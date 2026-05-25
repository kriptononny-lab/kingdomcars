/**
 * Animated waving Polish flag (white over red) rendered inline next to the
 * hero headline highlight. The cloth is split into vertical columns, each
 * animated with a phase-shifted `flagWave` (declared in globals.css) to
 * simulate wind. Sized in `em` so it scales with the surrounding text.
 *
 * Decorative — `aria-hidden`; the word "Polska/Польше" already carries the
 * meaning. Animation is disabled under `prefers-reduced-motion` via the
 * global reset in globals.css.
 */
export function PolishFlag() {
  return (
    <svg
      viewBox="0 0 41 31"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      focusable="false"
      style={{
        display: 'inline-block',
        width: '1.15em',
        height: 'auto',
        verticalAlign: 'baseline',
        marginLeft: '0.18em',
      }}
    >
      <g transform="translate(2,2)">
        <g className="flag-col" style={{ animationDelay: '0s' }}>
          <rect x="0" y="0" width="6.5" height="13.5" fill="#ffffff" />
          <rect x="0" y="13.5" width="6.5" height="13.5" fill="#d4213d" />
        </g>
        <g className="flag-col" style={{ animationDelay: '0.25s' }}>
          <rect x="6.5" y="0" width="6.5" height="13.5" fill="#f7f7f7" />
          <rect x="6.5" y="13.5" width="6.5" height="13.5" fill="#cb1e37" />
        </g>
        <g className="flag-col" style={{ animationDelay: '0.5s' }}>
          <rect x="13" y="0" width="6.5" height="13.5" fill="#f0f0f0" />
          <rect x="13" y="13.5" width="6.5" height="13.5" fill="#c01b33" />
        </g>
        <g className="flag-col" style={{ animationDelay: '0.75s' }}>
          <rect x="19.5" y="0" width="6.5" height="13.5" fill="#f7f7f7" />
          <rect x="19.5" y="13.5" width="6.5" height="13.5" fill="#cb1e37" />
        </g>
        <g className="flag-col" style={{ animationDelay: '1s' }}>
          <rect x="26" y="0" width="6.5" height="13.5" fill="#ffffff" />
          <rect x="26" y="13.5" width="6.5" height="13.5" fill="#d4213d" />
        </g>
        <g className="flag-col" style={{ animationDelay: '1.25s' }}>
          <rect x="32.5" y="0" width="6.5" height="13.5" fill="#f0f0f0" />
          <rect x="32.5" y="13.5" width="6.5" height="13.5" fill="#c01b33" />
        </g>
      </g>
    </svg>
  );
}
