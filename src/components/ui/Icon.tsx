import {
  Calendar,
  Check,
  Clock,
  FileText,
  MapPin,
  Shield,
  Star,
  type LucideIcon,
} from 'lucide-react';

const ICONS = {
  calendar: Calendar,
  clock: Clock,
  map: MapPin,
  check: Check,
  star: Star,
  shield: Shield,
  file: FileText,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICONS;

interface IconProps {
  name: IconKey;
  size?: number;
  className?: string;
}

/**
 * Thin type-safe wrapper over lucide-react.
 * Add new icons by extending `ICONS` and `IconKey` here, nowhere else.
 */
export function Icon({ name, size = 24, className }: IconProps) {
  const Component = ICONS[name];
  return <Component size={size} strokeWidth={2} className={className} aria-hidden="true" />;
}
