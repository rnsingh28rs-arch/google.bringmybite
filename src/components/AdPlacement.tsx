import React, { useEffect, useState } from 'react';
import { Info, ExternalLink } from 'lucide-react';
import { getMonetizationSettings } from '../data/monetizationConfig';

export type AdSlotType = 
  | 'header_banner' 
  | 'in_feed' 
  | 'sidebar' 
  | 'below_product' 
  | 'footer_banner';

interface AdPlacementProps {
  slot: AdSlotType;
  className?: string;
  onOpenAdmin?: () => void;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ 
  slot, 
  className = '',
  onOpenAdmin
}) => {
  const [settings, setSettings] = useState(getMonetizationSettings());

  useEffect(() => {
    const handleStorage = () => setSettings(getMonetizationSettings());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Safe Default: If AdSense is disabled AND preview mode is off, collapse cleanly (CLS: 0)
  if (!settings.adsense.enabled && !settings.previewMode) {
    return null;
  }

  const slotInfo = {
    header_banner: {
      name: 'Top Header Leaderboard',
      dimensions: 'Responsive (728x90 desktop / 320x50 mobile)',
      slotId: settings.adsense.adUnits.headerBanner,
      minHeight: 'min-h-[90px]'
    },
    in_feed: {
      name: 'Directory Feed In-Article Placement',
      dimensions: 'Fluid Native Responsive',
      slotId: settings.adsense.adUnits.inFeedHome,
      minHeight: 'min-h-[120px]'
    },
    sidebar: {
      name: 'Sidebar Sticky Unit',
      dimensions: '300x250 Medium Rectangle or 300x600 Half-Page',
      slotId: settings.adsense.adUnits.sidebarSticky,
      minHeight: 'min-h-[250px]'
    },
    below_product: {
      name: 'Post-Specs Recommendation Unit',
      dimensions: 'Responsive Display Box',
      slotId: settings.adsense.adUnits.belowProductSpecs,
      minHeight: 'min-h-[110px]'
    },
    footer_banner: {
      name: 'Footer Billboard Unit',
      dimensions: 'Responsive Horizontal (728x90)',
      slotId: settings.adsense.adUnits.footerBanner,
      minHeight: 'min-h-[90px]'
    }
  }[slot];

  return (
    <aside 
      className={`relative my-6 mx-auto w-full max-w-5xl overflow-hidden rounded-3xl ${className}`}
      aria-label="Advertisement placement"
    >
      {/* Policy-mandated advertisement disclosure label */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-100/80 border-b border-slate-200/60 text-[10px] font-bold tracking-wider text-slate-500 uppercase select-none">
        <span>ADVERTISEMENT</span>
        <span className="flex items-center gap-1 font-medium text-slate-400">
          <Info className="w-3 h-3" />
          <span>Independent from editorial recommendations</span>
        </span>
      </div>

      {/* Render Ad Container */}
      {settings.adsense.enabled ? (
        <div className={`p-4 bg-white flex items-center justify-center ${slotInfo.minHeight}`}>
          {/* Official Google AdSense responsive tag insertion point */}
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={settings.adsense.publisherId}
            data-ad-slot={slotInfo.slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        /* Administrator / Reviewer Preview Placeholder (Only visible in Preview Mode) */
        <div className={`p-5 bg-gradient-to-br from-slate-50/90 to-blue-50/40 border border-dashed border-slate-300 rounded-b-3xl flex flex-col items-center justify-center text-center ${slotInfo.minHeight}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold mb-2 shadow-2xs">
            <span>AdSense Slot Placeholder: {slotInfo.name}</span>
          </div>
          <p className="text-xs font-semibold text-slate-700 max-w-md">
            Reserved ad unit container ({slotInfo.dimensions})
          </p>
          <p className="text-[11px] text-slate-500 max-w-lg mt-1">
            Inactive by default. Ad units will activate automatically once your domain is verified and approved via Google AdSense.
          </p>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2 cursor-pointer"
            >
              <span>Configure in Monetisation Settings</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
