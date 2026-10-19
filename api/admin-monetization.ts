import type { IncomingMessage, ServerResponse } from 'http';
import { parseJsonBody, sendJson } from './_utils.js';
import { getAdminSecret, verifySessionToken, extractBearerToken } from './admin-auth.js';
import { getMonetizationSettings, saveMonetizationSettings } from './_storage.js';

// Default initial safe policy configuration
const DEFAULT_MONETIZATION = {
  adsense: {
    enabled: false,
    status: 'not_configured',
    verificationStatus: 'unsubmitted',
    adsTxtStatus: 'missing_publisher_id',
    testMode: true,
    publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
    adUnits: {
      headerBanner: '1092837465',
      inFeedHome: '2093847561',
      sidebarSticky: '3094857612',
      belowProductSpecs: '4095867123',
      footerBanner: '5096871234'
    },
    notes: 'Awaiting AdSense domain review and verification.'
  },
  affiliate: {
    enabled: false,
    network: 'google_workspace_referral',
    defaultTrackingTag: '',
    cj: {
      status: 'not_configured',
      publisherCid: '',
      websitePid: '',
      defaultSid: '',
      approvedPrograms: [
        {
          id: 'google-workspace-cj',
          name: 'Google Workspace (via CJ Affiliate)',
          cjAdvertiserId: '',
          status: 'not_configured',
          referralUrl: '',
          commissionTier: 'Bounty per qualified business seat (Starter/Standard)',
          notes: 'Requires approval into the Google Workspace advertiser programme within CJ Account Manager.'
        },
        {
          id: 'google-store-cj',
          name: 'Google Store Hardware (via CJ Affiliate)',
          cjAdvertiserId: '',
          status: 'not_configured',
          referralUrl: '',
          commissionTier: 'Revenue share percentage on eligible hardware devices',
          notes: 'Requires approval into Google Store advertiser program within CJ.'
        }
      ],
      commissionReporting: {
        supported: true,
        apiConfigured: false,
        notes: 'CJ provides GraphQL reporting API for automated transaction and commission logs. Personal Access Token must remain strictly server-side.'
      }
    },
    google: {
      googleWorkspace: {
        status: 'not_configured',
        active: false,
        programType: 'Google Workspace Referral Program',
        referralId: '',
        customUrl: '',
        eligibilityStatus: 'Open enrollment in India and 40+ countries. Requires bank account in registration region.',
        tier: 'Business Starter (approx. ₹750/user) & Business Standard (approx. ₹1,500/user)',
        notes: 'Direct official Google customer referral programme. Issues unique referworkspace.app.goo.gl links.'
      },
      googleCloud: {
        status: 'not_configured',
        active: false,
        programType: 'Google Cloud Partner Advantage / Innovators',
        referralId: '',
        customUrl: '',
        eligibilityStatus: 'Requires approved partner organization membership or certified Google Developer Expert status.',
        tier: 'Partner tier points, co-sell incentives, and cloud consumption credits',
        notes: 'Standard cloud.google.com URLs are official product links and do not contain partner referral attribution.'
      },
      googleOne: {
        status: 'not_configured',
        active: false,
        programType: 'Google One Referral (Member / Closed Partner)',
        referralId: '',
        customUrl: '',
        eligibilityStatus: 'Private / Closed. Google does not currently offer an open public affiliate program for Google One.',
        tier: 'Currently non-commissionable via open affiliate networks',
        notes: 'Direct one.google.com URLs are official consumer subscription links and do not provide referral kickbacks.'
      }
    },
    impact: {
      status: 'not_configured',
      accountSid: '',
      mediaPartnerId: '',
      campaignId: '',
      customUrl: '',
      notes: 'Universal Impact Radius tracking configuration for Google and developer products.'
    },
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
    },
    disclosure: {
      shortBadge: 'Affiliate / Commercial Link',
      fullNotice: 'Bring My Bite is an independent technology discovery platform. We may earn a referral commission from qualifying subscriptions or domain registrations completed through our partner links. This never affects pricing for you or our editorial product evaluations.',
      editorialIndependenceNotice: 'Editorial evaluations, benchmarks, and verdicts are conducted independently without commercial influence from advertisers or affiliate partners.'
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

function isVerifiedReferralUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.length === 0) return false;

  const fabricatedPatterns = [
    'YOUR_REFERRAL_CODE',
    'YOUR_PARTNER_ID',
    'YOUR_CODE',
    'demo-gtf-tracker-01',
    'bringmybite-21',
    'example.com',
    'localhost',
    'pub-XXXXXXXXXXXXXXXX',
    'ca-pub-XXXXXXXXXXXXXXXX'
  ];
  if (fabricatedPatterns.some(p => trimmed.toUpperCase().includes(p.toUpperCase()))) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    if (host === 'referworkspace.app.goo.gl') {
      return parsed.pathname.length > 1;
    }

    const authorizedNetworks = [
      'impact.com',
      'app.impact.com',
      'prf.hn',
      'cj.com',
      'anrdoezrs.net',
      'dpbolvw.net',
      'jdoqocy.com',
      'tkqlhce.com',
      'kqzyfj.com',
      'emjcd.com',
      'rakuten.com'
    ];
    if (authorizedNetworks.some(net => host === net || host.endsWith('.' + net))) {
      return parsed.pathname.length > 1 || parsed.search.length > 1;
    }

    if (
      host === 'workspace.google.com' ||
      host === 'cloud.google.com' ||
      host === 'one.google.com' ||
      host === 'drive.google.com'
    ) {
      const hasWorkspaceRef = parsed.searchParams.has('ref') &&
        parsed.searchParams.get('ref')!.length > 4 &&
        !parsed.searchParams.get('ref')!.toUpperCase().includes('YOUR');
      const hasCloudPartner = parsed.searchParams.has('partner') &&
        parsed.searchParams.get('partner')!.length > 4 &&
        !parsed.searchParams.get('partner')!.toUpperCase().includes('YOUR');
      return Boolean(hasWorkspaceRef || hasCloudPartner);
    }

    return false;
  } catch {
    return false;
  }
}

