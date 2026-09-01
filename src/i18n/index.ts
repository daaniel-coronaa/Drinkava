import en from './en';
import es from './es';
import type { TranslationSchema } from './en';

export type Language = 'es' | 'en';

const dictionaries: Record<Language, TranslationSchema> = { en, es };

// Builds a union of every dot-path leading to a string leaf in TranslationSchema, e.g.
// 'common.cancel' | 'auth.welcome.tagline' | ... — gives autocomplete + a compile error
// on typos instead of a silent missing-key fallback at runtime.
type Paths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : T[K] extends readonly string[] ? K : `${K}.${Paths<T[K]>}`;
}[keyof T & string];

export type TranslationKey = Paths<TranslationSchema>;

function resolve(dict: TranslationSchema, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined), dict);
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => (key in params ? String(params[key]) : match));
}

export function translate(language: Language, key: TranslationKey, params?: Record<string, string | number>): string {
  const value = resolve(dictionaries[language], key);
  if (typeof value !== 'string') return key;
  return interpolate(value, params);
}

export function monthNames(language: Language): readonly string[] {
  return dictionaries[language].common.months;
}

export function weekdayShortNames(language: Language): readonly string[] {
  return dictionaries[language].common.weekdaysShort;
}
