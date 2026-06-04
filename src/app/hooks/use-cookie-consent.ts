import { useCallback, useEffect, useState } from 'react';

export type CookieConsentLevel = 'necessary' | 'all';

const STORAGE_KEY = 'nazarje_cookie_consent';

export function readCookieConsent(): CookieConsentLevel | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === 'necessary' || raw === 'all') return raw;
  return null;
}

export function writeCookieConsent(level: CookieConsentLevel): void {
  localStorage.setItem(STORAGE_KEY, level);
}

export function clearCookieConsent(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsentLevel | null>(() => readCookieConsent());
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    setConsent(readCookieConsent());
    setBannerOpen(readCookieConsent() === null);
  }, []);

  const acceptNecessary = useCallback(() => {
    writeCookieConsent('necessary');
    setConsent('necessary');
    setBannerOpen(false);
  }, []);

  const acceptAll = useCallback(() => {
    writeCookieConsent('all');
    setConsent('all');
    setBannerOpen(false);
  }, []);

  const reopenBanner = useCallback(() => {
    clearCookieConsent();
    setConsent(null);
    setBannerOpen(true);
  }, []);

  return {
    consent,
    bannerOpen,
    acceptNecessary,
    acceptAll,
    reopenBanner,
  };
}
