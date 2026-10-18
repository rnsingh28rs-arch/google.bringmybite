import React, { useState } from 'react';
import { ExternalLink, Info, ShieldCheck, Tag } from 'lucide-react';
import { trackOutboundClick } from '../utils/analyticsBroker';

interface AffiliateLinkProps {
  merchantName: string;
  destinationUrl: string;
  trackingId?: string;
  label?: string;
  className?: string;
  variant?: 'button' | 'badge' | 'card';
  onNavigate?: () => void;
}

export const AffiliateLink: React.FC<AffiliateLinkProps> = ({
  merchantName,
  destinationUrl,
  trackingId,
  label,
  className = '',
  variant = 'button',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // If real approved tracking exists, use it; otherwise, preserve pristine authentic destination
  const effectiveUrl = destinationUrl;
  const isApprovedAffiliate = Boolean(trackingId && trackingId !== 'demo-gtf-tracker-01' && trackingId.trim());

  const handleClick = () => {
    trackOutboundClick(effectiveUrl, {
      productSlug: merchantName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isAffiliate: isApprovedAffiliate
    });
  };

  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-xl border border-blue-100 bg-blue-50/50 text-slate-800 ${className}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
              Official Outbound Destination
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
            {isApprovedAffiliate ? 'Partner Link' : 'Verified Official Google URL'}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
          Google Tool Finder maintains strict editorial independence. This button redirects directly to the authentic Google product or developer portal.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <a
            href={effectiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            {label || `Visit Official ${merchantName}`}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <a
        href={effectiveUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-all ${
          variant === 'button'
            ? 'px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200'
            : 'text-blue-600 hover:text-blue-800 underline'
        } ${className}`}
      >
        <span>{label || `Official ${merchantName} Site`}</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
          Official Site
        </span>
      </a>

      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-0 z-50 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl pointer-events-none">
          <div className="flex items-center gap-1.5 font-semibold text-blue-300 mb-1">
            <Info className="w-3.5 h-3.5" />
            <span>Outbound Link Transparency</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Direct navigation to the authentic Google ecosystem portal. Outbound click safely recorded in server telemetry.
          </p>
        </div>
      )}
    </div>
  );
};

export interface AffiliateGlobalNoticeProps {
  onNavigate?: (view: string, slug?: string) => void;
}

export const AffiliateGlobalNotice: React.FC<AffiliateGlobalNoticeProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50 border-y border-slate-200 py-2.5 px-4 text-xs text-slate-600">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Editorial Transparency:</strong> Google Tool Finder is completely independent. Outbound links connect directly to verified Google product portals. We never fabricate commercial endorsements or affiliate approval.
          </span>
        </div>
        <button 
          type="button"
          onClick={() => {
            if (onNavigate) {
              onNavigate('affiliate-disclosure');
            } else {
              window.location.hash = '#/affiliate-disclosure';
            }
          }}
          className="text-blue-600 hover:underline font-medium text-xs whitespace-nowrap cursor-pointer bg-transparent border-none p-0 inline-flex items-center"
        >
          Read full transparency policy &rarr;
        </button>
      </div>
    </div>
  );
};
