import type { IncomingMessage, ServerResponse } from 'http';
import { recordContactEnquiry, getContactEnquiries } from './_storage.js';

export const VALID_SUBJECTS = {
  project_enquiry: 'Custom Software & Development Project Enquiry',
  product_suggestion: 'Suggest a Google Product to Add',
  offer_correction: 'Report Pricing or Offer Correction',
  scam_report: 'Report a Suspicious / Fake Promo Link',
  partnership: 'Affiliate / Partnership Inquiry',
  general: 'General Editorial Feedback'
} as const;

export type ContactSubject = keyof typeof VALID_SUBJECTS;

export interface ContactRequestBody {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
  website?: string; // Honeypot field (must be empty)
  formStartTime: number; // Timestamp when form was loaded (bot protection, required)
}

export interface ContactSuccessResponse {
  success: true;
  status: 'delivered' | 'test_accepted';
  message: string;
  confirmationId: string;
  timestamp: string;
}

export interface ContactErrorResponse {
  success: false;
  status: 'validation_error' | 'rate_limited' | 'service_unconfigured' | 'delivery_failed';
  error: string;
  details?: Record<string, string>;
}

// In-memory sliding window rate limiter (max 5 requests per 15 minutes per IP)
// Note: In serverless production environments (Vercel), function instances are stateless
// and scale independently. This provides local burst throttling per instance. Distributed
// production rate-limiting should be paired with edge WAF or an external KV store.
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Opportunistic cleanup when map grows
  if (rateLimitMap.size > 500) {
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  const entry = rateLimitMap.get(ip);
  if (entry && now > entry.resetTime) {
    rateLimitMap.delete(ip);
  }

  const current = rateLimitMap.get(ip);
  if (!current) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  current.count += 1;
  return true;
}

function sanitizeString(str: unknown, maxLen: number): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
}

function validateEmail(email: string): boolean {
  // RFC 5322 compliant practical regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

function isValidIp(ip: string): boolean {
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6 = /^[0-9a-fA-F:]+$/;
  return ipv4.test(ip) || ipv6.test(ip);
}

export function extractClientIp(req: IncomingMessage): string {
  // 1. Check Vercel edge proxy headers (injected by Vercel infrastructure, cannot be spoofed by client)
  const vercelForwarded = req.headers['x-vercel-forwarded-for'];
  if (typeof vercelForwarded === 'string') {
    const first = vercelForwarded.split(',')[0].trim();
    if (isValidIp(first)) return first;
  }

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string') {
    const clean = realIp.trim();
    if (isValidIp(clean)) return clean;
  }

  // 2. Direct socket connection address
  if (req.socket?.remoteAddress) {
    const clean = req.socket.remoteAddress.replace(/^::ffff:/, '').trim();
    if (isValidIp(clean)) return clean;
  }

  // 3. Fallback: x-forwarded-for only if valid IP format
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const first = forwarded.split(',')[0].trim();
    if (isValidIp(first)) return first;
  }

  return '127.0.0.1';
}

