import React from 'react';
import { 
  ArrowRight, 
  ExternalLink, 
  Check, 
  Sparkles, 
  ShieldCheck,
  Layers,
  Bookmark
} from 'lucide-react';
import { Product } from '../types';
import { ProductLogo } from './ProductLogo';
import { resolveProductActionUrl } from '../data/monetizationConfig';
import { trackOutboundClick } from '../utils/analyticsBroker';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onSelect: (slug: string) => void;
  variant?: 'visual' | 'detailed';
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onSelect, 
  variant = 'visual' 
}) => {
  const { isToolSaved, toggleSavedTool } = useAuth();
  const saved = isToolSaved(product.slug);

  const getPricingBadge = (status: Product['pricingStatus']) => {
    switch (status) {
      case 'free':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs whitespace-nowrap">
            100% Free
          </span>
        );
      case 'free_tier':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-2xs whitespace-nowrap">
            Always-Free Tier
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300 shadow-2xs whitespace-nowrap">
            Paid Plan
          </span>
        );
      case 'trial':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-300 shadow-2xs whitespace-nowrap">
            Free Trial
          </span>
        );
      case 'varies':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs whitespace-nowrap">
            Usage Based
          </span>
        );
    }
  };

  const actionLink = resolveProductActionUrl(product.officialUrl, product.affiliateUrl, product.slug);

  // 1. VISUAL DISCOVERY VARIANT (Hero, Homepage & Featured Sections - Reduced Text, Logo-First)
  if (variant === 'visual') {
    return (
      <div 
        onClick={() => onSelect(product.slug)}
        className="group relative liquid-glass-card p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 h-full min-h-[260px]"
      >
        {/* Top Accent Ribbon */}
        {product.isFeaturedAI && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />
        )}

        <div>
          {/* Header Row: Authentic Product Logo + Pricing Badge + Bookmark */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="w-14 h-14 liquid-logo-vessel shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <ProductLogo slug={product.slug} name={product.name} size="md" />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSavedTool(product.slug);
                }}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  saved 
                    ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-2xs' 
                    : 'bg-white/80 hover:bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-700'
                }`}
                title={saved ? 'Saved in your Google Stack' : 'Save to your personal Google Stack'}
                aria-label={saved ? 'Remove from Stack' : 'Save to Stack'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-blue-600 text-blue-600' : ''}`} />
              </button>

              <div className="flex flex-col items-end gap-1">
                {getPricingBadge(product.pricingStatus)}
                {actionLink.isAffiliate && (
                  <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.2 rounded-full border border-blue-200">
                    Affiliate
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight flex items-center justify-between">
            <span className="truncate">{product.name}</span>
            <span className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1 text-sm">&rarr;</span>
          </h3>

          {/* Category Tag */}
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            {product.category}
          </p>

          {/* Short, Useful 1-2 line description */}
          <p className="text-xs text-slate-600 leading-relaxed mt-2.5 line-clamp-2">
            {product.tagline}
          </p>
        </div>

        {/* Bottom Action Strip */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
            <span>Explore Specs</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </span>

          <span className="text-[11px] font-semibold text-slate-400">
            {product.verifiedPricingInINR ? product.verifiedPricingInINR.split(';')[0] : (product.pricingStatus === 'free' ? '₹0 Free' : 'Standard Plan')}
          </span>
        </div>
      </div>
    );
  }

  // 2. DETAILED CATALOG VARIANT (Products directory page with highlight checklists)
  return (
    <div className="group relative liquid-glass-card flex flex-col justify-between overflow-hidden h-full">
      
      {/* 1. Top Banner Accent */}
      {product.isFeaturedAI ? (
        <div className="h-8 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 text-white text-[11px] font-semibold flex items-center justify-between flex-shrink-0">
          <span className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow flex-shrink-0" />
            <span className="truncate">Featured Google AI</span>
          </span>
          <span className="text-[10px] bg-white/20 px-2 py-0.2 rounded-full backdrop-blur-xs flex-shrink-0 ml-2">
            Gemini Reasoning
          </span>
        </div>
      ) : (
        <div className="h-8 bg-slate-50/90 border-b border-slate-100 px-4 text-slate-500 text-[11px] font-semibold flex items-center justify-between flex-shrink-0">
          <span className="flex items-center gap-1.5 truncate">
            <Layers className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className="truncate">Google Ecosystem</span>
          </span>
          <span className="text-[10px] text-slate-400 truncate">
            {product.verifiedPricingInINR ? product.verifiedPricingInINR.split(';')[0] : 'Free Tier Available'}
          </span>
        </div>
      )}

      {/* 2. Main Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row: Authentic Logo, Name, Category, Badge, Bookmark */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div 
              onClick={() => onSelect(product.slug)}
              className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
            >
              <div className="w-12 h-12 liquid-logo-vessel flex-shrink-0 group-hover:scale-105 transition-transform">
                <ProductLogo slug={product.slug} name={product.name} size="md" />
              </div>

              <div className="h-11 flex flex-col justify-center min-w-0">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium truncate">
                  {product.category}
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSavedTool(product.slug);
                }}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  saved 
                    ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-2xs' 
                    : 'bg-white/80 hover:bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-700'
                }`}
                title={saved ? 'Saved in your Google Stack' : 'Save to your personal Google Stack'}
                aria-label={saved ? 'Remove from Stack' : 'Save to Stack'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-blue-600 text-blue-600' : ''}`} />
              </button>
              {getPricingBadge(product.pricingStatus)}
            </div>
          </div>

          {/* Tagline */}
          <p className="h-5 text-xs font-semibold text-slate-800 line-clamp-1 mb-1">
            {product.tagline}
          </p>

          {/* Summary */}
          <p className="h-10 text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {product.summary}
          </p>

          {/* Highlights */}
          <div className="h-16 pt-2 border-t border-slate-100 mb-3 space-y-1 overflow-hidden">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Highlights</p>
            {product.keyFeatures.slice(0, 2).map((feat, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1 text-[11px] leading-snug">{feat}</span>
              </div>
            ))}
          </div>

          {/* Pricing bar */}
          <div className="h-9 bg-slate-50/80 rounded-xl px-3 py-1.5 mb-3 text-[11px] text-slate-700 flex items-center justify-between border border-slate-100/90">
            <span className="font-medium text-slate-500">Verified Pricing:</span>
            <span className="font-bold text-slate-900 line-clamp-1 text-right ml-2 truncate">
              {product.verifiedPricingInINR 
                ? product.verifiedPricingInINR.split(';')[0]
                : (product.pricingStatus === 'free' ? '₹0 Forever' : 'Standard Account Tier')}
            </span>
          </div>

          {/* Platform tags */}
          <div className="h-6 flex items-center gap-1.5 mb-3 overflow-hidden">
            {product.platforms.slice(0, 3).map((plat) => (
              <span key={plat} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold whitespace-nowrap">
                {plat}
              </span>
            ))}
            <span className="ml-auto text-[10px] text-slate-400 flex items-center gap-1 flex-shrink-0">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>{product.lastVerifiedDate}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-2 grid grid-cols-2 gap-2 h-11 flex-shrink-0">
          <button
            onClick={() => onSelect(product.slug)}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
          >
            <span>Learn & Specs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <a
            href={actionLink.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            onClick={(e) => {
              e.stopPropagation();
              trackOutboundClick(actionLink.url, {
                productSlug: product.slug,
                isAffiliate: actionLink.isAffiliate,
                sourcePage: window.location.hash || 'products'
              });
            }}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <span>{actionLink.isAffiliate ? 'Partner Link' : 'Official'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

      </div>
    </div>
  );
};
