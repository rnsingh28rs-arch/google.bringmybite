export type PricingStatus = 'free' | 'free_tier' | 'paid' | 'trial' | 'varies';

export type Platform = 'Web' | 'Android' | 'iOS' | 'ChromeOS' | 'Windows' | 'macOS' | 'API' | 'Extension';

export type Audience = 'General Public' | 'Students' | 'Professionals' | 'Developers' | 'Small Businesses' | 'Enterprises' | 'Creators' | 'Educators';

export type ProductCategory = 
  | 'AI & Generative AI'
  | 'Productivity & Office'
  | 'Email & Communication'
  | 'Cloud Storage & Files'
  | 'Search & Research'
  | 'Developer Tools'
  | 'Cloud Computing'
  | 'Analytics & Marketing'
  | 'Monetisation & Ads'
  | 'Maps & Location'
  | 'Photos & Media'
  | 'Education'
  | 'Business Tools'
  | 'Security & Account';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  summary: string;
  description: string[];
  keyFeatures: string[];
  typicalUseCases: string[];
  intendedAudience: Audience[];
  platforms: Platform[];
  pricingStatus: PricingStatus;
  pricingOverview: string;
  verifiedPricingInINR?: string;
  verifiedPricingInUSD?: string;
  pricingNotes: string;
  officialUrl: string;
  officialPricingUrl?: string;
  affiliateUrl?: string;
  affiliateProgram?: string;
  affiliateTrackingId?: string;
  lastVerifiedDate: string;
  isPopular?: boolean;
  isFeaturedAI?: boolean;
  iconName: string; // Lucide icon reference fallback
  logoType?: string; // Specific official logo identifier
  relatedProductSlugs: string[];
  relatedTutorialSlugs: string[];
}

export type OfferCategory = 
  | 'free_trial'
  | 'free_plan'
  | 'telecom_bundle'
  | 'student_education'
  | 'startup_developer'
  | 'seasonal_promotion'
  | 'business_workspace';

export type OfferStatus = 'verified' | 'expired' | 'awaiting_verification';

export interface IndiaOffer {
  id: string;
  title: string;
  productSlug: string;
  productName: string;
  category: OfferCategory;
  summary: string;
  benefit: string;
  eligibilityRequirements: string[];
  paymentDetailsRequired: boolean;
  paymentDetailsNote: string;
  expiryDateText: string;
  redemptionUrl: string;
  lastVerifiedDate: string;
  status: OfferStatus;
  cautionNotes?: string;
  termsHighlights: string[];
}

export interface TutorialSection {
  heading: string;
  content: string;
  steps?: string[];
  tip?: string;
  warning?: string;
}

export interface Tutorial {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readingTimeMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lastUpdated: string;
  summary: string;
  relatedProductSlug?: string;
  keyTakeaways: string[];
  sections: TutorialSection[];
  officialDocUrl: string;
}

export interface ComparisonCriterion {
  name: string;
  description: string;
  winnerName?: string;
}

export interface ComparisonItem {
  id: string;
  name: string;
  tagline: string;
  pricingSummary: string;
  bestFor: string;
  strengths: string[];
  limitations: string[];
}

export interface Comparison {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  items: ComparisonItem[];
  criteria: ComparisonCriterion[];
  featureTable: {
    feature: string;
    description: string;
    values: Record<string, string>; // item id -> value description
  }[];
  verdict: string;
  recommendations: {
    audience: string;
    recommendedProduct: string;
    rationale: string;
  }[];
  lastVerifiedDate: string;
}

export interface UpdateItem {
  id: string;
  date: string;
  title: string;
  category: 'AI Launch' | 'Pricing Update' | 'New Feature' | 'India Offer' | 'Discontinuation';
  productName: string;
  summary: string;
  impact: string;
  officialSourceUrl: string;
}
