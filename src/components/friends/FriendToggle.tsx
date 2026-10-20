import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { useTranslation } from '@/context/SettingsContext';
import { useTheme } from '@/theme';

type Props = {
  isFriend: boolean;
  onToggle: () => void;
};

// The add/undo pill: filled accent "Agregar" → outlined "✓ Amigos" (tap again to undo).
export function FriendToggle({ isFriend, onToggle }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation();

  return (
    <PressableScale
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ selected: isFriend }}
      style={[
        styles.pill,
        isFriend ? { borderColor: colors.borderStrong, borderWidth: 1 } : { backgroundColor: colors.accentPrimary },
      ]}
    >
      {isFriend ? <MaterialCommunityIcons name="check" size={16} color={colors.accentText} /> : null}
      <Text style={[typography.bodyBold, { fontSize: 14, color: isFriend ? colors.textPrimary : colors.onAccent }]}>
        {isFriend ? t('friends.friendsBadge') : t('friends.addButton')}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  pill: { minHeight: 44, minWidth: 96, paddingHorizontal: 16, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
});
