/**
 * Office service illustration — isometric tower with a window grid and a
 * ground-floor entrance. See Apartment.tsx for the shared isometric visual
 * language (light from upper-right).
 */
export function Office() {
  return (
    <>
      <rect width="200" height="200" fill="#1a1a1a" />
      <ellipse cx="100" cy="192" rx="50" ry="8" fill="#000" opacity="0.3" />
      {/* roof + walls */}
      <polygon points="100,55.8 145,81.8 100,107.8 55,81.8" fill="#b5800f" />
      <polygon points="145,165 100,191 100,107.8 145,81.8" fill="#e8a825" />
      <polygon points="55,165 100,191 100,107.8 55,81.8" fill="#9c7012" />
      {/* window grid — right wall */}
      <polygon points="139,105.1 126.8,112.1 126.8,100.4 139,93.4" fill="#161616" />
      <polygon points="139,123.3 126.8,130.3 126.8,118.6 139,111.6" fill="#161616" />
      <polygon points="139,141.5 126.8,148.5 126.8,136.8 139,129.8" fill="#161616" />
      <polygon points="118.7,116.8 106.5,123.8 106.5,112.1 118.7,105.1" fill="#161616" />
      <polygon points="118.7,135 106.5,142 106.5,130.3 118.7,123.3" fill="#161616" />
      <polygon points="118.7,153.2 106.5,160.2 106.5,148.5 118.7,141.5" fill="#161616" />
      {/* window grid — left wall */}
      <polygon points="61,105.1 73.2,112.1 73.2,100.4 61,93.4" fill="#161616" />
      <polygon points="61,123.3 73.2,130.3 73.2,118.6 61,111.6" fill="#161616" />
      <polygon points="61,141.5 73.2,148.5 73.2,136.8 61,129.8" fill="#161616" />
      <polygon points="81.3,116.8 93.5,123.8 93.5,112.1 81.3,105.1" fill="#161616" />
      <polygon points="81.3,135 93.5,142 93.5,130.3 81.3,123.3" fill="#161616" />
      <polygon points="81.3,153.2 93.5,160.2 93.5,148.5 81.3,141.5" fill="#161616" />
      {/* entrance */}
      <polygon points="127.2,175.5 118.2,180.7 118.2,157.3 127.2,152.1" fill="#1e1607" />
    </>
  );
}
