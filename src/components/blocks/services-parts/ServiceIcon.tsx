import { Apartment } from '@/components/blocks/services-parts/Apartment';
import { Office } from '@/components/blocks/services-parts/Office';
import { Trash } from '@/components/blocks/services-parts/Trash';
import { Warehouse } from '@/components/blocks/services-parts/Warehouse';

type ServiceIconKey = 'apartment' | 'warehouse' | 'trash' | 'office';

interface Props {
  kind: ServiceIconKey;
}

/**
 * Decorative SVG illustration for a service card. `aria-hidden` — the card
 * title carries the semantic meaning.
 *
 * Each variant lives in its own sibling file (Apartment, Warehouse, Trash,
 * Office) so this component stays a thin switch.
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
