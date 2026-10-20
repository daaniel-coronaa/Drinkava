import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { FriendToggle } from '@/components/friends/FriendToggle';
import { Avatar } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/theme';
import type { User } from '@/types';

type Props = {
  user: User;
  isFriend: boolean;
  onToggle: () => void;
};

// A person in the friends search: tap the row for their profile, tap the pill to add —
// or, when already friends, to undo it.
export function FriendRow({ user, isFriend, onToggle }: Props) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.row, { paddingHorizontal: spacing.inset, paddingVertical: spacing.sm, gap: spacing.sm }]}>
      <PressableScale
        scaleTo={0.985}
        onPress={() => router.push(`/(tabs)/profile/${user.id}`)}
        style={[styles.row, { flex: 1, gap: spacing.sm }]}
      >
        <Avatar uri={user.avatarUrl} name={user.name} size={44} />
        <Text style={[typography.bodyBold, { color: colors.textPrimary, flex: 1 }]} numberOfLines={1}>
          {user.name}
        </Text>
      </PressableScale>
      <FriendToggle isFriend={isFriend} onToggle={onToggle} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
