import type { IncomingMessage, ServerResponse } from 'http';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { sendJson } from '../_utils.js';
import { getAdminSecret, verifySessionToken } from '../admin-auth.js';
import { getGmailConnectionStatus, saveGmailConnection, disconnectGmail } from '../_gmail.js';

const oauthClient = new OAuth2Client();

function getAdminToken(req: IncomingMessage): string | null {
  const value = req.headers.authorization;
  const match = typeof value === 'string' ? value.match(/^Bearer\s+([A-Za-z0-9_.-]+)$/i) : null;
  return match?.[1] || null;
}
function isAdmin(req: IncomingMessage): boolean {
  const secret = getAdminSecret();
  const token = getAdminToken(req);
  return Boolean(secret && token && verifySessionToken(token, secret).valid);
}
function createState(email: string): string {
  const secret = process.env.GMAIL_OAUTH_STATE_SECRET || '';
  if (secret.length < 32) throw new Error('GMAIL_OAUTH_STATE_SECRET must contain at least 32 characters.');
  const payload = Buffer.from(JSON.stringify({ email, iat: Date.now(), nonce: randomBytes(24).toString('base64url') })).toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return payload + '.' + signature;
}
function verifyState(state: string): { email: string } | null {
  try {
    const [payload, signature] = state.split('.');
    const secret = process.env.GMAIL_OAUTH_STATE_SECRET || '';
    if (!payload || !signature || secret.length < 32) return null;
    const expected = createHmac('sha256', secret).update(payload).digest();
    const actual = Buffer.from(signature, 'base64url');
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed.email || !parsed.iat || Date.now() - parsed.iat > 10 * 60 * 1000 || parsed.iat > Date.now() + 30000) return null;
    return { email: String(parsed.email).toLowerCase() };
  } catch { return null; }
}
function config() {
  const clientId = process.env.GMAIL_OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GMAIL_OAUTH_CLIENT_SECRET || '';
  const redirectUri = process.env.GMAIL_REDIRECT_URI || '';
  if (!clientId || !clientSecret || !redirectUri) throw new Error('Configure GMAIL_OAUTH_CLIENT_ID, GMAIL_OAUTH_CLIENT_SECRET and GMAIL_REDIRECT_URI.');
  return { clientId, clientSecret, redirectUri };
}
function htmlResult(title: string, message: string) {
  const escapeHtml = (value: string) => value.replace(/[&<>\"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;' }[char] || char));
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + escapeHtml(title) + '</title></head><body style="font-family:system-ui,sans-serif;max-width:560px;margin:12vh auto;padding:24px;color:#0f172a"><h1>' + escapeHtml(title) + '</h1><p>' + escapeHtml(message) + '</p><p>You can close this tab and return to the Google Tool Finder Admin Console.</p></body></html>';
}
export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  const url = new URL(req.url || '/', 'http://localhost');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204; res.setHeader('Allow','GET, POST, DELETE, OPTIONS'); res.end(); return;
  }

  if (req.method === 'POST') {
    if (!isAdmin(req)) return sendJson(res, 401, { success:false, error:'UNAUTHORIZED', message:'Admin session required.' });
    try {
      const { clientId, redirectUri } = config();
      const encryptionKey = Buffer.from(process.env.GMAIL_TOKEN_ENCRYPTION_KEY || '', 'base64');
      if (encryptionKey.length !== 32 || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return sendJson(res, 503, { success:false, error:'GMAIL_STORAGE_UNCONFIGURED', message:'Encrypted Gmail storage is not configured. Set a base64-encoded 32-byte GMAIL_TOKEN_ENCRYPTION_KEY and SUPABASE_SERVICE_ROLE_KEY.' });
      }
      const adminEmail = (process.env.ADMIN_EMAIL || '28r.n.singh@gmail.com').trim().toLowerCase();
      const state = createState(adminEmail);
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email https://www.googleapis.com/auth/gmail.send',
        access_type: 'offline',
        prompt: 'consent',
        login_hint: adminEmail,
        include_granted_scopes: 'true',
        state
      });
      return sendJson(res, 200, { success:true, authUrl:'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString() });
    } catch (error: any) {
      return sendJson(res, 503, { success:false, error:'GMAIL_OAUTH_UNCONFIGURED', message:error.message || 'Gmail OAuth is not configured.' });
    }
  }

  if (req.method === 'GET' && url.searchParams.has('error')) {
    res.statusCode = 400; res.setHeader('Content-Type','text/html; charset=utf-8'); res.end(htmlResult('Gmail connection cancelled', 'Google authorization was cancelled or denied. You can start again from Admin Console → Gmail API.')); return;
  }

  if (req.method === 'GET' && url.searchParams.has('code')) {
    try {
      const state = verifyState(url.searchParams.get('state') || '');
      if (!state) {
        res.statusCode = 400; res.setHeader('Content-Type','text/html'); res.end(htmlResult('Connection not verified','The Google authorization state was invalid or expired. Start the connection again from Admin Console.')); return;
      }
      const { clientId, clientSecret, redirectUri } = config();
      const code = url.searchParams.get('code') || '';
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams({code,client_id:clientId,client_secret:clientSecret,redirect_uri:redirectUri,grant_type:'authorization_code'}).toString()
      });
      const tokenData: any = await tokenResponse.json().catch(()=>({}));
      if (!tokenResponse.ok || !tokenData.id_token || !tokenData.refresh_token) throw new Error('Google did not return the required ID and refresh tokens. Revoke access and reconnect with consent.');
      const ticket = await oauthClient.verifyIdToken({ idToken:tokenData.id_token, audience:clientId });
      const payload = ticket.getPayload();
      const actualEmail = (payload?.email || '').toLowerCase();
      if (!payload?.email_verified || actualEmail !== state.email) throw new Error('The connected Google account does not match the configured administrator email.');
      await saveGmailConnection(actualEmail, tokenData.refresh_token);
      res.statusCode = 200; res.setHeader('Content-Type','text/html; charset=utf-8');
      res.end(htmlResult('Gmail connected successfully', 'The Gmail API connection is now securely stored for ' + actualEmail + '.'));
      return;
    } catch (error: any) {
      res.statusCode = 503; res.setHeader('Content-Type','text/html; charset=utf-8');
      res.end(htmlResult('Gmail connection failed', error.message || 'Unable to complete Google OAuth.'));
      return;
    }
  }

  if (req.method === 'GET' && url.searchParams.get('action') === 'status') {
    if (!isAdmin(req)) return sendJson(res, 401, { success:false, error:'UNAUTHORIZED', message:'Admin session required.' });
    try { return sendJson(res, 200, { success:true, ...(await getGmailConnectionStatus()) }); }
    catch (error:any) { return sendJson(res, 503, { success:false, error:'GMAIL_STORAGE_UNAVAILABLE', message:error.message }); }
  }

  if (req.method === 'DELETE') {
    if (!isAdmin(req)) return sendJson(res, 401, { success:false, error:'UNAUTHORIZED', message:'Admin session required.' });
    try { await disconnectGmail(); return sendJson(res, 200, { success:true, message:'Gmail connection removed.' }); }
    catch (error:any) { return sendJson(res, 503, { success:false, error:'GMAIL_DISCONNECT_FAILED', message:error.message }); }
  }

  return sendJson(res, 405, { success:false, error:'METHOD_NOT_ALLOWED', message:'Use POST to connect, GET status, or DELETE to disconnect.' });
}
