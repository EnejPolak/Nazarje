import { useEffect, useRef, useState } from 'react';

const SCROLL_DELTA = 10;
const TOP_THRESHOLD = 48;

/** Skrije element ob scrollu navzdol, pokaže ob scrollu navzgor. */
export function useScrollHideOnDown(enabled = true) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setHidden(false);
      return;
    }

    lastY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        if (y <= TOP_THRESHOLD) {
          setHidden(false);
        } else if (delta > SCROLL_DELTA) {
          setHidden(true);
        } else if (delta < -SCROLL_DELTA) {
          setHidden(false);
        }

        lastY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enabled]);

  return hidden;
}
