import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { adminLogin } from '../api/admin';
import { ApiError, clearAdminSession } from '../api/client';
import type { ApiAdminUser } from '../api/types';

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

type CrmAuthContextValue = {
  isAuthenticated: boolean;
  user: ApiAdminUser | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const CrmAuthContext = createContext<CrmAuthContextValue | null>(null);

function readToken(): boolean {
  try {
    return !!localStorage.getItem(TOKEN_KEY);
  } catch {
    return false;
  }
}

function readUser(): ApiAdminUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ApiAdminUser;
  } catch {
    return null;
  }
}

export function CrmAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readToken);
  const [user, setUser] = useState<ApiAdminUser | null>(readUser);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { token, user: loggedInUser } = await adminLogin(email, password);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
      setIsAuthenticated(true);
      setUser(loggedInUser);
      return { ok: true };
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.status === 401 || /invalid email or password/i.test(e.message)
            ? 'Napačen e-poštni naslov ali geslo.'
            : e.message
          : 'Prijava ni uspela. Preverite povezavo z API-jem.';
      return { ok: false, error: msg };
    }
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, user, login, logout }),
    [isAuthenticated, user, login, logout]
  );

  return <CrmAuthContext.Provider value={value}>{children}</CrmAuthContext.Provider>;
}

export function useCrmAuth() {
  const ctx = useContext(CrmAuthContext);
  if (!ctx) throw new Error('useCrmAuth mora biti znotraj CrmAuthProvider');
  return ctx;
}