function mergeMonetizationConfig(base: any, incoming: any) {
  if (!incoming) return base;

  const incomingGoogle = incoming.affiliate?.google;
  const incomingPrograms = incoming.affiliate?.programs;

  const mergedWorkspace = {
    ...base.affiliate.google.googleWorkspace,
    ...(incomingGoogle?.googleWorkspace || {}),
    referralId: incomingGoogle?.googleWorkspace?.referralId ?? incomingPrograms?.googleWorkspace?.referralId ?? base.affiliate.google.googleWorkspace.referralId,
    customUrl: incomingGoogle?.googleWorkspace?.customUrl ?? incomingPrograms?.googleWorkspace?.customUrl ?? base.affiliate.google.googleWorkspace.customUrl,
    active: incomingGoogle?.googleWorkspace?.active ?? incomingPrograms?.googleWorkspace?.active ?? base.affiliate.google.googleWorkspace.active
  };

  const mergedCloud = {
    ...base.affiliate.google.googleCloud,
    ...(incomingGoogle?.googleCloud || {}),
    referralId: incomingGoogle?.googleCloud?.referralId ?? incomingPrograms?.googleCloud?.partnerId ?? base.affiliate.google.googleCloud.referralId,
    customUrl: incomingGoogle?.googleCloud?.customUrl ?? incomingPrograms?.googleCloud?.customUrl ?? base.affiliate.google.googleCloud.customUrl,
    active: incomingGoogle?.googleCloud?.active ?? incomingPrograms?.googleCloud?.active ?? base.affiliate.google.googleCloud.active
  };

  const mergedOne = {
    ...base.affiliate.google.googleOne,
    ...(incomingGoogle?.googleOne || {}),
    referralId: incomingGoogle?.googleOne?.referralId ?? incomingPrograms?.googleOne?.partnerId ?? base.affiliate.google.googleOne.referralId,
    customUrl: incomingGoogle?.googleOne?.customUrl ?? incomingPrograms?.googleOne?.customUrl ?? base.affiliate.google.googleOne.customUrl,
    active: incomingGoogle?.googleOne?.active ?? incomingPrograms?.googleOne?.active ?? base.affiliate.google.googleOne.active
  };

  return {
    ...base,
    ...incoming,
    adsense: {
      ...base.adsense,
      ...(incoming.adsense || {}),
      status: incoming.adsense?.status || base.adsense.status || 'not_configured',
      verificationStatus: incoming.adsense?.verificationStatus || base.adsense.verificationStatus || 'unsubmitted',
      adsTxtStatus: incoming.adsense?.adsTxtStatus || base.adsense.adsTxtStatus || 'missing_publisher_id',
      adUnits: {
        ...base.adsense.adUnits,
        ...(incoming.adsense?.adUnits || {})
      }
    },
    affiliate: {
      ...base.affiliate,
      ...(incoming.affiliate || {}),
      cj: {
        ...base.affiliate.cj,
        ...(incoming.affiliate?.cj || {}),
        status: incoming.affiliate?.cj?.status || base.affiliate.cj.status || 'not_configured',
        approvedPrograms: Array.isArray(incoming.affiliate?.cj?.approvedPrograms) && incoming.affiliate.cj.approvedPrograms.length > 0
          ? incoming.affiliate.cj.approvedPrograms
          : base.affiliate.cj.approvedPrograms,
        commissionReporting: {
          ...base.affiliate.cj.commissionReporting,
          ...(incoming.affiliate?.cj?.commissionReporting || {})
        }
      },
      impact: {
        ...base.affiliate.impact,
        ...(incoming.affiliate?.impact || {}),
        status: incoming.affiliate?.impact?.status || base.affiliate.impact.status || 'not_configured'
      },
      google: {
        googleWorkspace: mergedWorkspace,
        googleCloud: mergedCloud,
        googleOne: mergedOne
      },
      programs: {
        googleWorkspace: {
          active: mergedWorkspace.active,
          referralId: mergedWorkspace.referralId,
          customUrl: mergedWorkspace.customUrl,
          tier: 'Business Starter & Standard (India / Global)'
        },
        googleCloud: {
          active: mergedCloud.active,
          partnerId: mergedCloud.referralId,
          customUrl: mergedCloud.customUrl
        },
        googleOne: {
          active: mergedOne.active,
          partnerId: mergedOne.referralId,
          customUrl: mergedOne.customUrl
        }
      },
      disclosure: {
        ...base.affiliate.disclosure,
        ...(incoming.affiliate?.disclosure || {})
      }
    },
    ownerPromotion: {
      ...(base.ownerPromotion || DEFAULT_MONETIZATION.ownerPromotion),
      ...(incoming.ownerPromotion || {})
    }
  };
}

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
        memoryStore = mergeMonetizationConfig(DEFAULT_MONETIZATION, persisted);
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

    const merged = mergeMonetizationConfig(memoryStore, body);

    // Enforce Rule: Never invent referral IDs or pretend ordinary Google URLs are affiliate links.
    // If genuine referral URLs are unavailable, keep redirects disabled.
    const hasVerifiedWorkspace = isVerifiedReferralUrl(
      merged.affiliate?.google?.googleWorkspace?.customUrl || merged.affiliate?.programs?.googleWorkspace?.customUrl
    );
    const hasVerifiedCloud = isVerifiedReferralUrl(
      merged.affiliate?.google?.googleCloud?.customUrl || merged.affiliate?.programs?.googleCloud?.customUrl
    );
    const hasVerifiedOne = isVerifiedReferralUrl(
      merged.affiliate?.google?.googleOne?.customUrl || merged.affiliate?.programs?.googleOne?.customUrl
    );

    // CJ approved programs check
    const hasVerifiedCjProgram = Array.isArray(merged.affiliate?.cj?.approvedPrograms) &&
      merged.affiliate.cj.approvedPrograms.some((p: any) => isVerifiedReferralUrl(p.referralUrl));

    // Impact custom URL check
    const hasVerifiedImpact = isVerifiedReferralUrl(merged.affiliate?.impact?.customUrl);

    // Update Program Active and Truthful Status Flags
    if (merged.affiliate?.google?.googleWorkspace) {
      merged.affiliate.google.googleWorkspace.active = hasVerifiedWorkspace;
      if (!hasVerifiedWorkspace && (merged.affiliate.google.googleWorkspace.status === 'verified' || merged.affiliate.google.googleWorkspace.status === 'active')) {
        merged.affiliate.google.googleWorkspace.status = merged.affiliate.google.googleWorkspace.referralId?.trim() ? 'pending_approval' : 'not_configured';
      }
    }
    if (merged.affiliate?.programs?.googleWorkspace) {
      merged.affiliate.programs.googleWorkspace.active = hasVerifiedWorkspace;
    }

    if (merged.affiliate?.google?.googleCloud) {
      merged.affiliate.google.googleCloud.active = hasVerifiedCloud;
      if (!hasVerifiedCloud && (merged.affiliate.google.googleCloud.status === 'verified' || merged.affiliate.google.googleCloud.status === 'active')) {
        merged.affiliate.google.googleCloud.status = merged.affiliate.google.googleCloud.referralId?.trim() ? 'pending_approval' : 'not_configured';
      }
    }
    if (merged.affiliate?.programs?.googleCloud) {
      merged.affiliate.programs.googleCloud.active = hasVerifiedCloud;
    }

    if (merged.affiliate?.google?.googleOne) {
      merged.affiliate.google.googleOne.active = hasVerifiedOne;
      if (!hasVerifiedOne && (merged.affiliate.google.googleOne.status === 'verified' || merged.affiliate.google.googleOne.status === 'active')) {
        merged.affiliate.google.googleOne.status = merged.affiliate.google.googleOne.referralId?.trim() ? 'pending_approval' : 'not_configured';
      }
    }
    if (merged.affiliate?.programs?.googleOne) {
      merged.affiliate.programs.googleOne.active = hasVerifiedOne;
    }

    // Truthful validation for CJ Affiliate
    if (merged.affiliate?.cj) {
      const hasCjIds = Boolean(merged.affiliate.cj.publisherCid?.trim() && merged.affiliate.cj.websitePid?.trim());
      if (!hasCjIds && (merged.affiliate.cj.status === 'verified' || merged.affiliate.cj.status === 'active')) {
        merged.affiliate.cj.status = 'not_configured';
      } else if (hasCjIds && !hasVerifiedCjProgram && merged.affiliate.cj.status === 'active') {
        merged.affiliate.cj.status = 'pending_approval';
      }
    }

    // Truthful validation for Google AdSense
    if (merged.adsense) {
      const pubId = (merged.adsense.publisherId || '').trim();
      const isPlaceholder = !pubId || pubId === 'ca-pub-XXXXXXXXXXXXXXXX' || !/^ca-pub-\d{16}$/.test(pubId);
      if (isPlaceholder) {
        if (merged.adsense.status === 'verified' || merged.adsense.status === 'active') {
          merged.adsense.status = pubId ? 'pending_approval' : 'not_configured';
        }
        merged.adsense.enabled = false; // Never enable live ad units with placeholder ID
      }
    }

    // If no verified referral URLs are available anywhere, keep redirects strictly disabled
    const hasAnyVerifiedReferral = hasVerifiedWorkspace || hasVerifiedCloud || hasVerifiedOne || hasVerifiedCjProgram || hasVerifiedImpact;
    if (!hasAnyVerifiedReferral) {
      merged.affiliate.enabled = false;
    }

    const updatedSettings = {
      ...merged,
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
