import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PartyCard } from '@/components/party/PartyCard';
import { AchievementBadge } from '@/components/profile/AchievementBadge';
import { EditableAvatar } from '@/components/profile/EditableAvatar';
import { ScoringTable } from '@/components/profile/ScoringTable';
import { StatTile } from '@/components/profile/StatTile';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { useAchievements } from '@/hooks/useAchievements';
import { useProfileStats } from '@/hooks/useProfileStats';
import { useTheme } from '@/theme';

export default function MyProfileScreen() {
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const { session, updateProfile } = useAuth();
  const { parties, totalDrinks, favoriteType, globalEntry } = useProfileStats(session?.user.id);
  const { definitions, unlocked } = useAchievements(session?.user.id);
  const unlockedByKey = Object.fromEntries(unlocked.map((a) => [a.achievementKey, a.unlockedAt]));

  if (!session) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: spacing.inset }}>
          <Pressable onPress={() => router.push('/settings')}>
            <MaterialCommunityIcons name="cog-outline" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        <View style={{ alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg }}>
          <EditableAvatar
            uri={session.user.avatarUrl}
            name={session.user.name}
            size={80}
            onChange={(avatarUrl) => updateProfile({ avatarUrl })}
          />
          <Text style={[typography.h2, { color: colors.textPrimary }]}>{session.user.name}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.inset, marginBottom: spacing.md }}>
          <StatTile label={t('profile.totalDrinks')} value={totalDrinks} />
          <StatTile label={t('profile.parties')} value={parties.length} />
          <StatTile label={t('profile.favorite')} value={favoriteType ? t(`drinkTypes.${favoriteType}`) : t('profile.none')} />
        </View>

        <View style={{ paddingHorizontal: spacing.inset, marginBottom: spacing.lg }}>
          <Pressable onPress={() => router.push('/leaderboard')}>
            <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.sm,
                }}
              >
                <MaterialCommunityIcons name="trophy" size={22} color={colors.textPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>{t('profile.rankingTitle')}</Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {globalEntry
                    ? t('profile.rankingSubtitleWithRank', { rank: globalEntry.rank, score: globalEntry.score })
                    : t('profile.rankingSubtitleEmpty')}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </Card>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: spacing.inset, marginBottom: spacing.lg }}>
          <ScoringTable />
        </View>

        <View style={{ paddingHorizontal: spacing.inset, marginBottom: spacing.sm }}>
          <Pressable onPress={() => router.push('/achievements')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[typography.h3, { color: colors.textPrimary, flex: 1 }]}>{t('profile.achievementsTitle')}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.sm }}>
          {definitions.map((d) => (
            <AchievementBadge key={d.key} definition={d} unlockedAt={unlockedByKey[d.key]} />
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: spacing.inset, marginTop: spacing.lg, marginBottom: spacing.sm }}>
          <Text style={[typography.h3, { color: colors.textPrimary }]}>{t('profile.partyHistoryTitle')}</Text>
        </View>
        {parties.map((p) => (
          <PartyCard key={p.id} party={p} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
