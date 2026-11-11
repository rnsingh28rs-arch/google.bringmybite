import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { getSupabaseClient } from './_storage.js';

type StoredGmailConnection = {
  key: string;
  account_email: string;
  encrypted_refresh_token: string;
  updated_at?: string;
};

function requireServiceRoleClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('GMAIL_STORAGE_UNCONFIGURED: SUPABASE_SERVICE_ROLE_KEY is required for encrypted Gmail token storage.');
  }
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('GMAIL_STORAGE_UNCONFIGURED: Supabase client could not be initialized.');
  return supabase;
}

function encryptionKey(): Buffer {
  const raw = process.env.GMAIL_TOKEN_ENCRYPTION_KEY || '';
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) throw new Error('GMAIL_ENCRYPTION_KEY_INVALID: GMAIL_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key.');
  return key;
}

export function encryptGmailSecret(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString('base64url'), tag.toString('base64url'), encrypted.toString('base64url')].join('.');
}

function decryptGmailSecret(value: string): string {
  const [ivRaw, tagRaw, encryptedRaw] = value.split('.');
  if (!ivRaw || !tagRaw || !encryptedRaw) throw new Error('GMAIL_TOKEN_CORRUPT: Stored Gmail token is malformed.');
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(ivRaw, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagRaw, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(encryptedRaw, 'base64url')), decipher.final()]).toString('utf8');
}

async function getStoredConnection(): Promise<StoredGmailConnection | null> {
  const supabase = requireServiceRoleClient();
  const { data, error } = await supabase.from('gtf_integrations')
    .select('key,account_email,encrypted_refresh_token,updated_at')
    .eq('key', 'gmail_oauth')
    .maybeSingle();
  if (error) throw new Error('GMAIL_STORAGE_ERROR: ' + error.message);
  return data || null;
}

export async function getGmailConnectionStatus(): Promise<{ connected: boolean; accountEmail?: string; updatedAt?: string }> {
  const row = await getStoredConnection();
  if (!row) return { connected: false };
  return { connected: true, accountEmail: row.account_email, updatedAt: row.updated_at };
}

export async function saveGmailConnection(accountEmail: string, refreshToken: string): Promise<void> {
  const supabase = requireServiceRoleClient();
  const encrypted = encryptGmailSecret(refreshToken);
  const { error } = await supabase.from('gtf_integrations').upsert({
    key: 'gmail_oauth',
    account_email: accountEmail.toLowerCase(),
    encrypted_refresh_token: encrypted,
    updated_at: new Date().toISOString()
  }, { onConflict: 'key' });
  if (error) throw new Error('GMAIL_STORAGE_ERROR: ' + error.message);
}

export async function disconnectGmail(): Promise<void> {
  const supabase = requireServiceRoleClient();
  const { error } = await supabase.from('gtf_integrations').delete().eq('key', 'gmail_oauth');
  if (error) throw new Error('GMAIL_STORAGE_ERROR: ' + error.message);
}

export async function sendGmailMessage(input: { to: string; subject: string; text: string; replyTo?: string }): Promise<boolean> {
  const row = await getStoredConnection();
  if (!row) return false;
  const clientId = process.env.GMAIL_OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GMAIL_OAUTH_CLIENT_SECRET || '';
  if (!clientId || !clientSecret) throw new Error('GMAIL_OAUTH_CONFIG_UNSET: Gmail OAuth client credentials are missing.');
  const refreshToken = decryptGmailSecret(row.encrypted_refresh_token);
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }).toString()
  });
  const tokenData: any = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new Error('GMAIL_TOKEN_REFRESH_FAILED: ' + (tokenData.error_description || tokenData.error || tokenResponse.status));
  }

  const encodeHeader = (value: string) => '=?UTF-8?B?' + Buffer.from(value, 'utf8').toString('base64') + '?=';
  const headers = [
    'To: ' + input.to,
    'Subject: ' + encodeHeader(input.subject),
    ...(input.replyTo ? ['Reply-To: ' + input.replyTo] : []),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 8bit'
  ];
  const raw = Buffer.from(headers.join('\r\n') + '\r\n\r\n' + input.text, 'utf8').toString('base64url');
  const sendResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + tokenData.access_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw })
  });
  const sendData: any = await sendResponse.json().catch(() => ({}));
  if (!sendResponse.ok || !sendData.id) {
    throw new Error('GMAIL_SEND_FAILED: ' + (sendData.error?.message || sendResponse.status));
  }
  return true;
}
