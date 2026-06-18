import { useEffect } from 'react';

const MANAGED_ATTR = 'data-structured-data';

type JsonLd = Record<string, unknown>;

/**
 * Injects one or more JSON-LD blocks into <head> as
 * <script type="application/ld+json"> tags, replacing any previously injected
 * blocks on each change and cleaning them up on unmount. The prerender step
 * serializes these into the static HTML so crawlers see them without JS.
 */
export function useStructuredData(data: JsonLd | JsonLd[] | null | undefined) {
  const serialized = data ? JSON.stringify(Array.isArray(data) ? data : [data]) : null;

  useEffect(() => {
    document.querySelectorAll(`script[${MANAGED_ATTR}]`).forEach((el) => el.remove());

    if (!serialized) return;

    const blocks = JSON.parse(serialized) as JsonLd[];
    const created = blocks.map((block) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(MANAGED_ATTR, 'true');
      script.textContent = JSON.stringify(block);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      created.forEach((script) => script.remove());
    };
  }, [serialized]);
}
