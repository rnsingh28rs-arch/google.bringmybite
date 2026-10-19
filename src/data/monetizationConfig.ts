/**
 * Centralized Monetisation & Advertising Configuration for Bring My Bite
 *
 * Safe Default Policy:
 * - All ad units and commercial affiliate links default to INACTIVE until genuine, approved identifiers are configured.
 * - When inactive, ad slots do not cause layout shifts (CLS: 0).
 * - Transparent editorial and affiliate disclosure is maintained at all times.
 * - Outbound referral redirects stay strictly OFF until genuine approved links are verified.
 * - Direct official Google destinations remain active at all times.
 */

export type MonetizationStatus = 'not_configured' | 'pending_approval' | 'verified' | 'active';

export interface AdSenseConfig {
  enabled: boolean;
  status: MonetizationStatus;
  verificationStatus: 'unsubmitted' | 'pending_review' | 'verified' | 'rejected';
  adsTxtStatus: 'missing_publisher_id' | 'pending_verification' | 'verified';
  testMode: boolean;
  publisherId: string; // e.g. "ca-pub-XXXXXXXXXXXXXXXX" (placeholder until Google approves domain)
  adUnits: {
    headerBanner: string;
    inFeedHome: string;
    sidebarSticky: string;
    belowProductSpecs: string;
    footerBanner: string;
  };
  notes?: string;
}

export interface CjAdvertiserProgram {
  id: string; // e.g. 'google-workspace-cj'
  name: string; // e.g. 'Google Workspace (via CJ Affiliate)'
  cjAdvertiserId: string; // CJ Advertiser ID (e.g. '5678901')
  status: MonetizationStatus;
  referralUrl: string; // Genuine CJ tracking URL (e.g. https://www.anrdoezrs.net/click-...)
  commissionTier: string; // e.g. 'CPA flat bounty per qualified business user (approx. ₹750–₹1,500 / $8–$23)'
  notes: string;
}

export interface CjAffiliateConfig {
  status: MonetizationStatus;
  publisherCid: string; // CJ Publisher Account CID (7-8 digits)
  websitePid: string; // Website Property ID (PID)
  defaultSid: string; // Shopper / SubID Tracking ID (SID, max 64 chars)
  approvedPrograms: CjAdvertiserProgram[];
  commissionReporting: {
    supported: boolean;
    apiConfigured: boolean; // Server-side GraphQL integration flag
    notes: string;
  };
}

export interface GoogleProgramItem {
  status: MonetizationStatus;
  active: boolean;
  programType: string;
  referralId: string;
  customUrl: string;
  eligibilityStatus: string;
  tier: string;
  notes: string;
}

export interface GoogleAffiliateConfig {
  googleWorkspace: GoogleProgramItem;
  googleCloud: GoogleProgramItem;
  googleOne: GoogleProgramItem;
}

export interface ImpactAffiliateConfig {
  status: MonetizationStatus;
  accountSid: string;
  mediaPartnerId: string;
  campaignId: string;
  customUrl: string;
  notes: string;
}

export interface AffiliateConfig {
  enabled: boolean;
  network: 'cj' | 'google_workspace_referral' | 'google_cloud_partner' | 'impact' | 'direct';
  defaultTrackingTag: string;
  cj: CjAffiliateConfig;
  google: GoogleAffiliateConfig;
  impact: ImpactAffiliateConfig;
  programs: {
    googleWorkspace: {
      active: boolean;
      referralId: string;
      customUrl: string;
      tier: 'Business Starter & Standard (India / Global)';
    };
    googleCloud: {
      active: boolean;
      partnerId: string;
      customUrl: string;
    };
    googleOne: {
      active: boolean;
      partnerId: string;
      customUrl: string;
    };
  };
  disclosure: {
    shortBadge: string;
    fullNotice: string;
    editorialIndependenceNotice: string;
  };
}

export interface OwnerPromotionConfig {
  enabled: boolean;
  badgeText: string;
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

export interface MonetizationSettings {
  adsense: AdSenseConfig;
  affiliate: AffiliateConfig;
  ownerPromotion?: OwnerPromotionConfig;
  previewMode: boolean;
  complianceLastAudited: string;
}

export const DEFAULT_OWNER_PROMOTION: OwnerPromotionConfig = {
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
};

export const DEFAULT_CJ_CONFIG: CjAffiliateConfig = {
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
};

export const DEFAULT_IMPACT_CONFIG: ImpactAffiliateConfig = {
  status: 'not_configured',
  accountSid: '',
  mediaPartnerId: '',
  campaignId: '',
  customUrl: '',
  notes: 'Universal Impact Radius tracking configuration for Google and developer products.'
};

export const DEFAULT_GOOGLE_CONFIG: GoogleAffiliateConfig = {
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
};

export const DEFAULT_MONETIZATION_CONFIG: MonetizationSettings = {
  ownerPromotion: DEFAULT_OWNER_PROMOTION,
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
    cj: DEFAULT_CJ_CONFIG,
    google: DEFAULT_GOOGLE_CONFIG,
    impact: DEFAULT_IMPACT_CONFIG,
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
  previewMode: false,
  complianceLastAudited: 'October 2026'
};

const STORAGE_KEY = 'bmb_monetization_settings_v1';

/**
 * Deep merge monetization settings with defaults to prevent missing nested keys
 */
export const mergeMonetizationConfig = (
  base: MonetizationSettings,
  incoming: Partial<MonetizationSettings> | null | undefined
): MonetizationSettings => {
  if (!incoming) return base;

  // Reconcile legacy programs with google programs if provided
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
        approvedPrograms: Array.isArray(incoming.affiliate?.cj?.approvedPrograms) && incoming.affiliate!.cj!.approvedPrograms.length > 0
          ? incoming.affiliate!.cj!.approvedPrograms
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
      ...(base.ownerPromotion || DEFAULT_OWNER_PROMOTION),
      ...(incoming.ownerPromotion || {})
    }
  };
};

