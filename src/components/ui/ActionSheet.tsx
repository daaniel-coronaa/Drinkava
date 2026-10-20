import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useSheetFrame } from '@/hooks/useSheetFrame';
import { useTheme } from '@/theme';

export type SheetAction = {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: () => void;
  destructive?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  actions: SheetAction[];
};

// Secondary actions live here instead of as a stack of buttons, so a screen keeps one
// obvious primary action. Rows are 56dp tall; the sheet sits on the 560dp app column.
export function ActionSheet({ visible, onClose, title, actions }: Props) {
  const { colors, spacing, radius, typography } = useTheme();
  const frame = useSheetFrame();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View
        style={[
          frame,
          {
            backgroundColor: colors.surface,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            paddingTop: spacing.md,
            paddingBottom: spacing.xl,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        <View style={[styles.grabber, { backgroundColor: colors.borderStrong }]} />
        {title ? (
          <Text style={[typography.eyebrow, { color: colors.textSecondary, paddingHorizontal: spacing.sm, marginBottom: spacing.xs }]}>{title}</Text>
        ) : null}
        {actions.map((action) => (
          <Pressable
            key={action.key}
            accessibilityRole="button"
            onPress={() => {
              onClose();
              action.onPress();
            }}
            style={({ pressed }) => [
              styles.row,
              { paddingHorizontal: spacing.sm, borderRadius: radius.md, backgroundColor: pressed ? colors.surfaceElevated : 'transparent' },
            ]}
          >
            <MaterialCommunityIcons
              name={action.icon}
              size={22}
              color={action.destructive ? colors.dangerText : colors.textPrimary}
              style={{ marginRight: spacing.md }}
            />
            <Text style={[typography.body, { color: action.destructive ? colors.dangerText : colors.textPrimary }]}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#00000066' },
  grabber: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, marginBottom: 12, opacity: 0.6 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 56 },
});
