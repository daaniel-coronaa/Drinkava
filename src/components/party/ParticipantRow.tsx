import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Chip } from '@/components/ui/Chip';
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
  return (
    <Pressable
      onPress={() => router.push(`/(tabs)/profile/${user.id}`)}
      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm }}
    >
      <Avatar uri={user.avatarUrl} name={user.name} size={36} />
      <View style={{ flex: 1 }}>
        <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>{user.name}</Text>
        <Text style={[typography.tiny, { color: colors.textSecondary }]}>Se unió {timeAgo(joinedAt)}</Text>
      </View>
      <Chip
        label={role === 'admin' ? 'Administrador' : 'Invitado'}
        color={role === 'admin' ? colors.accentPrimary : undefined}
        tone={role === 'admin' ? 'accent' : 'neutral'}
      />
    </Pressable>
  );
}
