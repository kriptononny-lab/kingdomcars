import type { Access, FieldAccess } from 'payload';

/**
 * Restrict to authenticated admin users.
 * Use as `access.read | create | update | delete` on sensitive collections (§6).
 */
export const isAdmin: Access = ({ req: { user } }) => {
  return user?.collection === 'users';
};

/**
 * Field-level variant for hiding fields from non-admins.
 */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return user?.collection === 'users';
};
