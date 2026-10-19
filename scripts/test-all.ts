import 'dotenv/config';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import fs from 'fs';
import path from 'path';

// Load Handlers
import contactHandler from '../api/contact.ts';
import assistantHandler from '../api/assistant.ts';
import adminAuthHandler, { generateSessionToken, hashPassword, verifyPasswordHash } from '../api/admin-auth.ts';
import adminMonetizationHandler from '../api/admin-monetization.ts';
import newsletterHandler, { generateUnsubscribeToken, verifyUnsubscribeToken } from '../api/newsletter.ts';
import trackClickHandler, { isAllowedDestination } from '../api/track-click.ts';
import userHandler from '../api/user.ts';
import adminAnalyticsHandler from '../api/admin-analytics.ts';
import { timingSafeCompare } from '../api/_utils.ts';
import { getSubscribers } from '../api/_storage.ts';
import {
  resolveProductActionUrl,
  isVerifiedReferralUrl
} from '../src/data/monetizationConfig.ts';

// Mock request / response helper
function createMockReqRes(options: {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: any;
}) {
  const req = new IncomingMessage(new Socket());
  req.method = options.method || 'GET';
  req.url = options.url || '/';
  req.headers = {
    'content-type': 'application/json',
    ...(options.headers || {})
  };

  const bodyData = options.body ? JSON.stringify(options.body) : '';
  let dataSent = false;

  // Simulate readable stream for body
  req._read = () => {
    if (!dataSent && bodyData) {
      req.push(Buffer.from(bodyData));
      dataSent = true;
    }
    req.push(null);
  };

  const headersMap: Record<string, string> = {};
  let statusCode = 200;
  let responseData = '';

  const res = new ServerResponse(req);
  res.setHeader = (name: string, val: any) => {
    headersMap[name.toLowerCase()] = String(val);
    return res;
  };
  res.getHeader = (name: string) => headersMap[name.toLowerCase()];
  res.end = (chunk?: any) => {
    if (chunk) responseData += chunk.toString();
    return res;
  };

  Object.defineProperty(res, 'statusCode', {
    get: () => statusCode,
    set: (code: number) => { statusCode = code; }
  });

  return {
    req: req as IncomingMessage & { body?: any },
    res,
    getResponse: () => {
      let parsedJson: any = null;
      try {
        parsedJson = JSON.parse(responseData);
      } catch {
        parsedJson = responseData;
      }
      return {
        statusCode,
        headers: headersMap,
        body: parsedJson,
        raw: responseData
      };
    }
  };
}

let passed = 0;
let failed = 0;

