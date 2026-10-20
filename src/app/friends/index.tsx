import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ActivityRow } from '@/components/friends/ActivityRow';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { PressableScale } from '@/components/ui/PressableScale';
import { Segmented } from '@/components/ui/Segmented';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { useFriends } from '@/hooks/useFriends';
import { useTheme } from '@/theme';
import { enter } from '@/theme/motion';

type Tab = 'friends' | 'activity';

// Your friends and what they've been drinking lately. Reached from the profile.
export default function FriendsScreen() {
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const { session } = useAuth();
  const { friends, statsById, activity, loading, refetch } = useFriends(session?.user.id);
  const [tab, setTab] = useState<Tab>('friends');

  const addEmpty = (
    <PressableScale
      onPress={() => router.push('/friends/add')}
      style={[styles.addRow, { marginHorizontal: spacing.inset, marginBottom: spacing.sm, gap: spacing.sm, borderColor: colors.borderStrong }]}
    >
      <View style={[styles.addIcon, { backgroundColor: colors.accentPrimary }]}>
        <MaterialCommunityIcons name="account-plus-outline" size={22} color={colors.onAccent} />
      </View>
      <Text style={[typography.bodyBold, { color: colors.textPrimary, flex: 1 }]}>{t('friends.title')}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
    </PressableScale>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ title: t('friends.listTitle') }} />

      <View style={{ marginHorizontal: spacing.inset, marginTop: spacing.sm, marginBottom: spacing.sm }}>
        <Segmented<Tab>
          options={[
            { key: 'friends', label: t('friends.tabFriends', { count: friends.length }) },
            { key: 'activity', label: t('friends.tabActivity') },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>

      {tab === 'friends' ? (
        <FlatList
          data={friends}
          keyExtractor={(u) => u.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.accentText} />}
          ListHeaderComponent={addEmpty}
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                icon="account-multiple-outline"
                title={t('friends.noFriendsTitle')}
                description={t('friends.noFriendsDescription')}
              />
            ) : null
          }
          renderItem={({ item, index }) => {
            const stats = statsById[item.id];
            return (
              <Animated.View entering={enter(index)}>
                <PressableScale
                  scaleTo={0.985}
                  onPress={() => router.push(`/(tabs)/profile/${item.id}`)}
                  style={[styles.row, { paddingHorizontal: spacing.inset, paddingVertical: spacing.sm, gap: spacing.sm }]}
                >
                  <Avatar uri={item.avatarUrl} name={item.name} size={48} />
                  <View style={{ flex: 1 }}>
                    <Text style={[typography.bodyBold, { color: colors.textPrimary }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {stats ? (
                      <Text style={[typography.caption, { color: colors.textSecondary }]}>
                        {t('friends.statsLine', { drinks: stats.drinks, parties: stats.parties })}
                      </Text>
                    ) : null}
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
                </PressableScale>
              </Animated.View>
            );
          }}
        />
      ) : (
        <FlatList
          data={activity}
          keyExtractor={(a) => a.log.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.accentText} />}
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                icon="glass-cocktail"
                title={t('friends.noActivityTitle')}
                description={t('friends.noActivityDescription')}
              />
            ) : null
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={enter(index)}>
              <ActivityRow log={item.log} user={item.user} partyName={item.party?.name} />
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  addRow: { flexDirection: 'row', alignItems: 'center', minHeight: 64, paddingHorizontal: 12, borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, borderStyle: 'dashed' },
  addIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
