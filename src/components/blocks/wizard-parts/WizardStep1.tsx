'use client';

import { Building2, Home, Trash2, Warehouse } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

type ServiceKey = 'apartment' | 'warehouse' | 'trash' | 'office';

interface Props {
  selected: ServiceKey | null;
  onSelect: (key: ServiceKey) => void;
}

const ICONS: Record<ServiceKey, React.ReactNode> = {
  apartment: <Home size={32} />,
  warehouse: <Warehouse size={32} />,
  trash: <Trash2 size={32} />,
  office: <Building2 size={32} />,
};

const KEYS: ServiceKey[] = ['apartment', 'warehouse', 'trash', 'office'];

export function WizardStep1({ selected, onSelect }: Props) {
  const t = useTranslations('wizard');
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key)}
          className={cn(
            'flex flex-col items-center gap-3 rounded-xl border-2 px-4 py-6 transition-all',
            selected === key
              ? 'border-gold bg-gold/10 text-gold'
              : 'bg-surface-card text-text-secondary hover:border-gold/50 hover:text-gold border-white/10',
          )}
        >
          {ICONS[key]}
          <span className="text-center text-sm font-medium">{t(key)}</span>
        </button>
      ))}
    </div>
  );
}
