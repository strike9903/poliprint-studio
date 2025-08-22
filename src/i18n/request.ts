import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // If locale is not provided, default to 'uk'
  if (!locale || !['uk', 'ru'].includes(locale)) {
    locale = 'uk';
  }

  let messages;
  
  try {
    messages = (await import(`../i18n/messages/${locale}.json`)).default;
  } catch (error) {
    // Fallback to Ukrainian if locale file not found
    messages = (await import(`../i18n/messages/uk.json`)).default;
    locale = 'uk';
  }

  return {
    locale,
    messages
  };
});