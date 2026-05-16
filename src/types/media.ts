/**
 * Lightweight Payload Media shape, used by block renderers until
 * `payload generate:types` produces the real one.
 */

export interface MediaSize {
  url: string;
  width: number;
  height: number;
  mimeType?: string;
}

export interface Media {
  id: string;
  alt?: string;
  caption?: string;
  url: string;
  width?: number;
  height?: number;
  mimeType?: string;
  filesize?: number;
  sizes?: {
    thumbnail?: MediaSize;
    card?: MediaSize;
    og?: MediaSize;
    hero?: MediaSize;
  };
}
