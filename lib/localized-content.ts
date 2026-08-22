export type PublicLocale = "tr" | "en";

export function isPublicLocale(value: string): value is PublicLocale {
  return value === "tr" || value === "en";
}

export function localizedValue(
  locale: string,
  turkishValue: string,
  englishValue?: string | null,
) {
  const normalizedEnglish = englishValue?.trim();
  return locale === "en" && normalizedEnglish
    ? normalizedEnglish
    : turkishValue;
}

export function localizedOptionalValue(
  locale: string,
  turkishValue?: string | null,
  englishValue?: string | null,
) {
  const normalizedEnglish = englishValue?.trim();
  if (locale === "en" && normalizedEnglish) return normalizedEnglish;
  return turkishValue?.trim() || null;
}
