/**
 * Apartment service illustration. Wrapped in `<g>` and consumed by ServiceIcon.
 * Decorative — no aria attributes; semantics live on the parent.
 */
export function Apartment() {
  return (
    <>
      <rect width="200" height="200" fill="#1a1a1a" />
      <rect
        x="40"
        y="50"
        width="120"
        height="120"
        rx="4"
        fill="#2a2a2a"
        stroke="#E8A825"
        strokeWidth="1"
        opacity="0.5"
      />
      <rect x="60" y="70" width="30" height="30" rx="2" fill="#E8A825" opacity="0.2" />
      <rect x="110" y="70" width="30" height="30" rx="2" fill="#E8A825" opacity="0.2" />
      <rect x="60" y="120" width="30" height="50" rx="2" fill="#E8A825" opacity="0.3" />
      <rect x="110" y="120" width="30" height="30" rx="2" fill="#E8A825" opacity="0.2" />
      <polygon points="100,25 30,55 170,55" fill="#E8A825" opacity="0.15" />
    </>
  );
}
