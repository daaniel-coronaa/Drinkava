import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/theme';
import type { User } from '@/types';
import { timeAgo } from '@/utils/date';

type Props = {
  user: User;
  joinedAt: string;
  isHost?: boolean;
};

export function ParticipantRow({ user, joinedAt, isHost }: Props) {
  const { colors, spacing, typography } = useTheme();
  return (
    <Pressable
      onPress={() => router.push(`/(tabs)/profile/${user.id}`)}
      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm }}
    >
      <Avatar uri={user.avatarUrl} name={user.name} size={36} />
      <View style={{ flex: 1 }}>
        <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>
          {user.name}
          {isHost ? '  👑' : ''}
        </Text>
        <Text style={[typography.tiny, { color: colors.textSecondary }]}>Se unió {timeAgo(joinedAt)}</Text>
      </View>
    </Pressable>
  );
}
