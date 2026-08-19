import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { DisclaimerBanner } from '@/components/compliance/DisclaimerBanner';
import { DrinkTypePicker } from '@/components/drink-log/DrinkTypePicker';
import { PhotoPicker } from '@/components/drink-log/PhotoPicker';
import { QuantityStepper } from '@/components/drink-log/QuantityStepper';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { services } from '@/services';
import { useTheme } from '@/theme';
import type { DrinkType, Party } from '@/types';

// SEAM: photoUrl stays a local file URI in the mock flow. Real impl uploads to
// Supabase Storage here, and this is also where Phase 2 AI photo validation
// (Claude/GPT-4V) would run before the log is accepted.
export default function NewDrinkLogScreen() {
  const { partyId: partyIdParam } = useLocalSearchParams<{ partyId?: string }>();
  const { colors, spacing, typography } = useTheme();
  const { session } = useAuth();

  const [activeParties, setActiveParties] = useState<Party[]>([]);
  const [partyId, setPartyId] = useState(partyIdParam);
  const [drinkType, setDrinkType] = useState<DrinkType>('beer');
  const [customLabel, setCustomLabel] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!partyIdParam) {
      services.parties.list('active').then(setActiveParties);
    }
  }, [partyIdParam]);

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
      router.back();
      if (unlocked.length > 0) {
        setTimeout(() => Alert.alert('¡Nuevo logro!', unlocked.map((a) => a.achievementKey).join(', ')), 300);
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
          <Text style={[typography.caption, { color: colors.textSecondary }]}>¿En qué fiesta?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {activeParties.map((p) => (
              <Pressable key={p.id} onPress={() => setPartyId(p.id)}>
                <Chip label={p.name} tone={partyId === p.id ? 'accent' : 'neutral'} />
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View style={{ gap: spacing.sm }}>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>Tipo de bebida</Text>
        <DrinkTypePicker value={drinkType} onChange={setDrinkType} />
        {drinkType === 'other' && (
          <TextInput
            value={customLabel}
            onChangeText={setCustomLabel}
            placeholder="¿Qué estás tomando?"
            placeholderTextColor={colors.textSecondary}
            style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.sm, color: colors.textPrimary }}
          />
        )}
      </View>

      <View style={{ gap: spacing.sm, alignItems: 'center' }}>
        <Text style={[typography.caption, { color: colors.textSecondary, alignSelf: 'flex-start' }]}>Cantidad</Text>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </View>

      <View>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>Foto (opcional)</Text>
        <PhotoPicker uri={photoUrl} onChange={setPhotoUrl} label="Agregar foto del trago" />
      </View>

      <Button label="Registrar" onPress={handleSubmit} loading={submitting} disabled={!partyId} />
    </ScrollView>
  );
}
