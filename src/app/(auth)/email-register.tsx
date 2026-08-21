import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import { useAuth } from '@/context/AuthContext';
import { EmailInUseError } from '@/services';
import { useTheme } from '@/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailRegisterScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const { registerWithEmail } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (!name.trim()) return setError('Ingresa tu nombre.');
    if (!EMAIL_PATTERN.test(email.trim())) return setError('Ingresa un correo válido.');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (password !== confirmPassword) return setError('Las contraseñas no coinciden.');

    setLoading(true);
    try {
      await registerWithEmail({ name: name.trim(), email: email.trim(), password });
      router.replace('/');
    } catch (e) {
      setError(e instanceof EmailInUseError ? 'Ese correo ya tiene una cuenta.' : 'Algo salió mal. Intenta de nuevo.');
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
        <Text style={[typography.h1, { color: colors.textPrimary }]}>Crea tu cuenta</Text>

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>Nombre</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
            placeholderTextColor={colors.textSecondary}
            autoComplete="name"
            style={inputStyle}
          />
        </View>

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
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            autoComplete="new-password"
            style={inputStyle}
          />
        </View>

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>Confirmar contraseña</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repite tu contraseña"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            autoComplete="new-password"
            style={inputStyle}
          />
        </View>

        {error ? <Text style={[typography.caption, { color: '#E5484D' }]}>{error}</Text> : null}

        <Button label="Crear cuenta" onPress={handleSubmit} loading={loading} />

        <Pressable onPress={() => router.replace('/(auth)/email-login')} style={{ alignItems: 'center', marginTop: spacing.sm }}>
          <Text style={[typography.caption, { color: colors.accentPrimary }]}>¿Ya tienes cuenta? Inicia sesión</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
