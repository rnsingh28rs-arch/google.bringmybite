import type { IncomingMessage, ServerResponse } from 'http';
import { sendJson } from './_utils.js';
import { getAdminSecret, verifySessionToken, extractBearerToken } from './admin-auth.js';
import { getAnalyticsSummary } from './_storage.js';

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Allow', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    return sendJson(res, 405, { success: false, error: 'METHOD_NOT_ALLOWED', message: 'Only GET supported.' });
  }

  // 1. Enforce Server-Side Administrative Authorization
  const secret = getAdminSecret();
  if (!secret) {
    return sendJson(res, 503, {
      success: false,
      error: 'ADMIN_AUTH_UNCONFIGURED',
      message: 'Admin authentication is unconfigured on the server. Set ADMIN_PASSWORD to enable access.'
    });
  }

  const token = extractBearerToken(req);
  if (!token) {
    return sendJson(res, 401, {
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Administrative Bearer token is required.'
    });
  }

  const verification = verifySessionToken(token, secret);
  if (!verification.valid) {
    return sendJson(res, 401, {
      success: false,
      error: verification.reason || 'INVALID_TOKEN',
      message: 'Admin session is invalid or has expired.'
    });
  }

  // 2. Fetch Real Persisted Data from Storage Abstraction
  try {
    const summary = await getAnalyticsSummary();

    // Integration and Configuration Status
    const integrationStatus = {
      adminPasswordConfigured: Boolean(process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PASSWORD_HASH),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()),
      geminiModel: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
      resendConfigured: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim()),
      webhookConfigured: Boolean(process.env.CONTACT_WEBHOOK_URL && process.env.CONTACT_WEBHOOK_URL.trim()),
      databaseType: process.env.SUPABASE_URL ? 'Supabase PostgreSQL' : (process.env.KV_REST_API_URL ? 'Vercel KV' : 'Local JSON Disk Storage'),
      adsenseStatus: 'Pre-Approval Readiness Mode (pub-XXXXXXXXXXXXXXXX placeholder)',
      affiliateStatus: 'Configurable Links Active (Pending Network Conversion Postback)'
    };

    return sendJson(res, 200, {
      success: true,
      data: {
        ...summary,
        integrations: integrationStatus
      }
    });
  } catch (err: any) {
    console.error('[Admin Analytics Error]', err);
    return sendJson(res, 500, {
      success: false,
      error: 'STORAGE_READ_ERROR',
      message: 'Unable to retrieve analytics summary from storage.'
    });
  }
}
