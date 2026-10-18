/**
 * Analytics and Outbound Link Broker
 * 
 * Safely dispatches outbound click analytics to the /api/track-click endpoint
 * using navigator.sendBeacon or fetch keepalive.
 * Does not block navigation or invent fake commissions.
 */

export interface TrackClickOptions {
  productSlug?: string;
  sourcePage?: string;
  isAffiliate?: boolean;
  userUid?: string;
}

// Generate or retrieve persistent anonymous session ID for this browser tab
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let sid = sessionStorage.getItem('gtf_anon_sid');
    if (!sid) {
      sid = 'sid_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
      sessionStorage.setItem('gtf_anon_sid', sid);
    }
    return sid;
  } catch {
    return 'ephemeral_session';
  }
}

// Prevent rapid accidental double-clicks within 1.5 seconds
const recentClicks = new Map<string, number>();

export function trackOutboundClick(
  destinationUrl: string, 
  optionsOrLabel?: TrackClickOptions | string,
  argProductSlug?: string,
  argSourcePage?: string
): void {
  if (typeof window === 'undefined' || !destinationUrl) return;

  const now = Date.now();
  const lastClick = recentClicks.get(destinationUrl);
  if (lastClick && now - lastClick < 1500) {
    return; // Skip accidental duplicate click
  }
  recentClicks.set(destinationUrl, now);

  // Opportunistic cleanup of click debouncing map
  if (recentClicks.size > 50) {
    for (const [url, time] of recentClicks.entries()) {
      if (now - time > 5000) recentClicks.delete(url);
    }
  }

  // Parse polymorphic options
  const options: TrackClickOptions = typeof optionsOrLabel === 'object' && optionsOrLabel !== null
    ? optionsOrLabel
    : {
        productSlug: argProductSlug,
        sourcePage: argSourcePage
      };

  // Determine source page
  const sourcePage = options.sourcePage || 
    (window.location.hash ? window.location.hash.replace(/^#\/?/, '') : 'home');

  // Detect authenticated user UID if stored in browser
  let userUid = options.userUid;
  if (!userUid) {
    try {
      const storedUser = localStorage.getItem('gtf_auth_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.uid) userUid = parsed.uid;
      }
    } catch {}
  }

  const payload = JSON.stringify({
    destination: destinationUrl,
    productSlug: options.productSlug || 'general',
    sourcePage,
    isAffiliate: Boolean(options.isAffiliate),
    sessionId: getSessionId(),
    userUid
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/track-click', blob);
      return;
    }
  } catch {}

  fetch('/api/track-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true
  }).catch(() => {
    // Fail gracefully: tracking error must never block user navigation
  });
}
