import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** Ob menjavi poti scrolla na vrh (SPA ne naredi tega samodejno). */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
