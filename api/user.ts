import type { IncomingMessage, ServerResponse } from 'http';
import { OAuth2Client } from 'google-auth-library';
import { parseJsonBody, sendJson, extractClientIp } from './_utils.js';
import { saveUser, getUserById, toggleSavedTool, GTFUser } from './_storage.js';

const oauthClient = new OAuth2Client();

export async function verifyGoogleIdToken(idToken: string): Promise<{
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
} | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || clientId.trim() === '') return null;

  try {
    const ticket = await oauthClient.verifyIdToken({
      idToken: idToken.trim(),
      audience: clientId.trim()
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) return null;
    return {
      uid: payload.sub,
      email: payload.email,
      displayName: payload.name,
      photoURL: payload.picture
    };
  } catch (err) {
    return null;
  }
}

function extractAuthToken(req: IncomingMessage, body?: any): string | null {
  const authHeader = req.headers['authorization'];
  if (typeof authHeader === 'string') {
    const match = authHeader.match(/^Bearer\s+([A-Za-z0-9_.-]+)$/i);
    if (match) return match[1];
  }
  if (body && typeof body === 'object' && typeof body.idToken === 'string') {
    return body.idToken.trim();
  }
  return null;
}

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Allow', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  const urlPath = req.url ? req.url.split('?')[0].replace(/\/+$/, '') : '';
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

  // POST /api/user/sync - Store or update authenticated user profile
  if (req.method === 'POST' && (urlPath === '/api/user/sync' || urlPath === '/api/user')) {
    let body: any;
    try {
      body = await parseJsonBody(req);
    } catch {
      return sendJson(res, 400, { success: false, error: 'INVALID_JSON', message: 'Malformed JSON payload.' });
    }

    let finalUid = (body.uid || '').trim();
    let finalEmail = (body.email || '').trim().toLowerCase();
    let finalDisplayName = body.displayName ? String(body.displayName).slice(0, 100) : 'Google User';
    let finalPhotoUrl = body.photoURL ? String(body.photoURL).slice(0, 500) : undefined;
    let provider = body.provider || 'google.com';

    const token = extractAuthToken(req, body);

    // If client ID is configured or a token was provided, enforce cryptographic verification
    if (clientId && clientId.trim()) {
      if (!token) {
        return sendJson(res, 401, {
          success: false,
          error: 'AUTHENTICATION_REQUIRED',
          message: 'Google authentication token is required.'
        });
      }

      const verified = await verifyGoogleIdToken(token);
      if (!verified) {
        return sendJson(res, 401, {
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Google authentication token is invalid or expired.'
        });
      }

      // Security isolation: prevent client from forging identity
      if (finalUid && finalUid !== verified.uid) {
        return sendJson(res, 403, {
          success: false,
          error: 'FORBIDDEN_UID_MISMATCH',
          message: 'Supplied UID does not match verified Google token identity.'
        });
      }

      finalUid = verified.uid;
      finalEmail = verified.email;
      if (verified.displayName) finalDisplayName = verified.displayName;
      if (verified.photoURL) finalPhotoUrl = verified.photoURL;
      provider = 'accounts.google.com';
    } else if (isProduction && !token) {
      // Fail safely in production if Google OAuth is unconfigured
      return sendJson(res, 503, {
        success: false,
        error: 'GOOGLE_AUTH_UNCONFIGURED',
        message: 'Google OAuth configuration is missing on the server. Please configure GOOGLE_CLIENT_ID.'
      });
    }

    if (!finalUid || finalUid.length < 3) {
      return sendJson(res, 400, { success: false, error: 'MISSING_UID', message: 'Valid authentication UID is required.' });
    }

    if (!finalEmail || !finalEmail.includes('@')) {
      return sendJson(res, 400, { success: false, error: 'INVALID_EMAIL', message: 'Valid verified email is required.' });
    }

    const userRecord: GTFUser = {
      uid: finalUid,
      email: finalEmail,
      displayName: finalDisplayName,
      photoURL: finalPhotoUrl,
      provider,
      createdAt: body.createdAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      savedTools: Array.isArray(body.savedTools) ? body.savedTools.map(String) : []
    };

    try {
      const saved = await saveUser(userRecord);
      return sendJson(res, 200, {
        success: true,
        message: 'User profile synchronized securely.',
        user: saved
      });
    } catch (err: any) {
      console.error('[User Sync Error]', err);
      return sendJson(res, 500, { success: false, error: 'STORAGE_ERROR', message: 'Failed to synchronize user profile.' });
    }
  }

  // POST /api/user/save-tool - Gated action: toggle tool bookmark for verified user
  if (req.method === 'POST' && urlPath === '/api/user/save-tool') {
    let body: any;
    try {
      body = await parseJsonBody(req);
    } catch {
      return sendJson(res, 400, { success: false, error: 'INVALID_JSON', message: 'Malformed JSON payload.' });
    }

    let targetUid = (body.uid || '').trim();
    const toolSlug = (body.toolSlug || '').trim();

    if (!targetUid || !toolSlug) {
      return sendJson(res, 400, { success: false, error: 'MISSING_PARAMS', message: 'User UID and toolSlug are required.' });
    }

    const token = extractAuthToken(req, body);

    if (clientId && clientId.trim()) {
      if (!token) {
        return sendJson(res, 401, {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Google authentication token is required to modify bookmarks.'
        });
      }

      const verified = await verifyGoogleIdToken(token);
      if (!verified) {
        return sendJson(res, 401, {
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Google authentication token is invalid or expired.'
        });
      }

      if (targetUid !== verified.uid) {
        return sendJson(res, 403, {
          success: false,
          error: 'FORBIDDEN_UID_MISMATCH',
          message: 'Cannot modify bookmarks belonging to another user.'
        });
      }
      targetUid = verified.uid;
    } else if (isProduction && !token) {
      return sendJson(res, 503, {
        success: false,
        error: 'GOOGLE_AUTH_UNCONFIGURED',
        message: 'Google OAuth configuration is missing on the server. Please configure GOOGLE_CLIENT_ID.'
      });
    }

    try {
      const result = await toggleSavedTool(targetUid, toolSlug);
      return sendJson(res, 200, {
        success: true,
        saved: result.saved,
        savedTools: result.savedTools
      });
    } catch (err: any) {
      return sendJson(res, 404, { success: false, error: 'USER_NOT_FOUND', message: 'User not registered. Please sign in first.' });
    }
  }

  // GET /api/user?uid=... - Retrieve profile
  if (req.method === 'GET') {
    const rawUrl = new URL(req.url || '/', 'http://localhost');
    const requestedUid = rawUrl.searchParams.get('uid') || '';

    if (!requestedUid) {
      return sendJson(res, 400, { success: false, error: 'MISSING_UID', message: 'User UID is required.' });
    }

    const token = extractAuthToken(req);
    if (clientId && clientId.trim() && token) {
      const verified = await verifyGoogleIdToken(token);
      if (verified && requestedUid !== verified.uid) {
        return sendJson(res, 403, { success: false, error: 'FORBIDDEN', message: 'Access to other user profiles is restricted.' });
      }
    }

    const user = await getUserById(requestedUid);
    if (!user) {
      return sendJson(res, 404, { success: false, error: 'NOT_FOUND', message: 'User record not found.' });
    }

    return sendJson(res, 200, {
      success: true,
      user
    });
  }

  return sendJson(res, 405, { success: false, error: 'METHOD_NOT_ALLOWED', message: 'Method not supported.' });
}
