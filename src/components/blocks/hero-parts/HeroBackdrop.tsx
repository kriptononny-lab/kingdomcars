/**
 * Decorative night-sky + Warsaw skyline backdrop for the hero block.
 * No content — purely visual, hidden from screen readers.
 */
export function HeroBackdrop() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0e1f] via-[#1a1535] to-[#8a3a1f]"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 20% 30%, white, transparent),
              radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,0.7), transparent),
              radial-gradient(1px 1px at 80% 40%, rgba(255,255,255,0.5), transparent),
              radial-gradient(1px 1px at 30% 70%, rgba(255,255,255,0.6), transparent),
              radial-gradient(1px 1px at 90% 25%, white, transparent)
            `,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-surface to-transparent" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-[60%]">
        <svg viewBox="0 0 1920 600" preserveAspectRatio="xMidYMax slice" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <g fill="#1a0f1f">
            <rect x="500" y="340" width="90" height="260" /><rect x="610" y="310" width="70" height="290" />
            <rect x="700" y="350" width="100" height="250" /><rect x="820" y="280" width="80" height="320" />
            <rect x="1100" y="320" width="85" height="280" /><rect x="1200" y="295" width="95" height="305" />
            <rect x="1310" y="335" width="75" height="265" /><rect x="1400" y="305" width="90" height="295" />
          </g>
          <g fill="#251530">
            <rect x="920" y="200" width="60" height="400" /><rect x="900" y="220" width="100" height="20" />
            <rect x="880" y="280" width="140" height="320" /><rect x="860" y="340" width="180" height="260" />
            <rect x="840" y="400" width="220" height="200" /><polygon points="950,200 940,140 950,80 960,140" />
          </g>
          <g fill="#1f1428">
            <rect x="1060" y="150" width="50" height="450" /><polygon points="1060,150 1085,100 1110,150" />
          </g>
          <g fill="#E8A825" opacity="0.85">
            <circle cx="520" cy="370" r="2" /><circle cx="540" cy="400" r="2" />
            <circle cx="630" cy="340" r="2" /><circle cx="720" cy="380" r="2" />
            <circle cx="840" cy="320" r="2" /><circle cx="1075" cy="290" r="2" />
            <circle cx="1220" cy="320" r="2" /><circle cx="1420" cy="340" r="2" />
          </g>
        </svg>
      </div>
    </>
  );
}
