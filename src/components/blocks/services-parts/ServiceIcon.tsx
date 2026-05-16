type ServiceIconKey = 'apartment' | 'warehouse' | 'trash' | 'office';

interface Props {
  kind: ServiceIconKey;
}

/**
 * Decorative SVG illustration for a service card. aria-hidden — the card title
 * carries the semantic meaning.
 */
export function ServiceIcon({ kind }: Props) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {kind === 'apartment' ? <Apartment /> : null}
      {kind === 'warehouse' ? <Warehouse /> : null}
      {kind === 'trash' ? <Trash /> : null}
      {kind === 'office' ? <Office /> : null}
    </svg>
  );
}

function Apartment() {
  return (
    <>
      <rect width="200" height="200" fill="#1a1a1a" />
      <rect x="40" y="50" width="120" height="120" rx="4" fill="#2a2a2a" stroke="#E8A825" strokeWidth="1" opacity="0.5" />
      <rect x="60" y="70" width="30" height="30" rx="2" fill="#E8A825" opacity="0.2" />
      <rect x="110" y="70" width="30" height="30" rx="2" fill="#E8A825" opacity="0.2" />
      <rect x="60" y="120" width="30" height="50" rx="2" fill="#E8A825" opacity="0.3" />
      <rect x="110" y="120" width="30" height="30" rx="2" fill="#E8A825" opacity="0.2" />
      <polygon points="100,25 30,55 170,55" fill="#E8A825" opacity="0.15" />
    </>
  );
}

function Warehouse() {
  return (
    <>
      <rect width="200" height="200" fill="#1a1a1a" />
      <rect x="30" y="80" width="140" height="90" rx="2" fill="#2a2a2a" stroke="#E8A825" strokeWidth="1" opacity="0.5" />
      <path d="M30,80 L100,40 L170,80" fill="none" stroke="#E8A825" strokeWidth="1.5" opacity="0.4" />
      <rect x="50" y="110" width="40" height="60" fill="#E8A825" opacity="0.15" />
      <rect x="110" y="110" width="40" height="60" fill="#E8A825" opacity="0.15" />
      <rect x="60" y="90" width="20" height="15" rx="1" fill="#E8A825" opacity="0.25" />
      <rect x="120" y="90" width="20" height="15" rx="1" fill="#E8A825" opacity="0.25" />
    </>
  );
}

function Trash() {
  return (
    <>
      <rect width="200" height="200" fill="#1a1a1a" />
      <path d="M65,60 L70,160 L130,160 L135,60" fill="#2a2a2a" stroke="#E8A825" strokeWidth="1" opacity="0.5" />
      <line x1="55" y1="60" x2="145" y2="60" stroke="#E8A825" strokeWidth="1.5" opacity="0.4" />
      <rect x="85" y="45" width="30" height="15" rx="2" fill="none" stroke="#E8A825" strokeWidth="1" opacity="0.3" />
      <line x1="85" y1="75" x2="88" y2="150" stroke="#E8A825" strokeWidth="1" opacity="0.2" />
      <line x1="100" y1="75" x2="100" y2="150" stroke="#E8A825" strokeWidth="1" opacity="0.2" />
      <line x1="115" y1="75" x2="112" y2="150" stroke="#E8A825" strokeWidth="1" opacity="0.2" />
    </>
  );
}

function Office() {
  return (
    <>
      <rect width="200" height="200" fill="#1a1a1a" />
      <rect x="50" y="40" width="100" height="130" rx="3" fill="#2a2a2a" stroke="#E8A825" strokeWidth="1" opacity="0.5" />
      <rect x="65" y="55" width="25" height="20" rx="1" fill="#E8A825" opacity="0.15" />
      <rect x="110" y="55" width="25" height="20" rx="1" fill="#E8A825" opacity="0.15" />
      <rect x="65" y="90" width="25" height="20" rx="1" fill="#E8A825" opacity="0.15" />
      <rect x="110" y="90" width="25" height="20" rx="1" fill="#E8A825" opacity="0.15" />
      <rect x="65" y="125" width="25" height="20" rx="1" fill="#E8A825" opacity="0.15" />
      <rect x="110" y="125" width="25" height="20" rx="1" fill="#E8A825" opacity="0.15" />
      <rect x="85" y="150" width="30" height="20" rx="1" fill="#E8A825" opacity="0.3" />
    </>
  );
}
