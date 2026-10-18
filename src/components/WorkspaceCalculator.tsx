import React, { useState } from 'react';
import { Calculator, Users, Check, Sparkles, Building2, HelpCircle } from 'lucide-react';

export const WorkspaceCalculator: React.FC = () => {
  const [usersCount, setUsersCount] = useState<number>(5);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'standard' | 'plus'>('standard');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [includeGeminiAddon, setIncludeGeminiAddon] = useState<boolean>(false);

  // Pricing constants (verified introductory/standard rates)
  const plans = {
    starter: {
      name: 'Business Starter',
      storage: '30 GB pooled per user',
      meet: '100 participant video calls',
      priceINR: billingCycle === 'annual' ? 136 : 160,
      priceUSD: billingCycle === 'annual' ? 6 : 7.20,
      bestFor: 'Freelancers & micro-teams needing professional email'
    },
    standard: {
      name: 'Business Standard',
      storage: '2 TB pooled per user',
      meet: '150 participant calls + meeting recording & noise cancel',
      priceINR: billingCycle === 'annual' ? 672 : 780,
      priceUSD: billingCycle === 'annual' ? 12 : 14.40,
      bestFor: 'Growing SMBs needing shared drives and video recordings'
    },
    plus: {
      name: 'Business Plus',
      storage: '5 TB pooled per user',
      meet: '500 participant calls + attendance tracking + Vault',
      priceINR: billingCycle === 'annual' ? 1360 : 1550,
      priceUSD: billingCycle === 'annual' ? 18 : 21.60,
      bestFor: 'Regulated companies requiring legal eDiscovery & Vault'
    }
  };

  const geminiAddonPriceINR = 1650;
  const geminiAddonPriceUSD = 20;

  const currentPlan = plans[selectedPlan];
  const baseRate = currency === 'INR' ? currentPlan.priceINR : currentPlan.priceUSD;
  const addonRate = includeGeminiAddon ? (currency === 'INR' ? geminiAddonPriceINR : geminiAddonPriceUSD) : 0;
  
  const monthlySubtotal = (baseRate + addonRate) * usersCount;
  const gstRate = currency === 'INR' ? 0.18 : 0; // 18% GST in India
  const monthlyGST = monthlySubtotal * gstRate;
  const totalMonthlyWithTax = monthlySubtotal + monthlyGST;
  const estimatedAnnualTotal = totalMonthlyWithTax * 12;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl glass-icon-blue flex items-center justify-center text-blue-600 shadow-md">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Google Workspace Cost Estimator</h3>
              <p className="text-xs text-slate-300">Calculate realistic monthly and annual expenses for your team in India</p>
            </div>
          </div>

          <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/10 text-xs">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                currency === 'INR' ? 'bg-blue-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              ₹ INR (India)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                currency === 'USD' ? 'bg-blue-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              $ USD (Global)
            </button>
          </div>
        </div>

        {/* Currency & Tax Disclaimer */}
        <p className="text-[11px] text-slate-400 max-w-2xl leading-relaxed">
          *Indian business subscriptions are subject to 18% Goods & Services Tax (GST). If your company has a valid GSTIN, you can claim this as Input Tax Credit (ITC).
        </p>
      </div>

      <div className="p-6 md:p-8 grid md:grid-cols-12 gap-8">
        {/* Left Controls (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          {/* Team Size Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Number of Team Members (User Seats):</span>
              </label>
              <span className="text-base font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                {usersCount} {usersCount === 1 ? 'user' : 'users'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={usersCount}
              onChange={(e) => setUsersCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 user</span>
              <span>25 users</span>
              <span>50 users</span>
              <span>100+ users</span>
            </div>
          </div>

          {/* Plan Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
              Select Workspace Edition:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['starter', 'standard', 'plus'] as const).map((planKey) => {
                const p = plans[planKey];
                const isSelected = selectedPlan === planKey;
                return (
                  <button
                    key={planKey}
                    type="button"
                    onClick={() => setSelectedPlan(planKey)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">{p.name.replace('Business ', '')}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{p.storage.split(' ')[0]} {p.storage.split(' ')[1]}</p>
                    <p className="text-xs font-bold text-blue-700 mt-2">
                      {currency === 'INR' ? `₹${p.priceINR}` : `$${p.priceUSD}`}/mo
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Billing Cycle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-800">Billing Commitment</p>
              <p className="text-[11px] text-slate-500">Annual commitment saves ~15% over flexible monthly billing</p>
            </div>
            <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  billingCycle === 'annual' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Annual (~15% off)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  billingCycle === 'monthly' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Flexible
              </button>
            </div>
          </div>

          {/* Gemini AI Addon Toggle */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-violet-200 bg-violet-50/50">
            <input
              type="checkbox"
              id="gemini-addon"
              checked={includeGeminiAddon}
              onChange={(e) => setIncludeGeminiAddon(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
            />
            <label htmlFor="gemini-addon" className="cursor-pointer text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                Add Gemini for Google Workspace Enterprise AI
              </span>
              <span className="text-slate-600 block mt-0.5 text-[11px] leading-relaxed">
                Unlock generative AI in Gmail, Google Docs, and Sheets (+{currency === 'INR' ? `₹${geminiAddonPriceINR}` : `$${geminiAddonPriceUSD}`}/user/month).
              </span>
            </label>
          </div>
        </div>

        {/* Right Cost Summary Card (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Cost Breakdown</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                14-Day Free Trial Eligible
              </span>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between text-slate-600">
                <span>{currentPlan.name} ({usersCount} seats)</span>
                <span className="font-semibold text-slate-900">
                  {currency === 'INR' ? `₹${baseRate * usersCount}` : `$${baseRate * usersCount}`} / mo
                </span>
              </div>

              {includeGeminiAddon && (
                <div className="flex justify-between text-violet-700">
                  <span>Gemini Business Addon ({usersCount} seats)</span>
                  <span className="font-semibold">
                    +{currency === 'INR' ? `₹${addonRate * usersCount}` : `$${addonRate * usersCount}`} / mo
                  </span>
                </div>
              )}

              {currency === 'INR' && (
                <div className="flex justify-between text-slate-500">
                  <span className="flex items-center gap-1">
                    GST @ 18% (India)
                    <span title="Input Tax Credit eligible with GSTIN" className="cursor-help">
                      <HelpCircle className="w-3 h-3 text-slate-400" />
                    </span>
                  </span>
                  <span className="font-semibold">₹{Math.round(monthlyGST)} / mo</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-1">
              <p className="text-xs text-slate-500 font-medium">Estimated Monthly Total:</p>
              <div className="text-3xl font-extrabold text-slate-900">
                {currency === 'INR' ? `₹${Math.round(totalMonthlyWithTax).toLocaleString('en-IN')}` : `$${Math.round(totalMonthlyWithTax).toLocaleString()}`}
                <span className="text-xs font-normal text-slate-500 ml-1">/ month</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Annual budget: ~{currency === 'INR' ? `₹${Math.round(estimatedAnnualTotal).toLocaleString('en-IN')}` : `$${Math.round(estimatedAnnualTotal).toLocaleString()}`} per year
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 space-y-2">
            <a
              href="https://workspace.google.com/pricing"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              Start Official 14-Day Free Trial
            </a>
            <p className="text-[10px] text-center text-slate-400">
              Zero charges during trial. Cancel anytime in Google Admin Console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
