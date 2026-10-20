import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, Text, View } from 'react-native';

import { DisclaimerBanner } from '@/components/compliance/DisclaimerBanner';
import { DrinkTypePicker } from '@/components/drink-log/DrinkTypePicker';
import { PhotoPicker } from '@/components/drink-log/PhotoPicker';
import { QuantityStepper } from '@/components/drink-log/QuantityStepper';
import { Chip } from '@/components/ui/Chip';
import { PressableScale } from '@/components/ui/PressableScale';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { services } from '@/services';
import { useTheme } from '@/theme';
import type { DrinkType, Party } from '@/types';
import { hapticSelect, hapticSuccess } from '@/utils/haptics';

// SEAM: photoUrl stays a local file URI in the mock flow. Real impl uploads to
// Supabase Storage here, and this is also where Phase 2 AI photo validation
// (Claude/GPT-4V) would run before the log is accepted.
export default function NewDrinkLogScreen() {
  const { partyId: partyIdParam } = useLocalSearchParams<{ partyId?: string }>();
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const { session } = useAuth();

  const [activeParties, setActiveParties] = useState<Party[]>([]);
  const [partyId, setPartyId] = useState(partyIdParam);
  const [drinkType, setDrinkType] = useState<DrinkType>('beer');
  const [customLabel, setCustomLabel] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  // Only the parties the user is actually in — and pre-pick the first so the common case
  // (one live party) needs zero taps before "Log it".
  const userId = session?.user.id;
  useEffect(() => {
    if (partyIdParam || !userId) return;
    services.parties.listForUser(userId).then((mine) => {
      const live = mine.filter((p) => p.status === 'active');
      setActiveParties(live);
      setPartyId((current) => current ?? live[0]?.id);
    });
  }, [partyIdParam, userId]);

  const handleSubmit = async () => {
    if (!partyId || !session) return;
    setSubmitting(true);
    try {
      await services.drinkLogs.create({
        partyId,
        drinkType,
        customLabel: drinkType === 'other' ? customLabel.trim() || undefined : undefined,
        quantity,
      });
      const unlocked = await services.achievements.evaluateAndUnlock(session.user.id);
      // Every logged drink is a "turno" for the party's random challenge pacing.
      await services.challenges.maybeTriggerNextChallenge(partyId);
      hapticSuccess();
      router.back();
      if (unlocked.length > 0) {
        const names = unlocked.map((a) => t(`achievements.${a.achievementKey}.title`)).join(', ');
        setTimeout(() => {
          if (Platform.OS === 'web') window.alert(`${t('drinkLog.achievementUnlockedTitle')}\n\n${names}`);
          else Alert.alert(t('drinkLog.achievementUnlockedTitle'), names);
        }, 300);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      <DisclaimerBanner />
      {!partyIdParam && (
        <View style={{ gap: spacing.sm }}>
          <Text style={[typography.eyebrow, { color: colors.textSecondary }]}>{t('drinkLog.whichParty')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {activeParties.map((p) => (
              <PressableScale
                key={p.id}
                onPress={() => {
                  hapticSelect();
                  setPartyId(p.id);
                }}
              >
                <Chip label={p.name} tone={partyId === p.id ? 'accent' : 'neutral'} size="lg" />
              </PressableScale>
            ))}
          </View>
        </View>
      )}

      <View style={{ gap: spacing.sm }}>
        <Text style={[typography.eyebrow, { color: colors.textSecondary }]}>{t('drinkLog.drinkTypeLabel')}</Text>
        <DrinkTypePicker value={drinkType} onChange={setDrinkType} />
        {drinkType === 'other' && (
          <Input
            value={customLabel}
            onChangeText={setCustomLabel}
            placeholder={t('drinkLog.customPlaceholder')}
          />
        )}
      </View>

      <View style={{ gap: spacing.sm, alignItems: 'center' }}>
        <Text style={[typography.eyebrow, { color: colors.textSecondary, alignSelf: 'flex-start' }]}>{t('drinkLog.quantityLabel')}</Text>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </View>

      <View>
        <Text style={[typography.eyebrow, { color: colors.textSecondary }]}>{t('drinkLog.photoLabel')}</Text>
        <PhotoPicker uri={photoUrl} onChange={setPhotoUrl} label={t('drinkLog.addPhotoLabel')} />
      </View>

      <Button label={t('drinkLog.submitButton')} onPress={handleSubmit} loading={submitting} disabled={!partyId} />
    </ScrollView>
  );
}
