import Image from 'next/image';

import { Link } from '@/i18n/navigation';

interface Props {
  size?: number;
}

/**
 * Brand logo linking to the localised home. `priority` because this is the
 * LCP element in the header — preload boosts mobile-3G LCP by ~300 ms.
 * Source is a 512×512 WebP (~25 KB); `next/image` auto-generates 1x/2x AVIF
 * variants per the `sizes` hint.
 *
 * NOTE: explicit `style={{ width, height }}` is required to satisfy Chrome
 * even with the `width`/`height` attributes set. Tailwind 4's preflight
 * applies `max-width: 100%; height: auto;` to every `<img>` element, which
 * silently overrides the height attribute → browser then complains the
 * width/height ratio doesn't match the natural image ratio. Inline style
 * wins specificity vs Tailwind base layer.
 */
export function Logo({ size = 48 }: Props) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="KingdomCars — home">
      <Image
        src="/logo.webp"
        alt=""
        width={size}
        height={size}
        priority
        fetchPriority="high"
        sizes={`${size}px`}
        style={{ width: size, height: size }}
      />
    </Link>
  );
}
