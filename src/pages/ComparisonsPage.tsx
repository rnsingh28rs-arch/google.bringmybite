import React from 'react';
import { Scale, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { COMPARISONS } from '../data/comparisons';
import { ComparisonCard } from '../components/ComparisonCard';

interface ComparisonsPageProps {
  onSelectComparison: (slug: string) => void;
}

export const ComparisonsPage: React.FC<ComparisonsPageProps> = ({ onSelectComparison }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-bold text-violet-600 uppercase tracking-wider">
          <div className="w-6 h-6 rounded-lg glass-icon-violet flex items-center justify-center text-violet-600 shadow-2xs">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <span>Objective Evaluations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Google Product Comparisons
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Side-by-side matrices, strength and limitation breakdowns, and practical workflow recommendations. Verified facts clearly distinguished from editorial verdicts.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6 items-stretch">
        {COMPARISONS.map((comp) => (
          <ComparisonCard
            key={comp.id}
            comparison={comp}
            onSelect={onSelectComparison}
          />
        ))}
      </div>

      {/* Methodology notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Our Comparison Methodology</span>
        </div>
        <p className="leading-relaxed">
          All feature tables, limits, and pricing points are gathered directly from official Google documentation. Editorial verdicts and "Which should you choose" recommendations reflect hands-on testing across common enterprise and consumer workflows.
        </p>
      </div>

    </div>
  );
};
