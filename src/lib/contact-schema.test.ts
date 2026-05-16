import { describe, expect, it } from 'vitest';

import { contactSchema } from './contact-schema';

const valid = {
  name: 'Jan Kowalski',
  phone: '+48 500 100 200',
  consent: true as const,
  locale: 'pl' as const,
};

describe('contactSchema', () => {
  it('accepts a minimal valid payload', () => {
    const r = contactSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it('rejects too-short names', () => {
    const r = contactSchema.safeParse({ ...valid, name: 'A' });
    expect(r.success).toBe(false);
  });

  it('rejects too-long names', () => {
    const r = contactSchema.safeParse({ ...valid, name: 'A'.repeat(121) });
    expect(r.success).toBe(false);
  });

  it('rejects phones with letters', () => {
    const r = contactSchema.safeParse({ ...valid, phone: 'call me' });
    expect(r.success).toBe(false);
  });

  it('rejects phones that are too short', () => {
    const r = contactSchema.safeParse({ ...valid, phone: '+48' });
    expect(r.success).toBe(false);
  });

  it('accepts blank optional email', () => {
    const r = contactSchema.safeParse({ ...valid, email: '' });
    expect(r.success).toBe(true);
  });

  it('rejects malformed email', () => {
    const r = contactSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(r.success).toBe(false);
  });

  it('rejects when consent is false', () => {
    const r = contactSchema.safeParse({ ...valid, consent: false });
    expect(r.success).toBe(false);
  });

  it('rejects unknown service values', () => {
    const r = contactSchema.safeParse({ ...valid, service: 'rocket-launch' });
    expect(r.success).toBe(false);
  });

  it('accepts known service values', () => {
    for (const service of ['apartment', 'warehouse', 'trash', 'office', 'other'] as const) {
      expect(contactSchema.safeParse({ ...valid, service }).success).toBe(true);
    }
  });

  it('rejects unknown locale', () => {
    const r = contactSchema.safeParse({ ...valid, locale: 'fr' });
    expect(r.success).toBe(false);
  });

  it('flags honeypot when filled', () => {
    const r = contactSchema.safeParse({ ...valid, honeypot: 'i am a bot' });
    expect(r.success).toBe(false);
  });

  it('accepts empty honeypot', () => {
    const r = contactSchema.safeParse({ ...valid, honeypot: '' });
    expect(r.success).toBe(true);
  });
});
