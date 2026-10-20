import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PartyCard } from '@/components/party/PartyCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Header } from '@/components/ui/Header';
import { PressableScale } from '@/components/ui/PressableScale';
import { Segmented } from '@/components/ui/Segmented';
import { useTranslation } from '@/context/SettingsContext';
import { useParties } from '@/hooks/useParties';
import { useTheme } from '@/theme';
import { enter } from '@/theme/motion';
import type { PartyStatus } from '@/types';

export default function PartiesScreen() {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<PartyStatus>('active');
  const { parties, loading, refetch } = useParties(filter);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <Header
        title={t('parties.headerTitle')}
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <PressableScale
              onPress={() => router.push('/party/join')}
              accessibilityLabel={t('parties.join.title')}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons name="account-multiple-plus-outline" size={24} color={colors.textPrimary} />
            </PressableScale>
            <PressableScale
              onPress={() => router.push('/party/create')}
              accessibilityLabel={t('parties.create.title')}
              style={[styles.iconButton, { backgroundColor: colors.accentPrimary }]}
            >
              <MaterialCommunityIcons name="plus" size={24} color={colors.onAccent} />
            </PressableScale>
          </View>
        }
      />

      <View style={{ marginHorizontal: spacing.inset, marginBottom: spacing.sm }}>
        <Segmented<PartyStatus>
          options={[
            { key: 'active', label: t('parties.filterActive') },
            { key: 'finished', label: t('parties.filterFinished') },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </View>

      <FlatList
        data={parties}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.accentText} />}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="party-popper"
              title={filter === 'active' ? t('parties.emptyActiveTitle') : t('parties.emptyFinishedTitle')}
              description={t('parties.emptyDescription')}
            />
          ) : null
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={enter(index)}>
            <PartyCard party={item} />
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
