import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { InvalidCredentialsError } from '@/services';
import { useTheme } from '@/theme';

export default function EmailLoginScreen() {
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError(t('auth.emailLogin.errorMissing'));
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail({ email: email.trim(), password });
      router.replace('/');
    } catch (e) {
      setError(e instanceof InvalidCredentialsError ? t('auth.emailLogin.errorInvalid') : t('auth.emailLogin.errorGeneric'));
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
        <Text style={[typography.h1, { color: colors.textPrimary }]}>{t('auth.emailLogin.title')}</Text>

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.eyebrow, { color: colors.textSecondary }]}>{t('auth.emailLogin.emailLabel')}</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.emailLogin.emailPlaceholder')}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.eyebrow, { color: colors.textSecondary }]}>{t('auth.emailLogin.passwordLabel')}</Text>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.emailLogin.passwordPlaceholder')}
            secureTextEntry
            autoComplete="password"
          />
        </View>

        {error ? <Text style={[typography.caption, { color: colors.dangerText }]}>{error}</Text> : null}

        <Button label={t('auth.emailLogin.submitButton')} onPress={handleSubmit} loading={loading} />

        <Pressable onPress={() => router.replace('/(auth)/email-register')} style={{ alignItems: 'center', paddingVertical: spacing.md }}>
          <Text style={[typography.caption, { color: colors.accentText }]}>{t('auth.emailLogin.noAccount')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
