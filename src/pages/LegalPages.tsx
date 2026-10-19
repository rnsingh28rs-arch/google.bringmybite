import React from 'react';
import { ShieldCheck, FileText, ArrowLeft, Home, Search } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'disclaimer';
  onNavigateHome: () => void;
  onNavigate?: (view: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigateHome, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3 text-xs">
          {type !== 'disclaimer' && (
            <button
              onClick={() => onNavigate && onNavigate('disclaimer')}
              className="text-slate-500 hover:text-blue-600 font-semibold transition-colors"
            >
              Disclaimer
            </button>
          )}
          {type !== 'terms' && (
            <button
              onClick={() => onNavigate && onNavigate('terms')}
              className="text-slate-500 hover:text-blue-600 font-semibold transition-colors"
            >
              Terms of Service
            </button>
          )}
          {type !== 'privacy' && (
            <button
              onClick={() => onNavigate && onNavigate('privacy')}
              className="text-slate-500 hover:text-blue-600 font-semibold transition-colors"
            >
              Privacy Policy
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm">
        {type === 'privacy' && (
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
        )}

        {type === 'terms' && (
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

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. Permitted Educational & Directory Use</h2>
              <p>
                Content, calculators, and tutorials provided on Google Tool Finder are intended for individual educational guidance, business research, and productivity planning. Automated mass-scraping or denial-of-service activities targeting our infrastructure are strictly prohibited.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">5. Commercial Transparency & Referrals</h2>
              <p>
                In compliance with FTC guidelines and ASCI regulations, outbound links to commercial editions or partner services may in the future include verified referral parameters. Such relationships do not influence editorial scores, comparison methodologies, or product inclusion.
              </p>
            </section>
          </>
        )}

        {type === 'disclaimer' && (
          <>
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Legal Disclaimers</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Legal & Trademark Disclaimer</h1>
              <p className="text-xs text-slate-400">Effective Date: October 2026 • Published by Bring My Bite</p>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Editorial Independence & Non-Affiliation</h2>
              <p>
                Google Tool Finder is an independent, community-first informational guide and directory developed and maintained by parent company <strong>Bring My Bite</strong>. This website is <strong>not</strong> affiliated with, endorsed by, sponsored by, authorized by, or in any way officially connected with Google LLC, Alphabet Inc., or any of their subsidiaries or affiliates.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. Trademark Notice & Educational Fair Use</h2>
              <p>
                Google, Gmail, Google Drive, Google Docs, Google Sheets, Google Slides, Google Meet, Google Calendar, Gemini, NotebookLM, Google AI Studio, Google Cloud, Firebase, Google Analytics, Google Maps, Google Photos, Google Ads, Google AdMob, Android, Android Studio, and Google Workspace are registered trademarks or service marks of Google LLC.
              </p>
              <p>
                All product names, logos, screenshots, and brand identifiers displayed on this website are used strictly for identification, comparative analysis, tutorial guidance, and educational purposes under the principles of Nominative Fair Use (United States Trademark Law) and Section 30 of the Indian Trade Marks Act, 1999.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Pricing, Offers & Telecom Perks Accuracy</h2>
              <p>
                Software subscription plans, commercial licensing tiers, and special regional offers (including Indian telecom bundles such as Jio and Airtel 100 GB Cloud perks) are established solely by Google LLC and third-party telecom operators. These offerings are subject to modification, withdrawal, or price adjustments at any time without notice.
              </p>
              <p>
                While Google Tool Finder verifies pricing structures, RBI recurring banking mandates, and regional trial eligibility, all data is provided strictly "as is". Users are strongly advised to confirm current prices and terms directly on official Google web portals (such as <code>workspace.google.com</code>, <code>cloud.google.com</code>, or <code>one.google.com</code>) prior to any purchase or trial redemption.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. Advertising & Affiliate Transparency</h2>
              <p>
                In full alignment with the Federal Trade Commission (FTC) Guides Concerning the Use of Endorsements and Testimonials in Advertising (16 CFR § 255) and the Advertising Standards Council of India (ASCI) guidelines:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>We clearly disclose commercial relationships and referral destinations across our platform.</li>
                <li>We do not claim official partnership or AdSense approval until formally verified.</li>
                <li>Affiliate commissions, if earned on verified future referral links, incur zero additional cost to you and do not compromise our editorial integrity.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">5. Limitation of Liability</h2>
              <p>
                Under no circumstances shall Google Tool Finder, Bring My Bite, or its creators be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use of, or inability to use, information provided on this directory.
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
