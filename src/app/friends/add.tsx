import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { FriendRow } from '@/components/friends/FriendRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { services } from '@/services';
import { useTheme } from '@/theme';
import { enter } from '@/theme/motion';
import type { User } from '@/types';
import { hapticSelect } from '@/utils/haptics';

// Search people by name and add them as friends. With an empty search it shows your
// current friends, so the same screen doubles as the friends list.
export default function AddFriendsScreen() {
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const { session } = useAuth();
  const userId = session?.user.id;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const latest = useRef(0);

  const loadFriends = useCallback(async () => {
    if (!userId) return;
    setFriends(await services.friends.listFriends(userId));
  }, [userId]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  // Search as you type; the counter drops answers that arrive after a newer keystroke.
  useEffect(() => {
    const id = ++latest.current;
    if (!userId || !query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      const found = await services.friends.search(userId, query);
      if (id === latest.current) {
        setResults(found);
        setSearching(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query, userId]);

  const friendIds = new Set(friends.map((f) => f.id));

  const toggle = async (user: User) => {
    if (!userId) return;
    hapticSelect();
    if (friendIds.has(user.id)) {
      setFriends((prev) => prev.filter((f) => f.id !== user.id));
      await services.friends.remove(userId, user.id);
    } else {
      setFriends((prev) => [...prev, user]);
      await services.friends.add(userId, user.id);
    }
  };

  const searchActive = query.trim().length > 0;
  const data = searchActive ? results : friends;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing.inset, paddingBottom: spacing.sm }}>
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder={t('friends.searchPlaceholder')}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel={t('friends.searchPlaceholder')}
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(u) => u.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          data.length > 0 ? (
            <Text
              style={[
                typography.eyebrow,
                { color: colors.textSecondary, paddingHorizontal: spacing.inset, paddingBottom: spacing.xs },
              ]}
            >
              {searchActive ? t('friends.resultsTitle') : t('friends.yourFriends')}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          searching ? null : searchActive ? (
            <EmptyState
              icon="account-search-outline"
              title={t('friends.noResultsTitle')}
              description={t('friends.noResultsDescription')}
            />
          ) : (
            <EmptyState
              icon="account-multiple-outline"
              title={t('friends.noFriendsTitle')}
              description={t('friends.noFriendsDescription')}
            />
          )
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={enter(index)}>
            <FriendRow user={item} isFriend={friendIds.has(item.id)} onToggle={() => toggle(item)} />
          </Animated.View>
        )}
      />
    </View>
  );
}
