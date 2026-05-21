/**
 * Trash / disposal service illustration. See Apartment.tsx for the shared
 * visual language across service icons.
 */
export function Trash() {
  return (
    <>
      <rect width="200" height="200" fill="#1a1a1a" />
      <path
        d="M65,60 L70,160 L130,160 L135,60"
        fill="#2a2a2a"
        stroke="#E8A825"
        strokeWidth="1"
        opacity="0.5"
      />
      <line x1="55" y1="60" x2="145" y2="60" stroke="#E8A825" strokeWidth="1.5" opacity="0.4" />
      <rect
        x="85"
        y="45"
        width="30"
        height="15"
        rx="2"
        fill="none"
        stroke="#E8A825"
        strokeWidth="1"
        opacity="0.3"
      />
      <line x1="85" y1="75" x2="88" y2="150" stroke="#E8A825" strokeWidth="1" opacity="0.2" />
      <line x1="100" y1="75" x2="100" y2="150" stroke="#E8A825" strokeWidth="1" opacity="0.2" />
      <line x1="115" y1="75" x2="112" y2="150" stroke="#E8A825" strokeWidth="1" opacity="0.2" />
    </>
  );
}
