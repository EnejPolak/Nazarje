/** SCSS @for loop — iste formule, inline stili ob buildTrees. */
const MAX_HEIGHT = 105;
const MIN_HEIGHT = 25;
const MIN_WIDTH = MIN_HEIGHT * (2 / 5);
const STEPS = 5;
const BG = { r: 255, g: 255, b: 255 };
const FG = { r: 58, g: 71, b: 31 };

export function applyTreeRandomStyles(treeEl: SVGSVGElement): void {
  const height = Math.random() * (MAX_HEIGHT - MIN_HEIGHT) + MIN_HEIGHT;

  if (Math.random() > 0.5) {
    treeEl.style.transform = 'scaleX(-1)';
  }

  treeEl.style.height = `${height}%`;
  treeEl.style.left = `${Math.random() * (100 + MIN_WIDTH / 2) - MIN_WIDTH / 4}%`;
  treeEl.style.zIndex = String(Math.round((height * 100) / ((height * 100) * 0 + 1)));

  const scale = Math.round(((height - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * (STEPS - 1));
  const r = BG.r + (((FG.r - BG.r) / STEPS) * (scale + 1));
  const g = BG.g + (((FG.g - BG.g) / STEPS) * (scale + 1));
  const b = BG.b + (((FG.b - BG.b) / STEPS) * (scale + 1));
  const color = `rgb(${r}, ${g}, ${b})`;

  treeEl.style.stroke = color;

  const trunk = treeEl.querySelector('.trunk');
  if (trunk instanceof SVGElement) {
    trunk.style.fill = color;
  }
}
