import React from 'react';
import {
  ShieldCheck,
  Tag,
  Info,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Server,
  HardDrive,
  Briefcase,
  MapPin,
  Clock,
  Eye,
  Settings
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductLogo } from '../components/ProductLogo';
import { useMonetizationSync } from '../utils/useMonetizationSync';
import { resolveProductActionUrl, isVerifiedReferralUrl } from '../data/monetizationConfig';
import { trackOutboundClick } from '../utils/analyticsBroker';

interface AffiliateDisclosurePageProps {
  onSelectProduct?: (slug: string) => void;
  onNavigate?: (view: string, slug?: string) => void;
}

export const AffiliateDisclosurePage: React.FC<AffiliateDisclosurePageProps> = ({
  onSelectProduct,
  onNavigate
}) => {
  const { settings } = useMonetizationSync();

  // Primary Google products with commercial editions or official referral programs
  const eligibleSlugs = ['google-workspace', 'google-cloud', 'google-drive', 'gemini', 'google-maps'];
  const eligibleProducts = eligibleSlugs
    .map(slug => PRODUCTS.find(p => p.slug === slug))
    .filter((p): p is typeof PRODUCTS[0] => Boolean(p));

  const hasVerifiedWorkspace = isVerifiedReferralUrl(settings.affiliate.programs.googleWorkspace?.customUrl);
  const hasVerifiedCloud = isVerifiedReferralUrl(settings.affiliate.programs.googleCloud?.customUrl);
  const hasVerifiedOne = isVerifiedReferralUrl(settings.affiliate.programs.googleOne?.customUrl);
  const hasAnyVerified = settings.affiliate.enabled && (hasVerifiedWorkspace || hasVerifiedCloud || hasVerifiedOne);

  const getReferralStatusInfo = (slug: string) => {
    if (slug === 'google-workspace') {
      const active = settings.affiliate.enabled && hasVerifiedWorkspace;
      return {
        isVerified: active,
        badgeText: active ? 'Verified Referral Link' : 'Awaiting Verified Referral URL',
        badgeClass: active ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300',
        note: active
          ? 'Active Google Workspace Referral Program link. Qualified signups may provide a referral fee.'
          : 'Redirects strictly disabled. Direct official Google Workspace URL is used with zero tracking.'
      };
    }
    if (slug === 'google-cloud') {
      const active = settings.affiliate.enabled && hasVerifiedCloud;
      return {
        isVerified: active,
        badgeText: active ? 'Verified Partner Link' : 'Awaiting Verified Referral URL',
        badgeClass: active ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300',
        note: active
          ? 'Active Google Cloud Partner Advantage link. Qualified enterprise evaluations may provide compensation.'
          : 'Redirects strictly disabled. Direct official Google Cloud URL is used with zero tracking.'
      };
    }
    if (slug === 'google-drive' || slug === 'gemini') {
      const active = settings.affiliate.enabled && hasVerifiedOne;
      return {
        isVerified: active,
        badgeText: active ? 'Verified Partner Link' : 'Awaiting Verified Referral URL',
        badgeClass: active ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300',
        note: active
          ? 'Active verified referral link for Google One / Gemini Advanced plans.'
          : 'Redirects strictly disabled. Direct official Google One / Gemini URL is used with zero tracking.'
      };
    }
    return {
      isVerified: false,
      badgeText: 'Official Direct Destination',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      note: 'Direct official Google product portal with zero commercial redirection.'
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 overflow-x-hidden">

      {/* 1. Header & Breadcrumb Hero */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            <span>Commercial Transparency & Affiliate Directory</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>FTC 16 CFR § 255 & ASCI Compliant</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Affiliate & Commercial Partnerships
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Google Tool Finder provides independent discovery of Google tools, transparent INR/USD pricing, and verified destination links. This directory profiles commercial software editions, eligible referral programs, and our strict editorial independence firewall.
        </p>
      </div>

      {/* 2. Real-Time Referral Verification Status Banner */}
      <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm ${
        hasAnyVerified
          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
          : 'bg-amber-50/90 border-amber-200 text-amber-950'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
              {hasAnyVerified ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Active Commercial Referrals Verified</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>Referral Status: Redirects Strictly Disabled (Awaiting Verified URLs)</span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
              {hasAnyVerified ? (
                'Verified partner referral links are currently active for select Google enterprise software suites. Outbound clicks are tracked securely and transparently in server telemetry.'
              ) : (
                'Genuine referral URLs for Google Workspace, Google Cloud, and Google One are currently awaiting formal merchant verification. All outbound links navigate directly to authentic official Google product web portals with zero tracking. We never invent referral codes, append fake tracking parameters, or pretend standard Google links are affiliate partnerships.'
              )}
            </p>
          </div>

          <div className="flex-shrink-0 self-start sm:self-center">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border shadow-2xs ${
              hasAnyVerified
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              {hasAnyVerified ? 'Redirects Active' : 'Redirects Disabled (Safe Default)'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Eligible Google Commercial Products Directory */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Eligible Commercial Google Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Official destination portals, transparent India & global pricing, and live referral link verification status.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {eligibleProducts.length} Solutions Profiled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eligibleProducts.map((product) => {
            const actionLink = resolveProductActionUrl(product.officialUrl, product.affiliateUrl, product.slug);
            const statusInfo = getReferralStatusInfo(product.slug);
            let displayDomain = 'google.com';
            try {
              displayDomain = new URL(actionLink.url).hostname;
            } catch {}

            return (
              <div
                key={product.id}
                className="liquid-glass rounded-3xl p-6 border border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Card Header: Product Logo + Referral Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl liquid-logo-vessel shadow-xs flex-shrink-0 flex items-center justify-center">
                      <ProductLogo slug={product.slug} name={product.name} size="md" />
                    </div>

                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap shadow-2xs ${statusInfo.badgeClass}`}>
                      {statusInfo.badgeText}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {product.name}
                    </h3>
                    <span className="text-xs font-medium text-slate-500">
                      {product.category}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {product.tagline || product.summary}
                  </p>

                  {/* Verified Pricing Snippet */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Verified Pricing Overview
                    </div>
                    <div className="font-semibold text-slate-800 text-[11px] leading-snug">
                      {product.pricingOverview}
                    </div>
                    {product.verifiedPricingInINR && (
                      <div className="text-[11px] text-slate-600 pt-0.5 line-clamp-2">
                        {product.verifiedPricingInINR}
                      </div>
                    )}
                  </div>

                  {/* Destination Transparency Display */}
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Official Destination:</span>
                      <code className="text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-mono text-[10px]">
                        {displayDomain}
                      </code>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      {statusInfo.note}
                    </p>
                  </div>
                </div>

                {/* Card Actions: Touch-friendly targets (>= 44px) */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(product.slug);
                      } else if (onNavigate) {
                        onNavigate('product-detail', product.slug);
                      } else {
                        window.location.hash = `#/products/${product.slug}`;
                      }
                    }}
                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>View Specs</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <a
                    href={actionLink.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    onClick={() => {
                      trackOutboundClick(actionLink.url, {
                        productSlug: product.slug,
                        isAffiliate: actionLink.isAffiliate,
                        sourcePage: 'affiliate-page'
                      });
                    }}
                    className={`w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-xs ${
                      actionLink.isAffiliate
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <span>{actionLink.isAffiliate ? 'Partner Link' : 'Official Portal'}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Complete FTC & Regulatory Transparency Statement */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm">

        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Monetization Policy Summary:</strong> When you purchase or register for certain eligible software subscriptions through verified links on Google Tool Finder, we may earn an affiliate commission at zero additional cost to you. This platform never allows advertising revenue, sponsorship fees, or potential commissions to dictate editorial ratings, product inclusion, or comparison verdicts.
          </p>
        </div>

        <div className="space-y-6 divide-y divide-slate-100">
          <div className="space-y-2 pt-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              1. Current Status: Redirects Disabled & Awaiting Verified Referral URLs
            </h3>
            <p>
              In compliance with truth-in-advertising guidelines and software platform standards, all commercial affiliate link redirects on Google Tool Finder are currently <strong>strictly disabled</strong>. Outbound buttons navigate directly to authentic official Google product portals with zero commercial tracking.
            </p>
            <p>
              Genuine referral URLs for Google Workspace, Google Cloud, and Google One are awaiting formal merchant verification. We never invent referral IDs, append fake tracking parameters, or pretend ordinary Google URLs are affiliate links. We do NOT make false claims of endorsement by Google LLC.
            </p>
          </div>

          <div className="space-y-2 pt-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              2. How Commercial Referral Links Work (Zero Cost to You)
            </h3>
            <p>
              When approved commercial tracking is operational, clicking an eligible partner link appends an authenticated merchant referral parameter to the destination URL. If you subsequently complete a qualifying subscription (such as Google Workspace Business Edition or Google Cloud commitments), the merchant platform may provide our publication with a referral commission.
            </p>
            <p>
              <strong>Zero Cost to You:</strong> The price you pay is identical whether you use our link, go directly to Google, or search on the web. In fact, we actively strive to highlight legitimate promotional discounts and free trials (such as India carrier storage bundle perks and free trial credits) that reduce your net expenses.
            </p>
          </div>

          <div className="space-y-2 pt-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              3. Uncompromised Editorial Independence Firewall
            </h3>
            <p>
              Our researchers, writers, and technical editors operate independently of commercial relationships:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>We profile Google products with zero affiliate programs (such as 100% free Google Keep, Search Console, Forms, Docs, and Colab) with the exact same rigor as paid business plans.</li>
              <li>We prominently document known product limitations, rate caps, and pricing quirks in our side-by-side comparison tables.</li>
              <li>No merchant, advertiser, or sponsor can pay to alter an editorial review, boost a search ranking, or remove a documented drawback.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              4. FTC 16 CFR § 255 & ASCI Consumer Protection Compliance
            </h3>
            <p>
              This disclosure is provided in strict accordance with the United States Federal Trade Commission’s 16 CFR § 255 regarding endorsements and testimonials in advertising, as well as the Consumer Protection (E-Commerce) Rules and Advertising Standards Council of India (ASCI) guidelines for transparent digital communications.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Administrative Console Callout */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Settings className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <span>
            Authorized administrator? Configure approved affiliate identifiers, manage AdSense slot IDs, and view server click telemetry in the administrative console.
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            if (onNavigate) {
              onNavigate('admin');
            } else {
              window.location.hash = '#/admin';
            }
          }}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
        >
          Open Admin Console &rarr;
        </button>
      </div>

    </div>
  );
};
