import type { Access } from 'payload';

/**
 * Allow access to anyone, authenticated or not.
 * Use for public-facing read operations.
 */
export const anyone: Access = () => true;
