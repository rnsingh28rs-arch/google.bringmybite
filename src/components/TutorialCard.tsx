import React from 'react';
import { ArrowRight, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { Tutorial } from '../types';

interface TutorialCardProps {
  tutorial: Tutorial;
  onSelect: (slug: string) => void;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial, onSelect }) => {
  const getDifficultyColor = (diff: Tutorial['difficulty']) => {
    switch (diff) {
      case 'Beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced': return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div 
      className="group bg-white rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1 h-full"
    >
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header meta with Glass Icon: Exactly h-8 */}
          <div className="flex items-center justify-between gap-2 mb-3 h-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl glass-icon-blue flex items-center justify-center text-blue-600 shadow-xs flex-shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getDifficultyColor(tutorial.difficulty)}`}>
                {tutorial.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{tutorial.readingTimeMinutes} min read</span>
            </div>
          </div>

          {/* Title: Exactly h-12 with line-clamp-2 */}
          <h3 
            onClick={() => onSelect(tutorial.slug)}
            className="h-12 flex items-start text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug cursor-pointer line-clamp-2"
          >
            {tutorial.title}
          </h3>

          {/* Subtitle / summary: Exactly h-10 with line-clamp-2 */}
          <p className="h-10 text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {tutorial.summary}
          </p>

          {/* Key Takeaways: Exactly h-20 */}
          <div className="h-20 space-y-1.5 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 overflow-hidden">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">What you'll learn:</p>
            {tutorial.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1 text-[11px] leading-tight">{takeaway}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: Pinned to bottom, exactly h-10 */}
        <button
          onClick={() => onSelect(tutorial.slug)}
          className="mt-auto w-full h-10 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white transition-all shadow-2xs group-hover:shadow-md cursor-pointer flex-shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Read Step-by-Step Guide</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
