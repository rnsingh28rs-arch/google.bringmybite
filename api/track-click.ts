import type { IncomingMessage, ServerResponse } from 'http';
import { parseJsonBody, sendJson, extractClientIp } from './_utils.js';
import { recordOutboundClick } from './_storage.js';

// Strict destination whitelist to prevent open redirect vulnerabilities
const ALLOWED_DOMAINS = [
  'google.com',
  'workspace.google.com',
  'cloud.google.com',
  'firebase.google.com',
  'ads.google.com',
  'analytics.google.com',
  'lookerstudio.google.com',
  'search.google.com',
  'tagmanager.google.com',
  'developer.android.com',
  'flutter.dev',
  'play.google.com',
  'mapsplatform.google.com',
  'colab.research.google.com',
  'notebooklm.google.com',
  'aistudio.google.com',
  'drive.google.com',
  'docs.google.com',
  'sheets.google.com',
  'slides.google.com',
  'meet.google.com',
  'keep.google.com',
  'calendar.google.com',
  'chromeenterprise.google',
  'forms.google.com',
  'sites.google.com',
  'appsheet.com',
  'www.appsheet.com'
];

export function isAllowedDestination(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    const hostname = parsed.hostname.toLowerCase();
    return ALLOWED_DOMAINS.some(allowed => hostname === allowed || hostname.endsWith('.' + allowed));
  } catch {
    return false;
  }
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

  const clientIp = extractClientIp(req);

  // POST: Async analytics beacon
  if (req.method === 'POST') {
    let body: {
      destination?: string;
      productSlug?: string;
      sourcePage?: string;
      isAffiliate?: boolean;
      sessionId?: string;
      userUid?: string;
    };

    try {
      body = await parseJsonBody(req);
    } catch {
      return sendJson(res, 400, { success: false, error: 'INVALID_JSON', message: 'Malformed JSON payload.' });
    }

    const destination = (body.destination || '').trim();
    if (!destination) {
      return sendJson(res, 400, { success: false, error: 'MISSING_DESTINATION', message: 'Destination URL is required.' });
    }

    if (!isAllowedDestination(destination)) {
      return sendJson(res, 400, {
        success: false,
        error: 'UNTRUSTED_DESTINATION',
        message: 'Destination URL is not in the approved official Google domains whitelist.'
      });
    }

    const clickRecord = {
      sourcePage: (body.sourcePage || 'home').trim().slice(0, 100),
      productSlug: (body.productSlug || 'general').trim().slice(0, 100),
      destination,
      isAffiliate: Boolean(body.isAffiliate),
      sessionId: body.sessionId ? String(body.sessionId).slice(0, 64) : undefined,
      userUid: body.userUid ? String(body.userUid).slice(0, 128) : undefined,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || 'Unknown',
      clientIp
    };

    try {
      await recordOutboundClick(clickRecord);
    } catch (err) {
      console.warn('[Storage Notice] Outbound click tracking write non-fatal warning:', err);
    }

    return sendJson(res, 200, {
      success: true,
      tracked: true,
      timestamp: clickRecord.timestamp
    });
  }

  // GET: Safe outbound redirector /api/track-click?url=...&slug=...&source=...
  if (req.method === 'GET') {
    const rawUrl = new URL(req.url || '/', 'http://localhost');
    const targetUrl = rawUrl.searchParams.get('url') || '';
    const productSlug = rawUrl.searchParams.get('slug') || 'unknown';
    const sourcePage = rawUrl.searchParams.get('source') || 'home';
    const sessionId = rawUrl.searchParams.get('session') || undefined;
    const userUid = rawUrl.searchParams.get('uid') || undefined;

    if (!targetUrl || !isAllowedDestination(targetUrl)) {
      return sendJson(res, 400, {
        success: false,
        error: 'INVALID_OR_UNTRUSTED_REDIRECT',
        message: 'Redirect target is invalid or not in the trusted domain whitelist.'
      });
    }

    try {
      await recordOutboundClick({
        sourcePage,
        productSlug,
        destination: targetUrl,
        isAffiliate: false,
        sessionId,
        userUid,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent'] || 'Unknown',
        clientIp
      });
    } catch (err) {
      console.warn('[Storage Notice] Redirect tracking write non-fatal warning:', err);
    }

    res.statusCode = 302;
    res.setHeader('Location', targetUrl);
    res.end();
    return;
  }

  return sendJson(res, 405, { success: false, error: 'METHOD_NOT_ALLOWED', message: 'Only GET and POST supported.' });
}
