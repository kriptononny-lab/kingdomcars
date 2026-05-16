/**
 * SVG gradient definitions for the hero van illustration. Lives in its own
 * file because the gradient set is logically self-contained and would push
 * HeroVan over the 100-line budget.
 *
 * IDs are namespaced (`hv-*`) so they don't clash with other inline SVG defs
 * that may render on the same page.
 */
export function HeroVanDefs() {
  return (
    <defs>
      <linearGradient id="vb" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff" />
        <stop offset="60%" stopColor="#e8e8e8" />
        <stop offset="100%" stopColor="#b8b8b8" />
      </linearGradient>
      <linearGradient id="vc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f5f5f5" />
        <stop offset="100%" stopColor="#a8a8a8" />
      </linearGradient>
      <linearGradient id="ws" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1a3055" />
        <stop offset="100%" stopColor="#0a1525" />
      </linearGradient>
      <radialGradient id="hl" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#fff8d0" />
        <stop offset="100%" stopColor="#E8A825" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}
