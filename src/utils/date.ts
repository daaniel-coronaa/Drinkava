import { differenceInYears, formatDistanceToNowStrict, format, parseISO } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

import type { Language } from '@/i18n';

// Module-level so plain (non-hook) date formatting functions stay locale-aware without
// threading `language` through every call site — SettingsContext calls this whenever
// the language changes (including on initial load).
let currentLocale = es;

export function setDateFnsLocale(language: Language) {
  currentLocale = language === 'en' ? enUS : es;
}

export const timeAgo = (iso: string) => formatDistanceToNowStrict(parseISO(iso), { addSuffix: true, locale: currentLocale });

export const formatDate = (iso: string, pattern = 'd MMM yyyy') => format(parseISO(iso), pattern, { locale: currentLocale });

export const formatDateTime = (iso: string) => format(parseISO(iso), "d MMM yyyy, HH:mm", { locale: currentLocale });

export const ageFromBirthDate = (iso: string) => differenceInYears(new Date(), parseISO(iso));

export const isAdult = (iso: string) => ageFromBirthDate(iso) >= 18;
