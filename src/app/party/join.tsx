import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { services } from '@/services';
import { useTheme } from '@/theme';

// Reachable via the drinkava://party/join?code=XXXXXX deep link shared from a party's
// "Compartir invitación" — the code param pre-fills the input below.
export default function JoinPartyScreen() {
  const { code: codeParam } = useLocalSearchParams<{ code?: string }>();
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const { session } = useAuth();
  const [code, setCode] = useState(codeParam?.toUpperCase() ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleJoin = async () => {
    if (!code.trim() || !session) return;
    setSubmitting(true);
    setError(null);
    try {
      const party = await services.parties.join(code.trim(), session.user.id);
      router.replace(`/(tabs)/parties/${party.id}`);
    } catch {
      setError(t('parties.join.errorNotFound'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md }}>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        {codeParam ? t('parties.join.promptWithCode') : t('parties.join.promptNoCode')}
      </Text>
      <Input
        value={code}
        onChangeText={(value) => setCode(value.toUpperCase())}
        placeholder={t('parties.join.placeholder')}
        autoCapitalize="characters"
        style={{ fontSize: 20, letterSpacing: 4, textAlign: 'center', paddingVertical: spacing.md }}
      />
      {error ? <Text style={{ color: colors.dangerText }}>{error}</Text> : null}
      <Button label={t('parties.join.submitButton')} onPress={handleJoin} loading={submitting} disabled={!code.trim()} />
    </View>
  );
}
