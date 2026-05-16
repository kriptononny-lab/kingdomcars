import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from '@/i18n/routing';

/**
 * Resolves the active locale per request and loads the matching messages
 * bundle. Falls back to `defaultLocale` for unknown or missing values.
 *
 * Called once per RSC tree by next-intl; the result is cached for the request.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
