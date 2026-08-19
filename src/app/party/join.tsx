import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { services } from '@/services';
import { useTheme } from '@/theme';

// Reachable via the drinkava://party/join?code=XXXXXX deep link shared from a party's
// "Compartir invitación" — the code param pre-fills the input below.
export default function JoinPartyScreen() {
  const { code: codeParam } = useLocalSearchParams<{ code?: string }>();
  const { colors, spacing, radius, typography } = useTheme();
  const [code, setCode] = useState(codeParam?.toUpperCase() ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const party = await services.parties.join(code.trim());
      router.replace(`/(tabs)/parties/${party.id}`);
    } catch {
      setError('No encontramos una fiesta con ese código.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md }}>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        {codeParam
          ? 'Detectamos un código de invitación. Confirma para unirte.'
          : 'Ingresa el código de invitación que te compartió el anfitrión.'}
      </Text>
      <TextInput
        value={code}
        onChangeText={(t) => setCode(t.toUpperCase())}
        placeholder="ABC123"
        autoCapitalize="characters"
        placeholderTextColor={colors.textSecondary}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.md,
          padding: spacing.md,
          color: colors.textPrimary,
          fontSize: 20,
          letterSpacing: 4,
          textAlign: 'center',
        }}
      />
      {error ? <Text style={{ color: '#E5484D' }}>{error}</Text> : null}
      <Button label="Unirme" onPress={handleJoin} loading={submitting} disabled={!code.trim()} />
    </View>
  );
}
