interface Props {
  count: 1 | 2 | 3 | 4;
}

/**
 * Stylised "N people" icon for pricing tiers. count=4 renders the 3+ variant.
 * Decorative — aria-hidden.
 */
export function PeopleIcon({ count }: Props) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">
      {count === 1 ? (
        <>
          <circle cx="20" cy="12" r="6" />
          <path d="M10,36 Q10,24 20,24 Q30,24 30,36" />
        </>
      ) : null}
      {count === 2 ? (
        <>
          <circle cx="14" cy="12" r="5" />
          <circle cx="26" cy="12" r="5" />
          <path d="M4,36 Q4,24 14,24 Q24,24 24,36" opacity="0.7" />
          <path d="M16,36 Q16,24 26,24 Q36,24 36,36" />
        </>
      ) : null}
      {count === 3 ? (
        <>
          <circle cx="10" cy="14" r="4" />
          <circle cx="20" cy="10" r="5" />
          <circle cx="30" cy="14" r="4" />
          <path d="M2,36 Q2,26 10,26 Q18,26 18,36" opacity="0.5" />
          <path d="M10,36 Q10,22 20,22 Q30,22 30,36" />
          <path d="M22,36 Q22,26 30,26 Q38,26 38,36" opacity="0.5" />
        </>
      ) : null}
      {count === 4 ? (
        <>
          <circle cx="10" cy="14" r="4" />
          <circle cx="20" cy="10" r="5" />
          <circle cx="30" cy="14" r="4" />
          <path d="M2,36 Q2,26 10,26 Q18,26 18,36" opacity="0.5" />
          <path d="M10,36 Q10,22 20,22 Q30,22 30,36" />
          <path d="M22,36 Q22,26 30,26 Q38,26 38,36" opacity="0.5" />
          <text x="34" y="12" fontSize="10" fontWeight="bold">
            +
          </text>
        </>
      ) : null}
    </svg>
  );
}
