import { useEffect } from 'react';
import { absoluteUrl, getOgDefaultImage, getSiteUrl } from '../utils/site-config';

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

function removeMeta(name: string, attribute: 'name' | 'property' = 'name') {
  document.querySelector(`meta[${attribute}="${name}"]`)?.remove();
}

export interface PageMetaOptions {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
}

export function usePageMeta({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  noindex,
}: PageMetaOptions) {
  useEffect(() => {
    const desc = description ?? DEFAULT_DESCRIPTION;
    const url = canonicalUrl ?? (typeof window !== 'undefined' ? window.location.href : getSiteUrl());
    const image = ogImage ? absoluteUrl(ogImage) : getOgDefaultImage();

    document.title = title;
    upsertMeta('description', desc);

    if (noindex) {
      upsertMeta('robots', 'noindex, nofollow');
    } else {
      removeMeta('robots');
    }

    upsertMeta('og:title', title, 'property');
    upsertMeta('og:description', desc, 'property');
    upsertMeta('og:url', url, 'property');
    upsertMeta('og:type', ogType, 'property');
    upsertMeta('og:image', image, 'property');
    upsertMeta('og:locale', 'sl_SI', 'property');
    upsertMeta('og:site_name', 'Nazarje Dogodki', 'property');
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', desc);
    upsertMeta('twitter:image', image);

    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    }
  }, [title, description, canonicalUrl, ogImage, ogType, noindex]);
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
