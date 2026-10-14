import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PartyCard } from '@/components/party/PartyCard';
import { StatTile } from '@/components/profile/StatTile';
import { Avatar } from '@/components/ui/Avatar';
import { useTranslation } from '@/context/SettingsContext';
import { useProfileStats } from '@/hooks/useProfileStats';
import { services } from '@/services';
import { useTheme } from '@/theme';
import type { User } from '@/types';

export default function OtherUserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const { parties, totalDrinks, favoriteType, globalEntry } = useProfileStats(userId);

  useEffect(() => {
    if (userId) services.users.getProfile(userId).then(setUser);
  }, [userId]);

  if (!user) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={{ alignItems: 'center', gap: spacing.xs, marginTop: spacing.lg, marginBottom: spacing.lg }}>
          <Avatar uri={user.avatarUrl} name={user.name} size={80} />
          <Text style={[typography.h2, { color: colors.textPrimary }]}>{user.name}</Text>
          {globalEntry ? (
            <Text style={[typography.caption, { color: colors.accentText }]}>
              {t('profile.otherUserRankLine', { rank: globalEntry.rank, score: globalEntry.score })}
            </Text>
          ) : null}
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <StatTile label={t('profile.totalDrinks')} value={totalDrinks} />
          <StatTile label={t('profile.parties')} value={parties.length} />
          <StatTile label={t('profile.favorite')} value={favoriteType ? t(`drinkTypes.${favoriteType}`) : t('profile.none')} />
        </View>

        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.sm }}>
          <Text style={[typography.h3, { color: colors.textPrimary }]}>{t('profile.partyHistoryTitle')}</Text>
        </View>
        {parties.map((p) => (
          <PartyCard key={p.id} party={p} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