/**
 * Evaluates whether a URL is a genuine, verified affiliate or referral URL.
 * Never treats ordinary Google URLs (e.g. workspace.google.com, cloud.google.com, one.google.com)
 * or placeholder parameters as affiliate links.
 */
export const isVerifiedReferralUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.length === 0) return false;

  // Placeholder and fabricated patterns that must never be treated as affiliate links
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

    // Genuine Google Workspace referral program domain
    if (host === 'referworkspace.app.goo.gl') {
      return parsed.pathname.length > 1;
    }

    // Authorized affiliate network domains (CJ, Impact, Rakuten)
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

    // Direct Google domains: ordinary Google URLs without genuine affiliate parameters
    // are direct official URLs and must NOT be treated as affiliate links
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
};

export const getMonetizationSettings = (): MonetizationSettings => {
  if (typeof window === 'undefined') return DEFAULT_MONETIZATION_CONFIG;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_MONETIZATION_CONFIG;
    return mergeMonetizationConfig(DEFAULT_MONETIZATION_CONFIG, JSON.parse(stored));
  } catch {
    return DEFAULT_MONETIZATION_CONFIG;
  }
};

export const saveMonetizationSettings = (settings: MonetizationSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save monetization settings', err);
  }
};

/**
 * Resolves the outbound link for a product:
 * If genuine, verified referral URLs are configured and affiliate mode is enabled, returns the tracking link.
 * Otherwise, always defaults to the authentic, direct official Google product URL with redirects disabled.
 */
export const resolveProductActionUrl = (
  productOfficialUrl: string,
  productAffiliateUrl?: string,
  productSlug?: string
): { url: string; isAffiliate: boolean } => {
  const settings = getMonetizationSettings();

  // Redirects only active if affiliate mode is enabled AND genuine referral URL is verified
  if (settings.affiliate.enabled) {
    // 1. Direct per-product affiliate link override (must be verified referral URL)
    if (productAffiliateUrl && isVerifiedReferralUrl(productAffiliateUrl)) {
      return {
        url: productAffiliateUrl.trim(),
        isAffiliate: true
      };
    }

    const slug = (productSlug || '').toLowerCase();

    // 2. CJ Approved Programs check
    if (settings.affiliate.cj?.status === 'active' || settings.affiliate.cj?.status === 'verified') {
      const cjProg = settings.affiliate.cj.approvedPrograms?.find(p => {
        if (slug === 'google-workspace' || slug === 'workspace') return p.id.includes('workspace');
        return false;
      });
      if (cjProg && (cjProg.status === 'active' || cjProg.status === 'verified') && isVerifiedReferralUrl(cjProg.referralUrl)) {
        return {
          url: cjProg.referralUrl.trim(),
          isAffiliate: true
        };
      }
    }

    // 3. Program-level custom referral links if actively configured with verified URL
    if (
      (slug === 'google-workspace' || slug === 'workspace') &&
      (settings.affiliate.google?.googleWorkspace?.active || settings.affiliate.programs.googleWorkspace?.active)
    ) {
      const candidateUrl = settings.affiliate.google?.googleWorkspace?.customUrl || settings.affiliate.programs.googleWorkspace.customUrl;
      if (isVerifiedReferralUrl(candidateUrl)) {
        return {
          url: candidateUrl.trim(),
          isAffiliate: true
        };
      }
    }

    if (
      (slug === 'google-cloud' || slug === 'gcp') &&
      (settings.affiliate.google?.googleCloud?.active || settings.affiliate.programs.googleCloud?.active)
    ) {
      const candidateUrl = settings.affiliate.google?.googleCloud?.customUrl || settings.affiliate.programs.googleCloud.customUrl;
      if (isVerifiedReferralUrl(candidateUrl)) {
        return {
          url: candidateUrl.trim(),
          isAffiliate: true
        };
      }
    }

    if (
      (slug === 'google-drive' || slug === 'gemini') &&
      (settings.affiliate.google?.googleOne?.active || settings.affiliate.programs.googleOne?.active)
    ) {
      const candidateUrl = settings.affiliate.google?.googleOne?.customUrl || settings.affiliate.programs.googleOne.customUrl;
      if (isVerifiedReferralUrl(candidateUrl)) {
        return {
          url: candidateUrl.trim(),
          isAffiliate: true
        };
      }
    }
  }

  // Safe Default: Redirects disabled or URLs awaiting verification -> Direct official Google URL
  return {
    url: productOfficialUrl,
    isAffiliate: false
  };
};
