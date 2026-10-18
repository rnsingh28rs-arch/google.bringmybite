import { useState, useEffect } from 'react';
import { 
  getMonetizationSettings, 
  saveMonetizationSettings, 
  MonetizationSettings 
} from '../data/monetizationConfig';

/**
 * React hook to synchronize and access active server-side monetization settings.
 */
export function useMonetizationSync() {
  const [settings, setSettings] = useState<MonetizationSettings>(getMonetizationSettings());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch('/api/admin/monetization', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && data.settings) {
          const merged = { ...getMonetizationSettings(), ...data.settings };
          setSettings(merged);
          saveMonetizationSettings(merged);
        }
      })
      .catch(err => {
        console.debug('[Monetization Sync]', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, isLoading };
}
