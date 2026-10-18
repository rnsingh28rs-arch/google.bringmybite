import React, { useState } from 'react';
import { Gift, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';

interface FreeToolsPageProps {
  onSelectProduct: (slug: string) => void;
}

export const FreeToolsPage: React.FC<FreeToolsPageProps> = ({ onSelectProduct }) => {
  const [filterType, setFilterType] = useState<'all' | '100_percent_free' | 'free_tier'>('all');

  const freeProducts = PRODUCTS.filter(p => {
    if (filterType === '100_percent_free') {
      return p.pricingStatus === 'free';
    }
    if (filterType === 'free_tier') {
      return p.pricingStatus === 'free_tier';
    }
    return p.pricingStatus === 'free' || p.pricingStatus === 'free_tier';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-8 sm:p-12 text-white shadow-md">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold border border-emerald-700 shadow-sm">
            <div className="w-5 h-5 rounded-md glass-icon-emerald flex items-center justify-center text-emerald-300">
              <Gift className="w-3.5 h-3.5" />
            </div>
            <span>Zero-Cost Software Discovery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            100% Free Google Tools & Forever-Free Allowances
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Discover Google tools you can use without paying a single rupee or dollar. Understand exactly which products are permanently free forever versus which ones provide generous monthly free allowances.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="font-extrabold text-lg block text-emerald-300">15 GB</span>
              <span className="text-emerald-100 text-[11px]">Free Cloud Storage (Personal)</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="font-extrabold text-lg block text-emerald-300">1 TB</span>
              <span className="text-emerald-100 text-[11px]">Free BigQuery SQL Queries/mo</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="font-extrabold text-lg block text-emerald-300">$200</span>
              <span className="text-emerald-100 text-[11px]">Recurring Maps API Credit/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Free Tools ({PRODUCTS.filter(p => p.pricingStatus === 'free' || p.pricingStatus === 'free_tier').length})
          </button>
          <button
            onClick={() => setFilterType('100_percent_free')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === '100_percent_free'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            100% Free Forever (No Card Needed)
          </button>
          <button
            onClick={() => setFilterType('free_tier')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'free_tier'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Generous Free Tiers & Quotas
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Showing {freeProducts.length} verified zero-cost tools
        </span>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {freeProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
        ))}
      </div>

      {/* Storage Tip Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs text-slate-700 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          <span>Pro-Tip: Docs, Sheets, and Slides Do Not Consume Google Drive Storage</span>
        </div>
        <p className="leading-relaxed">
          Native Google Docs, Google Sheets, Google Slides, Google Forms, and Google Keep notes take up 0 bytes of your 15 GB quota! Only uploaded PDF files, images, videos, zip archives, and Gmail attachments consume storage space.
        </p>
      </div>

    </div>
  );
};
