import type { Access } from 'payload';

/**
 * Public reads see only published documents.
 * Authenticated users (admins) see drafts too — required for live preview.
 */
export const publishedOnly: Access = ({ req: { user } }) => {
  if (user) return true;
  return {
    _status: { equals: 'published' },
  };
};
