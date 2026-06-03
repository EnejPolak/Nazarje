/**
 * DrawSVGPlugin — zamenjaj z uradno GSAP Club datoteko, če jo imaš.
 * Podpira drawSVG: 0 in drawSVG: '100%' kot v originalni animaciji.
 */
import { gsap } from 'gsap';

function getLength(target) {
  if (typeof target.getTotalLength === 'function') {
    return target.getTotalLength() || 0;
  }
  return 0;
}

function parseDrawSVG(value) {
  if (value === 0 || value === '0') {
    return 0;
  }
  if (value === '100%' || value === 1 || value === '1') {
    return 1;
  }
  return 1;
}

export const DrawSVGPlugin = {
  name: 'drawSVG',
  version: '3.0.0',
  propCache: { drawSVG: 1 },
  get(target) {
    const length = getLength(target);
    if (!length) return 0;
    const offset = parseFloat(target.style.strokeDashoffset) || 0;
    return 1 - offset / length;
  },
  init(target, value) {
    if (!target || !target.style || typeof target.getTotalLength !== 'function') {
      return false;
    }
    const length = getLength(target);
    if (!length) {
      return false;
    }
    target.style.strokeDasharray = String(length);
    const end = parseDrawSVG(value);
    target.style.strokeDashoffset = String(length * (1 - end));
    this._length = length;
    this._start = 0;
    this._end = end;
    this.target = target;
    return true;
  },
  render(ratio, data) {
    const target = data?.target;
    if (!target?.style) return;
    const length = data._length || getLength(target);
    if (!length) return;
    const start = data._start ?? 0;
    const end = data._end ?? 1;
    const progress = start + (end - start) * ratio;
    target.style.strokeDashoffset = String(length * (1 - progress));
  },
};

gsap.registerPlugin(DrawSVGPlugin);

export default DrawSVGPlugin;
