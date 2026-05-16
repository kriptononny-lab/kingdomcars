import { describe, expect, it } from 'vitest';

import { buildContentSecurityPolicy, staticSecurityHeaders } from './security-headers';

describe('buildContentSecurityPolicy', () => {
  const nonce = 'abc123base64==';

  it('includes the nonce in script-src', () => {
    const csp = buildContentSecurityPolicy(nonce);
    expect(csp).toContain(`'nonce-${nonce}'`);
    expect(csp).toContain('script-src');
  });

  it("includes 'strict-dynamic' for transitively loaded scripts", () => {
    expect(buildContentSecurityPolicy(nonce)).toContain("'strict-dynamic'");
  });

  it("anchors default-src to 'self'", () => {
    expect(buildContentSecurityPolicy(nonce)).toContain("default-src 'self'");
  });

  it("blocks framing via frame-ancestors 'none'", () => {
    expect(buildContentSecurityPolicy(nonce)).toContain("frame-ancestors 'none'");
  });

  it("blocks objects via object-src 'none'", () => {
    expect(buildContentSecurityPolicy(nonce)).toContain("object-src 'none'");
  });

  it('includes upgrade-insecure-requests directive', () => {
    expect(buildContentSecurityPolicy(nonce)).toContain('upgrade-insecure-requests');
  });

  it('joins directives with semicolons', () => {
    const csp = buildContentSecurityPolicy(nonce);
    expect(csp.split(';').length).toBeGreaterThan(5);
  });
});

describe('staticSecurityHeaders', () => {
  it('declares HSTS with 2-year max-age and preload', () => {
    const hsts = staticSecurityHeaders.find((h) => h.key === 'Strict-Transport-Security');
    expect(hsts?.value).toContain('max-age=63072000');
    expect(hsts?.value).toContain('includeSubDomains');
    expect(hsts?.value).toContain('preload');
  });

  it('denies framing via X-Frame-Options', () => {
    const xfo = staticSecurityHeaders.find((h) => h.key === 'X-Frame-Options');
    expect(xfo?.value).toBe('DENY');
  });

  it('disables MIME-sniffing', () => {
    const xcto = staticSecurityHeaders.find((h) => h.key === 'X-Content-Type-Options');
    expect(xcto?.value).toBe('nosniff');
  });

  it('denies camera / microphone / geolocation by default', () => {
    const pp = staticSecurityHeaders.find((h) => h.key === 'Permissions-Policy');
    expect(pp?.value).toContain('camera=()');
    expect(pp?.value).toContain('microphone=()');
    expect(pp?.value).toContain('geolocation=()');
  });

  it('uses strict-origin-when-cross-origin referrer policy', () => {
    const rp = staticSecurityHeaders.find((h) => h.key === 'Referrer-Policy');
    expect(rp?.value).toBe('strict-origin-when-cross-origin');
  });
});
