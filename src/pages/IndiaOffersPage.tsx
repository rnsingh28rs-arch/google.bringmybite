import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CreditCard, 
  Building2, 
  Wifi, 
  Gift, 
  Server, 
  Smartphone,
  Radio,
  Sparkles
} from 'lucide-react';
import { INDIA_OFFERS } from '../data/indiaOffers';
import { OfferCard } from '../components/OfferCard';

interface IndiaOffersPageProps {
  onNavigateTutorial: (slug: string) => void;
}

export const IndiaOffersPage: React.FC<IndiaOffersPageProps> = ({ onNavigateTutorial }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: `All Offers (${INDIA_OFFERS.length})` },
    { id: 'jio', label: 'Reliance Jio (4)' },
    { id: 'airtel', label: 'Bharti Airtel (3)' },
    { id: 'telecom_bundle', label: 'All Telecom Perks' },
    { id: 'free_trial', label: 'Official Free Trials' },
    { id: 'startup_developer', label: 'Developer & Cloud Credits' },
    { id: 'business_workspace', label: 'Business & Workspace' },
    { id: 'student_education', label: 'Education & Schools' }
  ];

  const filteredOffers = INDIA_OFFERS.filter(offer => {
    if (selectedCategory === 'jio') {
      return offer.title.toLowerCase().includes('jio') || offer.productName.toLowerCase().includes('jio');
    }
    if (selectedCategory === 'airtel') {
      return offer.title.toLowerCase().includes('airtel') || offer.productName.toLowerCase().includes('airtel');
    }
    if (selectedCategory !== 'all' && offer.category !== selectedCategory) {
      return false;
    }
    if (onlyVerified && offer.status !== 'verified') {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner with Glowing Glass Orbs */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold border border-emerald-700 shadow-sm">
            <div className="w-4 h-4 rounded-full glass-icon-emerald flex items-center justify-center text-[10px] font-bold text-emerald-400">
              ₹
            </div>
            <span>Independent India Verification Hub (₹)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Legitimate Google Offers, Jio & Airtel Perks & Free Credits in India
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Discover verified 100 GB Google One cloud storage perks with Reliance JioFiber and Bharti Airtel Thanks, $300 GCP credits, school workspace grants, and Reserve Bank of India (RBI) e-mandate card verification guidelines.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-300">
            <span className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md glass-icon-emerald flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>Strict Anti-Scam Verification</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md glass-icon-blue flex items-center justify-center text-blue-400">
                <Wifi className="w-3.5 h-3.5" />
              </div>
              <span>Reliance Jio & Bharti Airtel Alliances</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md glass-icon-emerald flex items-center justify-center text-emerald-400">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span>RBI e-Mandate Compliant</span>
            </span>
          </div>

        </div>
      </div>

      {/* Indian Telecom Alliances Dual Spotlight: Reliance Jio & Bharti Airtel */}
      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        
        {/* 1. Reliance Jio Alliance Spotlight */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-indigo-200 shadow-md flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl glass-icon-indigo flex items-center justify-center text-indigo-700 shadow-md flex-shrink-0">
                  <Wifi className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-700 tracking-wider uppercase block">
                    Strategic Alliance
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Google & Reliance Jio
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedCategory('jio')}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                Filter Jio (4)
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Google invested $4.5B in Jio Platforms. Together they provide 100 GB Google One storage bundles for Jio broadband, seamless carrier billing, and enterprise Workspace solutions:
            </p>

            <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-2xl bg-white/90 border border-indigo-100 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Gift className="w-3.5 h-3.5 text-indigo-600" />
                  <span>JioFiber & AirFiber 100GB</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  100 GB Google One cloud storage included on ₹599+ plans via MyJio app.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-indigo-100 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Jio Carrier Billing</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Charge Google One & Play Store purchases to monthly Jio bill without card declines.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between text-xs text-indigo-800 font-semibold">
            <span>Redeemable via official MyJio application</span>
            <span className="text-indigo-600">&rarr;</span>
          </div>
        </div>

        {/* 2. Bharti Airtel Alliance Spotlight */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-rose-200 shadow-md flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl glass-icon-red flex items-center justify-center text-rose-700 shadow-md flex-shrink-0">
                  <Radio className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-rose-700 tracking-wider uppercase block">
                    Strategic Alliance
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Google & Bharti Airtel
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedCategory('airtel')}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                Filter Airtel (3)
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Google invested up to $1B in Bharti Airtel. Eligible postpaid and Xstream fiber subscribers can unlock 100 GB of Google One cloud backup via the Airtel Thanks reward program:
            </p>

            <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-2xl bg-white/90 border border-rose-100 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Gift className="w-3.5 h-3.5 text-rose-600" />
                  <span>Airtel Thanks 100GB Perk</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  100 GB Google One cloud storage for 6 to 12 months on eligible postpaid/fiber plans.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-rose-100 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Smartphone className="w-3.5 h-3.5 text-rose-600" />
                  <span>Airtel Carrier Billing</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Pay for Google One, apps, and games directly on your Airtel postpaid invoice.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs text-rose-800 font-semibold">
            <span>Claim inside Airtel Thanks app &gt; Rewards</span>
            <span className="text-rose-600">&rarr;</span>
          </div>
        </div>

      </div>

      {/* Critical Caution Notice: Indian Banking & Auto-Debit Rules */}
      <div className="bg-amber-50 rounded-2xl border-2 border-amber-200/80 p-5 sm:p-6 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl glass-icon-amber flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-950">
              Crucial Notice: RBI e-Mandate Regulations & Card Verification in India
            </h3>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Under Reserve Bank of India (RBI) guidelines, setting up recurring trials (such as Google Cloud $300 or Google One AI Premium) requires an initial card verification with Two-Factor OTP authentication.
            </p>
            <ul className="list-disc list-inside text-xs text-amber-950 space-y-1 pt-1">
              <li><strong>Temporary Authorization:</strong> A small temporary hold (typically ₹1, ₹2, or ₹50) is charged and instantly refunded to confirm your card is genuine.</li>
              <li><strong>Recurring e-Mandate:</strong> An e-mandate registration SMS is sent by your bank. Your bank is required to send you a pre-debit alert 24-48 hours before any recurring billing occurs.</li>
              <li><strong>Supported Cards:</strong> Credit cards (Visa, Mastercard, Amex) and major international debit cards (HDFC, ICICI, SBI, Axis) work smoothly. Alternatively, use Reliance Jio or Bharti Airtel Direct Carrier Billing on Google Play to avoid card declines.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={(e) => setOnlyVerified(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span>Show Verified Only</span>
        </label>
      </div>

      {/* Offers Grid: Pixel-perfect equal height cells */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="h-full flex flex-col">
            <OfferCard offer={offer} />
          </div>
        ))}
      </div>

      {/* Safety & Educational Walkthrough Callout */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <div className="w-5 h-5 rounded-md glass-icon-emerald flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span>Fraud Prevention Masterclass</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            How to Safely Claim Free Google Offers in India
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Read our step-by-step security breakdown to verify authentic Google, Reliance Jio, and Bharti Airtel portals, avoid Telegram phishing traps, and cancel subscriptions before trial charges occur.
          </p>
        </div>

        <button
          onClick={() => onNavigateTutorial('discovering-eligible-offers-india')}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors whitespace-nowrap cursor-pointer"
        >
          Read Safe Redemption Guide &rarr;
        </button>
      </div>

    </div>
  );
};
