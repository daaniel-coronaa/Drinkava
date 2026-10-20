import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CommentSheet } from '@/components/feed/CommentSheet';
import { KudosBar } from '@/components/feed/KudosBar';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/context/SettingsContext';
import { useTheme } from '@/theme';
import type { DrinkLog, User } from '@/types';
import { timeAgo } from '@/utils/date';
import { drinkLabel, drinkTypeIcons } from '@/utils/drinkType';

type Props = {
  drinkLog: DrinkLog;
  usersById: Record<string, User>;
};

export function DrinkLogCard({ drinkLog, usersById }: Props) {
  const { colors, spacing, radius, typography } = useTheme();
  const { t } = useTranslation();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const author = usersById[drinkLog.userId];

  return (
    <Card style={{ marginHorizontal: spacing.inset, marginBottom: spacing.md }}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.push(`/(tabs)/profile/${drinkLog.userId}`)}>
          <Avatar uri={author?.avatarUrl} name={author?.name ?? '?'} size={36} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>{author?.name ?? t('feed.someone')}</Text>
          <Text style={[typography.tiny, { color: colors.textSecondary }]}>{timeAgo(drinkLog.timestamp)}</Text>
        </View>
        <View style={[styles.iconCircle, { backgroundColor: colors.border, borderRadius: radius.pill }]}>
          <MaterialCommunityIcons name={drinkTypeIcons[drinkLog.drinkType]} size={20} color={colors.textPrimary} />
        </View>
      </View>

      <Text style={[typography.body, { color: colors.textPrimary, marginTop: spacing.sm }]}>
        {drinkLog.quantity}× {drinkLabel(drinkLog.drinkType, t(`drinkTypes.${drinkLog.drinkType}`), drinkLog.customLabel)}
      </Text>

      {drinkLog.photoUrl ? (
        <Image
          source={{ uri: drinkLog.photoUrl }}
          style={{ width: '100%', height: 180, borderRadius: radius.md, marginTop: spacing.sm }}
          contentFit="cover"
        />
      ) : null}

      <KudosBar drinkLogId={drinkLog.id} onOpenComments={() => setCommentsOpen(true)} />
      <CommentSheet
        visible={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        drinkLogId={drinkLog.id}
        usersById={usersById}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});
