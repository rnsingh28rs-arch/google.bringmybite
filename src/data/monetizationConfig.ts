/**
 * Centralized Monetisation & Advertising Configuration for Bring My Bite
 * 
 * Safe Default Policy:
 * - All ad units and commercial affiliate links default to INACTIVE until genuine, approved identifiers are configured.
 * - When inactive, ad slots do not cause layout shifts (CLS: 0).
 * - Transparent editorial and affiliate disclosure is maintained at all times.
 */

export interface AdSenseConfig {
  enabled: boolean;
  testMode: boolean;
  publisherId: string; // e.g. "ca-pub-XXXXXXXXXXXXXXXX" (placeholder until Google approves domain)
  adUnits: {
    headerBanner: string;
    inFeedHome: string;
    sidebarSticky: string;
    belowProductSpecs: string;
    footerBanner: string;
  };
}

export interface AffiliateConfig {
  enabled: boolean;
  network: 'google_workspace_referral' | 'google_cloud_partner' | 'impact' | 'direct';
  defaultTrackingTag: string; // e.g. "bringmybite-21" or tracking tag
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
  videoUrl: string; // YouTube, Vimeo, or direct MP4/WebM
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
  previewMode: boolean; // Enables visual preview of ad placements for site administrators
  complianceLastAudited: string;
}

const DEFAULT_OWNER_PROMOTION: OwnerPromotionConfig = {
  enabled: false, // Inactive until owner provides actual campaign details
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

const DEFAULT_MONETIZATION_CONFIG: MonetizationSettings = {
  ownerPromotion: DEFAULT_OWNER_PROMOTION,
  adsense: {
    enabled: false, // Default inactive until domain approval by Google AdSense
    testMode: true,
    publisherId: 'ca-pub-XXXXXXXXXXXXXXXX', // Documented placeholder
    adUnits: {
      headerBanner: '1092837465',
      inFeedHome: '2093847561',
      sidebarSticky: '3094857612',
      belowProductSpecs: '4095867123',
      footerBanner: '5096871234'
    }
  },
  affiliate: {
    enabled: false, // Default inactive until affiliate partnership approval
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
        customUrl: '',
      },
      googleOne: {
        active: false,
        partnerId: '',
        customUrl: '',
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

export const getMonetizationSettings = (): MonetizationSettings => {
  if (typeof window === 'undefined') return DEFAULT_MONETIZATION_CONFIG;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_MONETIZATION_CONFIG;
    return { ...DEFAULT_MONETIZATION_CONFIG, ...JSON.parse(stored) };
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
 * If an approved affiliate URL is configured and affiliate mode is enabled, returns the tracking link.
 * Otherwise, always defaults to the authentic, direct official Google product URL.
 */
export const resolveProductActionUrl = (
  productOfficialUrl: string, 
  productAffiliateUrl?: string,
  productSlug?: string
): { url: string; isAffiliate: boolean } => {
  const settings = getMonetizationSettings();
  if (settings.affiliate.enabled) {
    // 1. Direct per-product affiliate link override
    if (productAffiliateUrl && productAffiliateUrl.trim().length > 0) {
      return {
        url: productAffiliateUrl.trim(),
        isAffiliate: true
      };
    }

    // 2. Program-level custom referral links if actively configured
    const slug = (productSlug || '').toLowerCase();
    if ((slug === 'google-workspace' || slug === 'workspace') && settings.affiliate.programs.googleWorkspace?.active && settings.affiliate.programs.googleWorkspace.customUrl) {
      return {
        url: settings.affiliate.programs.googleWorkspace.customUrl.trim(),
        isAffiliate: true
      };
    }
    if ((slug === 'google-cloud' || slug === 'gcp') && settings.affiliate.programs.googleCloud?.active && settings.affiliate.programs.googleCloud.customUrl) {
      return {
        url: settings.affiliate.programs.googleCloud.customUrl.trim(),
        isAffiliate: true
      };
    }
    if ((slug === 'google-drive' || slug === 'gemini') && settings.affiliate.programs.googleOne?.active && settings.affiliate.programs.googleOne.customUrl) {
      return {
        url: settings.affiliate.programs.googleOne.customUrl.trim(),
        isAffiliate: true
      };
    }
  }

  return {
    url: productOfficialUrl,
    isAffiliate: false
  };
};
