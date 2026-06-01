import React from 'react';
import '../../../styles/components/hero.css';

export function Hero() {
  return (
    <section id="domov" className="public-hero">
      <div className="public-hero__frame">
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
