import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAuth } from '@/context/AuthContext';
import { mockDb } from '@/services';
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
  const { session, signOut, updateProfile } = useAuth();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [savingSubscription, setSavingSubscription] = useState(false);
  const [resetConfirmVisible, setResetConfirmVisible] = useState(false);

  useEffect(() => {
    setHasActiveSubscription(!!session?.user.hasActiveSubscription);
  }, [session?.user.hasActiveSubscription]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  const resetLocalData = async () => {
    await mockDb.reset();
    // mockDb.reset() only clears the underlying storage — signOut() is what actually
    // updates AuthContext's in-memory session, which nothing else here would refresh.
    await signOut();
    router.replace('/');
  };

  const handleResetData = () => setResetConfirmVisible(true);

  const confirmResetData = () => {
    setResetConfirmVisible(false);
    resetLocalData();
  };

  const toggleSubscription = async (value: boolean) => {
    if (!session) return;
    setSavingSubscription(true);
    setHasActiveSubscription(value);
    try {
      await updateProfile({ hasActiveSubscription: value });
    } finally {
      setSavingSubscription(false);
    }
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="crown-outline" size={20} color={colors.textPrimary} style={{ marginRight: spacing.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={[typography.body, { color: colors.textPrimary }]}>Suscripción activa</Text>
              <Text style={[typography.tiny, { color: colors.textSecondary }]}>
                Prueba: desbloquea retos “social premium” en tus fiestas.
              </Text>
            </View>
            <Switch value={hasActiveSubscription} onValueChange={toggleSubscription} disabled={savingSubscription} />
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

        <Pressable onPress={handleResetData} style={{ alignItems: 'center', paddingVertical: spacing.sm }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>Restablecer datos de la app</Text>
        </Pressable>
      </View>

      <ConfirmDialog
        visible={resetConfirmVisible}
        title="Restablecer datos de la app"
        message="Esto borra todas las fiestas, bebidas y cuentas creadas en este dispositivo (incluida la tuya) y regresa la app a sus datos de ejemplo. No se puede deshacer."
        confirmLabel="Restablecer"
        destructive
        onConfirm={confirmResetData}
        onCancel={() => setResetConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