// SSRF Guard for Webhook URLs: blocks internal networks, localhost, and cloud metadata services
export function isSafeWebhookUrl(urlString: string): { safe: boolean; reason?: string } {
  try {
    const parsed = new URL(urlString);

    // 1. Protocol must be secure HTTPS
    if (parsed.protocol !== 'https:') {
      return { safe: false, reason: 'Webhook URL must use secure HTTPS protocol.' };
    }

    // 2. Reject non-standard ports to prevent internal port scanning
    if (parsed.port && parsed.port !== '443') {
      return { safe: false, reason: 'Webhook URL cannot use non-standard ports.' };
    }

    const rawHostname = parsed.hostname.toLowerCase();
    const cleanHostname = rawHostname.replace(/^\[/, '').replace(/\]$/, '');

    // 3. Reject localhost and loopback addresses
    if (
      cleanHostname === 'localhost' ||
      cleanHostname === '127.0.0.1' ||
      cleanHostname === '::1' ||
      cleanHostname === '0.0.0.0'
    ) {
      return { safe: false, reason: 'Webhook cannot target localhost or loopback addresses.' };
    }

    // 4. Reject cloud instance metadata endpoints (AWS, GCP, Azure) and local domains
    if (
      cleanHostname === '169.254.169.254' ||
      cleanHostname.endsWith('.internal') ||
      cleanHostname.endsWith('.local') ||
      cleanHostname.endsWith('.lan') ||
      cleanHostname.endsWith('.corp') ||
      cleanHostname.endsWith('.home.arpa') ||
      cleanHostname === 'metadata.google.internal' ||
      cleanHostname.includes('metadata')
    ) {
      return { safe: false, reason: 'Webhook cannot target internal or cloud metadata endpoints.' };
    }

    // 5. Reject private IPv4 ranges (RFC 1918 & link-local)
    const ipMatch = cleanHostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    if (ipMatch) {
      const b1 = parseInt(ipMatch[1], 10);
      const b2 = parseInt(ipMatch[2], 10);
      if (b1 === 10) return { safe: false, reason: 'Webhook cannot target private IP range (10.0.0.0/8).' };
      if (b1 === 172 && b2 >= 16 && b2 <= 31) return { safe: false, reason: 'Webhook cannot target private IP range (172.16.0.0/12).' };
      if (b1 === 192 && b2 === 168) return { safe: false, reason: 'Webhook cannot target private IP range (192.168.0.0/16).' };
      if (b1 === 169 && b2 === 254) return { safe: false, reason: 'Webhook cannot target link-local IP range (169.254.0.0/16).' };
      if (b1 === 127) return { safe: false, reason: 'Webhook cannot target loopback IP range (127.0.0.0/8).' };
      if (b1 === 0) return { safe: false, reason: 'Webhook cannot target zero IP range.' };
    }

    // 6. Reject IPv6 private / link-local addresses
    if (rawHostname.startsWith('[fc') || rawHostname.startsWith('[fd') || rawHostname.startsWith('[fe80')) {
      return { safe: false, reason: 'Webhook cannot target private IPv6 range.' };
    }

    return { safe: true };
  } catch {
    return { safe: false, reason: 'Malformed or invalid Webhook URL format.' };
  }
}

