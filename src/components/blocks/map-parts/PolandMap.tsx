import { CITIES, POLAND_PATH, ROUTES } from '@/components/blocks/map-parts/poland-map-data';

const WARSAW = { cx: 270, cy: 190 };

/**
 * Decorative Poland map: country outline + dashed routes from Warszawa to
 * four other cities + pulsing pins. All static geometry lives in
 * `poland-map-data.ts`.
 *
 * Animations (`cityPulse`, `routeDraw` via `.route-line`) are declared in
 * globals.css and gated by `prefers-reduced-motion: no-preference`.
 */
export function PolandMap() {
  return (
    <svg
      viewBox="0 0 500 480"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Map of Poland with covered cities"
      className="h-auto w-full"
    >
      <path
        d={POLAND_PATH}
        fill="rgba(232,168,37,0.06)"
        stroke="#E8A825"
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />
      {ROUTES.map((r) => (
        <line
          key={`${r.x2},${r.y2}`}
          x1={WARSAW.cx}
          y1={WARSAW.cy}
          x2={r.x2}
          y2={r.y2}
          stroke="#E8A825"
          strokeWidth="1"
          opacity="0.3"
          strokeDasharray="4 4"
          className="route-line"
          style={{ animationDelay: `${r.delayS}s` }}
        />
      ))}
      {CITIES.map((city, i) => (
        <g key={city.name}>
          <circle
            cx={city.cx}
            cy={city.cy}
            r="4"
            fill="#E8A825"
            style={{
              animation: 'cityPulse 2s ease-in-out infinite',
              animationDelay: `${i * 0.3}s`,
              transformOrigin: 'center',
              transformBox: 'fill-box',
            }}
          />
          <text x={city.cx + 8} y={city.cy + 4} fill="#B0B0B0" fontSize="11">
            {city.name}
          </text>
        </g>
      ))}
      <circle
        cx={WARSAW.cx}
        cy={WARSAW.cy}
        r="12"
        fill="none"
        stroke="#E8A825"
        strokeWidth="1"
        opacity="0.3"
      >
        <animate attributeName="r" from="6" to="20" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
