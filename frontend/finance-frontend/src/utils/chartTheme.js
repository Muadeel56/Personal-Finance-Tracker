/** Read a CSS custom property from :root (respects active data-theme). */
export function getCssVar(name) {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const CATEGORY_VAR_NAMES = [
  '--cat-plum',
  '--cat-emerald',
  '--cat-rose',
  '--cat-amber',
  '--cat-violet',
  '--cat-lime',
  '--cat-orange',
];

/** Category slice colors from design tokens. */
export function getCategoryColors() {
  return CATEGORY_VAR_NAMES.map((name) => getCssVar(name)).filter(Boolean);
}

/** Semi-transparent fills for chart backgrounds. */
export function getCategoryBackgrounds(opacity = 0.15) {
  return getCategoryColors().map((hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  });
}

export function getCategoryColorByIndex(index) {
  const colors = getCategoryColors();
  return colors[index % colors.length] || getCssVar('--accent');
}

export function getCategoryBgByIndex(index, opacity = 0.15) {
  const bgs = getCategoryBackgrounds(opacity);
  return bgs[index % bgs.length] || getCssVar('--accent-glow');
}
