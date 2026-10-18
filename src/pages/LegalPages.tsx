import React from 'react';
import { ShieldCheck, FileText, ArrowLeft, Home, Search } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onNavigateHome: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigateHome }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      <button
        onClick={onNavigateHome}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm">
        {type === 'privacy' ? (
          <>
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Legal Document</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
              <p className="text-xs text-slate-400">Effective Date: October 2026</p>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
              <p>
                Google Tool Finder respects your digital privacy. We operate as an informational directory and do not mandate user registration, account sign-ups, or credit card collection.
              </p>
              <p>
                When you interact with interactive calculators or form demos (such as our Google Workspace cost estimator or contact demo form), inputs are processed locally in your web browser. No proprietary personal financial records or business documents are transmitted or sold to third-party data brokers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. Cookies and Analytics</h2>
              <p>
                We do not use intrusive cross-site tracking pixels. Standard session cookies or local storage may be utilized solely to preserve your UI preferences (e.g., currency selection between INR and USD).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Third-Party Links</h2>
              <p>
                Our directory contains links to external web portals, including official Google service pages (*.google.com). Once you navigate away from our website, your privacy is governed by the respective third-party platform’s policies.
              </p>
            </section>
          </>
        ) : (
          <>
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Terms of Use</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Terms of Service</h1>
              <p className="text-xs text-slate-400">Effective Date: October 2026</p>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Google Tool Finder ("the Site"), you accept and agree to be bound by these terms. This site is created solely for independent research, educational comparison, and directory discovery.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. Editorial Nature & No Warranties</h2>
              <p>
                While we strive for 100% accuracy in our verified dates and pricing information, software features, terms of service, and subscription prices are set exclusively by Google LLC and are subject to immediate change without notice. All data is provided "as is" without warranty of any kind.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Trademark Disclaimers</h2>
              <p>
                Google, Gmail, Google Drive, Google Docs, Sheets, Slides, Google Meet, Gemini, NotebookLM, Google AI Studio, Google Cloud, Firebase, and Google Workspace are trademarks of Google LLC. Google Tool Finder has no official affiliation with Google LLC.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onOpenSearch: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome, onOpenSearch }) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto text-2xl font-black">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          The Google Tool Finder page or resource you requested could not be found or may have moved to a different directory location.
        </p>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search Directory</span>
        </button>
      </div>
    </div>
  );
};
