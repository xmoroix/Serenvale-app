// Supported locales for Serenvale
export const supportLocales = ['en-US', 'fr-FR'] as const;

export type Locales = (typeof supportLocales)[number];

// Default locale
export const defaultLocale: Locales = 'en-US';

// Locale labels for display
export const localeOptions = {
  'en-US': 'English',
  'fr-FR': 'Français',
} as const;
