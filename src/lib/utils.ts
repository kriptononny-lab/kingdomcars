import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Locale } from '@/lib/constants';

/**
 * Conditionally join Tailwind classes and resolve conflicts.
 *
 * @example
 *   cn('p-2', isActive && 'bg-gold', 'p-4') // → 'bg-gold p-4'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Localised number formatter using `Intl.NumberFormat` (§3).
 *
 * @example
 *   formatNumber(3200, 'pl') // → '3 200'
 */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Localised date formatter, defaults to medium date style.
 */
const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = { dateStyle: 'medium' };

/**
 * Format a date string or Date object using the active locale's conventions.
 *
 * @param value  - ISO date string or Date object.
 * @param locale - Active locale for `Intl.DateTimeFormat`.
 * @returns Localised date string (e.g. "15 maja 2024" for pl).
 */
export function formatDate(
  date: Date | string | number,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === 'object' ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, options ?? DEFAULT_DATE_OPTIONS).format(d);
}

/**
 * Escape HTML-unsafe characters for Telegram HTML parse mode (§12).
 *
 * @see https://core.telegram.org/bots/api#html-style
 */
export function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
