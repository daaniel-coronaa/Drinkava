import { Chip } from '@/components/ui/Chip';
import { useTranslation } from '@/context/SettingsContext';
import { useTheme } from '@/theme';
import type { PartyStatus } from '@/types';

export function PartyStatusBadge({ status }: { status: PartyStatus }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  if (status === 'active') return <Chip label={t('parties.liveBadge')} color={colors.accentSuccess} />;
  return <Chip label={t('parties.finishedBadge')} />;
}
