import type { IncomingMessage, ServerResponse } from 'http';
import { parseJsonBody, sendJson } from './_utils.js';
import { getAdminSecret, verifySessionToken, extractBearerToken } from './admin-auth.js';
import { getMonetizationSettings, saveMonetizationSettings } from './_storage.js';

// Default initial safe policy configuration
const DEFAULT_MONETIZATION = {
  adsense: {
    enabled: false,
    testMode: true,
    publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
    adUnits: {
      headerBanner: '1092837465',
      inFeedHome: '2093847561',
      sidebarSticky: '3094857612',
      belowProductSpecs: '4095867123',
      footerBanner: '5096871234'
    }
  },
  affiliate: {
    enabled: false,
    network: 'google_workspace_referral',
    defaultTrackingTag: '',
    programs: {
      googleWorkspace: {
        active: false,
        referralId: '',
        customUrl: '',
        tier: 'Business Starter & Standard (India / Global)'
      },
      googleCloud: {
        active: false,
        partnerId: '',
        customUrl: ''
      },
      googleOne: {
        active: false,
        partnerId: '',
        customUrl: ''
      }
    }
  },
  ownerPromotion: {
    enabled: false,
    badgeText: 'Creator Spotlight',
    title: '',
    subtitle: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    ctaText: 'Explore Project',
    ctaUrl: '',
    secondaryCtaText: '',
    secondaryCtaUrl: ''
  },
  previewMode: false,
  lastUpdated: new Date().toISOString()
};

let memoryStore = { ...DEFAULT_MONETIZATION };

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  // GET: Public or admin read of current server monetization settings
  if (req.method === 'GET') {
    try {
      const persisted = await getMonetizationSettings();
      if (persisted) {
        memoryStore = { ...DEFAULT_MONETIZATION, ...persisted };
      }
    } catch (e) {
      console.warn('[Monetization Load Warning]', e);
    }
    return sendJson(res, 200, {
      success: true,
      settings: memoryStore
    });
  }

  // POST: Modify settings - STRICTLY REQUIRES ADMIN AUTH
  if (req.method === 'POST') {
    const secret = getAdminSecret();
    if (!secret) {
      return sendJson(res, 503, {
        success: false,
        error: 'ADMIN_AUTH_UNCONFIGURED',
        message: 'Admin authentication is unconfigured. Set ADMIN_PASSWORD on server to modify settings.'
      });
    }

    const token = extractBearerToken(req);
    if (!token) {
      return sendJson(res, 401, {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Administrative authentication token is required.'
      });
    }

    const verification = verifySessionToken(token, secret);
    if (!verification.valid) {
      return sendJson(res, 401, {
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Admin session is invalid or expired. Please re-authenticate.'
      });
    }

    let body: any;
    try {
      body = await parseJsonBody(req);
    } catch {
      return sendJson(res, 400, { success: false, error: 'INVALID_JSON', message: 'Malformed JSON payload.' });
    }

    const updatedSettings = {
      ...memoryStore,
      adsense: {
        ...memoryStore.adsense,
        ...(body.adsense || {})
      },
      affiliate: {
        ...memoryStore.affiliate,
        ...(body.affiliate || {})
      },
      ownerPromotion: {
        ...(memoryStore.ownerPromotion || {
          enabled: false,
          badgeText: 'Creator Spotlight',
          title: '',
          subtitle: '',
          description: '',
          videoUrl: '',
          thumbnailUrl: '',
          ctaText: 'Explore Project',
          ctaUrl: '',
          secondaryCtaText: '',
          secondaryCtaUrl: ''
        }),
        ...(body.ownerPromotion || {})
      },
      previewMode: typeof body.previewMode === 'boolean' ? body.previewMode : memoryStore.previewMode,
      lastUpdated: new Date().toISOString()
    };

    let persisted = false;
    try {
      persisted = await saveMonetizationSettings(updatedSettings);
      memoryStore = updatedSettings;
    } catch (err: any) {
      console.error('[Monetization Persistence Error]', err);
      return sendJson(res, 500, {
        success: false,
        error: 'PERSISTENCE_FAILED',
        message: 'Failed to persist monetization settings to database.'
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: 'Monetization settings saved securely on server.',
      persisted,
      persistedToDisk: persisted,
      settings: updatedSettings
    });
  }

  return sendJson(res, 405, { success: false, error: 'METHOD_NOT_ALLOWED', message: 'Only GET and POST supported.' });
}
