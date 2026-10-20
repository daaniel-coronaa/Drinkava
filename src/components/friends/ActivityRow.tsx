import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTranslation } from '@/context/SettingsContext';
import { useTheme } from '@/theme';
import type { DrinkLog, User } from '@/types';
import { timeAgo } from '@/utils/date';
import { drinkLabel, drinkTypeIcons } from '@/utils/drinkType';

type Props = {
  log: DrinkLog;
  // Who logged it; omit on a profile where the person is already obvious.
  user?: User;
  partyName?: string;
};

// One logged drink in an activity list: "Camila · 3× Cerveza — en Previa · hace 5 min".
export function ActivityRow({ log, user, partyName }: Props) {
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const what = `${log.quantity}× ${drinkLabel(log.drinkType, t(`drinkTypes.${log.drinkType}`), log.customLabel)}`;
  const where = partyName ? ` · ${t('friends.inParty', { party: partyName })}` : '';

  const content = (
    <View style={[styles.row, { paddingHorizontal: spacing.inset, paddingVertical: spacing.sm, gap: spacing.sm }]}>
      {user ? <Avatar uri={user.avatarUrl} name={user.name} size={40} /> : null}
      <View style={{ flex: 1 }}>
        <Text style={[typography.bodyBold, { color: colors.textPrimary }]} numberOfLines={1}>
          {user ? user.name : what}
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]} numberOfLines={2}>
          {user ? `${what}${where}` : `${partyName ? `${t('friends.inParty', { party: partyName })} · ` : ''}${timeAgo(log.timestamp)}`}
        </Text>
        {user ? <Text style={[typography.tiny, { color: colors.textSecondary }]}>{timeAgo(log.timestamp)}</Text> : null}
      </View>
      <View style={[styles.icon, { backgroundColor: colors.border }]}>
        <MaterialCommunityIcons name={drinkTypeIcons[log.drinkType]} size={20} color={colors.textPrimary} />
      </View>
    </View>
  );

  if (!user) return content;
  return (
    <PressableScale scaleTo={0.985} onPress={() => router.push(`/(tabs)/profile/${user.id}`)}>
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
