import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PartyCard } from '@/components/party/PartyCard';
import { AchievementBadge } from '@/components/profile/AchievementBadge';
import { ScoringTable } from '@/components/profile/ScoringTable';
import { StatTile } from '@/components/profile/StatTile';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useAchievements } from '@/hooks/useAchievements';
import { useProfileStats } from '@/hooks/useProfileStats';
import { useTheme } from '@/theme';

export default function MyProfileScreen() {
  const { colors, spacing, typography } = useTheme();
  const { session } = useAuth();
  const { parties, totalDrinks, favoriteType, globalEntry } = useProfileStats(session?.user.id);
  const { definitions, unlocked } = useAchievements(session?.user.id);
  const unlockedByKey = Object.fromEntries(unlocked.map((a) => [a.achievementKey, a.unlockedAt]));

  if (!session) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: spacing.md }}>
          <Pressable onPress={() => router.push('/settings')}>
            <MaterialCommunityIcons name="cog-outline" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        <View style={{ alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg }}>
          <Avatar uri={session.user.avatarUrl} name={session.user.name} size={80} />
          <Text style={[typography.h2, { color: colors.textPrimary }]}>{session.user.name}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.md }}>
          <StatTile label="Bebidas totales" value={totalDrinks} />
          <StatTile label="Fiestas" value={parties.length} />
          <StatTile label="Favorito" value={favoriteType ?? '—'} />
        </View>

        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <Pressable onPress={() => router.push('/leaderboard')}>
            <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.accentPrimaryMuted,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.sm,
                }}
              >
                <MaterialCommunityIcons name="trophy" size={22} color={colors.accentPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>Ranking</Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {globalEntry ? `#${globalEntry.rank} de tu grupo · ${globalEntry.score} pts` : 'Ver ranking del grupo'}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </Card>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <ScoringTable />
        </View>

        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.sm }}>
          <Pressable onPress={() => router.push('/achievements')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[typography.h3, { color: colors.textPrimary, flex: 1 }]}>Logros</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.sm }}>
          {definitions.map((d) => (
            <AchievementBadge key={d.key} definition={d} unlockedAt={unlockedByKey[d.key]} />
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm }}>
          <Text style={[typography.h3, { color: colors.textPrimary }]}>Historial de fiestas</Text>
        </View>
        {parties.map((p) => (
          <PartyCard key={p.id} party={p} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
