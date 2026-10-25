import React, { useState } from 'react';
import { Bell, ExternalLink, ShieldCheck, Filter, Calendar } from 'lucide-react';
import { LATEST_UPDATES } from '../data/updates';
import { UpdateItem } from '../types';

export const LatestUpdatesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'AI Launch', 'New Feature', 'Free Learning', 'Pricing Update', 'India Offer'];

  const filtered = LATEST_UPDATES.filter(u => {
    if (selectedCategory !== 'all' && u.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Bell className="w-4 h-4" />
          <span>Ecosystem Changelog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Latest Verified Updates & Launches
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Track genuine product updates, AI capabilities, pricing model shifts in India and globally, and cloud allowance terms.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-200 text-xs font-semibold">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Updates' : cat}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-2xs hover:border-blue-400 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                  {item.category}
                </span>
                <span className="font-semibold text-slate-700">{item.productName}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {item.date}
              </span>
            </div>

            <h2 className="text-base font-bold text-slate-900">
              {item.title}
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              {item.summary}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block">Impact:</span>
              <p className="leading-relaxed">{item.impact}</p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Verified with official documentation
              </span>
              <a
                href={item.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
              >
                <span>Read Official Announcement</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
