import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { createElement } from 'react';
import { Platform } from 'react-native';

import { Button } from '@/components/ui/Button';
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

function toInputValue(date: Date, mode: 'date' | 'datetime') {
  const base = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return mode === 'date' ? base : `${base}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// SEAM: @react-native-community/datetimepicker has no visual implementation on web
// (DateTimePickerAndroid.open silently no-ops there). This component picks the right
// picker per platform: native spinner on iOS, native dialog on Android, and a real
// HTML date/datetime-local input on web — so the field is actually editable everywhere.
export function DateTimePickerField({ value, onChange, mode, maximumDate, minimumDate }: Props) {
  const { colors, radius } = useTheme();

  if (Platform.OS === 'web') {
    return createElement('input', {
      type: mode === 'date' ? 'date' : 'datetime-local',
      value: toInputValue(value, mode),
      max: maximumDate ? toInputValue(maximumDate, mode) : undefined,
      min: minimumDate ? toInputValue(minimumDate, mode) : undefined,
      onChange: (e: { target: { value: string } }) => {
        const raw = e.target.value;
        if (!raw) return;
        const next = mode === 'date' ? new Date(`${raw}T00:00:00`) : new Date(raw);
        if (!Number.isNaN(next.getTime())) onChange(next);
      },
      style: {
        fontSize: 16,
        padding: 12,
        borderRadius: radius.md,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.surface,
        color: colors.textPrimary,
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
      },
    });
  }

  if (Platform.OS === 'ios') {
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        display={mode === 'date' ? 'spinner' : 'compact'}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        onChange={(_event, selected) => selected && onChange(selected)}
      />
    );
  }

  const openPicker = () => {
    DateTimePickerAndroid.open({
      value,
      mode: 'date',
      maximumDate,
      minimumDate,
      onChange: (_event, selectedDate) => {
        if (!selectedDate) return;
        if (mode === 'date') {
          onChange(selectedDate);
          return;
        }
        DateTimePickerAndroid.open({
          value: selectedDate,
          mode: 'time',
          onChange: (_timeEvent, selectedTime) => selectedTime && onChange(selectedTime),
        });
      },
    });
  };

  return (
    <Button
      label={mode === 'date' ? formatDate(value.toISOString()) : formatDateTime(value.toISOString())}
      onPress={openPicker}
      variant="secondary"
    />
  );
}
