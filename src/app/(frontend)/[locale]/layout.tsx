import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { MotionProvider } from '@/components/animations/MotionProvider';
import { CtaFormProvider } from '@/components/features/CtaFormProvider';
import { Analytics } from '@/components/gdpr/Analytics';
import { CookieConsentProvider } from '@/components/gdpr/CookieConsentProvider';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipLink } from '@/components/layout/SkipLink';
import { SiteJsonLd } from '@/components/seo/SiteJsonLd';
import { routing } from '@/i18n/routing';
import { type Locale, LOCALES } from '@/lib/constants';
import { oswald, sourceSans } from '@/lib/fonts';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${oswald.variable} ${sourceSans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-surface text-text-primary antialiased">
        <SiteJsonLd locale={locale as Locale} />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <CookieConsentProvider>
            <MotionProvider>
              <SkipLink />
              <Header />
              <main id="main">{children}</main>
              <Footer />
              <CtaFormProvider />
            </MotionProvider>
            <Analytics />
          </CookieConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
