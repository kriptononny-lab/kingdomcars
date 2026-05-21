import type { CollectionConfig } from 'payload';

import { isAdmin, isAdminFieldLevel } from '@/payload/access/is-admin';
import { beforeLoginCheck } from '@/payload/hooks/check-mfa';

/**
 * Admin users for the Payload CMS. 2FA (§13) implemented as two fields:
 *   • `mfaEnabled` — flips to `true` after the user verifies a TOTP token
 *     against their stored secret (see /api/admin/mfa/verify).
 *   • `mfaSecret`  — base32 string from `otplib`. NEVER readable via the API
 *     (field-access `read: () => false`); only the server-side login hook
 *     reads it directly via `payload.find({ overrideAccess: true })`.
 *
 * Login rate-limit (5 / 15min / IP) lives in `beforeLoginCheck`; Payload's
 * built-in `maxLoginAttempts` is the second layer (account-level lockout).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'mfaEnabled', 'updatedAt'],
    group: 'Admin',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    maxLoginAttempts: 5,
    lockTime: 60 * 60 * 1000,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  hooks: {
    beforeLogin: [beforeLoginCheck],
  },
  access: {
    // §6: users are created exclusively via the seed script (which uses
    // `overrideAccess: true`) — never through the admin UI or the REST API.
    // This denies HTTP create attempts even from logged-in admins; if a new
    // user is needed, re-run `make seed` with the SEED_ADMIN_* envs.
    create: () => false,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      required: true,
    },
    {
      name: 'mfaEnabled',
      type: 'checkbox',
      defaultValue: false,
      admin: { readOnly: true, description: 'Set via /api/admin/mfa/verify.' },
      access: { update: () => false },
    },
    {
      name: 'mfaSecret',
      type: 'text',
      admin: { hidden: true },
      access: {
        // Owner can write during setup; nobody can read via API.
        read: () => false,
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
  ],
};
