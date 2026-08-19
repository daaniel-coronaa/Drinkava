import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PartyCard } from '@/components/party/PartyCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Header } from '@/components/ui/Header';
import { useParties } from '@/hooks/useParties';
import { useTheme } from '@/theme';
import type { PartyStatus } from '@/types';

export default function PartiesScreen() {
  const { colors, spacing, radius, typography } = useTheme();
  const [filter, setFilter] = useState<PartyStatus>('active');
  const { parties, loading, refetch } = useParties(filter);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <Header
        title="Fiestas"
        right={
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Pressable onPress={() => router.push('/party/join')}>
              <MaterialCommunityIcons name="account-multiple-plus-outline" size={24} color={colors.textPrimary} />
            </Pressable>
            <Pressable onPress={() => router.push('/party/create')}>
              <MaterialCommunityIcons name="plus-circle" size={26} color={colors.accentPrimary} />
            </Pressable>
          </View>
        }
      />

      <View style={[styles.segmented, { marginHorizontal: spacing.md, marginBottom: spacing.sm, backgroundColor: colors.surfaceElevated, borderRadius: radius.md }]}>
        {(['active', 'finished'] as PartyStatus[]).map((status) => (
          <Pressable
            key={status}
            onPress={() => setFilter(status)}
            style={[
              styles.segment,
              { borderRadius: radius.sm, backgroundColor: filter === status ? colors.accentPrimary : 'transparent' },
            ]}
          >
            <Text
              style={[
                typography.bodyBold,
                { color: filter === status ? '#FFFFFF' : colors.textSecondary, textAlign: 'center' },
              ]}
            >
              {status === 'active' ? 'Activas' : 'Finalizadas'}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={parties}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.accentPrimary} />}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="party-popper"
              title={filter === 'active' ? 'No hay fiestas activas' : 'Sin fiestas finalizadas'}
              description="Crea una fiesta o únete con un código de invitación."
            />
          ) : null
        }
        renderItem={({ item }) => <PartyCard party={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  segmented: { flexDirection: 'row', padding: 4 },
  segment: { flex: 1, paddingVertical: 8 },
});
