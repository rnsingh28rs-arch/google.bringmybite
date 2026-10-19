import React from 'react';
import {
  ArrowLeft,
  Scale,
  Trophy,
  Check,
  X,
  ShieldCheck,
  ExternalLink,
  Users,
  HelpCircle
} from 'lucide-react';
import { Comparison } from '../types';
import { COMPARISONS } from '../data/comparisons';

interface ComparisonDetailPageProps {
  comparisonSlug: string;
  onBack: () => void;
  onNavigateComparison: (slug: string) => void;
}

export const ComparisonDetailPage: React.FC<ComparisonDetailPageProps> = ({
  comparisonSlug,
  onBack,
  onNavigateComparison
}) => {
  const comparison = COMPARISONS.find(c => c.slug === comparisonSlug);

  if (!comparison) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Comparison Not Found</h2>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Comparisons</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">

      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Comparisons</span>
        </button>
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verified Freshness: {comparison.lastVerifiedDate}</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-violet-600 uppercase tracking-wider">
          <div className="w-7 h-7 rounded-lg glass-icon-violet flex items-center justify-center text-violet-600 shadow-2xs">
            <Scale className="w-4 h-4" />
          </div>
          <span>Head-to-Head Comparison</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {comparison.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          {comparison.subtitle}
        </p>
      </div>

      {/* Competitor Cards Row */}
      <div className={`grid gap-6 ${comparison.items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {comparison.items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contender</span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{item.name}</h2>
              <p className="text-xs font-medium text-slate-500 mt-1">{item.tagline}</p>

              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800">
                <span className="font-bold block text-[10px] text-slate-400 uppercase">Pricing Status:</span>
                <span>{item.pricingSummary}</span>
              </div>

              {/* Strengths */}
              <div className="mt-4 space-y-1.5">
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Key Strengths:</p>
                {item.strengths.map((str, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>

              {/* Limitations */}
              <div className="mt-4 space-y-1.5">
                <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Considerations / Limitations:</p>
                {item.limitations.map((lim, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <X className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{lim}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <span className="font-bold text-slate-800">Best for: </span>
              <span>{item.bestFor}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Key Criteria Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>Key Evaluation Criteria</span>
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {comparison.criteria.map((crit, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900">{crit.name}</h4>
                {crit.winnerName && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                    Winner: {crit.winnerName}
                  </span>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed">{crit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-900">
            Detailed Feature Comparison Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified facts and parameters extracted directly from current official technical specifications.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-4 w-1/4">Feature / Specification</th>
                {comparison.items.map((item) => (
                  <th key={item.id} className="p-4 font-extrabold text-slate-900">
                    {item.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {comparison.featureTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-900">
                    <div>{row.feature}</div>
                    <div className="text-[11px] font-normal text-slate-400 mt-0.5">{row.description}</div>
                  </td>
                  {comparison.items.map((item) => (
                    <td key={item.id} className="p-4 font-medium leading-relaxed">
                      {row.values[item.id] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editorial Verdict Box */}
      <div className="bg-amber-50/80 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2.5 font-bold text-amber-900 text-base">
          <div className="w-8 h-8 rounded-xl glass-icon-amber flex items-center justify-center text-amber-700 shadow-2xs">
            <Trophy className="w-4 h-4" />
          </div>
          <span>Editorial Verdict & Summary</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
          {comparison.verdict}
        </p>
      </div>

      {/* Practical Recommendations by Audience */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <span>Which One Should You Choose?</span>
        </h3>
        <div className="space-y-3">
          {comparison.recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 text-sm">{rec.audience}:</span>
                <p className="text-slate-600 leading-relaxed">{rec.rationale}</p>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 font-bold whitespace-nowrap self-start sm:self-center">
                Pick: {rec.recommendedProduct}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
