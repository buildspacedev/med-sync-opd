import i18n from "@/i18n";

const LOCALE_KEY = "med_sync_locale";

export function getUserLocale(): string {
  return localStorage.getItem(LOCALE_KEY) || "en";
}

export async function setUserLocale(locale: string): Promise<void> {
  localStorage.setItem(LOCALE_KEY, locale);
  await i18n.changeLanguage(locale);
}
