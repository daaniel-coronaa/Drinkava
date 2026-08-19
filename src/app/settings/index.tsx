import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useTheme, type ThemeMode } from '@/theme';

function Row({ icon, label, onPress }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; label: string; onPress: () => void }) {
  const { colors, spacing, typography } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.row, { paddingVertical: spacing.sm }]}>
      <MaterialCommunityIcons name={icon} size={20} color={colors.textPrimary} style={{ marginRight: spacing.sm }} />
      <Text style={[typography.body, { color: colors.textPrimary, flex: 1 }]}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { colors, spacing, typography, modeOverride, setModeOverride } = useTheme();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <Card>
          <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.sm }]}>Apariencia</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {(['system', 'light', 'dark'] as (ThemeMode | 'system')[]).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => setModeOverride(mode)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor: modeOverride === mode ? colors.accentPrimary : colors.surfaceElevated,
                }}
              >
                <Text
                  style={[
                    typography.caption,
                    { color: modeOverride === mode ? '#FFFFFF' : colors.textSecondary, textAlign: 'center' },
                  ]}
                >
                  {mode === 'system' ? 'Sistema' : mode === 'light' ? 'Claro' : 'Oscuro'}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card>
          <Row icon="shield-check-outline" label="Modo Seguro" onPress={() => router.push('/safe-mode')} />
          <Row icon="file-document-outline" label="Términos de servicio" onPress={() => router.push('/settings/terms')} />
          <Row icon="lock-outline" label="Privacidad" onPress={() => router.push('/settings/privacy')} />
        </Card>

        <Pressable onPress={handleSignOut} style={{ alignItems: 'center', paddingVertical: spacing.sm }}>
          <Text style={[typography.bodyBold, { color: '#E5484D' }]}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
