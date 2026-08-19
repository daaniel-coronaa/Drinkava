import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/theme';

export default function WelcomeScreen() {
  const { colors, spacing, typography } = useTheme();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [pending, setPending] = useState<'google' | 'apple' | null>(null);

  const handleSignIn = async (provider: 'google' | 'apple') => {
    setPending(provider);
    try {
      if (provider === 'google') await signInWithGoogle();
      else await signInWithApple();
      router.replace('/');
    } finally {
      setPending(null);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.hero, { gap: spacing.md }]}>
        <View style={[styles.iconCircle, { backgroundColor: colors.accentPrimaryMuted }]}>
          <MaterialCommunityIcons name="glass-cocktail" size={56} color={colors.accentPrimary} />
        </View>
        <Text style={[typography.display, { color: colors.textPrimary, textAlign: 'center' }]}>Drinkava</Text>
        <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
          Trackea tus fiestas, compite con tu grupo y comparte cada brindis.
        </Text>
      </View>

      <View style={{ gap: spacing.sm, paddingHorizontal: spacing.lg, width: '100%' }}>
        <Button
          label="Continuar con Google"
          onPress={() => handleSignIn('google')}
          loading={pending === 'google'}
          disabled={pending !== null}
          icon={<MaterialCommunityIcons name="google" size={18} color="#FFFFFF" />}
        />
        <Button
          label="Continuar con Apple"
          onPress={() => handleSignIn('apple')}
          loading={pending === 'apple'}
          disabled={pending !== null}
          variant="secondary"
          icon={<MaterialCommunityIcons name="apple" size={18} color={colors.textPrimary} />}
        />
        <Text style={[typography.tiny, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }]}>
          Debes ser mayor de 18 años para usar Drinkava. Bebe con responsabilidad.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', paddingVertical: 40 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconCircle: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
});
