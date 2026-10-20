import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTranslation } from '@/context/SettingsContext';
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
  const { t } = useTranslation();

  return (
    <View style={[styles.row, { paddingHorizontal: spacing.inset, paddingVertical: spacing.sm, gap: spacing.sm }]}>
      <Pressable
        onPress={() => router.push(`/(tabs)/profile/${user.id}`)}
        style={[styles.row, { flex: 1, gap: spacing.sm }]}
      >
        <Avatar uri={user.avatarUrl} name={user.name} size={44} />
        <Text style={[typography.bodyBold, { color: colors.textPrimary, flex: 1 }]} numberOfLines={1}>
          {user.name}
        </Text>
      </Pressable>
      <PressableScale
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ selected: isFriend }}
        style={[
          styles.pill,
          isFriend
            ? { borderColor: colors.borderStrong, borderWidth: 1 }
            : { backgroundColor: colors.accentPrimary },
        ]}
      >
        {isFriend ? <MaterialCommunityIcons name="check" size={16} color={colors.accentText} /> : null}
        <Text style={[typography.bodyBold, { fontSize: 14, color: isFriend ? colors.textPrimary : colors.onAccent }]}>
          {isFriend ? t('friends.friendsBadge') : t('friends.addButton')}
        </Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  pill: { minHeight: 44, minWidth: 96, paddingHorizontal: 16, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
});
