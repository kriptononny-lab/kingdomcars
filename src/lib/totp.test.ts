import { authenticator } from 'otplib';
import { describe, expect, it } from 'vitest';

import { buildOtpAuthUrl, generateTotpSecret, verifyTotp } from './totp';

describe('generateTotpSecret', () => {
  it('returns a base32 secret', () => {
    const s = generateTotpSecret();
    expect(s).toMatch(/^[A-Z2-7]+=*$/);
    expect(s.length).toBeGreaterThanOrEqual(16);
  });

  it('produces fresh values across calls', () => {
    const a = generateTotpSecret();
    const b = generateTotpSecret();
    expect(a).not.toEqual(b);
  });
});

describe('buildOtpAuthUrl', () => {
  it('embeds label, issuer and secret', () => {
    const url = buildOtpAuthUrl('user@example.com', 'JBSWY3DPEHPK3PXP');
    expect(url).toContain('otpauth://totp/');
    expect(url).toContain('KingdomCars');
    expect(url).toContain('JBSWY3DPEHPK3PXP');
    expect(url).toContain('user');
  });
});

describe('verifyTotp', () => {
  const SECRET = 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';

  it('accepts a freshly generated token', () => {
    const token = authenticator.generate(SECRET);
    expect(verifyTotp(SECRET, token)).toBe(true);
  });

  it('rejects token from a different secret', () => {
    const token = authenticator.generate(SECRET);
    expect(verifyTotp('NBSWY3DPEHPK3PXPNBSWY3DPEHPK3PXP', token)).toBe(false);
  });

  it('rejects non-numeric token', () => {
    expect(verifyTotp(SECRET, 'abc123')).toBe(false);
  });

  it('rejects too-short token', () => {
    expect(verifyTotp(SECRET, '12345')).toBe(false);
  });

  it('rejects too-long token', () => {
    expect(verifyTotp(SECRET, '1234567')).toBe(false);
  });

  it('rejects empty token', () => {
    expect(verifyTotp(SECRET, '')).toBe(false);
  });

  it('rejects too-short secret', () => {
    expect(verifyTotp('SHORT', '123456')).toBe(false);
  });

  it('rejects empty secret', () => {
    expect(verifyTotp('', '123456')).toBe(false);
  });

  it('returns false on malformed secret instead of throwing', () => {
    expect(verifyTotp('!!!!!!!!!!!!!!!!!!!!', '123456')).toBe(false);
  });
});
