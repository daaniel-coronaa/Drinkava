import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FriendAvatarStack } from '@/components/friends/FriendAvatarStack';
import { PartyCard } from '@/components/party/PartyCard';
import { AchievementBadge } from '@/components/profile/AchievementBadge';
import { EditableAvatar } from '@/components/profile/EditableAvatar';
import { ScoringTable } from '@/components/profile/ScoringTable';
import { StatTile } from '@/components/profile/StatTile';
import { Card } from '@/components/ui/Card';
import { PressableScale } from '@/components/ui/PressableScale';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { useAchievements } from '@/hooks/useAchievements';
import { useFriends } from '@/hooks/useFriends';
import { useProfileStats } from '@/hooks/useProfileStats';
import { useTheme } from '@/theme';
import { enter } from '@/theme/motion';

export default function MyProfileScreen() {
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const { session, updateProfile } = useAuth();
  const { parties, totalDrinks, favoriteType, globalEntry } = useProfileStats(session?.user.id);
  const { friends } = useFriends(session?.user.id);
  const { definitions, unlocked } = useAchievements(session?.user.id);
  const unlockedByKey = Object.fromEntries(unlocked.map((a) => [a.achievementKey, a.unlockedAt]));

  if (!session) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: spacing.inset }}>
          <PressableScale onPress={() => router.push('/settings')} accessibilityLabel={t('settings.screenTitle')} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name="cog-outline" size={24} color={colors.textPrimary} />
          </PressableScale>
        </View>

        <Animated.View entering={enter(0)} style={{ alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg }}>
          <EditableAvatar
            uri={session.user.avatarUrl}
            name={session.user.name}
            size={80}
            onChange={(avatarUrl) => updateProfile({ avatarUrl })}
          />
          <Text style={[typography.h2, { color: colors.textPrimary }]}>{session.user.name}</Text>
        </Animated.View>

        <Animated.View entering={enter(1)} style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.inset, marginBottom: spacing.md }}>
          <StatTile label={t('profile.totalDrinks')} value={totalDrinks} />
          <StatTile label={t('profile.parties')} value={parties.length} />
          <StatTile label={t('profile.favorite')} value={favoriteType ? t(`drinkTypes.${favoriteType}`) : t('profile.none')} />
        </Animated.View>

        <Animated.View entering={enter(2)} style={{ paddingHorizontal: spacing.inset, marginBottom: spacing.lg }}>
          <PressableScale scaleTo={0.985} onPress={() => router.push('/leaderboard')}>
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
          </PressableScale>
        </Animated.View>

        <Animated.View entering={enter(3)} style={{ paddingHorizontal: spacing.inset, marginBottom: spacing.lg }}>
          <PressableScale scaleTo={0.985} onPress={() => router.push('/friends')}>
            <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              {friends.length > 0 ? (
                <FriendAvatarStack users={friends} />
              ) : (
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name="account-multiple-plus-outline" size={22} color={colors.textPrimary} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>{t('profile.friendsTitle')}</Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {friends.length > 0 ? t('profile.friendsCount', { count: friends.length }) : t('profile.friendsEmpty')}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </Card>
          </PressableScale>
        </Animated.View>

        <View style={{ paddingHorizontal: spacing.inset, marginBottom: spacing.lg }}>
          <ScoringTable />
        </View>

        <View style={{ paddingHorizontal: spacing.inset, marginBottom: spacing.sm }}>
          <PressableScale onPress={() => router.push('/achievements')} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 44 }}>
            <Text style={[typography.h3, { color: colors.textPrimary, flex: 1 }]}>{t('profile.achievementsTitle')}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </PressableScale>
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
