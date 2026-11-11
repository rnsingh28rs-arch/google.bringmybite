import React, { useState } from 'react';
import { Sparkles, Brain, Cpu, BookOpen, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';

interface AIToolsPageProps {
  onSelectProduct: (slug: string) => void;
  onNavigateTutorial: (slug: string) => void;
}

export const AIToolsPage: React.FC<AIToolsPageProps> = ({ onSelectProduct, onNavigateTutorial }) => {
  const [filterAudience, setFilterAudience] = useState<string>('all');

  const aiProducts = PRODUCTS.filter(p => p.category === 'AI & Generative AI' || p.isFeaturedAI);

  const filtered = aiProducts.filter(p => {
    if (filterAudience === 'all') return true;
    return p.intendedAudience.includes(filterAudience as any);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 p-8 sm:p-12 text-white overflow-hidden shadow-md">
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-800/80 text-violet-200 text-xs font-bold border border-violet-700 shadow-sm">
            <div className="w-5 h-5 rounded-md glass-icon-violet flex items-center justify-center text-violet-300">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>Gemini Intelligence Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Google AI & Machine Learning Tools
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            From consumer conversational reasoning in Gemini to source-grounded research in NotebookLM and developer APIs in Google AI Studio. Compare models, free tier limits, and enterprise capabilities.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => onNavigateTutorial('getting-started-with-gemini')}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Gemini Masterclass</span>
            </button>
            <button
              onClick={() => onNavigateTutorial('using-notebooklm')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold transition-colors inline-flex items-center gap-1.5 text-white"
            >
              <span>Learn NotebookLM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Audience Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter AI for:</span>
          {[
            { id: 'all', label: 'All AI Tools' },
            { id: 'General Public', label: 'Everyday Users' },
            { id: 'Students', label: 'Students & Academics' },
            { id: 'Developers', label: 'Developers & Engineers' },
            { id: 'Professionals', label: 'Business & Professionals' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterAudience(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterAudience === tab.id
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filtered.length} specialized AI tools
        </span>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filtered.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
        ))}
      </div>

      {/* Free-tier limits: show only documented quotas and link to live provider dashboards */}
      <section className="rounded-2xl border border-violet-200 bg-white p-5 sm:p-7 space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Free-tier tokens, quotas & usage limits</h2>
          <p className="mt-1 text-xs text-slate-500">Limits are model-, project-, account- and region-dependent. We avoid inventing a universal token allowance where Google publishes dynamic quotas.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead><tr className="border-b border-slate-200 text-slate-500"><th className="p-3">Tool</th><th className="p-3">Free access / quota</th><th className="p-3">What controls the limit</th><th className="p-3">Official limits</th></tr></thead>
            <tbody>
              <tr className="border-b border-slate-100"><td className="p-3 font-bold">Gemini API / AI Studio</td><td className="p-3">Free tier includes input and output tokens for eligible models; no single fixed token bucket for all models.</td><td className="p-3">Requests/minute, input tokens/minute and requests/day; limits vary by model and project. Daily quota resets at midnight Pacific Time.</td><td className="p-3"><a className="font-bold text-violet-700 underline" href="https://ai.google.dev/gemini-api/docs/rate-limits" target="_blank" rel="noreferrer">Rate limits</a> · <a className="font-bold text-violet-700 underline" href="https://ai.google.dev/gemini-api/docs/pricing" target="_blank" rel="noreferrer">Pricing</a></td></tr>
              <tr className="border-b border-slate-100"><td className="p-3 font-bold">Gemini Notebook (Standard)</td><td className="p-3">100 notebooks/user; 50 sources/notebook; 50 chats/day; 3 Audio Overviews/day (published standard limits).</td><td className="p-3">Compute-based limits can vary; daily and other quota refresh windows apply. Plan terms may change.</td><td className="p-3"><a className="font-bold text-violet-700 underline" href="https://support.google.com/gemininotebook/answer/16213268" target="_blank" rel="noreferrer">Plans & limits</a></td></tr>
              <tr><td className="p-3 font-bold">Vertex AI</td><td className="p-3">No universal free token quota is assumed; trial credits, model availability and pricing depend on billing account and region.</td><td className="p-3">Model-specific quotas, provisioned throughput and Cloud billing configuration.</td><td className="p-3"><a className="font-bold text-violet-700 underline" href="https://cloud.google.com/vertex-ai/generative-ai/pricing" target="_blank" rel="noreferrer">Vertex AI pricing</a></td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-500">Checked 11 November 2026. Always inspect the live AI Studio Rate Limits dashboard for the actual project quota before estimating production throughput.</p>
      </section>

      {/* AI Safety and Grounding Callout */}
      <div className="p-6 rounded-2xl bg-violet-50/70 border border-violet-200 text-xs text-violet-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-violet-900">
          <ShieldCheck className="w-4 h-4 text-violet-600" />
          <span>Understanding Hallucination & Source Grounding</span>
        </div>
        <p className="leading-relaxed">
          While general-purpose chatbots like Gemini synthesize broad web data, NotebookLM guarantees strict source grounding with clickable citations on your uploaded documents. Choose your tool based on whether you need creative open-ended ideation (Gemini) or verifiable research analysis (NotebookLM).
        </p>
      </div>

    </div>
  );
};
