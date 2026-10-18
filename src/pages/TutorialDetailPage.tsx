import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  BookOpen, 
  Share2, 
  ShieldCheck,
  Tag
} from 'lucide-react';
import { Tutorial } from '../types';
import { TUTORIALS } from '../data/tutorials';
import { PRODUCTS } from '../data/products';

interface TutorialDetailPageProps {
  tutorialSlug: string;
  onBack: () => void;
  onNavigateTutorial: (slug: string) => void;
  onNavigateProduct: (slug: string) => void;
}

export const TutorialDetailPage: React.FC<TutorialDetailPageProps> = ({
  tutorialSlug,
  onBack,
  onNavigateTutorial,
  onNavigateProduct
}) => {
  const tutorial = TUTORIALS.find(t => t.slug === tutorialSlug);

  if (!tutorial) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Tutorial Not Found</h2>
        <p className="text-xs text-slate-500">We couldn't locate the requested tutorial guide.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tutorials</span>
        </button>
      </div>
    );
  }

  // Related tutorials
  const relatedTutorials = TUTORIALS.filter(t => t.slug !== tutorial.slug).slice(0, 2);
  // Related product
  const relatedProduct = tutorial.relatedProductSlug ? PRODUCTS.find(p => p.slug === tutorial.relatedProductSlug) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Back button & top meta */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tutorials</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Updated: {tutorial.lastUpdated}</span>
        </div>
      </div>

      {/* Article Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-bold">
            {tutorial.category}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
            {tutorial.difficulty}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {tutorial.readingTimeMinutes} min read
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {tutorial.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
          {tutorial.subtitle}
        </p>

        {/* Official documentation external link */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
          {relatedProduct && (
            <button
              onClick={() => onNavigateProduct(relatedProduct.slug)}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1.5"
            >
              <span>Explore {relatedProduct.name} Directory Profile &rarr;</span>
            </button>
          )}

          <a
            href={tutorial.officialDocUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <span>Official Google Documentation</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </div>

      {/* Key Takeaways Box */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2.5 font-bold text-emerald-900 text-sm">
          <div className="w-7 h-7 rounded-lg glass-icon-emerald flex items-center justify-center text-emerald-600 shadow-2xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span>Core Takeaways & Prerequisites</span>
        </div>
        <ul className="grid sm:grid-cols-2 gap-2 text-xs text-emerald-950">
          {tutorial.keyTakeaways.map((takeaway, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
              <span className="leading-relaxed">{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Step-by-Step Sections */}
      <div className="space-y-8">
        {tutorial.sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {section.heading}
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {section.content}
            </p>

            {/* Steps list if present */}
            {section.steps && section.steps.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Action Steps:
                </p>
                <div className="space-y-2">
                  {section.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 shadow-2xs">
                        {stepIdx + 1}
                      </span>
                      <span className="leading-relaxed pt-0.5">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pro Tip */}
            {section.tip && (
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg glass-icon-blue flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <div className="leading-relaxed">
                  <strong>Pro-Tip: </strong>{section.tip}
                </div>
              </div>
            )}

            {/* Warning Callout */}
            {section.warning && (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg glass-icon-amber flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div className="leading-relaxed">
                  <strong>Caution: </strong>{section.warning}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Related Tutorials Row */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Continue Learning with Related Guides
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {relatedTutorials.map((rel) => (
            <div
              key={rel.id}
              onClick={() => onNavigateTutorial(rel.slug)}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 cursor-pointer transition-colors group"
            >
              <span className="text-[10px] font-bold text-blue-600 uppercase">{rel.category}</span>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 mt-1 line-clamp-1">
                {rel.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{rel.summary}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
