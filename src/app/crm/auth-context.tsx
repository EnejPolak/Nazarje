import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const SESSION_KEY = 'crm-seja';

type CrmAuthContextValue = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const CrmAuthContext = createContext<CrmAuthContextValue | null>(null);

function readSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

/** Začasno za ročno testiranje — pred produkcijo zamenjaj z backend prijavo. */
const DEMO_EMAIL = 'test@test';
const DEMO_PASSWORD = 'test12345';

export function CrmAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readSession);

  const login = useCallback((email: string, password: string) => {
    const ok =
      email.trim().toLowerCase() === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD;
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout]
  );

  return <CrmAuthContext.Provider value={value}>{children}</CrmAuthContext.Provider>;
}

export function useCrmAuth() {
  const ctx = useContext(CrmAuthContext);
  if (!ctx) throw new Error('useCrmAuth mora biti znotraj CrmAuthProvider');
  return ctx;
}
