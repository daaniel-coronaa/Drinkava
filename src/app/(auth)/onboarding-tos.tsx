import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/theme';

export default function OnboardingTosScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const { acceptTerms } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      await acceptTerms();
      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>Antes de entrar a la fiesta</Text>

        <View
          style={{
            backgroundColor: `${colors.accentWarning}1A`,
            borderRadius: radius.md,
            padding: spacing.md,
            gap: spacing.xs,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.accentWarning} />
            <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>Bebe con responsabilidad</Text>
          </View>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            Drinkava es una app social para compartir momentos con amigos, no una competencia de consumo. El ranking
            premia variedad, asistencia y kudos — no solo cuánto tomas.
          </Text>
        </View>

        <Text style={[typography.body, { color: colors.textSecondary }]}>
          Al continuar aceptas nuestros Términos de Servicio y Política de Privacidad, y confirmas que eres mayor de
          edad en tu país de residencia. Drinkava no promueve el consumo excesivo de alcohol.
        </Text>

        <Pressable
          onPress={() => setAccepted((v) => !v)}
          style={[styles.checkboxRow, { gap: spacing.sm }]}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: accepted ? colors.accentPrimary : colors.border,
                backgroundColor: accepted ? colors.accentPrimary : 'transparent',
                borderRadius: radius.sm,
              },
            ]}
          >
            {accepted ? <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" /> : null}
          </View>
          <Text style={[typography.body, { color: colors.textPrimary, flex: 1 }]}>
            Soy mayor de 18 años y acepto los Términos de Servicio, la Política de Privacidad y el compromiso de
            consumo responsable.
          </Text>
        </Pressable>
      </ScrollView>

      <View style={{ padding: spacing.lg }}>
        <Button label="Aceptar y continuar" onPress={handleContinue} loading={loading} disabled={!accepted} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start' },
  checkbox: { width: 24, height: 24, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
