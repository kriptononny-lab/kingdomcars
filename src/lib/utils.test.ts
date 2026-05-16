import { describe, expect, it } from 'vitest';

import { cn, escapeHtml, formatDate, formatNumber } from './utils';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('deduplicates conflicting tailwind utilities (last wins)', () => {
    expect(cn('px-2 text-sm', 'px-4')).toBe('text-sm px-4');
  });

  it('returns empty string when called without args', () => {
    expect(cn()).toBe('');
  });
});

describe('escapeHtml', () => {
  it('escapes the four chars Telegram HTML mode cares about', () => {
    expect(escapeHtml('<>&"')).toBe('&lt;&gt;&amp;&quot;');
  });

  it('escapes & first to avoid double-escaping', () => {
    expect(escapeHtml('&amp;')).toBe('&amp;amp;');
  });

  it('leaves plain text untouched', () => {
    expect(escapeHtml('hello world 123')).toBe('hello world 123');
  });

  it('handles empty input', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('escapes nested script tags', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;',
    );
  });
});

describe('formatNumber', () => {
  it('formats English thousands with comma', () => {
    expect(formatNumber(3200, 'en')).toBe('3,200');
  });

  it('returns a string for all locales', () => {
    // Polish grouping requires full-icu, which Node ships only on some builds.
    // Just assert it doesn't crash and yields a non-empty string.
    expect(typeof formatNumber(3200, 'pl')).toBe('string');
    expect(formatNumber(3200, 'pl')).not.toBe('');
    expect(formatNumber(3200, 'ru')).not.toBe('');
  });
});

describe('formatDate', () => {
  it('formats with medium date style by default', () => {
    expect(formatDate(new Date('2026-05-14T12:00:00Z'), 'en')).toMatch(/2026/);
  });

  it('accepts ISO string input', () => {
    expect(formatDate('2026-05-14T00:00:00Z', 'en')).toMatch(/2026/);
  });

  it('accepts numeric timestamp input', () => {
    expect(formatDate(Date.UTC(2026, 4, 14), 'en')).toMatch(/2026/);
  });

  it('honours custom options', () => {
    expect(formatDate(new Date('2026-05-14T12:00:00Z'), 'en', { year: 'numeric' })).toBe('2026');
  });
});
