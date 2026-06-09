import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearCookieConsent,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentLevel,
} from '../hooks/use-cookie-consent';

interface CookieConsentContextValue {
  consent: CookieConsentLevel | null;
  bannerOpen: boolean;
  acceptNecessary: () => void;
  acceptAll: () => void;
  reopenBanner: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsentLevel | null>(() => readCookieConsent());
  const [bannerOpen, setBannerOpen] = useState(() => readCookieConsent() === null);

  useEffect(() => {
    const stored = readCookieConsent();
    setConsent(stored);
    setBannerOpen(stored === null);
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

  const value = useMemo(
    () => ({ consent, bannerOpen, acceptNecessary, acceptAll, reopenBanner }),
    [consent, bannerOpen, acceptNecessary, acceptAll, reopenBanner]
  );

  return (
    <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
  );
}

export function useCookieConsentContext() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error('useCookieConsentContext must be used within CookieConsentProvider');
  }
  return ctx;
}
