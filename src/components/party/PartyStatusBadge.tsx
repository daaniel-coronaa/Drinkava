import { Chip } from '@/components/ui/Chip';
import { useTheme } from '@/theme';
import type { PartyStatus } from '@/types';

export function PartyStatusBadge({ status }: { status: PartyStatus }) {
  const { colors } = useTheme();
  if (status === 'active') return <Chip label="En vivo" color={colors.accentSuccess} />;
  return <Chip label="Finalizada" />;
}
