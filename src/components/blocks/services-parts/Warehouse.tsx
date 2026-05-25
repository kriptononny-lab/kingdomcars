/**
 * Warehouse service illustration — isometric building with a gable roof.
 * See Apartment.tsx for the shared isometric visual language (light from
 * upper-right). Front gable bright, roller door with slats, side windows.
 */
export function Warehouse() {
  return (
    <>
      <rect width="200" height="200" fill="#1a1a1a" />
      <ellipse cx="108" cy="189.0" rx="64" ry="9" fill="#000" opacity="0.3" />
      {/* gable roof */}
      <polygon points="100,84.6 55,110.6 77.5,74.2" fill="#c48b1a" />
      <polygon points="100,84.6 167.5,123.6 145,113.2 77.5,74.2" fill="#f0b733" />
      <polygon points="55,110.6 122.5,149.6 145,113.2 77.5,74.2" fill="#c48b1a" />
      <polygon points="167.5,123.6 122.5,149.6 145,113.2" fill="#f5c542" />
      {/* walls */}
      <polygon points="55,147.0 122.5,186.0 122.5,149.6 55,110.6" fill="#9c7012" />
      <polygon points="167.5,160.0 122.5,186.0 122.5,149.6 167.5,123.6" fill="#e8a825" />
      {/* roller door + slats */}
      <polygon points="155.4,167.3 135.1,179.0 135.1,151.7 155.4,140.0" fill="#1e1607" />
      <polygon points="155.4,160.8 135.1,172.5 135.1,171.4 155.4,159.7" fill="#3a2a08" />
      <polygon points="155.4,154.3 135.1,166.0 135.1,164.9 155.4,153.2" fill="#3a2a08" />
      <polygon points="155.4,147.8 135.1,159.5 135.1,158.4 155.4,146.7" fill="#3a2a08" />
      {/* side windows */}
      <polygon points="63.7,134.1 75,140.6 75,128.9 63.7,122.4" fill="#161616" />
      <polygon points="84,145.8 95.3,152.3 95.3,140.6 84,134.1" fill="#161616" />
      <polygon points="104.3,157.5 115.5,164.0 115.5,152.3 104.3,145.8" fill="#161616" />
    </>
  );
}
