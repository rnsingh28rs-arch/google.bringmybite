import React, { useState } from 'react';
import { 
  Tag, 
  Check, 
  ExternalLink, 
  HelpCircle, 
  ShieldCheck, 
  AlertTriangle,
  Building2,
  HardDrive,
  Cpu
} from 'lucide-react';
import { WorkspaceCalculator } from '../components/WorkspaceCalculator';

export const PricingPlansPage: React.FC = () => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 text-blue-800 text-xs font-bold border border-blue-200 shadow-2xs">
            <div className="w-5 h-5 rounded-md glass-icon-blue flex items-center justify-center text-blue-600">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <span>Transparent Plan Breakdown</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Google Pricing & Plans Explained
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Understand the distinction between consumer Google One storage, commercial Google Workspace suites, developer API tokens, and cloud infrastructure.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start md:self-end">
          <button
            onClick={() => setCurrency('INR')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currency === 'INR' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ₹ INR (India Pricing)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currency === 'USD' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            $ USD (Global Pricing)
          </button>
        </div>
      </div>

      {/* SECTION 1: GOOGLE ONE (CONSUMER STORAGE & AI) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <div className="w-6 h-6 rounded-lg glass-icon-blue flex items-center justify-center text-blue-600">
            <HardDrive className="w-3.5 h-3.5" />
          </div>
          <span>Consumer Storage & Personal Subscriptions</span>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Google One Plans (For Personal @gmail.com Accounts)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Upgrades your personal 15 GB quota across Gmail, Google Drive, and Google Photos. Shareable with up to 5 family members.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Plan 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Starter</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Free Google Account</h3>
              <div className="mt-3 text-2xl font-extrabold text-slate-900">
                {currency === 'INR' ? '₹0' : '$0'}
                <span className="text-xs font-normal text-slate-500"> / forever</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Default allowance with every Gmail account.</p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>15 GB shared cloud storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Full access to Docs, Sheets, Slides</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Standard Gemini Flash access</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium">Included by default</span>
            </div>
          </div>

          {/* Plan 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Most Popular</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Google One Basic</h3>
              <div className="mt-3 text-2xl font-extrabold text-slate-900">
                {currency === 'INR' ? '₹130' : '$1.99'}
                <span className="text-xs font-normal text-slate-500"> / month</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currency === 'INR' ? 'Or ₹1,300 billed annually (~17% savings)' : 'Or $19.99 billed annually'}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>100 GB shared cloud storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Share with up to 5 family members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Google Photos editing features</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Direct Google expert support</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <a
                href="https://one.google.com/about/plans"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-full inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <span>View on Google One</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>

          {/* Plan 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Family Tier</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Google One Standard</h3>
              <div className="mt-3 text-2xl font-extrabold text-slate-900">
                {currency === 'INR' ? '₹210' : '$2.99'}
                <span className="text-xs font-normal text-slate-500"> / month</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currency === 'INR' ? 'Or ₹2,100 billed annually' : 'Or $29.99 billed annually'}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>200 GB shared cloud storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Share with up to 5 family members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Google Photos premium editing</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <a
                href="https://one.google.com/about/plans"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-full inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <span>View on Google One</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>

          {/* Plan 4: AI Premium */}
          <div className="bg-gradient-to-b from-violet-50/50 to-white rounded-2xl border-2 border-violet-300 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-xs font-bold text-violet-700 uppercase tracking-wider flex items-center gap-1">
                <span>Gemini Advanced AI</span>
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Google One AI Premium</h3>
              <div className="mt-3 text-2xl font-extrabold text-violet-900">
                {currency === 'INR' ? '₹1,950' : '$19.99'}
                <span className="text-xs font-normal text-slate-500"> / month</span>
              </div>
              <p className="text-xs text-violet-700 mt-1 font-medium">
                1-Month Free Trial frequently available in India
              </p>

              <div className="mt-4 pt-4 border-t border-violet-100 space-y-2 text-xs text-slate-800">
                <div className="flex items-center gap-2 font-bold text-violet-900">
                  <Check className="w-4 h-4 text-violet-600" />
                  <span>Gemini Advanced Reasoning</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-violet-600" />
                  <span>2 TB (2,048 GB) cloud storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-violet-600" />
                  <span>Gemini integrated in Docs & Gmail</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-violet-100">
              <a
                href="https://one.google.com/about/plans"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-full inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-colors shadow-xs"
              >
                <span>Check Trial Eligibility</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WORKSPACE FOR BUSINESS (WITH CALCULATOR) */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Business & Enterprise Editions</span>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Google Workspace (For Custom @yourdomain.com Email)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Required if you want professional business email, team shared drives, employee admin controls, and corporate compliance.
          </p>
        </div>

        {/* Embedded Calculator */}
        <WorkspaceCalculator />
      </section>

      {/* SECTION 3: DEVELOPER & CLOUD PRICING */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Developer APIs & Cloud Computing</span>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Developer APIs & Google Cloud Pricing
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pay-as-you-go infrastructure with permanent recurring free quotas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Google AI Studio & Gemini API</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generous free tier for prototyping with rate limits. Paid tier starts as low as ~$0.075 per 1 million input tokens for Gemini Flash models.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
              Free Tier Available: No credit card needed for basic developer testing.
            </div>
            <a
              href="https://ai.google.dev/pricing"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <span>View Gemini API Pricing</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Google Cloud Platform (GCP)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              New accounts receive $300 (₹24,000+) in free trial credits for 90 days. Over 20+ core products (Cloud Run, Cloud Functions, BigQuery Sandbox) have permanent monthly free tiers.
            </p>
            <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 p-2 rounded-lg border border-blue-100">
              ₹24,000+ trial credits + 20 Always Free services.
            </div>
            <a
              href="https://cloud.google.com/free"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <span>View GCP Free Tier Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Google Maps Platform</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every registered billing account receives an automatic $200 recurring credit every month, covering approximately 28,500 static or dynamic map loads.
            </p>
            <div className="text-[11px] font-semibold text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100">
              $200 free allowance resets on the 1st of every month.
            </div>
            <a
              href="https://mapsplatform.google.com/pricing/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <span>View Maps Platform Rates</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Verified Data Disclosure */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Prices verified as of October 2026. Taxes (including 18% GST in India) may apply to business accounts.</span>
        </span>
        <span className="italic">Always check official Google checkout for final regional currency rates.</span>
      </div>

    </div>
  );
};
