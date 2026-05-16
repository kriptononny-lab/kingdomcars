/**
 * GDPR consent shape per §14 of the architecture spec.
 *
 * `necessary` is always `true` and cannot be disabled — strictly-necessary
 * cookies (session, anti-CSRF, consent itself) are exempt from prior
 * consent under ePrivacy Directive 5(3).
 *
 * Other categories default to `false` until the visitor explicitly opts in.
 */
export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export const REJECT_ALL: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export const ACCEPT_ALL: ConsentState = {
  necessary: true,
  analytics: true,
  marketing: true,
};
