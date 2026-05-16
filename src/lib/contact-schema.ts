import { z } from 'zod';

import { LOCALES } from '@/lib/constants';

/**
 * Single source of truth for contact-form validation — used by react-hook-form
 * on the client AND by the server action / API route for re-validation.
 *
 * Phone is the only required contact channel because most leads come from
 * Russian/Polish users who prefer phone callbacks over email.
 *
 * `honeypot` is a hidden field. Real users leave it empty; bots filling every
 * field will set it — we then 200-OK without sending, so the bot thinks it
 * succeeded.
 */
export const contactSchema = z.object({
  name: z.string().min(2, 'Min 2').max(120, 'Max 120'),
  phone: z
    .string()
    .min(6, 'Min 6')
    .max(32, 'Max 32')
    .regex(/^[+\d\s()-]+$/u, 'Invalid'),
  email: z.string().email('Invalid email').max(200).optional().or(z.literal('')),
  message: z.string().max(2000).optional().or(z.literal('')),
  service: z.enum(['apartment', 'warehouse', 'trash', 'office', 'other']).optional(),
  people: z.enum(['1', '2', '3', '3+']).optional(),
  // `boolean.refine` (vs `literal(true)`) keeps the input type as `boolean`
  // so the form can mount with `false` and TypeScript stays happy without
  // `as never`. Submission still fails until the user ticks the box.
  consent: z.boolean().refine((v) => v === true, { message: 'consent' }),
  honeypot: z.string().max(0).optional().or(z.literal('')),
  locale: z.enum(LOCALES),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Default values for the form on mount. */
export const contactDefaults: Partial<ContactInput> = {
  name: '',
  phone: '',
  email: '',
  message: '',
  consent: false,
  honeypot: '',
};
