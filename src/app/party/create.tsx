import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { PhotoPicker } from '@/components/drink-log/PhotoPicker';
import { Button } from '@/components/ui/Button';
import { DateTimePickerField } from '@/components/ui/DateTimePickerField';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { services } from '@/services';
import { useTheme } from '@/theme';

export default function CreatePartyScreen() {
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !session) return;
    setSubmitting(true);
    try {
      const party = await services.parties.create(
        {
          name: name.trim(),
          date: date.toISOString(),
          location: location.trim() || undefined,
          coverImageUrl,
        },
        session.user.id,
      );
      router.replace(`/(tabs)/parties/${party.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <View>
        <Text style={[typography.eyebrow, { color: colors.textSecondary, marginBottom: spacing.xs }]}>{t('parties.create.nameLabel')}</Text>
        <Input
          value={name}
          onChangeText={setName}
          placeholder={t('parties.create.namePlaceholder')}
        />
      </View>

      <View>
        <Text style={[typography.eyebrow, { color: colors.textSecondary, marginBottom: spacing.xs }]}>{t('parties.create.dateLabel')}</Text>
        <DateTimePickerField value={date} onChange={setDate} mode="datetime" />
      </View>

      <View>
        <Text style={[typography.eyebrow, { color: colors.textSecondary, marginBottom: spacing.xs }]}>{t('parties.create.locationLabel')}</Text>
        <Input
          value={location}
          onChangeText={setLocation}
          placeholder={t('parties.create.locationPlaceholder')}
        />
      </View>

      <View>
        <Text style={[typography.eyebrow, { color: colors.textSecondary }]}>{t('parties.create.coverLabel')}</Text>
        <PhotoPicker uri={coverImageUrl} onChange={setCoverImageUrl} label={t('parties.create.coverButton')} />
      </View>

      <Button label={t('parties.create.submitButton')} onPress={handleCreate} loading={submitting} disabled={!name.trim()} />
    </ScrollView>
  );
}
