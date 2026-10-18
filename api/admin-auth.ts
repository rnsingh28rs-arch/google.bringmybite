import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';
import { parseJsonBody, sendJson, timingSafeCompare, extractClientIp, createRateLimiter } from './_utils.js';

// Rate limiter: Max 5 login attempts per 15 minutes per IP to prevent brute-force attacks
export const adminLoginLimiter = createRateLimiter(15 * 60 * 1000, 5);

// Secure password hashing using scrypt (Node.js crypto standard)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derivedKey}`;
}

export function verifyPasswordHash(password: string, storedHash: string): boolean {
  try {
    if (!storedHash || typeof storedHash !== 'string') return false;
    const cleanHash = storedHash.trim().replace(/^["']|["']$/g, '');
    if (cleanHash.startsWith('scrypt$')) {
      const parts = cleanHash.split('$');
      if (parts.length !== 3) return false;
      const [, salt, expectedHash] = parts;
      if (!salt || !expectedHash) return false;
      const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
      return timingSafeCompare(derivedKey, expectedHash);
    }
    if (cleanHash.startsWith('pbkdf2$')) {
      const parts = cleanHash.split('$');
      if (parts.length !== 4) return false;
      const [, iterStr, salt, expectedHash] = parts;
      const iterations = parseInt(iterStr, 10);
      if (isNaN(iterations) || !salt || !expectedHash) return false;
      const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha256').toString('hex');
      return timingSafeCompare(derivedKey, expectedHash);
    }
    return false;
  } catch {
    return false;
  }
}

export function getAdminSecret(): string | null {
  const secret = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET_KEY;
  if (secret && secret.trim()) return secret.trim();
  
  // If only ADMIN_PASSWORD_HASH is set, derive a cryptographically stable secret for session token signing
  const hashSecret = process.env.ADMIN_PASSWORD_HASH;
  if (hashSecret && hashSecret.trim()) {
    const cleanHash = hashSecret.trim().replace(/^["']|["']$/g, '');
    return crypto.createHash('sha256').update(cleanHash).digest('hex');
  }
  return null;
}

export function verifyAdminPassword(password: string): boolean {
  const hashSecret = process.env.ADMIN_PASSWORD_HASH;
  if (hashSecret && hashSecret.trim()) {
    return verifyPasswordHash(password, hashSecret.trim());
  }
  const secret = getAdminSecret();
  if (secret) {
    return timingSafeCompare(password, secret);
  }
  return false;
}

export function generateSessionToken(secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (4 * 3600) // 4 hours
  })).toString('base64url');

  const signature = crypto.createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export function verifySessionToken(token: string, secret: string): { valid: boolean; reason?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, reason: 'MALFORMED_TOKEN' };

    const [header, payload, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (!timingSafeCompare(signature, expectedSignature)) {
      return { valid: false, reason: 'INVALID_SIGNATURE' };
    }

    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (!decodedPayload.exp || Math.floor(Date.now() / 1000) > decodedPayload.exp) {
      return { valid: false, reason: 'TOKEN_EXPIRED' };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: 'DECODE_ERROR' };
  }
}

export function extractBearerToken(req: IncomingMessage): string | null {
  const authHeader = req.headers['authorization'];
  if (!authHeader || typeof authHeader !== 'string') return null;
  const match = authHeader.match(/^Bearer\s+([A-Za-z0-9_.-]+)$/i);
  return match ? match[1] : null;
}

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  const secret = getAdminSecret();
  if (!secret) {
    // Fail Closed: Cannot log in if ADMIN_PASSWORD or ADMIN_PASSWORD_HASH is unconfigured on server
    return sendJson(res, 503, {
      success: false,
      error: 'ADMIN_AUTH_UNCONFIGURED',
      message: 'Admin authentication is unconfigured. Set the ADMIN_PASSWORD environment variable on the server to enable access.'
    });
  }

  // GET: Check existing token status
  if (req.method === 'GET') {
    const token = extractBearerToken(req);
    if (!token) {
      return sendJson(res, 401, {
        success: false,
        authenticated: false,
        error: 'NO_TOKEN',
        message: 'No authorization token provided.'
      });
    }

    const verification = verifySessionToken(token, secret);
    if (!verification.valid) {
      return sendJson(res, 401, {
        success: false,
        authenticated: false,
        error: verification.reason || 'INVALID_TOKEN',
        message: 'Session token is invalid or expired.'
      });
    }

    return sendJson(res, 200, {
      success: true,
      authenticated: true,
      message: 'Active admin session verified.'
    });
  }

  // POST: Login with password
  if (req.method === 'POST') {
    const clientIp = extractClientIp(req);
    if (!adminLoginLimiter(clientIp)) {
      return sendJson(res, 429, {
        success: false,
        error: 'RATE_LIMITED',
        message: 'Too many administrative authentication attempts. Please wait 15 minutes before trying again.'
      });
    }

    let body: { password?: string };
    try {
      body = await parseJsonBody<{ password?: string }>(req);
    } catch {
      return sendJson(res, 400, { success: false, error: 'INVALID_JSON', message: 'Malformed JSON payload.' });
    }

    const password = (body.password || '').trim();
    if (!password) {
      return sendJson(res, 400, { success: false, error: 'EMPTY_PASSWORD', message: 'Password is required.' });
    }

    if (!verifyAdminPassword(password)) {
      return sendJson(res, 401, {
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid administrative password.'
      });
    }

    // Reset rate limiter on successful login
    adminLoginLimiter.reset(clientIp);

    const token = generateSessionToken(secret);
    return sendJson(res, 200, {
      success: true,
      token,
      expiresInSeconds: 4 * 3600,
      message: 'Admin authentication successful.'
    });
  }

  return sendJson(res, 405, { success: false, error: 'METHOD_NOT_ALLOWED', message: 'Only GET and POST supported.' });
}
