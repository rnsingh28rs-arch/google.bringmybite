import React from 'react';
import { ArrowRight, Scale, Trophy } from 'lucide-react';
import { Comparison } from '../types';

interface ComparisonCardProps {
  comparison: Comparison;
  onSelect: (slug: string) => void;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ comparison, onSelect }) => {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1 h-full">
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row with Glass Icon: Exactly h-8 */}
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 mb-3 h-8">
            <div className="w-8 h-8 rounded-xl glass-icon-violet flex items-center justify-center text-violet-600 shadow-xs flex-shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <span className="uppercase tracking-wider text-[11px] font-bold">Side-by-Side Breakdown</span>
          </div>

          {/* Title: Exactly h-12 with line-clamp-2 */}
          <h3 
            onClick={() => onSelect(comparison.slug)}
            className="h-12 flex items-start text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors mb-2 leading-snug cursor-pointer line-clamp-2"
          >
            {comparison.title}
          </h3>

          {/* Subtitle: Exactly h-10 with line-clamp-2 */}
          <p className="h-10 text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
            {comparison.subtitle}
          </p>

          {/* Competitor Items Chips: Exactly h-16 */}
          <div className="h-16 grid grid-cols-2 gap-2 mb-4 overflow-hidden">
            {comparison.items.slice(0, 2).map((item) => (
              <div key={item.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 text-xs flex flex-col justify-center">
                <p className="font-bold text-slate-900 mb-0.5 truncate">{item.name}</p>
                <p className="text-[11px] text-slate-500 line-clamp-1">{item.pricingSummary}</p>
              </div>
            ))}
          </div>

          {/* Verdict snippet: Exactly h-24 */}
          <div className="h-24 bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3 mb-4 text-xs overflow-hidden">
            <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
              <div className="w-6 h-6 rounded-lg glass-icon-amber flex items-center justify-center text-amber-700 flex-shrink-0">
                <Trophy className="w-3.5 h-3.5" />
              </div>
              <span>Editorial Verdict:</span>
            </div>
            <p className="text-[11px] text-amber-950 line-clamp-2 leading-relaxed pl-8">
              {comparison.verdict}
            </p>
          </div>
        </div>

        {/* Read action: Pinned to bottom, exactly h-10 */}
        <button
          onClick={() => onSelect(comparison.slug)}
          className="mt-auto w-full h-10 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-purple-600 text-white transition-all shadow-xs hover:shadow-md cursor-pointer flex-shrink-0"
        >
          <span>Open Full Analysis & Matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
