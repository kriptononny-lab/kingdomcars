/**
 * Shared block primitives. Specific block types live as siblings of this file.
 */

export type LinkKind = 'internal' | 'external' | 'anchor';

export interface LinkValue {
  label: string;
  kind: LinkKind;
  url?: string;
  anchor?: string;
  newTab?: boolean;
  page?: { slug?: string } | string;
}

export interface BaseBlock {
  id?: string;
  blockName?: string;
}
