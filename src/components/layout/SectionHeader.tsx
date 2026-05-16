import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  align?: 'left' | 'center';
  level?: 'h2' | 'h3';
  className?: string;
}

/**
 * Section title with a brand-gold bar to its left.
 * Used by every block that has a heading.
 */
export function SectionHeader({
  eyebrow,
  title,
  align = 'left',
  level = 'h2',
  className,
}: SectionHeaderProps) {
  const Heading = level;
  return (
    <div
      className={cn(
        'mb-12 flex items-center gap-4',
        align === 'center' && 'justify-center',
        className,
      )}
    >
      <span aria-hidden="true" className="bg-gold block h-1 w-12 rounded-sm" />
      <div>
        {eyebrow ? (
          <span className="text-text-muted block text-xs font-semibold tracking-[0.18em] uppercase">
            {eyebrow}
          </span>
        ) : null}
        <Heading className="font-heading text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-wider uppercase">
          {title}
        </Heading>
      </div>
    </div>
  );
}
