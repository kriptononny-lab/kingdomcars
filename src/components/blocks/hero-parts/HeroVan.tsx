/**
 * Decorative SVG van. Animations only run when prefers-reduced-motion is not set
 * (handled globally in globals.css via the media query).
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
      <defs>
        <linearGradient id="vb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" /><stop offset="60%" stopColor="#e8e8e8" /><stop offset="100%" stopColor="#b8b8b8" />
        </linearGradient>
        <linearGradient id="vc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5f5f5" /><stop offset="100%" stopColor="#a8a8a8" />
        </linearGradient>
        <linearGradient id="ws" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3055" /><stop offset="100%" stopColor="#0a1525" />
        </linearGradient>
        <radialGradient id="hl" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff8d0" /><stop offset="100%" stopColor="#E8A825" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="300" cy="350" rx="240" ry="14" fill="#000" opacity="0.4" />
      <g style={{ animation: 'vanBob 3.5s ease-in-out infinite' }}>
        <rect x="80" y="120" width="320" height="180" rx="6" fill="url(#vb)" stroke="#888" strokeWidth="1.5" />
        <line x1="180" y1="120" x2="180" y2="300" stroke="#bbb" strokeWidth="1" />
        <line x1="280" y1="120" x2="280" y2="300" stroke="#bbb" strokeWidth="1" />
        <image href="/logo.webp" x="200" y="155" width="100" height="100" opacity="0.95" />
        <path d="M400,140 L490,140 Q510,140 515,160 L530,230 L530,300 L400,300 Z" fill="url(#vc)" stroke="#888" strokeWidth="1.5" />
        <path d="M408,148 L488,148 Q502,150 506,165 L518,225 L408,225 Z" fill="url(#ws)" />
        <rect x="408" y="155" width="40" height="60" fill="#0d1830" opacity="0.7" />
        <rect x="445" y="260" width="20" height="4" rx="1" fill="#333" />
        <ellipse cx="525" cy="245" rx="10" ry="14" fill="#fff8d0" />
        <ellipse cx="540" cy="250" rx="35" ry="20" fill="url(#hl)" style={{ animation: 'headlightPulse 2s ease-in-out infinite' }} />
        <rect x="510" y="270" width="22" height="20" rx="2" fill="#222" />
        <rect x="80" y="290" width="450" height="20" rx="3" fill="#444" />
      </g>
      <g>
        <circle cx="160" cy="320" r="32" fill="#1a1a1a" />
        <g>
          <circle cx="160" cy="320" r="22" fill="#333" />
          <circle cx="160" cy="320" r="14" fill="#1a1a1a" />
          <circle cx="160" cy="320" r="6" fill="#666" />
          <line x1="160" y1="298" x2="160" y2="342" stroke="#555" strokeWidth="2" />
          <line x1="138" y1="320" x2="182" y2="320" stroke="#555" strokeWidth="2" />
          <animateTransform attributeName="transform" type="rotate" from="0 160 320" to="360 160 320" dur="4s" repeatCount="indefinite" />
        </g>
      </g>
      <g>
        <circle cx="450" cy="320" r="32" fill="#1a1a1a" />
        <g>
          <circle cx="450" cy="320" r="22" fill="#333" />
          <circle cx="450" cy="320" r="14" fill="#1a1a1a" />
          <circle cx="450" cy="320" r="6" fill="#666" />
          <line x1="450" y1="298" x2="450" y2="342" stroke="#555" strokeWidth="2" />
          <line x1="428" y1="320" x2="472" y2="320" stroke="#555" strokeWidth="2" />
          <animateTransform attributeName="transform" type="rotate" from="0 450 320" to="360 450 320" dur="4s" repeatCount="indefinite" />
        </g>
      </g>
    </svg>
  );
}
