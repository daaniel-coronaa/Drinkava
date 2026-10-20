import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { services } from '@/services';
import { useTheme } from '@/theme';
import { enter } from '@/theme/motion';
import { hapticError, hapticSuccess } from '@/utils/haptics';

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
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  const handleJoin = async () => {
    if (!code.trim() || !session) return;
    setSubmitting(true);
    setError(null);
    try {
      const party = await services.parties.join(code.trim(), session.user.id);
      hapticSuccess();
      router.replace(`/(tabs)/parties/${party.id}`);
    } catch {
      // A short side-to-side shake says "that code didn't work" before the message is read.
      hapticError();
      shake.set(withSequence(withTiming(-10, { duration: 50 }), withTiming(10, { duration: 80 }), withTiming(-6, { duration: 80 }), withTiming(0, { duration: 60 })));
      setError(t('parties.join.errorNotFound'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md }}>
      <Animated.Text entering={enter(0)} style={[typography.body, { color: colors.textSecondary }]}>
        {codeParam ? t('parties.join.promptWithCode') : t('parties.join.promptNoCode')}
      </Animated.Text>
      <Animated.View entering={enter(1)} style={shakeStyle}>
        <Input
          value={code}
          onChangeText={(value) => setCode(value.toUpperCase())}
          placeholder={t('parties.join.placeholder')}
          autoCapitalize="characters"
          style={{ fontSize: 20, letterSpacing: 4, textAlign: 'center', paddingVertical: spacing.md }}
        />
      </Animated.View>
      {error ? (
        <Animated.Text entering={enter(0)} style={[typography.caption, { color: colors.dangerText }]}>
          {error}
        </Animated.Text>
      ) : null}
      <Animated.View entering={enter(2)}>
        <Button label={t('parties.join.submitButton')} onPress={handleJoin} loading={submitting} disabled={!code.trim()} />
      </Animated.View>
    </View>
  );
}
