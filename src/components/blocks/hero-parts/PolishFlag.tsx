import type { CSSProperties } from 'react';

/**
 * Animated waving Polish flag (white over red) rendered inline next to the
 * hero headline highlight. The cloth is rendered as many thin vertical strips,
 * each offset along a sine wave (via the `--y0`/`--y1` CSS vars consumed by the
 * `flagWave` keyframes in globals.css) so a smooth ripple travels across the
 * cloth. A soft light/shadow gradient on top adds depth. Sized in `em` so it
 * scales with the surrounding text.
 *
 * Decorative — `aria-hidden`; the word "Polska/Польше" already carries the
 * meaning. Animation is disabled under `prefers-reduced-motion` via the global
 * reset in globals.css.
 */
const STRIP_COUNT = 96;
const CLOTH_W = 48;
const CLOTH_H = 34;
const HALF = CLOTH_H / 2;
const AMPLITUDE = 2.8;
const DURATION_S = 2.2;
const STRIP_W = CLOTH_W / STRIP_COUNT;

const STRIPS = Array.from({ length: STRIP_COUNT }, (_, i) => {
  const phase = (i / STRIP_COUNT) * Math.PI * 2;
  return {
    x: i * STRIP_W,
    y0: -Math.sin(phase) * AMPLITUDE,
    y1: -Math.sin(phase + Math.PI) * AMPLITUDE,
    delay: -(i / STRIP_COUNT) * DURATION_S,
  };
});

export function PolishFlag() {
  return (
    <svg
      viewBox="0 0 54 42"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      focusable="false"
      style={{
        display: 'inline-block',
        width: '1.25em',
        height: 'auto',
        verticalAlign: 'baseline',
        marginLeft: '0.2em',
        overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient id="flagShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.14" />
        </linearGradient>
      </defs>
      <g transform="translate(3,4)">
        {STRIPS.map((s) => (
          <g
            key={s.x}
            className="flag-col"
            style={
              {
                '--y0': `${s.y0.toFixed(2)}px`,
                '--y1': `${s.y1.toFixed(2)}px`,
                animationDelay: `${s.delay.toFixed(3)}s`,
              } as CSSProperties
            }
          >
            <rect x={s.x} y={0} width={STRIP_W + 0.25} height={HALF} fill="#ffffff" />
            <rect x={s.x} y={HALF} width={STRIP_W + 0.25} height={HALF} fill="#d4213d" />
          </g>
        ))}
        <rect x={0} y={0} width={CLOTH_W} height={CLOTH_H} fill="url(#flagShade)" />
      </g>
    </svg>
  );
}
