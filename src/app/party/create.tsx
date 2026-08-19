import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, Text, TextInput, View } from 'react-native';

import { PhotoPicker } from '@/components/drink-log/PhotoPicker';
import { Button } from '@/components/ui/Button';
import { services } from '@/services';
import { useTheme } from '@/theme';
import { formatDateTime } from '@/utils/date';

export default function CreatePartyScreen() {
  const { colors, spacing, radius, typography } = useTheme();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const openAndroidPicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      mode: 'date',
      onChange: (_e, selected) => {
        if (!selected) return;
        DateTimePickerAndroid.open({
          value: selected,
          mode: 'time',
          onChange: (_e2, time) => time && setDate(time),
        });
      },
    });
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const party = await services.parties.create({
        name: name.trim(),
        date: date.toISOString(),
        location: location.trim() || undefined,
        coverImageUrl,
      });
      router.replace(`/(tabs)/parties/${party.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <View>
        <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.xs }]}>Nombre</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Previa en mi depto"
          placeholderTextColor={colors.textSecondary}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radius.md,
            padding: spacing.sm,
            color: colors.textPrimary,
          }}
        />
      </View>

      <View>
        <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.xs }]}>Fecha y hora</Text>
        {Platform.OS === 'ios' ? (
          <DateTimePicker value={date} mode="datetime" display="compact" onChange={(_e, d) => d && setDate(d)} />
        ) : (
          <Button label={formatDateTime(date.toISOString())} onPress={openAndroidPicker} variant="secondary" />
        )}
      </View>

      <View>
        <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.xs }]}>Ubicación (opcional)</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Depto de Cami"
          placeholderTextColor={colors.textSecondary}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radius.md,
            padding: spacing.sm,
            color: colors.textPrimary,
          }}
        />
      </View>

      <View>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>Portada (opcional)</Text>
        <PhotoPicker uri={coverImageUrl} onChange={setCoverImageUrl} label="Agregar foto de portada" />
      </View>

      <Button label="Crear fiesta" onPress={handleCreate} loading={submitting} disabled={!name.trim()} />
    </ScrollView>
  );
}
