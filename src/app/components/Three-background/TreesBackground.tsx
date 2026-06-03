import { useEffect } from 'react';
import { killTrees, spawnTrees } from './trees-animation';
import './trees-background.css';

export function TreesBackground() {
  useEffect(() => {
    let cancelled = false;
    const frameId = requestAnimationFrame(() => {
      if (!cancelled) spawnTrees();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      killTrees();
    };
  }, []);

  return (
    <div className="trees-background-layer" aria-hidden>
      <div id="trees-container">
        <div id="trees" />
        <section id="floor" />
      </div>
    </div>
  );
}
