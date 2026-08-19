import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { AgeRestrictedError } from '@/services';
import { useTheme } from '@/theme';
import { formatDate } from '@/utils/date';

export default function AgeGateScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const { submitBirthDate } = useAuth();
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openAndroidPicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      mode: 'date',
      maximumDate: new Date(),
      onChange: (_event, selected) => {
        if (selected) setDate(selected);
      },
    });
  };

  const handleContinue = async () => {
    setLoading(true);
    setError(null);
    try {
      await submitBirthDate(date.toISOString().slice(0, 10));
      router.replace('/');
    } catch (e) {
      if (e instanceof AgeRestrictedError) {
        setError('Debes tener 18 años o más para usar Drinkava.');
      } else {
        setError('Algo salió mal. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, padding: spacing.lg }]}>
      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>¿Cuándo naciste?</Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          Necesitamos verificar tu edad. Drinkava es solo para mayores de 18 años.
        </Text>
      </View>

      <View style={{ marginTop: spacing.xl, alignItems: 'center' }}>
        {Platform.OS === 'ios' ? (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            maximumDate={new Date()}
            onChange={(_event, selected) => selected && setDate(selected)}
          />
        ) : (
          <Button label={formatDate(date.toISOString())} onPress={openAndroidPicker} variant="secondary" />
        )}
      </View>

      {error ? (
        <View
          style={{
            marginTop: spacing.md,
            padding: spacing.sm,
            borderRadius: radius.md,
            backgroundColor: '#E5484D22',
          }}
        >
          <Text style={[typography.caption, { color: '#E5484D' }]}>{error}</Text>
        </View>
      ) : null}

      <View style={{ flex: 1 }} />
      <Button label="Continuar" onPress={handleContinue} loading={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
