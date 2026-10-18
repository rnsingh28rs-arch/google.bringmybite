import React, { useState } from 'react';
import { BookOpen, Search, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { TUTORIALS } from '../data/tutorials';
import { TutorialCard } from '../components/TutorialCard';

interface TutorialsPageProps {
  onSelectTutorial: (slug: string) => void;
}

export const TutorialsPage: React.FC<TutorialsPageProps> = ({ onSelectTutorial }) => {
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filtered = TUTORIALS.filter(t => {
    if (selectedDifficulty !== 'all' && t.difficulty !== selectedDifficulty) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <div className="w-6 h-6 rounded-lg glass-icon-blue flex items-center justify-center text-blue-600 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span>Knowledge & Masterclasses</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Google Tutorials & Practical Guides
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Comprehensive step-by-step guides with actionable advice, security precautions, and direct links to official documentation.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides (e.g. Gemini, NotebookLM, Business Email, Storage)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'Beginner', 'Intermediate'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {diff === 'all' ? 'All Difficulties' : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filtered.map((tut) => (
          <TutorialCard
            key={tut.id}
            tutorial={tut}
            onSelect={onSelectTutorial}
          />
        ))}
      </div>

      {/* Editorial Disclaimer on Guides */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Independent instructional articles. Screenshots and trademarks referenced under educational fair use.</span>
        </span>
        <span className="font-semibold text-slate-700">Last audited: October 2026</span>
      </div>

    </div>
  );
};
