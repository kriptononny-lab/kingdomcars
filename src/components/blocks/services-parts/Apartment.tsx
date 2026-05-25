/**
 * Apartment service illustration — isometric house with a pitched roof.
 * Geometry is projected from real 3D coordinates so faces and roof read
 * correctly; light falls from upper-right (top lightest, right gold, left
 * shadow). Decorative — semantics live on the parent ServiceIcon.
 */
export function Apartment() {
  return (
    <>
      <rect width="200" height="200" fill="#1a1a1a" />
      <ellipse cx="100" cy="182" rx="54" ry="9" fill="#000" opacity="0.3" />
      {/* roof — pyramid, two visible slopes */}
      <polygon points="100,66 152,96 100,64.5" fill="#c48b1a" />
      <polygon points="100,66 48,96 100,64.5" fill="#f0b733" />
      <polygon points="152,96 100,126 100,64.5" fill="#f0b733" />
      <polygon points="100,126 48,96 100,64.5" fill="#c48b1a" />
      {/* walls */}
      <polygon points="152,150 100,180 100,126 152,96" fill="#e8a825" />
      <polygon points="48,150 100,180 100,126 48,96" fill="#9c7012" />
      {/* window (right), door (right), window (left) */}
      <polygon points="144.4,130.6 130.1,138.9 130.1,122.4 144.4,114.1" fill="#161616" />
      <polygon points="118.4,169.6 107.5,175.9 107.5,145.9 118.4,139.6" fill="#1e1607" />
      <polygon points="62.1,134.4 85.5,147.9 85.5,131.4 62.1,117.9" fill="#161616" />
    </>
  );
}
