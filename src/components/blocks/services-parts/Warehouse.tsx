/**
 * Warehouse service illustration. See Apartment.tsx for the visual language
 * shared across service icons.
 */
export function Warehouse() {
  return (
    <>
      <rect width="200" height="200" fill="#1a1a1a" />
      <rect
        x="30"
        y="80"
        width="140"
        height="90"
        rx="2"
        fill="#2a2a2a"
        stroke="#E8A825"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M30,80 L100,40 L170,80"
        fill="none"
        stroke="#E8A825"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <rect x="50" y="110" width="40" height="60" fill="#E8A825" opacity="0.15" />
      <rect x="110" y="110" width="40" height="60" fill="#E8A825" opacity="0.15" />
      <rect x="60" y="90" width="20" height="15" rx="1" fill="#E8A825" opacity="0.25" />
      <rect x="120" y="90" width="20" height="15" rx="1" fill="#E8A825" opacity="0.25" />
    </>
  );
}