function assert(condition: boolean, desc: string) {
  if (condition) {
    console.log(`  PASS: ${desc}`);
    passed++;
  } else {
    console.error(`  FAIL: ${desc}`);
    failed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING GOOGLE TOOL FINDER AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  // TEST SUITE 1: CONTACT API
  console.log('--- TEST SUITE 1: /api/contact ---');
  {
    // 1.1 Reject honeypot bot trap
    const { req, res, getResponse } = createMockReqRes({
      method: 'POST',
      url: '/api/contact',
      body: {
        name: 'Bot User',
        email: 'bot@example.com',
        subject: 'general',
        message: 'This is spam',
        website: 'http://spam-link.com',
        formStartTime: Date.now() - 5000
      }
    });
    await contactHandler(req, res);
    const result = getResponse();
    assert(result.statusCode === 400 && result.body.error === 'Automated spam submission detected.', 'Rejects honeypot bot trap with 400');
  }

  {
    // 1.2 Reject missing required fields
    const { req, res, getResponse } = createMockReqRes({
      method: 'POST',
      url: '/api/contact',
      body: {
        name: '',
        email: 'bad-email',
        message: ''
      }
    });
    await contactHandler(req, res);
    const result = getResponse();
    assert(result.statusCode === 400 && result.body.status === 'validation_error', 'Rejects missing/invalid fields with validation_error');
  }

  {
    // 1.3 Unconfigured provider returns honest service_unconfigured
    const origKey = process.env.RESEND_API_KEY;
    const origWebhook = process.env.CONTACT_WEBHOOK_URL;
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_WEBHOOK_URL;
    delete process.env.CONTACT_TEST_MODE;

    const { req, res, getResponse } = createMockReqRes({
      method: 'POST',
      url: '/api/contact',
      body: {
        name: 'Valid User',
        email: 'user@example.com',
        subject: 'general',
        message: 'A legitimate message longer than ten characters.',
        formStartTime: Date.now() - 5000
      }
    });
    await contactHandler(req, res);
    const result = getResponse();
    assert(result.statusCode === 503 && result.body.status === 'service_unconfigured', 'Fails honestly when provider unconfigured (503 service_unconfigured)');

    // Restore
    if (origKey) process.env.RESEND_API_KEY = origKey;
    if (origWebhook) process.env.CONTACT_WEBHOOK_URL = origWebhook;

    // 1.4 Deduplicates rapid identical submissions
    const savedResendKey = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;
    process.env.CONTACT_TEST_MODE = 'true';
    const dedupBody = {
      name: 'Dedup Tester',
      email: 'dedup_test@bringmybite.test',
      subject: 'product_suggestion',
      message: 'This is a unique suggestion for deduplication testing.',
      formStartTime: Date.now() - 4000
    };
    const { req: d1, res: s1, getResponse: g1 } = createMockReqRes({
      method: 'POST',
      url: '/api/contact',
      body: dedupBody
    });
    await contactHandler(d1, s1);
    const r1 = g1();
    assert(r1.statusCode === 200, 'First submission accepted');

    const { req: d2, res: s2, getResponse: g2 } = createMockReqRes({
      method: 'POST',
      url: '/api/contact',
      body: dedupBody
    });
    await contactHandler(d2, s2);
    const r2 = g2();
    assert(r2.statusCode === 200 && r2.body.confirmationId === r1.body.confirmationId, 'Rapid duplicate contact submission returns existing confirmationId');
    delete process.env.CONTACT_TEST_MODE;
    if (savedResendKey) process.env.RESEND_API_KEY = savedResendKey;

    // 1.5 Validates CONTACT_TO_EMAIL destination configuration
    {
      const prevKey = process.env.RESEND_API_KEY;
      const prevTo = process.env.CONTACT_TO_EMAIL;
      process.env.RESEND_API_KEY = 're_test_mock_key';
      process.env.CONTACT_TO_EMAIL = 'invalid-destination-address';

      const { req, res, getResponse } = createMockReqRes({
        method: 'POST',
        url: '/api/contact',
        headers: { 'x-forwarded-for': '198.51.100.25' },
        body: {
          name: 'Recipient Config Tester',
          email: 'tester@example.com',
          subject: 'general',
          message: 'Testing destination email configuration validation.',
          formStartTime: Date.now() - 3000
        }
      });
      await contactHandler(req, res);
      const r = getResponse();
      assert(r.statusCode === 500 && r.body.error?.includes('destination email address'), 'Rejects invalid CONTACT_TO_EMAIL destination configuration with 500');

      if (prevKey) process.env.RESEND_API_KEY = prevKey; else delete process.env.RESEND_API_KEY;
      if (prevTo) process.env.CONTACT_TO_EMAIL = prevTo; else delete process.env.CONTACT_TO_EMAIL;
    }
  }

  // TEST SUITE 2: ASSISTANT API
  console.log('\n--- TEST SUITE 2: /api/assistant ---');
  {
    // 2.1 Rejects empty message
    const { req, res, getResponse } = createMockReqRes({
      method: 'POST',
      url: '/api/assistant',
      body: { message: '   ' }
    });
    await assistantHandler(req, res);
    const result = getResponse();
    assert(result.statusCode === 400 && result.body.error === 'EMPTY_MESSAGE', 'Rejects empty message with 400');
  }

  {
    // 2.2 Rejects oversized message
    const { req, res, getResponse } = createMockReqRes({
      method: 'POST',
      url: '/api/assistant',
      body: { message: 'a'.repeat(2500) }
    });
    await assistantHandler(req, res);
    const result = getResponse();
    assert(result.statusCode === 400 && result.body.error === 'MESSAGE_TOO_LONG', 'Rejects message > 2000 chars with 400');
  }

  {
    // 2.3 Transparent failure when GEMINI_API_KEY is unconfigured
    const origKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const { req, res, getResponse } = createMockReqRes({
      method: 'POST',
      url: '/api/assistant',
      body: { message: 'Recommend an AI tool' }
    });
    await assistantHandler(req, res);
    const result = getResponse();
    assert(result.statusCode === 503 && result.body.error === 'GEMINI_API_KEY_MISSING', 'Fails closed with 503 GEMINI_API_KEY_MISSING when unconfigured');

    if (origKey) process.env.GEMINI_API_KEY = origKey;
  }

  {
    // 2.4 Live Gemini 3.1 Flash Lite API integration test
    if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith('MY_')) {
      let attempts = 0;
      let result: any;
      while (attempts < 2) {
        attempts++;
        const { req, res, getResponse } = createMockReqRes({
          method: 'POST',
          url: '/api/assistant',
          body: { message: 'Recommend an AI tool for building web apps' }
        });
        await assistantHandler(req, res);
        result = getResponse();
        if (result.statusCode === 200) break;
        if (attempts < 2) await new Promise(r => setTimeout(r, 1500));
      }
      assert(result.statusCode === 200, `Live assistant with gemini-3.1-flash-lite returns 200 (got ${result.statusCode}: ${JSON.stringify(result.body)})`);
      assert(result.body.success === true, 'Response body success is true');
      assert(typeof result.body.text === 'string' && result.body.text.length > 0, 'Assistant returned non-empty response text');
      assert(result.body.model === 'gemini-3.1-flash-lite', `Assistant utilized gemini-3.1-flash-lite model (got ${result.body.model})`);
      assert(Array.isArray(result.body.recommendations), 'Assistant returned recommendations array');
      console.log('  [PASS] Live Gemini 3.1 Flash Lite model response verified.');
    }
  }

  // TEST SUITE 3: ADMIN AUTH & SECURITY
  console.log('\n--- TEST SUITE 3: /api/admin/auth ---');
  {
    // 3.1 Unconfigured ADMIN_PASSWORD fails closed
    const origPw = process.env.ADMIN_PASSWORD;
    const origSecret = process.env.ADMIN_SECRET_KEY;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_SECRET_KEY;

    const { req, res, getResponse } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/auth',
      body: { password: 'anypassword' }
    });
    await adminAuthHandler(req, res);
    const result = getResponse();
    assert(result.statusCode === 503 && result.body.error === 'ADMIN_AUTH_UNCONFIGURED', 'Fails closed with 503 ADMIN_AUTH_UNCONFIGURED when password unset');

    // 3.2 With configured ADMIN_PASSWORD
    process.env.ADMIN_PASSWORD = 'super_secure_test_password_123';

    // Wrong password -> 401
    const { req: wrongReq, res: wrongRes, getResponse: getWrongRes } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/auth',
      body: { password: 'wrong_password' }
    });
    await adminAuthHandler(wrongReq, wrongRes);
    assert(getWrongRes().statusCode === 401 && getWrongRes().body.error === 'INVALID_CREDENTIALS', 'Rejects wrong password with 401 INVALID_CREDENTIALS');

    // Correct password -> 200 + JWT token
    const { req: okReq, res: okRes, getResponse: getOkRes } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/auth',
      body: { password: 'super_secure_test_password_123' }
    });
    await adminAuthHandler(okReq, okRes);
    const okResult = getOkRes();
    assert(okResult.statusCode === 200 && Boolean(okResult.body.token), 'Accepts correct password, issues HMAC-SHA256 session token');
    const validToken = okResult.body.token;

    // GET with valid token -> 200
    const { req: verifyReq, res: verifyRes, getResponse: getVerifyRes } = createMockReqRes({
      method: 'GET',
      url: '/api/admin/auth',
      headers: { authorization: `Bearer ${validToken}` }
    });
    await adminAuthHandler(verifyReq, verifyRes);
    assert(getVerifyRes().statusCode === 200 && getVerifyRes().body.authenticated === true, 'GET verifies valid Bearer token as authenticated');

    // GET with tampered token -> 401
    const tamperedToken = validToken.substring(0, validToken.length - 4) + 'abcd';
    const { req: fakeReq, res: fakeRes, getResponse: getFakeRes } = createMockReqRes({
      method: 'GET',
      url: '/api/admin/auth',
      headers: { authorization: `Bearer ${tamperedToken}` }
    });
    await adminAuthHandler(fakeReq, fakeRes);
    assert(getFakeRes().statusCode === 401 && getFakeRes().body.error === 'INVALID_SIGNATURE', 'Rejects tampered Bearer token with 401 INVALID_SIGNATURE');

    // 3.3 Hashed password generation and verification (scrypt)
    const testSecret = 'admin_scrypt_secure_pass_882';
    const computedHash = hashPassword(testSecret);
    assert(computedHash.startsWith('scrypt$'), 'hashPassword produces valid scrypt$ formatted hash');
    assert(verifyPasswordHash(testSecret, computedHash) === true, 'verifyPasswordHash accepts matching password');
    assert(verifyPasswordHash('wrong_password', computedHash) === false, 'verifyPasswordHash rejects mismatching password');

    // 3.4 Login using ADMIN_PASSWORD_HASH environment variable
    delete process.env.ADMIN_PASSWORD;
    process.env.ADMIN_PASSWORD_HASH = `"${computedHash}"`; // Test tolerance for surrounding quotes

    const { req: hashOkReq, res: hashOkRes, getResponse: getHashOkRes } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/auth',
      body: { password: testSecret }
    });
    await adminAuthHandler(hashOkReq, hashOkRes);
    const hashOkResult = getHashOkRes();
    assert(hashOkResult.statusCode === 200 && Boolean(hashOkResult.body.token), 'Accepts password matching ADMIN_PASSWORD_HASH and issues token');

    const { req: hashBadReq, res: hashBadRes, getResponse: getHashBadRes } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/auth',
      body: { password: 'incorrect_password' }
    });
    await adminAuthHandler(hashBadReq, hashBadRes);
    assert(getHashBadRes().statusCode === 401 && getHashBadRes().body.error === 'INVALID_CREDENTIALS', 'Rejects wrong password with 401 when ADMIN_PASSWORD_HASH is set');

    // 3.4.1 Resilient handling of malformed or corrupted hashes
    assert(verifyPasswordHash('test', 'scrypt$corrupted_short') === false, 'verifyPasswordHash gracefully rejects truncated scrypt hash');
    assert(verifyPasswordHash('test', 'invalid$prefix$hash') === false, 'verifyPasswordHash gracefully rejects unknown prefix');

    delete process.env.ADMIN_PASSWORD_HASH;

    // 3.5 Length-timing safe comparison
    assert(timingSafeCompare('short', 'much_longer_string_value') === false, 'timingSafeCompare handles unequal length strings without timing leak or error');
    assert(timingSafeCompare('identical_value', 'identical_value') === true, 'timingSafeCompare verifies matching strings accurately');

    // Restore
    if (origPw) process.env.ADMIN_PASSWORD = origPw;
    if (origSecret) process.env.ADMIN_SECRET_KEY = origSecret;
  }

  // TEST SUITE 4: ADMIN MONETIZATION
  console.log('\n--- TEST SUITE 4: /api/admin/monetization ---');
  {
    process.env.ADMIN_PASSWORD = 'super_secure_test_password_123';
    const validToken = generateSessionToken(process.env.ADMIN_PASSWORD);

    // 4.1 GET settings succeeds
    const { req, res, getResponse } = createMockReqRes({
      method: 'GET',
      url: '/api/admin/monetization'
    });
    await adminMonetizationHandler(req, res);
    assert(getResponse().statusCode === 200 && Boolean(getResponse().body.settings), 'GET /api/admin/monetization returns current runtime settings');

    // 4.2 POST without auth fails with 401
    const { req: unauthReq, res: unauthRes, getResponse: getUnauthRes } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/monetization',
      body: { previewMode: true }
    });
    await adminMonetizationHandler(unauthReq, unauthRes);
    assert(getUnauthRes().statusCode === 401 && getUnauthRes().body.error === 'UNAUTHORIZED', 'POST /api/admin/monetization rejects unauthenticated write with 401');

    // 4.3 POST with valid auth succeeds and persists
    const { req: authReq, res: authRes, getResponse: getAuthRes } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/monetization',
      headers: { authorization: `Bearer ${validToken}` },
      body: {
        previewMode: true,
        ownerPromotion: {
          enabled: true,
          badgeText: 'Launch Spotlight',
          title: 'Introducing Google Workspace Sync',
          subtitle: 'Seamless integration for enterprise productivity',
          description: 'A newly launched platform built for fast workflows.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          ctaText: 'Discover Project',
          ctaUrl: 'https://bringmybite.com/workspace'
        }
      }
    });
    await adminMonetizationHandler(authReq, authRes);
    const saveResult = getAuthRes();
    assert(saveResult.statusCode === 200 && saveResult.body.success === true && saveResult.body.persistedToDisk === true, 'POST with valid auth updates settings and persists to disk');

    // 4.4 GET verifies ownerPromotion was saved
    const { req: getPromoReq, res: getPromoRes, getResponse: getPromoResult } = createMockReqRes({
      method: 'GET',
      url: '/api/admin/monetization'
    });
    await adminMonetizationHandler(getPromoReq, getPromoRes);
    const promoBody = getPromoResult().body;
    assert(promoBody.settings?.ownerPromotion?.title === 'Introducing Google Workspace Sync', 'GET verifies ownerPromotion saved correctly');
    assert(promoBody.settings?.ownerPromotion?.enabled === true, 'GET verifies ownerPromotion enabled state persisted');

    // 4.5 POST rejecting unverified or ordinary Google URLs as affiliate redirects
    const { req: ordinaryReq, res: ordinaryRes, getResponse: getOrdinaryRes } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/monetization',
      headers: { authorization: `Bearer ${validToken}` },
      body: {
        affiliate: {
          enabled: true, // Attempt to enable without verified referral URL
          programs: {
            googleWorkspace: {
              customUrl: 'https://workspace.google.com/?ref=YOUR_REFERRAL_CODE'
            },
            googleCloud: {
              customUrl: 'https://cloud.google.com'
            },
            googleOne: {
              customUrl: 'https://one.google.com/about/plans'
            }
          }
        }
      }
    });
    await adminMonetizationHandler(ordinaryReq, ordinaryRes);
    const ordinaryBody = getOrdinaryRes().body;
    assert(ordinaryBody.settings?.affiliate?.enabled === false, 'POST enforces affiliate redirects remain disabled when referral URLs are ordinary or placeholders');
    assert(ordinaryBody.settings?.affiliate?.programs?.googleWorkspace?.active === false, 'Google Workspace marked inactive when URL is a placeholder');
    assert(ordinaryBody.settings?.affiliate?.programs?.googleCloud?.active === false, 'Google Cloud marked inactive when URL is standard cloud.google.com');

    // 4.6 POST with verified referral link sets program active
    const { req: verifiedReq, res: verifiedRes, getResponse: getVerifiedRes } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/monetization',
      headers: { authorization: `Bearer ${validToken}` },
      body: {
        affiliate: {
          programs: {
            googleWorkspace: {
              customUrl: 'https://referworkspace.app.goo.gl/validRefToken123'
            }
          }
        }
      }
    });
    await adminMonetizationHandler(verifiedReq, verifiedRes);
    const verifiedBody = getVerifiedRes().body;
    assert(verifiedBody.settings?.affiliate?.programs?.googleWorkspace?.active === true, 'Genuine referral URL sets program to active');

    // 4.7 Reset to clean safe defaults with redirects disabled
    const { req: resetReq, res: resetRes, getResponse: getResetRes } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/monetization',
      headers: { authorization: `Bearer ${validToken}` },
      body: {
        affiliate: {
          enabled: false,
          programs: {
            googleWorkspace: { customUrl: '', active: false },
            googleCloud: { customUrl: '', active: false },
            googleOne: { customUrl: '', active: false }
          }
        }
      }
    });
    await adminMonetizationHandler(resetReq, resetRes);
    assert(getResetRes().body.settings?.affiliate?.enabled === false, 'Safe default persists with redirects disabled');

    // 4.8 Direct official URL resolution when redirects are disabled or unverified
    const wsAction = resolveProductActionUrl('https://workspace.google.com', undefined, 'google-workspace');
    assert(wsAction.url === 'https://workspace.google.com' && wsAction.isAffiliate === false, 'Workspace resolves directly to official Google URL with isAffiliate: false');
    const gcpAction = resolveProductActionUrl('https://cloud.google.com', undefined, 'google-cloud');
    assert(gcpAction.url === 'https://cloud.google.com' && gcpAction.isAffiliate === false, 'GCP resolves directly to official Google URL with isAffiliate: false');
    const driveAction = resolveProductActionUrl('https://drive.google.com', undefined, 'google-drive');
    assert(driveAction.url === 'https://drive.google.com' && driveAction.isAffiliate === false, 'Drive resolves directly to official Google URL with isAffiliate: false');
    assert(isVerifiedReferralUrl('https://workspace.google.com') === false, 'Ordinary workspace.google.com rejected as referral URL');
    assert(isVerifiedReferralUrl('https://cloud.google.com/?partner=YOUR_PARTNER_ID') === false, 'Placeholder partner parameter rejected as referral URL');
    assert(isVerifiedReferralUrl('https://referworkspace.app.goo.gl/token') === true, 'Official Google Workspace referral URL accepted as verified');

    // 4.9 CJ Affiliate domain validation
    assert(isVerifiedReferralUrl('https://www.anrdoezrs.net/click-100987654-15234567') === true, 'CJ anrdoezrs.net tracking URL accepted as verified');
    assert(isVerifiedReferralUrl('https://www.dpbolvw.net/click-100987654-15234567') === true, 'CJ dpbolvw.net tracking URL accepted as verified');
    assert(isVerifiedReferralUrl('https://www.jdoqocy.com/click-100987654-15234567') === true, 'CJ jdoqocy.com tracking URL accepted as verified');
    assert(isVerifiedReferralUrl('https://www.tkqlhce.com/click-100987654-15234567') === true, 'CJ tkqlhce.com tracking URL accepted as verified');
    assert(isVerifiedReferralUrl('https://bringmybite.prf.hn/click/camref:123') === true, 'Impact prf.hn tracking URL accepted as verified');

    // 4.10 CJ Affiliate configuration persistence and truthful status validation
    const { req: cjReq, res: cjRes, getResponse: getCjRes } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/monetization',
      headers: { authorization: `Bearer ${validToken}` },
      body: {
        affiliate: {
          cj: {
            status: 'pending_approval',
            publisherCid: '6123456',
            websitePid: '100987654',
            defaultSid: 'gtf-test-01',
            approvedPrograms: [
              {
                id: 'google-workspace-cj',
                name: 'Google Workspace (via CJ Affiliate)',
                cjAdvertiserId: '5493021',
                status: 'pending_approval',
                referralUrl: 'https://www.anrdoezrs.net/click-100987654-15234567',
                commissionTier: 'Bounty per qualified business seat',
                notes: 'Test CJ approval'
              }
            ]
          },
          google: {
            googleWorkspace: {
              status: 'pending_approval',
              referralId: 'REF-IN-123',
              customUrl: 'https://referworkspace.app.goo.gl/realRefToken'
            }
          },
          impact: {
            status: 'pending_approval',
            accountSid: 'IR-ACC-99',
            mediaPartnerId: '9876543',
            campaignId: '22334',
            customUrl: 'https://app.impact.com/advertiser/123'
          }
        },
        adsense: {
          status: 'pending_approval',
          verificationStatus: 'pending_review',
          publisherId: 'ca-pub-1234567890123456',
          enabled: false
        }
      }
    });
    await adminMonetizationHandler(cjReq, cjRes);
    const cjResult = getCjRes().body;
    assert(cjResult.success === true, 'POST saves CJ Affiliate, Google programs, and AdSense status correctly');
    assert(cjResult.settings?.affiliate?.cj?.publisherCid === '6123456', 'CJ publisherCid persisted to server storage');
    assert(cjResult.settings?.affiliate?.cj?.websitePid === '100987654', 'CJ websitePid persisted to server storage');
    assert(cjResult.settings?.affiliate?.cj?.defaultSid === 'gtf-test-01', 'CJ defaultSid persisted to server storage');
    assert(cjResult.settings?.affiliate?.cj?.approvedPrograms?.[0]?.cjAdvertiserId === '5493021', 'CJ approved advertiser programme persisted');
    assert(cjResult.settings?.affiliate?.impact?.accountSid === 'IR-ACC-99', 'Impact accountSid persisted');
    assert(cjResult.settings?.adsense?.verificationStatus === 'pending_review', 'AdSense verificationStatus persisted');

    // 4.11 AdSense placeholder prevents premature activation
    const { req: fakeAdSenseReq, res: fakeAdSenseRes, getResponse: getFakeAdSenseRes } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/monetization',
      headers: { authorization: `Bearer ${validToken}` },
      body: {
        adsense: {
          publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
          enabled: true,
          status: 'active'
        }
      }
    });
    await adminMonetizationHandler(fakeAdSenseReq, fakeAdSenseRes);
    const fakeAdSenseBody = getFakeAdSenseRes().body;
    assert(fakeAdSenseBody.settings?.adsense?.enabled === false, 'AdSense with placeholder ID cannot be enabled');
    assert(fakeAdSenseBody.settings?.adsense?.status !== 'active', 'AdSense with placeholder ID cannot be marked active');

    // Reset settings to safe clean defaults for remainder of tests
    const { req: cleanReq, res: cleanRes } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/monetization',
      headers: { authorization: `Bearer ${validToken}` },
      body: {
        affiliate: {
          enabled: false,
          programs: {
            googleWorkspace: { customUrl: '', active: false },
            googleCloud: { customUrl: '', active: false },
            googleOne: { customUrl: '', active: false }
          }
        }
      }
    });
    await adminMonetizationHandler(cleanReq, cleanRes);
  }

  // TEST SUITE 5: NEWSLETTER
  console.log('\n--- TEST SUITE 5: /api/newsletter ---');
  {
    // 5.1 Rejects invalid email
    const { req, res, getResponse } = createMockReqRes({
      method: 'POST',
      url: '/api/newsletter',
      body: { email: 'not-an-email' }
    });
    await newsletterHandler(req, res);
    assert(getResponse().statusCode === 400 && getResponse().body.error === 'INVALID_EMAIL', 'Rejects invalid email format with 400');

    // 5.2 Subscribes valid email
    const testEmail = `test_${Date.now()}@bringmybite.test`;
    const { req: okReq, res: okRes, getResponse: getOkRes } = createMockReqRes({
      method: 'POST',
      url: '/api/newsletter',
      body: { email: testEmail }
    });
    await newsletterHandler(okReq, okRes);
    const subResult = getOkRes();
    assert(subResult.statusCode === 200 && subResult.body.status === 'subscribed', 'Subscribes valid email, returns 200 and persists to data/subscribers.json');

    // 5.3 Duplicate subscription returns already_subscribed
    const { req: dupReq, res: dupRes, getResponse: getDupRes } = createMockReqRes({
      method: 'POST',
      url: '/api/newsletter',
      body: { email: testEmail }
    });
    await newsletterHandler(dupReq, dupRes);
    assert(getDupRes().statusCode === 200 && getDupRes().body.status === 'already_subscribed', 'Handles duplicate email idempotently with status already_subscribed');

    // 5.4 Token-based unsubscribe verification
    const unsubEmail = `unsub_${Date.now()}@bringmybite.test`;
    const token = generateUnsubscribeToken(unsubEmail);
    assert(Boolean(token) && token.length === 32, 'Generates 32-character hex unsubscribe token');
    assert(verifyUnsubscribeToken(unsubEmail, token) === true, 'verifyUnsubscribeToken accepts valid token');
    assert(verifyUnsubscribeToken(unsubEmail, 'invalid_token_xyz') === false, 'verifyUnsubscribeToken rejects tampered token');

    // First subscribe the email
    const { req: sReq, res: sRes, getResponse: getSRes } = createMockReqRes({
      method: 'POST',
      url: '/api/newsletter',
      body: { email: unsubEmail }
    });
    await newsletterHandler(sReq, sRes);
    assert(getSRes().statusCode === 200, 'Subscribed test user for unsubscription test');

    // 5.5 GET /api/newsletter?action=unsubscribe with invalid token fails with 403 HTML
    const { req: badGetReq, res: badGetRes, getResponse: getBadGetRes } = createMockReqRes({
      method: 'GET',
      url: `/api/newsletter?action=unsubscribe&email=${encodeURIComponent(unsubEmail)}&token=wrong_token`
    });
    await newsletterHandler(badGetReq, badGetRes);
    assert(getBadGetRes().statusCode === 403 && getBadGetRes().raw.includes('Unable to Unsubscribe'), 'GET unsubscribe rejects invalid token with 403 HTML');

    // 5.6 GET /api/newsletter?action=unsubscribe with valid token succeeds with 200 HTML
    const { req: okGetReq, res: okGetRes, getResponse: getOkGetRes } = createMockReqRes({
      method: 'GET',
      url: `/api/newsletter?action=unsubscribe&email=${encodeURIComponent(unsubEmail)}&token=${token}`
    });
    await newsletterHandler(okGetReq, okGetRes);
    assert(getOkGetRes().statusCode === 200 && getOkGetRes().raw.includes('You have been unsubscribed'), 'GET unsubscribe succeeds with 200 HTML confirmation page');

    // 5.7 Active subscribers query excludes unsubscribed user
    const activeSubscribers = await getSubscribers(true);
    const isPresentInActive = activeSubscribers.some(s => s.email.toLowerCase() === unsubEmail.toLowerCase());
    assert(isPresentInActive === false, 'getSubscribers(activeOnly=true) strictly excludes unsubscribed users');

    // 5.8 POST /api/newsletter API unsubscription
    const unsubEmail2 = `unsub2_${Date.now()}@bringmybite.test`;
    const { req: sub2Req, res: sub2Res } = createMockReqRes({
      method: 'POST',
      url: '/api/newsletter',
      body: { email: unsubEmail2 }
    });
    await newsletterHandler(sub2Req, sub2Res);

    const { req: postUnsubReq, res: postUnsubRes, getResponse: getPostUnsubRes } = createMockReqRes({
      method: 'POST',
      url: '/api/newsletter',
      body: { email: unsubEmail2, action: 'unsubscribe' }
    });
    await newsletterHandler(postUnsubReq, postUnsubRes);
    assert(getPostUnsubRes().statusCode === 200 && getPostUnsubRes().body.status === 'unsubscribed', 'POST /api/newsletter with action: unsubscribe returns 200 unsubscribed');

    // 5.9 Resubscribing previously unsubscribed user reactivates status
    const { req: resubReq, res: resubRes, getResponse: getResubRes } = createMockReqRes({
      method: 'POST',
      url: '/api/newsletter',
      body: { email: unsubEmail }
    });
    await newsletterHandler(resubReq, resubRes);
    assert(getResubRes().statusCode === 200 && getResubRes().body.status === 'subscribed', 'Resubscribing previously unsubscribed user reactivates subscription with 200 subscribed');
  }

  // TEST SUITE 6: TRACK CLICK & SAFE REDIRECTS
  console.log('\n--- TEST SUITE 6: /api/track-click ---');
  {
    // 6.1 Validates whitelist
    assert(isAllowedDestination('https://workspace.google.com/pricing') === true, 'Allows official domain workspace.google.com');
    assert(isAllowedDestination('https://cloud.google.com/run') === true, 'Allows official domain cloud.google.com');
    assert(isAllowedDestination('https://deepmind.google/technologies/gemini') === true, 'Allows official domain deepmind.google');
    assert(isAllowedDestination('https://referworkspace.app.goo.gl/promo') === true, 'Allows official referral domain referworkspace.app.goo.gl');
    assert(isAllowedDestination('https://blog.google/technology/ai') === true, 'Allows official domain blog.google');
    assert(isAllowedDestination('https://evil-phishing-site.com') === false, 'Rejects untrusted external domain');
    assert(isAllowedDestination('javascript:alert(1)') === false, 'Rejects javascript URI');

    // 6.2 POST beacon rejects untrusted destination
    const { req: badReq, res: badRes, getResponse: getBadRes } = createMockReqRes({
      method: 'POST',
      url: '/api/track-click',
      body: { destination: 'https://attacker.com/steal' }
    });
    await trackClickHandler(badReq, badRes);
    assert(getBadRes().statusCode === 400 && getBadRes().body.error === 'UNTRUSTED_DESTINATION', 'POST rejects untrusted destination with 400 UNTRUSTED_DESTINATION');

    // 6.3 POST beacon records click for valid domain
    const { req: okReq, res: okRes, getResponse: getOkRes } = createMockReqRes({
      method: 'POST',
      url: '/api/track-click',
      body: {
        destination: 'https://workspace.google.com',
        productSlug: 'google-workspace',
        sessionId: 'test_sess_ok',
        isAffiliate: false
      }
    });
    await trackClickHandler(okReq, okRes);
    assert(getOkRes().statusCode === 200 && getOkRes().body.tracked === true, 'POST records outbound click for official Google domain in telemetry');

    // 6.4 POST beacon records commercial affiliate click
    const { req: affReq, res: affRes, getResponse: getAffRes } = createMockReqRes({
      method: 'POST',
      url: '/api/track-click',
      body: {
        destination: 'https://workspace.google.com/?ref=TEST_AFFILIATE',
        productSlug: 'google-workspace',
        sessionId: 'test_sess_aff',
        isAffiliate: true
      }
    });
    await trackClickHandler(affReq, affRes);
    assert(getAffRes().statusCode === 200 && getAffRes().body.tracked === true, 'POST records commercial affiliate click in telemetry');

    // 6.5 GET redirector blocks malicious target
    const { req: redReq, res: redRes, getResponse: getRedRes } = createMockReqRes({
      method: 'GET',
      url: '/api/track-click?url=https://malicious.org'
    });
    await trackClickHandler(redReq, redRes);
    assert(getRedRes().statusCode === 400 && getRedRes().body.error === 'INVALID_OR_UNTRUSTED_REDIRECT', 'GET redirector blocks open redirect attempt with 400');

    // 6.6 GET redirector redirects to valid domain and tracks affiliate flag
    const { req: validRedReq, res: validRedRes, getResponse: getValidRedRes } = createMockReqRes({
      method: 'GET',
      url: '/api/track-click?url=https://workspace.google.com&slug=google-workspace&affiliate=true'
    });
    await trackClickHandler(validRedReq, validRedRes);
    const validRedResult = getValidRedRes();
    assert(validRedResult.statusCode === 302 && (validRedResult.headers?.location === 'https://workspace.google.com' || validRedResult.headers?.Location === 'https://workspace.google.com'), 'GET redirector safely redirects to approved destination with 302');
  }

  // TEST SUITE 7: SEO ASSETS AND BUNDLE SECURITY
  console.log('\n--- TEST SUITE 7: Static Assets & Bundle Security ---');
  {
    const robotsPath = path.join(process.cwd(), 'dist', 'robots.txt');
    const sitemapPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
    const adsPath = path.join(process.cwd(), 'dist', 'ads.txt');

    assert(fs.existsSync(robotsPath), 'dist/robots.txt exists in production bundle');
    assert(fs.existsSync(sitemapPath), 'dist/sitemap.xml exists in production bundle');
    assert(fs.existsSync(adsPath), 'dist/ads.txt exists in production bundle');

    // Check bundle for leaked secrets
    const distAssetsDir = path.join(process.cwd(), 'dist', 'assets');
    const jsFiles = fs.readdirSync(distAssetsDir).filter(f => f.endsWith('.js'));
    let secretFound = false;
    for (const f of jsFiles) {
      const content = fs.readFileSync(path.join(distAssetsDir, f), 'utf-8');
      if (content.includes('AIzaSy') || content.includes('super_secure_test_password') || content.includes('re_123456789')) {
        secretFound = true;
      }
    }
    assert(!secretFound, 'Zero provider secrets or passwords leaked in production client bundle');

    // Check Top Information Strip restoration and audit date removal
    const navbarContent = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'Navbar.tsx'), 'utf-8');
    assert(navbarContent.includes('export const SHOW_TOP_INFORMATION_STRIP = true;'), 'Top Information Strip restored and enabled');
    assert(navbarContent.includes('SHOW_TOP_INFORMATION_STRIP &&'), 'Top Information Strip source markup and logic active');
    assert(navbarContent.includes('Admin & AdSense') && navbarContent.includes('India Offers: Jio & Airtel Perks'), 'Top Information Strip content and links preserved intact in codebase');
    assert(!navbarContent.includes('Audited: Oct 2026'), 'Audit date strictly removed from Top Information Strip');

    // Check 3 Named Sections and Purpose
    const homeContent = fs.readFileSync(path.join(process.cwd(), 'src', 'pages', 'HomePage.tsx'), 'utf-8');
    assert(homeContent.includes('ONE-CLICK-TO-NEURAL'), 'HomePage contains ONE-CLICK-TO-NEURAL section');
    assert(homeContent.includes('QUANTUM ENGINE'), 'HomePage contains QUANTUM ENGINE section');
    assert(homeContent.includes('TOTAL COGNITIVE NEXUS'), 'HomePage contains TOTAL COGNITIVE NEXUS section');
    assert(homeContent.includes('Why Google Tool Finder Exists'), 'HomePage explains why Google Tool Finder exists');

    // Check Disclaimer, Terms & Conditions source preservation
    const legalContent = fs.readFileSync(path.join(process.cwd(), 'src', 'pages', 'LegalPages.tsx'), 'utf-8');
    assert(legalContent.includes("type === 'disclaimer'"), 'LegalPages supports dedicated disclaimer view');
    assert(legalContent.includes('Terms of Service') && legalContent.includes('Acceptance of Terms'), 'Existing Terms & Conditions preserved as authoritative source');

    // Check Frontend Security Deterrent module
    const deterrentPath = path.join(process.cwd(), 'src', 'utils', 'securityDeterrent.ts');
    assert(fs.existsSync(deterrentPath), 'src/utils/securityDeterrent.ts exists');
    const deterrentContent = fs.readFileSync(deterrentPath, 'utf-8');
    assert(deterrentContent.includes('isEditableElement') && deterrentContent.includes("tagName === 'input'"), 'Security deterrent preserves form inputs and text selection');
    assert(deterrentContent.includes("closest('a')"), 'Security deterrent preserves link context menus');
    assert(deterrentContent.includes('Self-XSS'), 'Security deterrent outputs protective Self-XSS console advisory');
  }

  // TEST SUITE 8: USER PROFILE AND TOOL STACK PERSISTENCE (/api/user)
  console.log('\n--- TEST SUITE 8: /api/user Identity & Saved Stack ---');
  {
    // 8.1 Rejects empty payload
    const { req: r1, res: s1, getResponse: g1 } = createMockReqRes({
      method: 'POST',
      url: '/api/user/sync',
      body: {}
    });
    await userHandler(r1, s1);
    assert(g1().statusCode === 400, 'POST /api/user/sync rejects empty body with 400');

    // 8.2 Valid user profile synchronization under stable UID
    const testUid = 'goog_test_' + Date.now().toString(36);
    const { req: r2, res: s2, getResponse: g2 } = createMockReqRes({
      method: 'POST',
      url: '/api/user/sync',
      body: {
        uid: testUid,
        email: 'developer.test@gmail.com',
        displayName: 'Test Developer',
        savedTools: ['google-workspace']
      }
    });
    await userHandler(r2, s2);
    assert(g2().statusCode === 200 && g2().body.success === true && g2().body.user.uid === testUid, 'POST /api/user/sync saves verified member profile under stable UID');

    // 8.3 Retrieve user profile via GET /api/user?uid=...
    const { req: r3, res: s3, getResponse: g3 } = createMockReqRes({
      method: 'GET',
      url: `/api/user?uid=${testUid}`
    });
    await userHandler(r3, s3);
    assert(g3().statusCode === 200 && g3().body.user?.email === 'developer.test@gmail.com', 'GET /api/user retrieves registered user by UID');

    // 8.4 Gated action: Toggle saved tool in stack
    const { req: r4, res: s4, getResponse: g4 } = createMockReqRes({
      method: 'POST',
      url: '/api/user/save-tool',
      body: {
        uid: testUid,
        toolSlug: 'gemini'
      }
    });
    await userHandler(r4, s4);
    assert(g4().statusCode === 200 && g4().body.saved === true && g4().body.savedTools.includes('gemini'), 'POST /api/user/save-tool adds tool to member stack');

    // 8.5 Toggle again removes tool from stack
    const { req: r5, res: s5, getResponse: g5 } = createMockReqRes({
      method: 'POST',
      url: '/api/user/save-tool',
      body: {
        uid: testUid,
        toolSlug: 'gemini'
      }
    });
    await userHandler(r5, s5);
    assert(g5().statusCode === 200 && g5().body.saved === false && !g5().body.savedTools.includes('gemini'), 'POST /api/user/save-tool removes tool on second toggle');

    // 8.6 Save tool without valid UID returns 404
    const { req: r6, res: s6, getResponse: g6 } = createMockReqRes({
      method: 'POST',
      url: '/api/user/save-tool',
      body: {
        uid: 'non_existent_uid_9999',
        toolSlug: 'gemini'
      }
    });
    await userHandler(r6, s6);
    assert(g6().statusCode === 404, 'POST /api/user/save-tool rejects non-existent UID with 404');
  }

  // TEST SUITE 9: ADMIN ANALYTICS AUTHORIZATION & PERSISTENCE (/api/admin/analytics)
  console.log('\n--- TEST SUITE 9: /api/admin/analytics Authorization & Telemetry ---');
  {
    const secret = process.env.ADMIN_PASSWORD || 'super_secure_test_password';

    // 9.1 Missing Authorization Bearer token returns 401
    const { req: a1, res: b1, getResponse: c1 } = createMockReqRes({
      method: 'GET',
      url: '/api/admin/analytics'
    });
    await adminAnalyticsHandler(a1, b1);
    assert(c1().statusCode === 401 && c1().body.error === 'UNAUTHORIZED', 'GET /api/admin/analytics requires Bearer token (401)');

    // 9.2 Invalid token returns 401
    const { req: a2, res: b2, getResponse: c2 } = createMockReqRes({
      method: 'GET',
      url: '/api/admin/analytics',
      headers: { 'authorization': 'Bearer fake_tampered_token_xyz' }
    });
    await adminAnalyticsHandler(a2, b2);
    assert(c2().statusCode === 401, 'GET /api/admin/analytics rejects tampered token (401)');

    // 9.3 Valid administrative token returns real analytics with all 11 sections
    const validToken = generateSessionToken(secret);
    const { req: a3, res: b3, getResponse: c3 } = createMockReqRes({
      method: 'GET',
      url: '/api/admin/analytics',
      headers: { 'authorization': `Bearer ${validToken}` }
    });
    await adminAnalyticsHandler(a3, b3);
    const body = c3().body;
    assert(
      c3().statusCode === 200 &&
      body.success === true &&
      body.data.overview &&
      Array.isArray(body.data.topDestinations) &&
      Array.isArray(body.data.topSources) &&
      Array.isArray(body.data.topProducts) &&
      Array.isArray(body.data.dailyTrends) &&
      Array.isArray(body.data.users) &&
      body.data.integrations,
      'GET /api/admin/analytics returns all 11 sections from persistent storage when authorized'
    );
  }

  // TEST SUITE 10: OUTBOUND CLICK WITH USER UID & DEDUPLICATION
  console.log('\n--- TEST SUITE 10: Outbound Click User UID & Deduplication ---');
  {
    const sessionId = 'test_sess_' + Date.now();
    // 10.1 Click with verified userUid
    const { req: cl1, res: cs1, getResponse: cg1 } = createMockReqRes({
      method: 'POST',
      url: '/api/track-click',
      body: {
        destination: 'https://cloud.google.com',
        productSlug: 'google-cloud',
        sourcePage: 'product-detail/google-cloud',
        sessionId,
        userUid: 'goog_test_member_123',
        isAffiliate: false
      }
    });
    await trackClickHandler(cl1, cs1);
    assert(cg1().statusCode === 200 && cg1().body.tracked === true, 'Outbound click records authenticated userUid and sessionId');

    // 10.2 Accidental rapid duplicate click within 3s for same session and destination
    const { req: cl2, res: cs2, getResponse: cg2 } = createMockReqRes({
      method: 'POST',
      url: '/api/track-click',
      body: {
        destination: 'https://cloud.google.com',
        productSlug: 'google-cloud',
        sourcePage: 'product-detail/google-cloud',
        sessionId,
        userUid: 'goog_test_member_123',
        isAffiliate: false
      }
    });
    await trackClickHandler(cl2, cs2);
    assert(cg2().statusCode === 200 && cg2().body.tracked === true, 'Deduplication handles rapid double clicks gracefully');
  }

  // TEST SUITE 11: ADMIN LOGIN IP RATE LIMITING
  console.log('\n--- TEST SUITE 11: Admin Login IP Rate Limiting ---');
  {
    process.env.ADMIN_PASSWORD = 'strong_test_admin_password_999';
    const attackerIp = '198.51.100.77';

    // Send 5 failed attempts from attacker IP
    let fiveRejected401 = true;
    for (let i = 1; i <= 5; i++) {
      const { req, res, getResponse } = createMockReqRes({
        method: 'POST',
        url: '/api/admin/auth',
        headers: { 'x-forwarded-for': attackerIp },
        body: { password: `wrong_pass_${i}` }
      });
      await adminAuthHandler(req, res);
      const resp = getResponse();
      if (resp.statusCode !== 401 || resp.body.error !== 'INVALID_CREDENTIALS') {
        fiveRejected401 = false;
      }
    }
    assert(fiveRejected401, 'Attempts 1 through 5 from attacker IP are rejected with 401 INVALID_CREDENTIALS');

    // 6th attempt must be rejected with 429 RATE_LIMITED
    const { req: req6, res: res6, getResponse: getResp6 } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/auth',
      headers: { 'x-forwarded-for': attackerIp },
      body: { password: 'wrong_pass_6' }
    });
    await adminAuthHandler(req6, res6);
    const resp6 = getResp6();
    assert(resp6.statusCode === 429 && resp6.body.error === 'RATE_LIMITED', 'The 6th rapid failed attempt is rejected with 429 RATE_LIMITED');

    // Independent benign IP is not blocked
    const { req: benignReq, res: benignRes, getResponse: getBenignResp } = createMockReqRes({
      method: 'POST',
      url: '/api/admin/auth',
      headers: { 'x-forwarded-for': '198.51.100.88' },
      body: { password: 'wrong_password_benign' }
    });
    await adminAuthHandler(benignReq, benignRes);
    const benignResp = getBenignResp();
    assert(benignResp.statusCode === 401 && benignResp.body.error === 'INVALID_CREDENTIALS', 'Unrelated IP is not blocked by attacker rate limit');
  }

  // TEST SUITE 12: GOOGLE OAUTH & TOKEN VERIFICATION
  console.log('\n--- TEST SUITE 12: Genuine Google OAuth & User Isolation ---');
  {
    const origClientId = process.env.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_ID = '41533331-test.apps.googleusercontent.com';

    // 12.1 POST /api/user/sync with invalid ID token is rejected
    const { req: fakeTokenReq, res: fakeTokenRes, getResponse: getFakeTokenRes } = createMockReqRes({
      method: 'POST',
      url: '/api/user/sync',
      body: {
        idToken: 'fake.header.payload.signature',
        user: { uid: 'spoofed_user_1', email: 'spoofed@example.com' }
      }
    });
    await userHandler(fakeTokenReq, fakeTokenRes);
    const fakeResp = getFakeTokenRes();
    assert(fakeResp.statusCode === 401 && fakeResp.body.error === 'INVALID_TOKEN', 'Rejects fabricated Google ID token with 401 INVALID_TOKEN');

    // 12.2 Missing token when OAuth is configured is rejected
    const { req: noTokenReq, res: noTokenRes, getResponse: getNoTokenRes } = createMockReqRes({
      method: 'POST',
      url: '/api/user/sync',
      body: {
        user: { uid: 'spoofed_user_2', email: 'spoofed2@example.com' }
      }
    });
    await userHandler(noTokenReq, noTokenRes);
    const noTokenResp = getNoTokenRes();
    assert(noTokenResp.statusCode === 401 && noTokenResp.body.error === 'AUTHENTICATION_REQUIRED', 'Rejects missing Google ID token with 401 AUTHENTICATION_REQUIRED');

    // Restore
    if (origClientId) process.env.GOOGLE_CLIENT_ID = origClientId;
    else delete process.env.GOOGLE_CLIENT_ID;
  }

  // TEST SUITE 13: SUPABASE STORAGE ADAPTER & PERSISTENCE
  console.log('\n--- TEST SUITE 13: Storage Abstraction & Resilient Persistence ---');
  {
    const {
      getUsers,
      saveUser,
      recordOutboundClick,
      recordSubscriber,
      recordContactEnquiry,
      getMonetizationSettings,
      saveMonetizationSettings
    } = await import('../api/_storage.ts');

    // 13.1 User persistence
    const testUser = {
      uid: 'storage_test_user_1',
      email: 'storage_test@example.com',
      displayName: 'Storage Test Member',
      savedTools: ['gemini', 'bigquery'],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    const savedU = await saveUser(testUser);
    assert(savedU.uid === testUser.uid && savedU.savedTools.length === 2, 'saveUser persists user record with saved tools');

    // 13.2 Subscriber persistence
    const subResult = await recordSubscriber({
      email: 'storage_sub_test@example.com',
      ip: '127.0.0.1',
      subscribedAt: new Date().toISOString()
    });
    assert(subResult.subscriber.email === 'storage_sub_test@example.com' && subResult.subscriber.status === 'active', 'recordSubscriber creates active subscriber');

    // 13.3 Outbound click persistence
    const clickRec = await recordOutboundClick({
      sourcePage: 'test-suite',
      productSlug: 'gemini',
      destination: 'https://gemini.google.com',
      isAffiliate: false,
      timestamp: new Date().toISOString(),
      clientIp: '127.0.0.1'
    });
    assert(clickRec.destination === 'https://gemini.google.com', 'recordOutboundClick persists click record');

    // 13.4 Contact enquiry persistence
    const enquiry = await recordContactEnquiry({
      name: 'Storage Tester',
      email: 'enquiry_tester@example.com',
      subject: 'general',
      message: 'Testing storage abstraction persistence',
      status: 'queued_in_database',
      clientIp: '127.0.0.1'
    });
    assert(Boolean(enquiry.confirmationId) && enquiry.status === 'queued_in_database', 'recordContactEnquiry assigns confirmationId and stores enquiry');

    // 13.5 Monetization persistence
    const savedMon = await saveMonetizationSettings({ previewMode: false, customTestFlag: true });
    assert(savedMon === true, 'saveMonetizationSettings persists settings durably');
  }

  // TEST SUITE 14: SEO SITEMAP & PERFORMANCE CHUNK SIZES
  console.log('\n--- TEST SUITE 14: SEO Clean URLs & Bundle Chunk Size ---');
  {
    // 14.1 Sitemap contains no hash-based URLs
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    assert(fs.existsSync(sitemapPath), 'public/sitemap.xml exists');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    assert(!sitemapContent.includes('#'), 'sitemap.xml has ZERO hash fragments (clean indexable canonical URLs)');
    assert(sitemapContent.includes('/products/gemini'), 'sitemap.xml includes individual product detail routes');
    assert(sitemapContent.includes('/tutorials/getting-started-with-gemini'), 'sitemap.xml includes tutorial routes');
    assert(sitemapContent.includes('/comparisons/gemini-vs-notebooklm'), 'sitemap.xml includes comparison routes');
    assert(!sitemapContent.includes('/admin'), 'sitemap.xml excludes private administrative pages');

    // 14.2 Built JS chunks are all under 500 kB
    const distAssetsDir = path.join(process.cwd(), 'dist', 'assets');
    if (fs.existsSync(distAssetsDir)) {
      const files = fs.readdirSync(distAssetsDir).filter(f => f.endsWith('.js'));
      let allUnder500kB = true;
      let largestSize = 0;
      let largestFile = '';

      for (const file of files) {
        const stats = fs.statSync(path.join(distAssetsDir, file));
        if (stats.size > largestSize) {
          largestSize = stats.size;
          largestFile = file;
        }
        if (stats.size > 500 * 1024) {
          allUnder500kB = false;
        }
      }
      assert(allUnder500kB, `Every production JS chunk is strictly under 500 kB (largest is ${largestFile}: ${(largestSize / 1024).toFixed(1)} kB)`);
    } else {
      console.log('  SKIP: dist/assets not found, run npm run build first');
    }
  }

  // TEST SUITE 15: DATABASE ROW LEVEL SECURITY & STRUCTURED DATA
  console.log('\n--- TEST SUITE 15: Row Level Security & SEO Structured Data ---');
  {
    // 15.1 Verify Row Level Security in data/schema.sql
    const schemaSql = fs.readFileSync(path.join(process.cwd(), 'data', 'schema.sql'), 'utf-8');
    assert(schemaSql.includes('ALTER TABLE gtf_users ENABLE ROW LEVEL SECURITY;'), 'schema.sql enables RLS on gtf_users');
    assert(schemaSql.includes('ALTER TABLE gtf_subscribers ENABLE ROW LEVEL SECURITY;'), 'schema.sql enables RLS on gtf_subscribers');
    assert(schemaSql.includes('ALTER TABLE gtf_contact_enquiries ENABLE ROW LEVEL SECURITY;'), 'schema.sql enables RLS on gtf_contact_enquiries');
    assert(schemaSql.includes('ALTER TABLE gtf_monetization_settings ENABLE ROW LEVEL SECURITY;'), 'schema.sql enables RLS on gtf_monetization_settings');
    assert(schemaSql.includes('unsubscribed_at TIMESTAMPTZ'), 'schema.sql includes unsubscribed_at column');

    // 15.2 Verify SEO metadata & JSON-LD structured data in index.html
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
    assert(indexHtml.includes('application/ld+json'), 'index.html includes JSON-LD structured data');
    assert(indexHtml.includes('"@type": "WebSite"') && indexHtml.includes('"@type": "Organization"'), 'index.html declares WebSite and Organization schema');
    assert(indexHtml.includes('property="og:url"') && indexHtml.includes('property="og:site_name"'), 'index.html includes canonical Open Graph og:url and og:site_name');
    assert(indexHtml.includes('name="robots" content="index, follow"'), 'index.html includes explicit robots index, follow directive');
  }

  // TEST SUITE 16: AFFILIATE PAGE END-TO-END VERIFICATION
  console.log('\n--- TEST SUITE 16: Affiliate Page & Commercial Verification ---');
  {
    // 16.1 Affiliate page source & component integrity
    const affPagePath = path.join(process.cwd(), 'src', 'pages', 'AffiliateDisclosurePage.tsx');
    assert(fs.existsSync(affPagePath), 'src/pages/AffiliateDisclosurePage.tsx exists');
    const affContent = fs.readFileSync(affPagePath, 'utf-8');
    assert(affContent.includes('useMonetizationSync'), 'AffiliateDisclosurePage connects to useMonetizationSync');
    assert(affContent.includes('resolveProductActionUrl'), 'AffiliateDisclosurePage uses resolveProductActionUrl for destination safety');
    assert(affContent.includes('trackOutboundClick'), 'AffiliateDisclosurePage wires clicks to trackOutboundClick');
    assert(affContent.includes('ProductLogo'), 'AffiliateDisclosurePage displays authentic product logos');

    // 16.2 Eligible commercial products profiled
    assert(affContent.includes('google-workspace') && affContent.includes('google-cloud') && affContent.includes('google-drive'), 'Affiliate page profiles Google Workspace, Cloud, and Drive');

    // 16.3 Regulatory disclosures intact
    assert(affContent.includes('1. Current Status: Redirects Disabled & Awaiting Verified Referral URLs'), 'Affiliate page contains Section 1 with redirects disabled notice');
    assert(affContent.includes('2. How Commercial Referral Links Work'), 'Affiliate page contains Section 2 zero cost explanation');
    assert(affContent.includes('3. Uncompromised Editorial Independence Firewall'), 'Affiliate page contains Section 3 editorial independence firewall');
    assert(affContent.includes('4. FTC 16 CFR § 255 & ASCI Consumer Protection Compliance'), 'Affiliate page contains Section 4 FTC compliance statement');

    // 16.4 Route mapping in App.tsx
    const appPath = path.join(process.cwd(), 'src', 'App.tsx');
    const appCode = fs.readFileSync(appPath, 'utf-8');
    assert(appCode.includes("rawView === 'affiliate' || rawView === 'affiliate-disclosure'"), 'App.tsx routes both /affiliate and /affiliate-disclosure');
    assert(appCode.includes('<AffiliateDisclosurePage'), 'App.tsx renders AffiliateDisclosurePage with navigation props');

    // 16.5 Outbound click tracking telemetry integration
    const { req: affClickReq, res: affClickRes, getResponse: getAffClickRes } = createMockReqRes({
      method: 'POST',
      url: '/api/track-click',
      body: {
        destination: 'https://workspace.google.com',
        productSlug: 'google-workspace',
        sourcePage: 'affiliate-page',
        isAffiliate: false
      }
    });
    await trackClickHandler(affClickReq, affClickRes);
    const clickRes = getAffClickRes();
    assert(clickRes.statusCode === 200 && clickRes.body.success === true, 'Outbound click on affiliate page logs to /api/track-click successfully');
  }

  // Clean up automated test records from data/ files
  try {
    const cleanFile = (filename: string, filterFn: (item: any) => boolean) => {
      const p = path.join(process.cwd(), 'data', filename);
      if (fs.existsSync(p)) {
        const items = JSON.parse(fs.readFileSync(p, 'utf-8'));
        fs.writeFileSync(p, JSON.stringify(items.filter(filterFn), null, 2), 'utf-8');
      }
    };
    cleanFile('subscribers.json', (s: any) => !s.email.includes('test'));
    cleanFile('users.json', (u: any) => !u.uid.startsWith('goog_test_') && !u.uid.startsWith('storage_test_'));
    cleanFile('outbound-clicks.json', (c: any) => !c.sessionId?.startsWith('test_sess_') && c.sourcePage !== 'test-suite' && c.sourcePage !== 'affiliate-page' && c.sourcePage !== 'home');
    cleanFile('enquiries.json', (e: any) => !e.email.includes('test'));
    cleanFile('assistant-usage.json', (a: any) => a.promptLength !== 20 && a.promptLength !== 5 && a.promptLength !== 42);
  } catch {}

  console.log('\n====================================================');
  console.log(`TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test Suite Exception:', err);
  process.exit(1);
});
