import { differenceInYears, formatDistanceToNowStrict, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const timeAgo = (iso: string) => formatDistanceToNowStrict(parseISO(iso), { addSuffix: true, locale: es });

export const formatDate = (iso: string, pattern = 'd MMM yyyy') => format(parseISO(iso), pattern, { locale: es });

export const formatDateTime = (iso: string) => format(parseISO(iso), "d MMM yyyy, HH:mm", { locale: es });

export const ageFromBirthDate = (iso: string) => differenceInYears(new Date(), parseISO(iso));

export const isAdult = (iso: string) => ageFromBirthDate(iso) >= 18;
