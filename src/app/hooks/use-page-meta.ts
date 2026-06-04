import { useEffect } from 'react';

const DEFAULT_DESCRIPTION =
  'Koledar in seznam dogodkov v Nazarjah — kulturni, športni in družabni dogodki v občini.';

function upsertMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export interface PageMetaOptions {
  title: string;
  description?: string;
  canonicalUrl?: string;
}

export function usePageMeta({ title, description, canonicalUrl }: PageMetaOptions) {
  useEffect(() => {
    document.title = title;
    upsertMeta('description', description ?? DEFAULT_DESCRIPTION);

    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    }
  }, [title, description, canonicalUrl]);
}

export const PAGE_META_DEFAULTS = {
  home: {
    title: 'Dogodki Nazarje',
    description: DEFAULT_DESCRIPTION,
  },
  allEvents: {
    title: 'Vsi dogodki · Nazarje',
    description: 'Pregled vseh prihajajočih dogodkov v Nazarjah z možnostjo filtriranja.',
  },
  pastEvents: {
    title: 'Pretekli dogodki · Nazarje',
    description: 'Arhiv preteklih dogodkov v občini Nazarje.',
  },
} as const;