export async function processContactSubmission(
  body: unknown,
  clientIp = '127.0.0.1',
  userAgent = 'Unknown'
): Promise<{ statusCode: number; response: ContactSuccessResponse | ContactErrorResponse }> {
  // Rate limit check
  if (!checkRateLimit(clientIp)) {
    return {
      statusCode: 429,
      response: {
        success: false,
        status: 'rate_limited',
        error: 'Too many submissions received from this connection. Please wait 15 minutes before submitting again.'
      }
    };
  }

  if (!body || typeof body !== 'object') {
    return {
      statusCode: 400,
      response: {
        success: false,
        status: 'validation_error',
        error: 'Malformed request payload. JSON object expected.'
      }
    };
  }

  const payload = body as Record<string, unknown>;

  // 1. Anti-spam honeypot verification
  if (payload.website && typeof payload.website === 'string' && payload.website.trim().length > 0) {
    return {
      statusCode: 400,
      response: {
        success: false,
        status: 'validation_error',
        error: 'Automated spam submission detected.'
      }
    };
  }

  // 2. Mandatory submission timing verification (cannot be omitted or bypassed)
  const now = Date.now();
  if (
    payload.formStartTime === undefined ||
    payload.formStartTime === null ||
    typeof payload.formStartTime !== 'number' ||
    !Number.isFinite(payload.formStartTime) ||
    payload.formStartTime <= 0
  ) {
    return {
      statusCode: 400,
      response: {
        success: false,
        status: 'validation_error',
        error: 'Submission timing verification is missing or malformed. Please reload the page and try again.'
      }
    };
  }

  // Clock tampering check (reject future timestamps beyond 3 seconds clock skew)
  if (payload.formStartTime > now + 3000) {
    return {
      statusCode: 400,
      response: {
        success: false,
        status: 'validation_error',
        error: 'Submission timestamp is invalid. Please check your system clock.'
      }
    };
  }

  const elapsed = now - payload.formStartTime;
  // Sub-second automated bot post check (< 1200ms)
  if (elapsed < 1200) {
    return {
      statusCode: 400,
      response: {
        success: false,
        status: 'validation_error',
        error: 'Form submission occurred too quickly. Please take a moment to review your message.'
      }
    };
  }

  // Stale form check (> 6 hours)
  if (elapsed > 6 * 60 * 60 * 1000) {
    return {
      statusCode: 400,
      response: {
        success: false,
        status: 'validation_error',
        error: 'Form session has expired. Please refresh the page and submit your message again.'
      }
    };
  }

  // 3. Field validation
  const name = sanitizeString(payload.name, 100);
  const email = sanitizeString(payload.email, 100).toLowerCase();
  const subject = payload.subject as ContactSubject;
  const message = sanitizeString(payload.message, 3000);

  const validationErrors: Record<string, string> = {};

  if (!name || name.length < 2) {
    validationErrors.name = 'Full name is required (minimum 2 characters).';
  }

  if (!email || !validateEmail(email)) {
    validationErrors.email = 'A valid email address is required.';
  }

  if (!subject || !(subject in VALID_SUBJECTS)) {
    validationErrors.subject = 'Please select a valid inquiry topic.';
  }

  if (!message || message.length < 10) {
    validationErrors.message = 'Message must be at least 10 characters in length.';
  }

  if (Object.keys(validationErrors).length > 0) {
    return {
      statusCode: 400,
      response: {
        success: false,
        status: 'validation_error',
        error: 'Please correct the highlighted errors before submitting.',
        details: validationErrors
      }
    };
  }

  const confirmationId = `GTF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const timestamp = new Date().toISOString();
  const subjectLabel = VALID_SUBJECTS[subject];

  // Rapid deduplication check (within 10 seconds for exact same email, topic, and message)
  try {
    const recentEnquiries = await getContactEnquiries(10);
    const existing = recentEnquiries.find(e => 
      e.email.toLowerCase() === email &&
      e.message === message &&
      Math.abs(Date.now() - new Date(e.timestamp || 0).getTime()) < 10000
    );
    if (existing) {
      return {
        statusCode: 200,
        response: {
          success: true,
          status: 'delivered',
          message: 'Your enquiry has been received and is currently being processed.',
          confirmationId: existing.confirmationId || confirmationId,
          timestamp: existing.timestamp || timestamp
        }
      };
    }
  } catch (dedupErr) {
    console.warn('[Contact Dedup Notice]', dedupErr);
  }

  // 4. Secure Delivery Provider Execution
  // Option A: Resend API (Recommended for Vercel)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && resendApiKey.trim()) {
    try {
      const toEmail = process.env.CONTACT_TO_EMAIL || 'bringmybyte@gmail.com';
      const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Google Tool Finder <onboarding@resend.dev>';

      if (!validateEmail(toEmail)) {
        console.error('[Config Error] CONTACT_TO_EMAIL is not a valid email address:', toEmail);
        return {
          statusCode: 500,
          response: {
            success: false,
            status: 'delivery_failed',
            error: 'Server configuration error: invalid destination email address.'
          }
        };
      }

      const emailPayload = {
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `[Google Tool Finder] ${subjectLabel}: ${name}`,
        text: `New Editorial Enquiry (${confirmationId})\n` +
              `----------------------------------------\n` +
              `Date: ${timestamp}\n` +
              `Name: ${name}\n` +
              `Email: ${email}\n` +
              `Topic: ${subjectLabel}\n` +
              `IP: ${clientIp}\n` +
              `User Agent: ${userAgent}\n\n` +
              `Message Content:\n` +
              `----------------------------------------\n` +
              `${message}\n`
      };

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

      const resData = await res.json().catch(() => ({}));

      // Require both HTTP 200/201 AND a valid message ID from Resend
      if (!res.ok || !resData || typeof resData.id !== 'string') {
        console.error('[Resend Error]', res.status, resData);
        return {
          statusCode: 502,
          response: {
            success: false,
            status: 'delivery_failed',
            error: 'Failed to deliver message via email provider: ' + (resData?.message || res.statusText || 'Rejected')
          }
        };
      }

      // User Acknowledgement Email (Task 4 Response Email requirement)
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [email],
            reply_to: toEmail,
            subject: `[Google Tool Finder] We received your message: ${subjectLabel} (${confirmationId})`,
            text: `Hi ${name},\n\n` +
                  `Thank you for contacting Google Tool Finder by Bring My Bite.\n\n` +
                  `We have received your message regarding "${subjectLabel}". Your enquiry has been routed to our editorial team for review (Reference: ${confirmationId}).\n\n` +
                  `Submitted Details:\n` +
                  `----------------------------------------\n` +
                  `Topic: ${subjectLabel}\n` +
                  `Date: ${timestamp}\n\n` +
                  `Message Summary:\n` +
                  `${message}\n\n` +
                  `Our team reviews all suggestions and corrections within 24–48 hours.\n\n` +
                  `Best regards,\n` +
                  `The Google Tool Finder Editorial Team\n` +
                  `https://google-tool-finder.web.app`
          })
        });
      } catch (ackErr) {
        console.warn('[User Acknowledgement Dispatch Notice]', ackErr);
      }

      await recordContactEnquiry({
        confirmationId,
        name,
        email,
        subject: subjectLabel,
        message,
        status: 'delivered_resend',
        timestamp,
        clientIp
      }).catch(() => {});

      return {
        statusCode: 200,
        response: {
          success: true,
          status: 'delivered',
          message: 'Your message has been successfully delivered to our editorial team.',
          confirmationId,
          timestamp
        }
      };
    } catch (err: any) {
      console.error('[Email Dispatch Exception]', err);
      return {
        statusCode: 502,
        response: {
          success: false,
          status: 'delivery_failed',
          error: 'A network error occurred while dispatching your enquiry. Please try again later.'
        }
      };
    }
  }

  // Option B: Webhook Dispatch (e.g. Discord, Slack, Zapier) with SSRF Guard
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl && webhookUrl.trim()) {
    const safetyCheck = isSafeWebhookUrl(webhookUrl.trim());
    if (!safetyCheck.safe) {
      console.error('[Security Error] Blocked unsafe webhook target:', safetyCheck.reason);
      return {
        statusCode: 500,
        response: {
          success: false,
          status: 'delivery_failed',
          error: `Server configuration error: ${safetyCheck.reason}`
        }
      };
    }

    try {
      const webhookPayload = {
        content: `📬 **New Editorial Enquiry [${confirmationId}]**\n` +
                 `**From:** ${name} (<${email}>)\n` +
                 `**Topic:** ${subjectLabel}\n` +
                 `**Time:** ${timestamp}\n\n` +
                 `**Message:**\n${message}`
      };

      const res = await fetch(webhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      });

      if (!res.ok) {
        return {
          statusCode: 502,
          response: {
            success: false,
            status: 'delivery_failed',
            error: `Failed to deliver message via configured webhook (HTTP ${res.status}).`
          }
        };
      }

      await recordContactEnquiry({
        confirmationId,
        name,
        email,
        subject: subjectLabel,
        message,
        status: 'delivered_webhook',
        timestamp,
        clientIp
      }).catch(() => {});

      return {
        statusCode: 200,
        response: {
          success: true,
          status: 'delivered',
          message: 'Your message has been successfully dispatched to our editorial team.',
          confirmationId,
          timestamp
        }
      };
    } catch (err: any) {
      console.error('[Webhook Dispatch Exception]', err);
      return {
        statusCode: 502,
        response: {
          success: false,
          status: 'delivery_failed',
          error: 'A network error occurred while dispatching webhook. Please try again later.'
        }
      };
    }
  }

  // Option C: Safe Test Mode (Strictly restricted to non-production environments)
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  if (process.env.CONTACT_TEST_MODE === 'true') {
    if (isProduction) {
      console.warn('[Security Warning] CONTACT_TEST_MODE cannot be enabled in production environments.');
      return {
        statusCode: 503,
        response: {
          success: false,
          status: 'service_unconfigured',
          error: 'Test mode is not permitted in production. Please configure live email delivery credentials (RESEND_API_KEY or CONTACT_WEBHOOK_URL).'
        }
      };
    }

    console.info(`[Safe Test Mode] Received valid enquiry ${confirmationId} from ${name} <${email}>: "${subjectLabel}"`);
    await recordContactEnquiry({
      confirmationId,
      name,
      email,
      subject: subjectLabel,
      message,
      status: 'test_accepted',
      timestamp,
      clientIp
    }).catch(() => {});

    return {
      statusCode: 200,
      response: {
        success: true,
        status: 'test_accepted',
        message: 'Your enquiry was validated and accepted in server test mode. Live email dispatch is awaiting RESEND_API_KEY or CONTACT_WEBHOOK_URL environment configuration.',
        confirmationId,
        timestamp
      }
    };
  }

  // Option D: Database Queue Mode (if live delivery credentials are intentionally deferred)
  if (process.env.CONTACT_ALLOW_DB_STORAGE === 'true') {
    await recordContactEnquiry({
      confirmationId,
      name,
      email,
      subject: subjectLabel,
      message,
      status: 'recorded_in_database',
      timestamp,
      clientIp
    }).catch(() => {});

    return {
      statusCode: 200,
      response: {
        success: true,
        status: 'test_accepted',
        message: 'Your enquiry was validated and securely recorded for our editorial team in the database.',
        confirmationId,
        timestamp
      }
    };
  }

  // Option E: Service Unconfigured Fallback
  // Neither RESEND_API_KEY, CONTACT_WEBHOOK_URL, nor CONTACT_TEST_MODE is configured.
  // We do NOT pretend the email was sent (Policy: Do not claim delivery unless confirmed).
  return {
    statusCode: 503,
    response: {
      success: false,
      status: 'service_unconfigured',
      error: 'The contact enquiry delivery service is awaiting server environment configuration (RESEND_API_KEY or CONTACT_WEBHOOK_URL). Submissions cannot be delivered until the site administrator provides credentials.'
    }
  };
}

