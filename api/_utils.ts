import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  [key: string]: any;
}

export function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(data));
}

export async function parseJsonBody<T = any>(req: IncomingMessage & { body?: any }, maxBytes = 64 * 1024): Promise<T> {
  if (req.body && typeof req.body === 'object') {
    return req.body as T;
  }

  return new Promise<T>((resolve, reject) => {
    // If stream already completed
    if (req.readableEnded || (req as any).complete) {
      if (req.body && typeof req.body === 'object') {
        return resolve(req.body as T);
      }
      return resolve({} as T);
    }

    const chunks: Buffer[] = [];
    let totalLength = 0;
    let isSettled = false;

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        resolve({} as T);
      }
    }, 5000);

    req.on('data', (chunk) => {
      const buf = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
      totalLength += buf.length;
      if (totalLength > maxBytes) {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          reject(new Error('PAYLOAD_TOO_LARGE'));
        }
        return;
      }
      chunks.push(buf);
    });

    req.on('end', () => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timer);
        const raw = Buffer.concat(chunks).toString('utf-8');
        if (!raw.trim()) {
          resolve({} as T);
        } else {
          try {
            resolve(JSON.parse(raw) as T);
          } catch (e) {
            reject(e);
          }
        }
      }
    });

    req.on('error', (err) => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timer);
        reject(err);
      }
    });

    // Ensure paused streams in Connect middleware resume flowing
    req.resume();
  });
}

export function extractClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

export function createRateLimiter(windowMs: number, maxRequests: number) {
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  const limiter = function checkLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return true;
    }
    if (entry.count >= maxRequests) {
      return false;
    }
    entry.count += 1;
    return true;
  };
  limiter.reset = (ip?: string) => {
    if (ip) rateLimitMap.delete(ip);
    else rateLimitMap.clear();
  };
  return limiter;
}

export function timingSafeCompare(a: string, b: string): boolean {
  try {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const hashA = crypto.createHash('sha256').update(a).digest();
    const hashB = crypto.createHash('sha256').update(b).digest();
    return crypto.timingSafeEqual(hashA, hashB);
  } catch {
    return false;
  }
}
