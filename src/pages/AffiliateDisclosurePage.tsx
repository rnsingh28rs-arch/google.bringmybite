import React from 'react';
import { ShieldCheck, Tag, Info, AlertTriangle } from 'lucide-react';

export const AffiliateDisclosurePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <Tag className="w-3.5 h-3.5" />
          <span>Full Monetization Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Affiliate & Commercial Disclosure
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Last revised: October 2026. Complete disclosure regarding affiliate tracking parameters, referral commissions, and our uncompromised editorial policy.
        </p>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm">
        
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Summary:</strong> When you purchase or register for certain eligible software subscriptions through links on Google Tool Finder, we may earn an affiliate commission at zero additional cost to you. This platform never allows advertising revenue or potential commissions to dictate editorial ratings, product inclusion, or comparison verdicts.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Current Status: Illustrative Demo Links</h2>
          <p>
            In compliance with truth-in-advertising guidelines and software platform standards, all affiliate tracking parameters present on this website are currently configured as <strong>illustrative demonstration placeholders</strong> (e.g. <code>ref_demo=demo-gtf-tracker-01</code>) until formal merchant affiliate agreements are executed and verified.
          </p>
          <p>
            We do NOT make false claims of official endorsement or unauthorized partnership with Google LLC.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">2. How Affiliate Links Work</h2>
          <p>
            When approved commercial tracking is operational, clicking an eligible partner link appends a unique referral code to the destination URL. If you subsequently complete a qualifying purchase (such as subscribing to Google Workspace Business Edition or Google One Storage), the merchant software platform provides our publication with a small referral fee.
          </p>
          <p>
            <strong>Zero Cost to You:</strong> The price you pay is identical whether you use our link, go directly to Google, or search on the web. In fact, we actively strive to highlight legitimate promotional discounts and free trials that reduce your net expenses.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Editorial Independence Firewall</h2>
          <p>
            Our writers, researchers, and technical editors operate independently of commercial relationships:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li>We profile products with zero affiliate programs (such as 100% free Google Keep, Search Console, Forms, and Docs) with the exact same rigor as paid business plans.</li>
            <li>We clearly point out limitations and pricing quirks in our side-by-side comparison tables.</li>
            <li>No merchant or sponsor can pay to alter an editorial review or remove a documented drawback.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">4. FTC and Consumer Protection Compliance</h2>
          <p>
            This disclosure is provided in accordance with the United States Federal Trade Commission’s 16 CFR § 255 regarding the use of endorsements and testimonials in advertising, as well as the Consumer Protection (E-Commerce) Rules and Advertising Standards Council of India (ASCI) guidelines.
          </p>
        </section>

      </div>

    </div>
  );
};