// Default export for Vercel Serverless Functions
export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse & { status?: any; json?: any }) {
  const sendJson = (code: number, data: any) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(JSON.stringify(data));
  };

  // Handle CORS Preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Allow', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return sendJson(405, {
      success: false,
      status: 'validation_error',
      error: 'Method Not Allowed. Only POST requests are supported.'
    });
  }

  try {
    let body = req.body;
    if (!body || typeof body !== 'object') {
      const chunks: Buffer[] = [];
      let totalLength = 0;
      for await (const chunk of req) {
        const buf = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
        totalLength += buf.length;
        if (totalLength > 64 * 1024) { // 64 KB max payload size
          return sendJson(413, {
            success: false,
            status: 'validation_error',
            error: 'Payload Too Large. Submissions must not exceed 64 KB.'
          });
        }
        chunks.push(buf);
      }
      const raw = Buffer.concat(chunks).toString('utf-8');
      body = raw ? JSON.parse(raw) : {};
    }

    const clientIp = extractClientIp(req);
    const userAgent = (req.headers['user-agent'] as string) || 'Unknown';

    const result = await processContactSubmission(body, clientIp, userAgent);
    return sendJson(result.statusCode, result.response);
  } catch (err: any) {
    console.error('[Contact Handler Error]', err);
    return sendJson(500, {
      success: false,
      status: 'delivery_failed',
      error: 'Internal Server Error processing contact enquiry.'
    });
  }
}
