import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useGoogleSignIn, GoogleSignInCancelledError } from '@/hooks/useGoogleSignIn';
import { useTheme } from '@/theme';

export default function WelcomeScreen() {
  const { colors, spacing, typography } = useTheme();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const google = useGoogleSignIn();
  const [pending, setPending] = useState<'google' | 'apple' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setPending('google');
    setError(null);
    try {
      const profile = await google.signIn();
      await signInWithGoogle(profile);
      router.replace('/');
    } catch (e) {
      if (!(e instanceof GoogleSignInCancelledError)) {
        setError('No pudimos iniciar sesión con Google. Intenta de nuevo.');
      }
    } finally {
      setPending(null);
    }
  };

  const handleApple = async () => {
    setPending('apple');
    setError(null);
    try {
      await signInWithApple();
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
          onPress={handleGoogle}
          loading={pending === 'google'}
          disabled={pending !== null || !google.configured}
          icon={<MaterialCommunityIcons name="google" size={18} color="#FFFFFF" />}
        />
        {!google.configured ? (
          <Text style={[typography.tiny, { color: colors.textSecondary, textAlign: 'center' }]}>
            Google aún no está configurado (falta EXPO_PUBLIC_GOOGLE_CLIENT_ID). Ver .env.example.
          </Text>
        ) : null}
        <Button
          label="Continuar con Apple"
          onPress={handleApple}
          loading={pending === 'apple'}
          disabled={pending !== null}
          variant="secondary"
          icon={<MaterialCommunityIcons name="apple" size={18} color={colors.textPrimary} />}
        />
        <Button
          label="Continuar con correo"
          onPress={() => router.push('/(auth)/email-login')}
          disabled={pending !== null}
          variant="ghost"
          icon={<MaterialCommunityIcons name="email-outline" size={18} color={colors.textPrimary} />}
        />

        {error ? (
          <Text style={[typography.caption, { color: '#E5484D', textAlign: 'center' }]}>{error}</Text>
        ) : null}

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
