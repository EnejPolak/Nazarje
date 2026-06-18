import React from 'react';
import heroAvif768 from '@/assets/hero/hero-768.avif';
import heroAvif1280 from '@/assets/hero/hero-1280.avif';
import heroAvif1920 from '@/assets/hero/hero-1920.avif';
import heroAvif2560 from '@/assets/hero/hero-2560.avif';
import heroWebp768 from '@/assets/hero/hero-768.webp';
import heroWebp1280 from '@/assets/hero/hero-1280.webp';
import heroWebp1920 from '@/assets/hero/hero-1920.webp';
import heroWebp2560 from '@/assets/hero/hero-2560.webp';
import heroFallback from '@/assets/hero/hero-1920.jpg';
import '../../../styles/components/hero.css';

const heroAvifSrcSet = `${heroAvif768} 768w, ${heroAvif1280} 1280w, ${heroAvif1920} 1920w, ${heroAvif2560} 2560w`;
const heroWebpSrcSet = `${heroWebp768} 768w, ${heroWebp1280} 1280w, ${heroWebp1920} 1920w, ${heroWebp2560} 2560w`;

export function Hero() {
  return (
    <section id="domov" className="public-hero">
      <div className="public-hero__frame">
        <picture>
          <source type="image/avif" srcSet={heroAvifSrcSet} sizes="100vw" />
          <source type="image/webp" srcSet={heroWebpSrcSet} sizes="100vw" />
          <img
            src={heroFallback}
            alt="Prireditve in dogodki v občini Nazarje"
            className="public-hero__image"
            width={1920}
            height={1440}
            decoding="async"
            // React 18 does not map camelCase `fetchPriority`; pass the lowercase DOM attribute.
            {...({ fetchpriority: 'high' } as Record<string, string>)}
          />
        </picture>
        <div className="public-hero__content">
          <h1 className="public-hero__title">
            <span className="public-hero__title-row">
              <span>DOGODKI</span>
              <span>NAZARJE</span>
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
