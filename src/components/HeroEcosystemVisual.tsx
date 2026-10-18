import React from 'react';
import { 
  Sparkles, 
  HardDrive, 
  Mail, 
  FileText, 
  Server, 
  BookOpen, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2,
  Cpu,
  Layers,
  Compass,
  Radio
} from 'lucide-react';

interface HeroEcosystemVisualProps {
  onNavigateProduct: (slug: string) => void;
  onNavigateOffer: () => void;
}

export const HeroEcosystemVisual: React.FC<HeroEcosystemVisualProps> = ({
  onNavigateProduct,
  onNavigateOffer,
}) => {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Ambient glowing radial orbs */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-blue-300/30 via-indigo-200/25 to-emerald-200/30 rounded-3xl blur-2xl -z-10 transform -rotate-1 animate-pulse"></div>

      {/* Main Glass Illustration Container */}
      <div className="relative glass-card rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden space-y-4 border border-white/80">
        
        {/* Top Header of the Visual Card */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Google Ecosystem Directory</span>
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Oct 2026
          </span>
        </div>

        {/* 1. Primary Highlight Card: Gemini Multimodal & AI Studio */}
        <div 
          onClick={() => onNavigateProduct('gemini')}
          className="group relative p-4 rounded-2xl bg-gradient-to-r from-violet-50/90 via-indigo-50/60 to-white/90 border border-violet-200/80 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Frosted Glass Icon */}
              <div className="w-10 h-10 rounded-2xl glass-icon-violet flex items-center justify-center font-bold text-violet-700 shadow-md transition-transform group-hover:scale-110 group-hover:rotate-6">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                    Gemini & AI Studio
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-violet-100 text-violet-800">
                    AI Multimodal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Multimodal reasoning • Free Tier + Gemini Advanced
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
          </div>

          <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-violet-100/80 text-[10px] text-slate-600 font-medium">
            <span className="bg-white/90 px-2 py-0.5 rounded-md border border-violet-200/60 font-semibold text-violet-900 shadow-2xs">2M+ Tokens</span>
            <span className="bg-white/90 px-2 py-0.5 rounded-md border border-violet-200/60 font-semibold text-slate-700 shadow-2xs">Canvas Coding</span>
            <span className="text-violet-700 font-bold ml-auto flex items-center gap-1">
              Explore Specs &rarr;
            </span>
          </div>
        </div>

        {/* 2. Middle Row: Google Workspace for Business & India Pricing */}
        <div 
          onClick={() => onNavigateProduct('google-workspace')}
          className="group p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 to-white/90 border border-blue-200/80 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Frosted Glass Icon */}
              <div className="w-10 h-10 rounded-2xl glass-icon-blue flex items-center justify-center font-bold text-blue-700 shadow-md transition-transform group-hover:scale-110 group-hover:-rotate-6">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Google Workspace
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                    14-Day Free Trial
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Custom domain email (@yourcompany.in) + Drive storage
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-blue-100/80 text-[10px]">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="bg-white/90 px-2 py-0.5 rounded-md border border-blue-200/60 font-bold text-slate-900 shadow-2xs">
                ₹136 / user / mo
              </span>
              <span className="text-slate-500">India Business Rate</span>
            </div>
            <span className="text-blue-600 font-bold">Calculator &rarr;</span>
          </div>
        </div>

        {/* 3. Bottom Grid: Google Cloud & NotebookLM */}
        <div className="grid grid-cols-2 gap-3">
          {/* Cloud $300 Credits */}
          <div 
            onClick={onNavigateOffer}
            className="group p-3.5 rounded-2xl bg-white/80 hover:bg-emerald-50/60 border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl glass-icon-emerald flex items-center justify-center text-emerald-700 shadow-sm transition-transform group-hover:scale-110">
                <Server className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.2 rounded-full border border-emerald-200">
                Verified
              </span>
            </div>
            <h5 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              GCP $300 Trial
            </h5>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
              ₹24,000+ credits for 90 days + 20 Always Free tools
            </p>
          </div>

          {/* NotebookLM Grounded Research */}
          <div 
            onClick={() => onNavigateProduct('notebooklm')}
            className="group p-3.5 rounded-2xl bg-white/80 hover:bg-violet-50/60 border border-slate-200/90 hover:border-violet-300 hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl glass-icon-violet flex items-center justify-center text-violet-700 shadow-sm transition-transform group-hover:scale-110">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-blue-800 bg-blue-100/80 px-1.5 py-0.2 rounded-full border border-blue-200">
                100% Free
              </span>
            </div>
            <h5 className="text-xs font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
              NotebookLM
            </h5>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
              Zero hallucination research + Audio Overview podcasts
            </p>
          </div>
        </div>

        {/* 4. Telecom 100GB Storage Perk Pill (Jio & Airtel) */}
        <div 
          onClick={onNavigateOffer}
          className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-rose-500/10 border border-emerald-200/80 hover:border-emerald-400 transition-all duration-300 cursor-pointer flex items-center justify-between shadow-2xs group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl glass-icon-emerald flex items-center justify-center text-emerald-700 shadow-xs flex-shrink-0 transition-transform group-hover:scale-110">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">100 GB Google One Storage</span>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">Jio & Airtel</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">Included on eligible JioFiber & Airtel Thanks broadband/postpaid</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-emerald-600 flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        {/* Footer info pill with glass effect */}
        <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md glass-icon-blue flex items-center justify-center text-blue-600">
              <Compass className="w-3 h-3" />
            </div>
            <span className="font-semibold text-slate-600">Interactive Discovery Map</span>
          </span>
          <span className="text-blue-600 font-semibold cursor-pointer">Click card to open specs &rarr;</span>
        </div>

      </div>
    </div>
  );
};
