import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityRow } from '@/components/friends/ActivityRow';
import { FriendToggle } from '@/components/friends/FriendToggle';
import { PartyCard } from '@/components/party/PartyCard';
import { StatTile } from '@/components/profile/StatTile';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { useProfileStats } from '@/hooks/useProfileStats';
import { services } from '@/services';
import { useTheme } from '@/theme';
import { enter } from '@/theme/motion';
import type { User } from '@/types';
import { hapticSelect } from '@/utils/haptics';

const RECENT_LIMIT = 5;

export default function OtherUserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const { session } = useAuth();
  const myId = session?.user.id;
  const [user, setUser] = useState<User | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const { logs, parties, totalDrinks, favoriteType, globalEntry } = useProfileStats(userId);

  useEffect(() => {
    if (userId) services.users.getProfile(userId).then(setUser);
  }, [userId]);

  useEffect(() => {
    if (!myId || !userId || myId === userId) return;
    services.friends.listFriends(myId).then((list) => setIsFriend(list.some((f) => f.id === userId)));
  }, [myId, userId]);

  if (!user) return null;

  const isMe = myId === user.id;
  const partyNameById = new Map(parties.map((p) => [p.id, p.name]));
  const recent = [...logs].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)).slice(0, RECENT_LIMIT);

  const toggleFriend = async () => {
    if (!myId) return;
    hapticSelect();
    const next = !isFriend;
    setIsFriend(next);
    if (next) await services.friends.add(myId, user.id);
    else await services.friends.remove(myId, user.id);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Animated.View entering={enter(0)} style={{ alignItems: 'center', gap: spacing.xs, marginTop: spacing.lg, marginBottom: spacing.lg }}>
          <Avatar uri={user.avatarUrl} name={user.name} size={80} />
          <Text style={[typography.h2, { color: colors.textPrimary }]}>{user.name}</Text>
          {globalEntry ? (
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              {t('profile.otherUserRankLine', { rank: globalEntry.rank, score: globalEntry.score })}
            </Text>
          ) : null}
          {!isMe ? (
            <View style={{ marginTop: spacing.sm }}>
              <FriendToggle isFriend={isFriend} onToggle={toggleFriend} />
            </View>
          ) : null}
        </Animated.View>

        <Animated.View entering={enter(1)} style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.inset, marginBottom: spacing.lg }}>
          <StatTile label={t('profile.totalDrinks')} value={totalDrinks} />
          <StatTile label={t('profile.parties')} value={parties.length} />
          <StatTile label={t('profile.favorite')} value={favoriteType ? t(`drinkTypes.${favoriteType}`) : t('profile.none')} />
        </Animated.View>

        <Animated.View entering={enter(2)} style={{ marginBottom: spacing.lg }}>
          <View style={{ paddingHorizontal: spacing.inset, marginBottom: spacing.xs }}>
            <Text style={[typography.h3, { color: colors.textPrimary }]}>{t('profile.recentActivityTitle')}</Text>
          </View>
          {recent.length === 0 ? (
            <Text style={[typography.caption, { color: colors.textSecondary, paddingHorizontal: spacing.inset }]}>
              {t('profile.noActivity')}
            </Text>
          ) : (
            recent.map((log) => <ActivityRow key={log.id} log={log} partyName={partyNameById.get(log.partyId)} />)
          )}
        </Animated.View>

        <View style={{ paddingHorizontal: spacing.inset, marginBottom: spacing.sm }}>
          <Text style={[typography.h3, { color: colors.textPrimary }]}>{t('profile.partyHistoryTitle')}</Text>
        </View>
        {parties.map((p, index) => (
          <Animated.View key={p.id} entering={enter(index + 3)}>
            <PartyCard party={p} />
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
