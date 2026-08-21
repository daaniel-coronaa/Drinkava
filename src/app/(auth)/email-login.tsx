import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import { useAuth } from '@/context/AuthContext';
import { InvalidCredentialsError } from '@/services';
import { useTheme } from '@/theme';

export default function EmailLoginScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputStyle = {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    color: colors.textPrimary,
  };

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail({ email: email.trim(), password });
      router.replace('/');
    } catch (e) {
      setError(e instanceof InvalidCredentialsError ? 'Correo o contraseña incorrectos.' : 'Algo salió mal. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing.md }}>
        <HeaderBackButton fallbackHref="/(auth)/welcome" />
      </View>
      <View style={{ padding: spacing.lg, gap: spacing.md, flex: 1 }}>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>Inicia sesión</Text>

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>Correo</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="tu@correo.com"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={inputStyle}
          />
        </View>

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            autoComplete="password"
            style={inputStyle}
          />
        </View>

        {error ? <Text style={[typography.caption, { color: '#E5484D' }]}>{error}</Text> : null}

        <Button label="Iniciar sesión" onPress={handleSubmit} loading={loading} />

        <Pressable onPress={() => router.replace('/(auth)/email-register')} style={{ alignItems: 'center', marginTop: spacing.sm }}>
          <Text style={[typography.caption, { color: colors.accentPrimary }]}>¿No tienes cuenta? Regístrate</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
