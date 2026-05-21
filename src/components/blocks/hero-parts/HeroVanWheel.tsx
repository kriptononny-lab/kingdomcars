interface Props {
  cx: number;
  cy: number;
}

/**
 * One spinning wheel for the hero van. The continuous rotation is rendered
 * with SMIL `<animateTransform>` (lighter than a JS rAF loop and respected
 * by reduced-motion automatically when the page disables SMIL elsewhere).
 *
 * Two instances are placed in HeroVan: front (cx=160) and rear (cx=450).
 */
export function HeroVanWheel({ cx, cy }: Props) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="32" fill="#1a1a1a" />
      <g>
        <circle cx={cx} cy={cy} r="22" fill="#333" />
        <circle cx={cx} cy={cy} r="14" fill="#1a1a1a" />
        <circle cx={cx} cy={cy} r="6" fill="#666" />
        <line x1={cx} y1={cy - 22} x2={cx} y2={cy + 22} stroke="#555" strokeWidth="2" />
        <line x1={cx - 22} y1={cy} x2={cx + 22} y2={cy} stroke="#555" strokeWidth="2" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${cx} ${cy}`}
          to={`360 ${cx} ${cy}`}
          dur="4s"
          repeatCount="indefinite"
        />
      </g>
    </g>
  );
}
