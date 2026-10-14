import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Chip } from '@/components/ui/Chip';
import { useTranslation } from '@/context/SettingsContext';
import { useTheme } from '@/theme';
import type { PartyMemberRole, User } from '@/types';
import { timeAgo } from '@/utils/date';

type Props = {
  user: User;
  joinedAt: string;
  role: PartyMemberRole;
};

export function ParticipantRow({ user, joinedAt, role }: Props) {
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={() => router.push(`/(tabs)/profile/${user.id}`)}
      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.inset, paddingVertical: spacing.sm, gap: spacing.sm }}
    >
      <Avatar uri={user.avatarUrl} name={user.name} size={36} />
      <View style={{ flex: 1 }}>
        <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>{user.name}</Text>
        <Text style={[typography.tiny, { color: colors.textSecondary }]}>{t('partyDetail.joinedAgo', { time: timeAgo(joinedAt) })}</Text>
      </View>
      <Chip
        label={role === 'admin' ? t('partyDetail.roleAdmin') : t('partyDetail.roleGuest')}
        color={role === 'admin' ? colors.textPrimary : undefined}
        tone={role === 'admin' ? 'accent' : 'neutral'}
      />
    </Pressable>
  );
}
