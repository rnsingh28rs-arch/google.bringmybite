import React from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Users, 
  Laptop, 
  Tag, 
  Clock, 
  BookOpen, 
  Share2, 
  AlertCircle,
  HelpCircle,
  Layers,
  Bookmark
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { TUTORIALS } from '../data/tutorials';
import { IconHelper } from '../components/IconHelper';
import { AffiliateLink } from '../components/AffiliateNotice';
import { TutorialCard } from '../components/TutorialCard';
import { trackOutboundClick } from '../utils/analyticsBroker';
import { useAuth } from '../context/AuthContext';

interface ProductDetailPageProps {
  productSlug: string;
  onBack: () => void;
  onNavigateProduct: (slug: string) => void;
  onNavigateTutorial: (slug: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productSlug,
  onBack,
  onNavigateProduct,
  onNavigateTutorial
}) => {
  const { toggleSavedTool, isToolSaved } = useAuth();
  const product = PRODUCTS.find(p => p.slug === productSlug);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500">We couldn't locate the requested Google product.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product Directory</span>
        </button>
      </div>
    );
  }

  // Related products
  const relatedProducts = PRODUCTS.filter(p => product.relatedProductSlugs.includes(p.slug));
  // Related tutorials
  const relatedTutorials = TUTORIALS.filter(t => 
    t.relatedProductSlug === product.slug || product.relatedTutorialSlugs.includes(t.slug)
  );

  const getPricingBadge = (status: Product['pricingStatus']) => {
    switch (status) {
      case 'free':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">100% Free Forever</span>;
      case 'free_tier':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">Free Tier / Freemium</span>;
      case 'trial':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Official Free Trial</span>;
      case 'paid':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300">Paid Commercial Plan</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Varies by Usage</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Top Navigation Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Last Verified: {product.lastVerifiedDate}</span>
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl glass-icon-blue text-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <IconHelper name={product.iconName} className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {product.name}
                </h1>
                {product.isFeaturedAI && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-800 border border-violet-200">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                    AI Intelligence
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-blue-600">{product.category}</p>
              <p className="text-sm font-medium text-slate-700 leading-snug">{product.tagline}</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-end gap-3 flex-shrink-0">
            {getPricingBadge(product.pricingStatus)}
          </div>
        </div>

        {/* CTA Bar & Official Links */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={product.officialUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={() => trackOutboundClick(product.officialUrl, { productSlug: product.slug, sourcePage: 'ProductDetailPage' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <span>Visit Official Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {product.officialPricingUrl && (
              <a
                href={product.officialPricingUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => trackOutboundClick(product.officialPricingUrl!, { productSlug: product.slug, sourcePage: 'ProductDetailPage' })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                <span>Official Pricing Page</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            )}

            {/* Gated Action: Save to My Stack */}
            <button
              onClick={() => toggleSavedTool(product.slug)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isToolSaved(product.slug)
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
              title={isToolSaved(product.slug) ? 'Saved in your Google Tool Stack' : 'Save to your personal Tool Stack'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isToolSaved(product.slug) ? 'fill-amber-600 text-amber-600' : 'text-slate-500'}`} />
              <span>{isToolSaved(product.slug) ? 'Saved in Stack' : 'Save to Stack'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 italic">
            *Independent product profile. Links direct to official Google destinations.
          </div>
        </div>
      </div>

      {/* Two Column Layout: Detailed Specs & Info */}
      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Left Col (8 cols): Description & Features */}
        <div className="md:col-span-8 space-y-8">
          
          {/* Detailed Summary */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Overview & Description</span>
            </h2>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              {product.description.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Key Features */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Verified Key Features
            </h2>
            <div className="grid sm:grid-cols-1 gap-2.5">
              {product.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Typical Use Cases */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Typical Real-World Use Cases
            </h2>
            <ul className="space-y-2 text-xs text-slate-600">
              {product.typicalUseCases.map((useCase, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed">{useCase}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Relevant Tutorials */}
          {relatedTutorials.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Related Tutorials & Setup Guides</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedTutorials.map((tut) => (
                  <TutorialCard
                    key={tut.id}
                    tutorial={tut}
                    onSelect={onNavigateTutorial}
                  />
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Right Col (4 cols): Metadata, Pricing & Audience Sidebar */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Verified Pricing Breakdown */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>Verified Pricing Details</span>
            </h3>

            {product.verifiedPricingInINR ? (
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1">
                <p className="font-bold text-slate-900">Pricing in India (INR):</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {product.verifiedPricingInINR}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Check the official website.</p>
            )}

            {product.verifiedPricingInUSD && (
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1">
                <p className="font-bold text-slate-900">Global Pricing (USD):</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {product.verifiedPricingInUSD}
                </p>
              </div>
            )}

            {product.pricingNotes && (
              <div className="flex items-start gap-1.5 text-[11px] text-slate-500 pt-1">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>{product.pricingNotes}</span>
              </div>
            )}
          </div>

          {/* Intended Audience Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Intended Audience</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {product.intendedAudience.map((aud) => (
                <span key={aud} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                  {aud}
                </span>
              ))}
            </div>
          </div>

          {/* Supported Platforms Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-blue-600" />
              <span>Supported Platforms</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {product.platforms.map((plat) => (
                <span key={plat} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-medium">
                  {plat}
                </span>
              ))}
            </div>
          </div>

          {/* Commercial Partner Link Box */}
          <AffiliateLink
            merchantName="Google"
            destinationUrl={product.officialUrl}
            trackingId={`gtf-${product.slug}-01`}
            variant="card"
          />

          {/* Related Tools */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Related Google Tools
              </h3>
              <div className="space-y-2">
                {relatedProducts.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onNavigateProduct(rel.slug)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-left transition-colors text-xs font-semibold text-slate-800"
                  >
                    <span>{rel.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{rel.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
