import { HeroVanDefs } from '@/components/blocks/hero-parts/HeroVanDefs';
import { HeroVanWheel } from '@/components/blocks/hero-parts/HeroVanWheel';

/**
 * Decorative SVG van. The body bobs and the headlight pulses through CSS
 * keyframes declared in `globals.css`; both keyframes are inside a
 * `@media (prefers-reduced-motion: no-preference)` block, so reduced-motion
 * users see a still illustration.
 *
 * Sub-parts: HeroVanDefs (gradients), HeroVanWheel (front + rear). The
 * body, windscreen, headlight and ground shadow stay inline here because
 * they're one-of-a-kind shapes that aren't reused.
 */
export function HeroVan() {
  return (
    <svg
      viewBox="0 0 600 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Delivery van"
      className="w-full max-w-[540px] drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
    >
      <HeroVanDefs />
      <ellipse cx="300" cy="350" rx="240" ry="14" fill="#000" opacity="0.4" />
      <g style={{ animation: 'vanBob 3.5s ease-in-out infinite' }}>
        <rect
          x="80"
          y="120"
          width="320"
          height="180"
          rx="6"
          fill="url(#vb)"
          stroke="#888"
          strokeWidth="1.5"
        />
        <line x1="180" y1="120" x2="180" y2="300" stroke="#bbb" strokeWidth="1" />
        <line x1="280" y1="120" x2="280" y2="300" stroke="#bbb" strokeWidth="1" />
        <image href="/logo.webp" x="200" y="155" width="100" height="100" opacity="0.95" />
        <path
          d="M400,140 L490,140 Q510,140 515,160 L530,230 L530,300 L400,300 Z"
          fill="url(#vc)"
          stroke="#888"
          strokeWidth="1.5"
        />
        <path d="M408,148 L488,148 Q502,150 506,165 L518,225 L408,225 Z" fill="url(#ws)" />
        <rect x="408" y="155" width="40" height="60" fill="#0d1830" opacity="0.7" />
        <rect x="445" y="260" width="20" height="4" rx="1" fill="#333" />
        <ellipse cx="525" cy="245" rx="10" ry="14" fill="#fff8d0" />
        <ellipse
          cx="540"
          cy="250"
          rx="35"
          ry="20"
          fill="url(#hl)"
          style={{ animation: 'headlightPulse 2s ease-in-out infinite' }}
        />
        <rect x="510" y="270" width="22" height="20" rx="2" fill="#222" />
        <rect x="80" y="290" width="450" height="20" rx="3" fill="#444" />
      </g>
      <HeroVanWheel cx={160} cy={320} />
      <HeroVanWheel cx={450} cy={320} />
    </svg>
  );
}
