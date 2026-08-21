import { Modal, Pressable, Text, View } from 'react-native';

import { useTheme } from '@/theme';

import { Button } from './Button';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// Custom in-app dialog instead of window.confirm()/Alert.alert(): Alert.alert has no
// visual implementation on web, and window.confirm is unreliable there too — many
// browser/webview contexts silently auto-dismiss it (no dialog, no error, the action
// just never happens), which made "Terminar fiesta" and "Salir de la fiesta" look
// broken with zero feedback. This works the same way on every platform.
export function ConfirmDialog({ visible, title, message, confirmLabel, cancelLabel = 'Cancelar', destructive, onConfirm, onCancel }: Props) {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <Pressable
        onPress={onCancel}
        style={{ flex: 1, backgroundColor: '#00000088', alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 360, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm }}
        >
          <Text style={[typography.h3, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginBottom: spacing.sm }]}>{message}</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button label={cancelLabel} onPress={onCancel} variant="secondary" style={{ flex: 1 }} />
            <Button label={confirmLabel} onPress={onConfirm} variant={destructive ? 'danger' : 'primary'} style={{ flex: 1 }} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
