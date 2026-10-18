import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';
import { parseJsonBody, sendJson, extractClientIp, createRateLimiter, timingSafeCompare } from './_utils.js';
import { recordSubscriber, getSubscribers, unsubscribeSubscriber, SubscriberRecord } from './_storage.js';

const rateLimiter = createRateLimiter(15 * 60 * 1000, 10);
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function generateUnsubscribeToken(email: string): string {
  const secret = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PASSWORD_HASH || 'gtf_newsletter_unsubscribe_salt_default';
  return crypto.createHmac('sha256', secret).update(`unsubscribe:${email.toLowerCase().trim()}`).digest('hex').slice(0, 32);
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!email || !token) return false;
  const expected = generateUnsubscribeToken(email);
  return timingSafeCompare(token.trim(), expected);
}

function sendHtml(res: ServerResponse, statusCode: number, html: string) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(html);
}

function renderUnsubscribeSuccessHtml(email: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed — Google Tool Finder</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 40px 20px; display: flex; align-items: center; justify-content: center; min-height: 80vh; }
    .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 36px; max-width: 480px; width: 100%; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); text-align: center; }
    .icon { width: 56px; height: 56px; border-radius: 16px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px; }
    h1 { font-size: 22px; font-weight: 800; margin: 0 0 12px; color: #0f172a; }
    p { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px; }
    .badge { display: inline-block; background: #f1f5f9; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-family: monospace; color: #334155; margin-bottom: 24px; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 24px; border-radius: 12px; transition: background 0.2s; }
    .btn:hover { background: #1d4ed8; }
    .footer { font-size: 11px; color: #94a3b8; margin-top: 28px; }
  </style>
</head>
<body>
  <div class="card" role="main">
    <div class="icon" aria-hidden="true">&#10003;</div>
    <h1>You have been unsubscribed</h1>
    <div class="badge">${email}</div>
    <p>You have been successfully removed from the Google Tool Finder updates mailing list. You will not receive any further newsletter emails from us.</p>
    <a href="/" class="btn">Return to Google Tool Finder</a>
    <div class="footer">An independent Google technology directory by Bring My Bite.</div>
  </div>
</body>
</html>`;
}

function renderUnsubscribeErrorHtml(errorMsg: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe Error — Google Tool Finder</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 40px 20px; display: flex; align-items: center; justify-content: center; min-height: 80vh; }
    .card { background: #ffffff; border: 1px solid #fee2e2; border-radius: 24px; padding: 36px; max-width: 480px; width: 100%; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); text-align: center; }
    .icon { width: 56px; height: 56px; border-radius: 16px; background: #fef2f2; color: #dc2626; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px; }
    h1 { font-size: 22px; font-weight: 800; margin: 0 0 12px; color: #991b1b; }
    p { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 24px; border-radius: 12px; }
  </style>
</head>
<body>
  <div class="card" role="alert">
    <div class="icon" aria-hidden="true">&#9888;</div>
    <h1>Unable to Unsubscribe</h1>
    <p>${errorMsg}</p>
    <a href="/" class="btn">Return to Home</a>
  </div>
</body>
</html>`;
}

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }

  const url = new URL(req.url || '/', 'http://127.0.0.1');
  const actionParam = url.searchParams.get('action');

  // -------------------------------------------------------------
  // 1. GET: One-click unsubscribe from email links
  // -------------------------------------------------------------
  if (req.method === 'GET') {
    if (actionParam === 'unsubscribe') {
      const email = (url.searchParams.get('email') || '').trim().toLowerCase();
      const token = (url.searchParams.get('token') || '').trim();

      if (!email || !EMAIL_REGEX.test(email)) {
        return sendHtml(res, 400, renderUnsubscribeErrorHtml('Invalid or missing email address in unsubscribe link.'));
      }

      if (!token || !verifyUnsubscribeToken(email, token)) {
        return sendHtml(res, 403, renderUnsubscribeErrorHtml('The unsubscribe security token is invalid or has expired.'));
      }

      try {
        await unsubscribeSubscriber(email);
        return sendHtml(res, 200, renderUnsubscribeSuccessHtml(email));
      } catch (err: any) {
        console.error('[Newsletter Unsubscribe Exception]', err);
        return sendHtml(res, 500, renderUnsubscribeErrorHtml('Server error while processing unsubscription. Please try again.'));
      }
    }

    return sendJson(res, 405, { success: false, error: 'METHOD_NOT_ALLOWED', message: 'Only POST and GET ?action=unsubscribe supported.' });
  }

  // -------------------------------------------------------------
  // 2. POST: Subscription or API unsubscription
  // -------------------------------------------------------------
  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'METHOD_NOT_ALLOWED', message: 'Only POST and GET supported.' });
  }

  const clientIp = extractClientIp(req);
  if (!rateLimiter(clientIp)) {
    return sendJson(res, 429, { success: false, error: 'RATE_LIMITED', message: 'Too many requests. Please wait before subscribing.' });
  }

  let body: { email?: string; action?: string; token?: string };
  try {
    body = await parseJsonBody(req);
  } catch {
    return sendJson(res, 400, { success: false, error: 'INVALID_JSON', message: 'Malformed JSON payload.' });
  }

  const emailRaw = (body.email || '').trim().toLowerCase();
  if (!emailRaw || !EMAIL_REGEX.test(emailRaw) || emailRaw.length > 254) {
    return sendJson(res, 400, {
      success: false,
      error: 'INVALID_EMAIL',
      message: 'Please provide a valid email address.'
    });
  }

  // Check if API caller requested unsubscription
  const isUnsubscribe = body.action === 'unsubscribe' || actionParam === 'unsubscribe';
  if (isUnsubscribe) {
    if (body.token && !verifyUnsubscribeToken(emailRaw, body.token)) {
      return sendJson(res, 403, {
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Security token is invalid or does not match email.'
      });
    }

    try {
      const result = await unsubscribeSubscriber(emailRaw);
      return sendJson(res, 200, {
        success: true,
        status: 'unsubscribed',
        message: 'You have been successfully unsubscribed from Google Tool Finder updates.',
        email: emailRaw,
        unsubscribedAt: result.subscriber?.unsubscribedAt || new Date().toISOString()
      });
    } catch (err: any) {
      console.error('[Newsletter Unsubscribe Error]', err);
      return sendJson(res, 500, {
        success: false,
        error: 'PERSISTENCE_FAILED',
        message: 'Unable to record unsubscription in database.'
      });
    }
  }

  // Handle Subscription
  const existingList = await getSubscribers();
  const existing = existingList.find(s => s.email.toLowerCase().trim() === emailRaw);
  if (existing && existing.status !== 'unsubscribed') {
    return sendJson(res, 200, {
      success: true,
      status: 'already_subscribed',
      message: 'You are already subscribed to the Google Tool Finder newsletter!'
    });
  }

  const unsubscribeToken = generateUnsubscribeToken(emailRaw);
  const appUrl = (process.env.APP_URL || 'https://google-tool-finder.web.app').replace(/\/+$/, '');
  const unsubscribeUrl = `${appUrl}/api/newsletter?action=unsubscribe&email=${encodeURIComponent(emailRaw)}&token=${unsubscribeToken}`;

  // External sync / confirmation email if RESEND_API_KEY is configured
  let providerSyncStatus = 'database_only';
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && resendKey.trim() && resendKey !== 'Do NOT USE') {
    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Google Tool Finder <newsletter@updates.googletoolfinder.com>',
          to: [emailRaw],
          subject: 'Welcome to Google Tool Finder Updates',
          text: `Thank you for subscribing to Google Tool Finder newsletter by Bring My Bite.\n\n` +
                `You will receive independent Google technology updates, transparent INR pricing alerts, and verified carrier cloud perks.\n\n` +
                `To unsubscribe at any time, visit:\n${unsubscribeUrl}`,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
          }
        })
      });
      if (emailRes.ok) {
        providerSyncStatus = 'resend_delivered';
      }
    } catch (e) {
      console.warn('[Resend Newsletter Sync Warning]', e);
    }
  }

  const newRecord: SubscriberRecord = {
    email: emailRaw,
    subscribedAt: new Date().toISOString(),
    ip: clientIp,
    providerSync: providerSyncStatus,
    status: 'active',
    unsubscribeToken
  };

  try {
    const result = await recordSubscriber(newRecord);
    if (!result.isNew) {
      return sendJson(res, 200, {
        success: true,
        status: 'already_subscribed',
        message: 'You are already subscribed to the Google Tool Finder newsletter!'
      });
    }

    return sendJson(res, 200, {
      success: true,
      status: 'subscribed',
      message: 'Thank you for subscribing! Your email has been registered for Google ecosystem updates.',
      providerStatus: providerSyncStatus,
      unsubscribeToken
    });
  } catch (err: any) {
    console.error('[Newsletter Storage Error]', err);
    return sendJson(res, 503, {
      success: false,
      error: 'PERSISTENCE_UNAVAILABLE',
      message: 'Unable to save subscription at this time. Storage service is unavailable.'
    });
  }
}
