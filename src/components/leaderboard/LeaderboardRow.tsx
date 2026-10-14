import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { useTranslation } from '@/context/SettingsContext';
import { useTheme } from '@/theme';
import type { LeaderboardEntry, User } from '@/types';

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

type Props = {
  entry: LeaderboardEntry;
  user?: User;
  onPress: () => void;
};

export function LeaderboardRow({ entry, user, onPress }: Props) {
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.inset, paddingVertical: spacing.sm, gap: spacing.sm }}
    >
      <Text style={[typography.bodyBold, { width: 32, color: colors.textSecondary }]}>
        {MEDALS[entry.rank] ?? `#${entry.rank}`}
      </Text>
      <Avatar uri={user?.avatarUrl} name={user?.name ?? '?'} size={36} />
      <View style={{ flex: 1 }}>
        <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>{user?.name ?? t('feed.someone')}</Text>
        <Text style={[typography.tiny, { color: colors.textSecondary }]}>
          {t('leaderboard.statsLine', { drinks: entry.drinkCount, variety: entry.uniqueTypes, kudos: entry.kudosReceived })}
        </Text>
      </View>
      <Text style={[typography.h3, { color: colors.textPrimary }]}>{entry.score}</Text>
    </Pressable>
  );
}
