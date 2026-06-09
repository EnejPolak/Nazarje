import { useEffect, useMemo, useRef } from 'react';
import { buildLeafConfigs } from './leaf-config';
import './falling-leaves.css';

const LEAF_COUNT = 15;

export function FallingLeaves() {
  const layerRef = useRef<HTMLDivElement>(null);
  const leaves = useMemo(() => buildLeafConfigs(LEAF_COUNT), []);

  useEffect(() => {
    const layer = layerRef.current;
    const zone = layer?.parentElement;
    if (!layer || !zone) return;

    const setFall = () => {
      layer.style.setProperty('--leaves-fall-distance', `${zone.offsetHeight}px`);
    };

    setFall();
    const ro = new ResizeObserver(setFall);
    ro.observe(zone);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={layerRef} className="falling-leaves-layer" aria-hidden>
      <div id="leaves">
        {leaves.map((leaf, i) => (
          <i
            key={i}
            className={`leaf leaf--${leaf.anim}`}
            style={
              {
                left: leaf.left,
                '--leaf-start-x': leaf.startX,
                '--leaf-drift-x': leaf.driftX,
                '--leaf-duration': leaf.duration,
                animationDelay: leaf.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
