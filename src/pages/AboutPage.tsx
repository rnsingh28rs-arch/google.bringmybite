import React from 'react';
import { ShieldCheck, Compass, CheckCircle2, AlertTriangle, Eye, Target, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
          <Compass className="w-4 h-4 text-blue-600" />
          <span>Independent Platform Since 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          About Google Tool Finder
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          <strong>Google Tool Finder</strong> is an independent, transparent informational catalog built and maintained by parent company <strong>Bring My Bite</strong> to cut through marketing hype, verify authentic software pricing and regional trials in India, and guide users to the right Google tools.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">100% Independent</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            We are not owned, operated, or endorsed by Google LLC. We maintain complete editorial freedom to highlight both strengths and limitations of any product.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Zero Fabricated Data</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            We never invent prices, fake discounts, or bogus promo codes. If an offer or telecom bundle cannot be verified via official documentation, we explicitly mark it.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">India Verification Focus</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            We provide verified coverage of Reserve Bank of India (RBI) e-mandate banking requirements, INR currency pricing, GST input credits, and student/startup grants.
          </p>
        </div>
      </div>

      {/* Verification Methodology */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          Our Research & Verification Methodology
        </h2>
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            The software landscape changes rapidly. Google regularly adjusts tier names (such as the evolution from G Suite to Google Workspace, or Bard to Gemini), storage allowances, and regional pricing tiers.
          </p>
          <p>
            Every product detail, pricing matrix, and offer entry on this platform undergoes a multi-step verification protocol:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li><strong>Official Source Checking:</strong> All pricing and limits are checked against public Google Workspace, Google One, and Google Cloud documentation.</li>
            <li><strong>Real Redemption Testing:</strong> Free trial paths are audited to clarify whether debit cards, credit cards, or UPI AutoPay are required.</li>
            <li><strong>Anti-Scam Flagging:</strong> Known deceptive campaigns (like fraudulent WhatsApp messages offering "Free 500GB Drive") are actively cataloged and warned against.</li>
          </ul>
        </div>
      </div>

      {/* Trademark & Legal Disclaimer Notice */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
        <h3 className="font-bold text-slate-200">Trademark Notice:</h3>
        <p className="text-slate-400 leading-relaxed">
          Google, Gmail, Google Drive, Google Docs, Sheets, Slides, Meet, Calendar, Gemini, NotebookLM, Google AI Studio, Google Cloud, Firebase, Google Analytics, Google Maps, and Google Workspace are trademarks of Google LLC. Reference to any specific commercial product, process, or service by trade name, trademark, manufacturer, or otherwise does not constitute or imply its endorsement, sponsorship, or recommendation by Google LLC.
        </p>
      </div>

    </div>
  );
};
