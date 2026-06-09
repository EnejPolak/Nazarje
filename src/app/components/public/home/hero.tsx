import React from 'react';
import heroImage from '@/assets/hero.jpg';
import '../../../styles/components/hero.css';

export function Hero() {
  return (
    <section id="domov" className="public-hero">
      <div className="public-hero__frame">
        <img
          src={heroImage}
          alt=""
          className="public-hero__image"
          aria-hidden
          fetchPriority="high"
        />
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
