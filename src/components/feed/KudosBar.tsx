import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { services } from '@/services';
import { useTheme } from '@/theme';

type Props = {
  drinkLogId: string;
  onOpenComments: () => void;
};

export function KudosBar({ drinkLogId, onOpenComments }: Props) {
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const { session } = useAuth();
  const [kudosUserIds, setKudosUserIds] = useState<string[]>([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    services.drinkLogs.listKudos(drinkLogId).then(setKudosUserIds);
    services.drinkLogs.listComments(drinkLogId).then((c) => setCommentsCount(c.length));
  }, [drinkLogId]);

  const userId = session?.user.id;
  const given = !!userId && kudosUserIds.includes(userId);

  const toggleKudos = async () => {
    if (!userId || pending) return;
    setPending(true);
    const next = given ? kudosUserIds.filter((id) => id !== userId) : [...kudosUserIds, userId];
    setKudosUserIds(next);
    try {
      if (given) await services.drinkLogs.removeKudos(drinkLogId, userId);
      else await services.drinkLogs.addKudos(drinkLogId, userId);
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={[styles.row, { gap: spacing.lg, marginTop: spacing.sm }]}>
      <Pressable onPress={toggleKudos} style={styles.row} hitSlop={12}>
        <MaterialCommunityIcons
          name={given ? 'thumb-up' : 'thumb-up-outline'}
          size={18}
          color={given ? colors.accentText : colors.textSecondary}
        />
        <Text style={[typography.caption, { color: given ? colors.accentText : colors.textSecondary, marginLeft: 6 }]}>
          {kudosUserIds.length > 0 ? kudosUserIds.length : t('feed.kudosLabel')}
        </Text>
      </Pressable>
      <Pressable onPress={onOpenComments} style={styles.row} hitSlop={12}>
        <MaterialCommunityIcons name="comment-outline" size={18} color={colors.textSecondary} />
        <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 6 }]}>
          {commentsCount > 0 ? commentsCount : t('feed.commentLabel')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
