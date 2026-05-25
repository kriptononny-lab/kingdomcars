/**
 * Trash / disposal service illustration — isometric tapered bin with a lid
 * and handle. See Apartment.tsx for the shared isometric visual language
 * (light from upper-right).
 */
export function Trash() {
  return (
    <>
      <rect width="200" height="200" fill="#1a1a1a" />
      <ellipse cx="100" cy="178" rx="46" ry="8" fill="#000" opacity="0.3" />
      {/* tapered body */}
      <polygon points="130.5,157 100,174.6 100,134.6 147.1,107.4" fill="#e8a825" />
      <polygon points="69.5,157 100,174.6 100,134.6 52.9,107.4" fill="#9c7012" />
      {/* lid */}
      <polygon points="152.7,107.4 100,137.8 100,129.8 152.7,99.4" fill="#c48b1a" />
      <polygon points="47.3,107.4 100,137.8 100,129.8 47.3,99.4" fill="#7a560a" />
      <polygon points="100,69 152.7,99.4 100,129.8 47.3,99.4" fill="#ffd766" />
      {/* handle */}
      <polygon points="87.3,97.8 102.8,106.8 102.8,98.8 87.3,89.8" fill="#9c7012" />
      <polygon points="112.7,101 102.8,106.8 102.8,98.8 112.7,93" fill="#e8a825" />
      <polygon points="97.2,84 112.7,93 102.8,98.8 87.3,89.8" fill="#f5c542" />
    </>
  );
}
