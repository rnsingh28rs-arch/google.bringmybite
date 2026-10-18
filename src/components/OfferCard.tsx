import React, { useState } from 'react';
import { 
  ExternalLink, 
  Clock, 
  CreditCard, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Tag, 
  Gift, 
  Server, 
  Wifi,
  Radio,
  AlertTriangle
} from 'lucide-react';
import { IndiaOffer } from '../types';
import { trackOutboundClick } from '../utils/analyticsBroker';

interface OfferCardProps {
  offer: IndiaOffer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status: IndiaOffer['status']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-300 shadow-2xs whitespace-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Verified Active
          </span>
        );
      case 'awaiting_verification':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 whitespace-nowrap">
            <Clock className="w-3 h-3 text-amber-600" />
            Awaiting Verification
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800 border border-red-300 whitespace-nowrap">
            Expired
          </span>
        );
    }
  };

  const getCategoryIcon = (cat: IndiaOffer['category']) => {
    switch (cat) {
      case 'telecom_bundle':
        return <Wifi className="w-4 h-4 text-purple-600" />;
      case 'free_trial':
        return <Gift className="w-4 h-4 text-blue-600" />;
      case 'startup_developer':
        return <Server className="w-4 h-4 text-emerald-600" />;
      default:
        return <Tag className="w-4 h-4 text-blue-600" />;
    }
  };

  const isJioOffer = offer.title.toLowerCase().includes('jio');
  const isAirtelOffer = offer.title.toLowerCase().includes('airtel');

  const getButtonLabel = () => {
    if (isJioOffer) return 'View Jio Plans';
    if (isAirtelOffer) return 'View Airtel Plans';
    if (offer.id.includes('gcp') || offer.id.includes('cloud')) return 'Claim Credits';
    return 'Official Redemption';
  };

  const getButtonClass = () => {
    if (isJioOffer) return 'bg-indigo-600 hover:bg-indigo-700 text-white';
    if (isAirtelOffer) return 'bg-rose-600 hover:bg-rose-700 text-white';
    return 'bg-emerald-600 hover:bg-emerald-700 text-white';
  };

  const getBorderClass = () => {
    if (isJioOffer) {
      return 'border-indigo-200/90 hover:border-indigo-500 hover:shadow-indigo-500/10 ring-1 ring-indigo-500/10';
    }
    if (isAirtelOffer) {
      return 'border-rose-200/90 hover:border-rose-500 hover:shadow-rose-500/10 ring-1 ring-rose-500/10';
    }
    return 'border-slate-200/90 hover:border-emerald-400 hover:shadow-emerald-500/10';
  };

  return (
    <div className={`group bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col h-full hover:shadow-xl ${getBorderClass()}`}>
      
      {/* 1. Top Carrier / Partnership Ribbon: Exactly h-8 (32px) on all cards */}
      {isJioOffer && (
        <div className="h-8 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 px-4 text-white text-[11px] font-bold flex items-center justify-between flex-shrink-0">
          <span className="flex items-center gap-1.5 truncate">
            <Wifi className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Reliance Jio Partnership</span>
          </span>
          <span className="bg-white/20 px-2 py-0.2 rounded-full text-[10px] whitespace-nowrap ml-2">
            MyJio App Redeemable
          </span>
        </div>
      )}

      {isAirtelOffer && (
        <div className="h-8 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-4 text-white text-[11px] font-bold flex items-center justify-between flex-shrink-0">
          <span className="flex items-center gap-1.5 truncate">
            <Radio className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Bharti Airtel Partnership</span>
          </span>
          <span className="bg-white/20 px-2 py-0.2 rounded-full text-[10px] whitespace-nowrap ml-2">
            Airtel Thanks Rewards
          </span>
        </div>
      )}

      {!isJioOffer && !isAirtelOffer && (
        <div className="h-8 bg-gradient-to-r from-slate-800 to-slate-900 px-4 text-white text-[11px] font-bold flex items-center justify-between flex-shrink-0">
          <span className="flex items-center gap-1.5 truncate">
            <Gift className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
            <span className="truncate">Verified Google India Promotion</span>
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.2 rounded-full text-[10px] whitespace-nowrap ml-2">
            Direct Redemption
          </span>
        </div>
      )}

      {/* 2. Top Meta Bar: Exactly h-12 (48px) on all cards */}
      <div className="h-12 px-5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-7 h-7 rounded-xl glass-icon-blue flex items-center justify-center shadow-xs flex-shrink-0">
            {getCategoryIcon(offer.category)}
          </div>
          <span className="text-xs text-slate-800 font-bold truncate">
            {offer.productName}
          </span>
        </div>
        <div className="flex-shrink-0">
          {getStatusBadge(offer.status)}
        </div>
      </div>

      {/* 3. Main Card Body (Stretches Flexibly with Perfectly Aligned Sections) */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        
        {/* Upper Block: Title, Benefit, Summary, Payment, Eligibility */}
        <div className="space-y-3">
          
          {/* Uniform Title: Exactly h-12 (48px) across all cards */}
          <h3 className="h-12 flex items-start text-sm sm:text-base font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
            <span className="line-clamp-2">{offer.title}</span>
          </h3>

          {/* Primary Benefit Callout: Exactly h-20 (80px) across all cards */}
          <div className="h-20 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-2.5 text-emerald-950 text-xs font-semibold flex items-start gap-2.5 shadow-2xs">
            <div className="w-6 h-6 rounded-lg glass-icon-emerald flex items-center justify-center flex-shrink-0 text-emerald-700 mt-0.5">
              <Gift className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight flex-1">
              <span className="text-emerald-800 font-extrabold uppercase text-[10px] block tracking-wider mb-0.5">
                Verified Benefit:
              </span>
              <span className="line-clamp-2 text-xs leading-snug">
                {offer.benefit}
              </span>
            </div>
          </div>

          {/* Summary: Exactly h-10 (40px) across all cards */}
          <p className="h-10 text-xs text-slate-600 leading-relaxed line-clamp-2">
            {offer.summary}
          </p>

          {/* Payment & Billing Note: Exactly h-20 (80px) across all cards */}
          <div className="h-20 bg-slate-50/90 rounded-2xl p-2.5 border border-slate-200/80 text-xs flex flex-col justify-center">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-0.5">
              <div className="w-5 h-5 rounded-md glass-icon-blue flex items-center justify-center text-blue-600 flex-shrink-0">
                <CreditCard className="w-3 h-3" />
              </div>
              <span className="text-[11px] truncate">Payment & RBI e-Mandate:</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-snug line-clamp-2 pl-7">
              {offer.paymentDetailsRequired ? (
                <span className="font-bold text-amber-700">Card required. </span>
              ) : (
                <span className="font-bold text-emerald-700">No card required. </span>
              )}
              {offer.paymentDetailsNote}
            </p>
          </div>

          {/* Eligibility Checklist: Fixed header and h-24 list */}
          <div className="pt-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 h-4">
              Eligibility Requirements:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 h-24 overflow-hidden">
              {offer.eligibilityRequirements.slice(0, 3).map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  <span className="leading-tight line-clamp-1 text-[11px]">{req}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Lower Block: Bottom Pinned Accordion and Actions */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex-shrink-0">
          
          {/* Caution & Terms Accordion */}
          <div className="pb-2.5 border-b border-slate-100">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-blue-600 py-1 transition-colors cursor-pointer"
            >
              <span>Important Terms & Anti-Scam Cautions</span>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {isExpanded && (
              <div className="mt-2.5 p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl text-xs space-y-2.5 animate-in fade-in duration-200">
                {offer.cautionNotes && (
                  <div className="flex items-start gap-2.5 text-amber-950">
                    <div className="w-6 h-6 rounded-lg glass-icon-amber flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[11px] leading-relaxed">{offer.cautionNotes}</p>
                  </div>
                )}
                {offer.termsHighlights.length > 0 && (
                  <div className="pt-2 border-t border-amber-200/60 pl-8">
                    <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                      Verified Terms Highlights:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-950">
                      {offer.termsHighlights.map((term, idx) => (
                        <li key={idx}>{term}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Meta & Official Action Button: Always Perfectly Aligned at the Bottom */}
          <div className="pt-3 flex items-center justify-between gap-3 h-10">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
              <div className="w-5 h-5 rounded-md glass-icon-emerald flex items-center justify-center text-emerald-600 flex-shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>Verified: {offer.lastVerifiedDate}</span>
            </div>

            <a
              href={offer.redemptionUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={() => trackOutboundClick(offer.redemptionUrl, {
                productSlug: offer.productSlug || offer.id,
                isAffiliate: false,
                sourcePage: 'india-offers'
              })}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all duration-200 hover:shadow-md cursor-pointer whitespace-nowrap ${getButtonClass()}`}
            >
              <span>{getButtonLabel()}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
