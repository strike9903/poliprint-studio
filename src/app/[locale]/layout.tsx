import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { WebVitalsTracker } from '@/components/analytics/WebVitalsTracker';

export function generateStaticParams() {
  return [{ locale: 'uk' }, { locale: 'ru' }];
}

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  
  return {
    title: t('heroTitle'),
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!['uk', 'ru'].includes(locale)) notFound();

  let messages;
  try {
    messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <WebVitalsTracker 
        debug={process.env.NODE_ENV === 'development'}
        trackResources={true}
        trackLongTasks={true}
      />
      {children}
    </NextIntlClientProvider>
  );
}