import React from 'react';
import { Compass, ShieldCheck, ExternalLink, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      {/* Upper Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1: Identity & Editorial Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl glass-icon-blue flex items-center justify-center text-blue-600 shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-base tracking-tight flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] bg-clip-text text-transparent font-black">
                    Google
                  </span>
                  <span>Tool Finder</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  by parent company <span className="text-slate-200 font-bold">Bring My Bite</span>
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Google Tool Finder is an independent, community-first informational directory developed by Bring My Bite to help individuals, professionals, and businesses discover Google tools, evaluate transparent pricing, verify legitimate Indian telecom perks, and master features.
            </p>

            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <p className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Editorial Independence Guarantee
              </p>
              <p>We do not accept payments to bias reviews, fabricate discounts, or falsely endorse unverified promotions.</p>
            </div>
          </div>

          {/* Col 2: Directory Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product Categories</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('ai-tools')} className="hover:text-white transition-colors">
                  AI & Generative AI
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('free-tools')} className="hover:text-white transition-colors">
                  100% Free Tools
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  Productivity & Workspace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  Cloud & Developer Tools
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  Analytics & Marketing
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Learning */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Guides & Offers</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('india-offers')} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1">
                  <span>India Verified Offers (₹)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">
                  Pricing & Plans Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tutorials')} className="hover:text-white transition-colors">
                  Step-by-Step Tutorials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('comparisons')} className="hover:text-white transition-colors">
                  Product Comparisons
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('latest-updates')} className="hover:text-white transition-colors">
                  Latest Product Updates
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">About & Policies</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Our Mission
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact & Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('affiliate-disclosure')} className="hover:text-white transition-colors">
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-12 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-[11px] leading-relaxed text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">Important Editorial & Trademark Disclaimer:</p>
          <p>
            Google Tool Finder is an independent informational guide and directory. Google, Gmail, Google Drive, Google Docs, Google Sheets, Google Slides, Google Meet, Google Calendar, Gemini, NotebookLM, Google AI Studio, Google Cloud, Firebase, Google Analytics, Google Maps, Google Photos, Google Ads, and Google Workspace are registered trademarks or service marks of Google LLC. This platform is NOT affiliated with, sponsored by, authorized by, or in any way officially connected with Google LLC or Alphabet Inc. All product screenshots, logos, and descriptions are used solely for identification, comparison, and educational purposes under fair use. Pricing and terms are subject to change by Google; always verify directly on official Google web portals.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Google Tool Finder. An independent technology resource by parent company <strong className="text-slate-400 font-semibold">Bring My Bite</strong>.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
