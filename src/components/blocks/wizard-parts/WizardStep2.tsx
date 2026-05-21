'use client';

import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

type PeopleKey = '1' | '2' | '3' | '3+';

interface Props {
  selected: PeopleKey | null;
  onSelect: (key: PeopleKey) => void;
}

const KEYS: PeopleKey[] = ['1', '2', '3', '3+'];

export function WizardStep2({ selected, onSelect }: Props) {
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
          <Users size={32} />
          <span className="text-center text-sm font-medium">{t('people', { count: key })}</span>
        </button>
      ))}
    </div>
  );
}
