import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { EmailInUseError } from '@/services';
import { useTheme } from '@/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailRegisterScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const { t } = useTranslation();
  const { registerWithEmail } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputStyle = {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
  };

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) return setError(t('auth.emailRegister.errorName'));
    if (!EMAIL_PATTERN.test(email.trim())) return setError(t('auth.emailRegister.errorEmail'));
    if (password.length < 6) return setError(t('auth.emailRegister.errorPasswordLength'));
    if (password !== confirmPassword) return setError(t('auth.emailRegister.errorPasswordMatch'));

    setLoading(true);
    try {
      await registerWithEmail({ name: name.trim(), email: email.trim(), password });
      router.replace('/');
    } catch (e) {
      setError(e instanceof EmailInUseError ? t('auth.emailRegister.errorInUse') : t('auth.emailRegister.errorGeneric'));
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
        <Text style={[typography.h1, { color: colors.textPrimary }]}>{t('auth.emailRegister.title')}</Text>

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('auth.emailRegister.nameLabel')}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('auth.emailRegister.namePlaceholder')}
            placeholderTextColor={colors.textSecondary}
            autoComplete="name"
            style={inputStyle}
          />
        </View>

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('auth.emailRegister.emailLabel')}</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.emailRegister.emailPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={inputStyle}
          />
        </View>

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('auth.emailRegister.passwordLabel')}</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.emailRegister.passwordPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            autoComplete="new-password"
            style={inputStyle}
          />
        </View>

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('auth.emailRegister.confirmLabel')}</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('auth.emailRegister.confirmPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            autoComplete="new-password"
            style={inputStyle}
          />
        </View>

        {error ? <Text style={[typography.caption, { color: colors.dangerText }]}>{error}</Text> : null}

        <Button label={t('auth.emailRegister.submitButton')} onPress={handleSubmit} loading={loading} />

        <Pressable onPress={() => router.replace('/(auth)/email-login')} style={{ alignItems: 'center', marginTop: spacing.sm }}>
          <Text style={[typography.caption, { color: colors.accentText }]}>{t('auth.emailRegister.haveAccount')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
