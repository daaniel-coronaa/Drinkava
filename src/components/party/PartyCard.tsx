import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PartyStatusBadge } from '@/components/party/PartyStatusBadge';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme';
import type { Party } from '@/types';
import { formatDateTime } from '@/utils/date';

export function PartyCard({ party }: { party: Party }) {
  const { colors, spacing, typography } = useTheme();

  return (
    <Pressable onPress={() => router.push(`/(tabs)/parties/${party.id}`)}>
      <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.sm, padding: 0, overflow: 'hidden' }}>
        {party.coverImageUrl ? (
          <Image source={{ uri: party.coverImageUrl }} style={{ width: '100%', height: 120 }} contentFit="cover" />
        ) : null}
        <View style={{ padding: spacing.md, gap: spacing.xs }}>
          <View style={styles.row}>
            <Text style={[typography.h3, { color: colors.textPrimary, flex: 1 }]}>{party.name}</Text>
            <PartyStatusBadge status={party.status} />
          </View>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>{formatDateTime(party.date)}</Text>
          {party.location ? (
            <Text style={[typography.caption, { color: colors.textSecondary }]}>{party.location}</Text>
          ) : null}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
