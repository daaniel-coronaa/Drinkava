import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { CalendarPicker } from '@/components/ui/CalendarPicker';
import { useTheme } from '@/theme';
import { formatDate, formatDateTime } from '@/utils/date';

type Props = {
  value: Date;
  onChange: (date: Date) => void;
  mode: 'date' | 'datetime';
  maximumDate?: Date;
  minimumDate?: Date;
};

const pad = (n: number) => String(n).padStart(2, '0');

// A single, fully custom, on-brand date/time field used the same way on every
// platform (web, iOS, Android) — a themed input-like Pressable that opens a bottom
// sheet with a month calendar (and a time stepper for "datetime" mode), instead of
// relying on each platform's differently-styled (and, on web, broken) native picker.
export function DateTimePickerField({ value, onChange, mode, maximumDate, minimumDate }: Props) {
  const { colors, spacing, radius, typography } = useTheme();
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(value);

  const open = () => {
    setDraft(value);
    setVisible(true);
  };

  const confirm = () => {
    onChange(draft);
    setVisible(false);
  };

  const setHour = (h: number) =>
    setDraft(new Date(draft.getFullYear(), draft.getMonth(), draft.getDate(), h, draft.getMinutes()));
  const setMinute = (m: number) =>
    setDraft(new Date(draft.getFullYear(), draft.getMonth(), draft.getDate(), draft.getHours(), m));

  return (
    <>
      <Pressable
        onPress={open}
        style={[
          styles.field,
          { borderColor: colors.border, borderRadius: radius.md, padding: spacing.sm, backgroundColor: colors.surface },
        ]}
      >
        <MaterialCommunityIcons
          name={mode === 'date' ? 'calendar-blank-outline' : 'calendar-clock-outline'}
          size={18}
          color={colors.accentPrimary}
        />
        <Text style={[typography.body, { color: colors.textPrimary, flex: 1, marginLeft: spacing.sm }]}>
          {mode === 'date' ? formatDate(value.toISOString()) : formatDateTime(value.toISOString())}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textSecondary} />
      </Pressable>

      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
          ]}
        >
          <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
            <Text style={[typography.h3, { color: colors.textPrimary, marginBottom: spacing.md }]}>
              {mode === 'date' ? 'Selecciona una fecha' : 'Selecciona fecha y hora'}
            </Text>

            <CalendarPicker value={draft} onChange={setDraft} minimumDate={minimumDate} maximumDate={maximumDate} />

            {mode === 'datetime' && (
              <View style={[styles.timeRow, { marginTop: spacing.lg, gap: spacing.sm }]}>
                <TimeStepper value={draft.getHours()} onChange={setHour} max={23} />
                <Text style={[typography.h2, { color: colors.textPrimary }]}>:</Text>
                <TimeStepper value={draft.getMinutes()} onChange={setMinute} max={59} />
              </View>
            )}

            <Button label="Listo" onPress={confirm} style={{ marginTop: spacing.lg }} />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

function TimeStepper({ value, onChange, max }: { value: number; onChange: (v: number) => void; max: number }) {
  const { colors, radius, typography } = useTheme();

  const step = (delta: number) => onChange((value + delta + (max + 1)) % (max + 1));

  return (
    <View style={styles.timeStepper}>
      <Pressable
        onPress={() => step(1)}
        style={[styles.timeButton, { borderRadius: radius.pill, backgroundColor: colors.surfaceElevated }]}
      >
        <MaterialCommunityIcons name="chevron-up" size={18} color={colors.textPrimary} />
      </Pressable>
      <Text style={[typography.h2, { color: colors.textPrimary, minWidth: 44, textAlign: 'center' }]}>
        {pad(value)}
      </Text>
      <Pressable
        onPress={() => step(-1)}
        style={[styles.timeButton, { borderRadius: radius.pill, backgroundColor: colors.surfaceElevated }]}
      >
        <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  backdrop: { flex: 1, backgroundColor: '#00000066' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: '85%' },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  timeStepper: { alignItems: 'center', gap: 4 },
  timeButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
