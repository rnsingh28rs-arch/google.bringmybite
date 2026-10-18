import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, ExternalLink, Play, CheckCircle } from 'lucide-react';
import { getMonetizationSettings, OwnerPromotionConfig } from '../data/monetizationConfig';

function parseSafeVideoEmbed(url: string): { type: 'youtube' | 'vimeo' | 'direct' | 'unsupported'; embedUrl?: string } {
  if (!url || typeof url !== 'string') return { type: 'unsupported' };
  const clean = url.trim();

  // YouTube matchers
  const ytMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`
    };
  }

  // Vimeo matchers
  const vimeoMatch = clean.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?dnt=1`
    };
  }

  // Direct MP4 / WebM
  if (/\.(mp4|webm|ogg)($|\?)/i.test(clean)) {
    return {
      type: 'direct',
      embedUrl: clean
    };
  }

  return { type: 'unsupported' };
}

export const FeaturedOwnerPromotion: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [promo, setPromo] = useState<OwnerPromotionConfig | undefined>(getMonetizationSettings().ownerPromotion);

  useEffect(() => {
    // Initial fetch from server to get latest settings
    fetch('/api/admin/monetization')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.settings?.ownerPromotion) {
          setPromo(d.settings.ownerPromotion);
        }
      })
      .catch(() => {});

    const onStorage = () => {
      setPromo(getMonetizationSettings().ownerPromotion);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Collapse cleanly if not enabled or essential fields missing
  if (!promo || !promo.enabled || !promo.title?.trim() || !promo.videoUrl?.trim()) {
    return null;
  }

  const embedInfo = parseSafeVideoEmbed(promo.videoUrl);

  return (
    <section 
      aria-label="Creator Announcement & Launch Spotlight"
      className={`relative my-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-indigo-500/20">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Content, Badge & CTAs */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Verified Creator Badge: Clearly distinguished from third-party ads */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{promo.badgeText || 'Special Announcement'}</span>
              <span className="text-[10px] text-blue-300/70 font-normal">| Creator Showcase</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {promo.title}
              </h2>
              {promo.subtitle && (
                <p className="text-sm sm:text-base font-semibold text-blue-200">
                  {promo.subtitle}
                </p>
              )}
            </div>

            {promo.description && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                {promo.description}
              </p>
            )}

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {promo.ctaUrl && (
                <a
                  href={promo.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>{promo.ctaText || 'Learn More'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}

              {promo.secondaryCtaUrl && promo.secondaryCtaText && (
                <a
                  href={promo.secondaryCtaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
                >
                  <span>{promo.secondaryCtaText}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Safe Video Embed / Player */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black aspect-video flex items-center justify-center">
              {embedInfo.type === 'youtube' || embedInfo.type === 'vimeo' ? (
                <iframe
                  src={embedInfo.embedUrl}
                  title={promo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              ) : embedInfo.type === 'direct' ? (
                <video
                  controls
                  playsInline
                  poster={promo.thumbnailUrl}
                  className="w-full h-full object-cover"
                >
                  <source src={embedInfo.embedUrl} />
                  Your browser does not support HTML5 video playback.
                </video>
              ) : (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <Play className="w-10 h-10 mx-auto text-slate-500" />
                  <p className="text-xs font-semibold">Video preview available at official link</p>
                  {promo.ctaUrl && (
                    <a
                      href={promo.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 underline font-bold"
                    >
                      Watch Demo Video
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
