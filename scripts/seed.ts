/**
 * Idempotent seed script. Run via `npm run seed` (or `make seed`).
 * Re-running is safe — every step finds existing then updates, never duplicates.
 */
import { getPayload, type Payload } from 'payload';

import { LOCALES, type Locale } from '@/lib/constants';
import { logger } from '@/lib/logger';
import config from '@/payload/payload.config';

import { homePageData } from './seed-data/home';
import { footerData, headerData } from './seed-data/navigation';
import { STATIC_SLUGS, staticPageData } from './seed-data/static-pages';

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@kingdomcars.example.com';
const DEV_DEFAULT_PASSWORD = 'ChangeMe!Now123';
const MIN_PASSWORD_LEN = 12;

/**
 * Seed data is built dynamically per locale, so it can't satisfy Payload's
 * narrow generated types at the call-site (the `Pages` shape is the union
 * of every block plus localized text fields). We rely on the integration
 * tests + the seed running successfully end-to-end as the type contract,
 * and use these tiny helpers to keep the cast contained to one place and
 * documented — §4.8 forbids `as never` scattered through call-sites.
 */
type PageSeedInput = Record<string, unknown> & { slug: string };
type GlobalSeedInput = Record<string, unknown>;

async function ensureAdmin(payload: Payload) {
  // §13 — production must supply SEED_ADMIN_PASSWORD; dev gets a loud fallback.
  const envPwd = process.env.SEED_ADMIN_PASSWORD;
  if (process.env.NODE_ENV === 'production' && (!envPwd || envPwd.length < MIN_PASSWORD_LEN)) {
    throw new Error(`SEED_ADMIN_PASSWORD must be set (≥ ${MIN_PASSWORD_LEN} chars) in production.`);
  }
  const password = envPwd && envPwd.length >= MIN_PASSWORD_LEN ? envPwd : DEV_DEFAULT_PASSWORD;
  if (!envPwd) logger.warn('SEED_ADMIN_PASSWORD unset — using dev default; NEVER use in prod.');

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: ADMIN_EMAIL } },
    limit: 1,
  });
  if (existing.docs.length > 0) {
    logger.info({ email: ADMIN_EMAIL }, 'admin already present');
    return;
  }
  await payload.create({
    collection: 'users',
    data: { email: ADMIN_EMAIL, password, name: 'KingdomCars admin', role: 'admin' },
  });
  logger.warn({ email: ADMIN_EMAIL }, 'admin created — CHANGE THE PASSWORD');
}

async function ensureSiteSettings(payload: Payload) {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      phonePrimary: '+48 506 873 074',
      phoneSecondary: '+48 532 491 876',
      email: 'inc.mars.com@gmail.com',
      address: '02-004 Warszawa, ul. Tytusa Chałubińskiego 9 lok. 2',
      hours: '24/7',
      organisationName: 'KingdomCars',
    },
  });
}

/**
 * Localized-page upsert. Pages are keyed by `slug` in PL (the default
 * locale); the same document id is then updated for every other locale.
 *
 * The data argument is typed as `Record<string, unknown> & { slug: string }`
 * — Payload's `create/update` accept this generic shape and validate at
 * runtime against the collection schema. We rely on the seed running
 * successfully end-to-end as the type contract.
 */
async function seedLocalisedPage(payload: Payload, build: (locale: Locale) => PageSeedInput) {
  const plData = build('pl');
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: plData.slug } },
    locale: 'pl',
    limit: 1,
  });
  let id: string | number;
  if (existing.docs.length === 0) {
    const created = await payload.create({
      collection: 'pages',
      data: plData,
      locale: 'pl',
    });
    id = created.id;
  } else {
    id = existing.docs[0]!.id;
    await payload.update({
      collection: 'pages',
      id,
      data: plData,
      locale: 'pl',
    });
  }
  for (const locale of LOCALES.filter((l) => l !== 'pl')) {
    await payload.update({
      collection: 'pages',
      id,
      data: build(locale),
      locale,
    });
  }
}

async function seedLocalisedGlobal(
  payload: Payload,
  slug: 'header' | 'footer',
  build: (locale: Locale) => GlobalSeedInput,
) {
  for (const locale of LOCALES) {
    await payload.updateGlobal({
      slug,
      data: build(locale),
      locale,
    });
  }
}

async function main() {
  const payload = await getPayload({ config });
  await ensureAdmin(payload);
  await ensureSiteSettings(payload);
  await seedLocalisedPage(payload, homePageData);
  for (const slug of STATIC_SLUGS) {
    await seedLocalisedPage(payload, (locale) => staticPageData(slug, locale));
  }
  await seedLocalisedGlobal(payload, 'header', headerData);
  await seedLocalisedGlobal(payload, 'footer', footerData);
  logger.info('seed complete');
  // eslint-disable-next-line unicorn/no-process-exit -- CLI script: explicit exit code required for CI gating.
  process.exit(0);
}

main().catch((error) => {
  logger.error({ err: error }, 'seed failed');
  // eslint-disable-next-line unicorn/no-process-exit -- CLI script: explicit exit code required for CI gating.
  process.exit(1);
});
