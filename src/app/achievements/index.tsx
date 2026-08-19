import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AchievementBadge } from '@/components/profile/AchievementBadge';
import { useAuth } from '@/context/AuthContext';
import { useAchievements } from '@/hooks/useAchievements';
import { useTheme } from '@/theme';

export default function AchievementsScreen() {
  const { colors, spacing } = useTheme();
  const { session } = useAuth();
  const { definitions, unlocked } = useAchievements(session?.user.id);
  const unlockedByKey = Object.fromEntries(unlocked.map((a) => [a.achievementKey, a.unlockedAt]));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <FlatList
        data={definitions}
        keyExtractor={(d) => d.key}
        numColumns={2}
        contentContainerStyle={{ padding: spacing.sm }}
        columnWrapperStyle={{ justifyContent: 'center' }}
        renderItem={({ item }) => <AchievementBadge definition={item} unlockedAt={unlockedByKey[item.key]} />}
      />
    </SafeAreaView>
  );
}
