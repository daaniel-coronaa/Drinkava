import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTranslation } from '@/context/SettingsContext';
import { monthNames, weekdayShortNames } from '@/i18n';
import { useTheme } from '@/theme';

type Props = {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
};

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function buildWeeks(year: number, month: number): (Date | null)[][] {
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// Fully custom, themed month-grid calendar — used on every platform instead of each
// OS's native date picker chrome, so the look is consistent and on-brand everywhere.
export function CalendarPicker({ value, onChange, minimumDate, maximumDate }: Props) {
  const { colors, spacing, radius, typography } = useTheme();
  const { language } = useTranslation();
  const monthLabels = monthNames(language);
  const weekdayLabels = weekdayShortNames(language);
  const [viewDate, setViewDate] = useState(new Date(value.getFullYear(), value.getMonth(), 1));
  const today = new Date();

  const min = minimumDate ? stripTime(minimumDate) : undefined;
  const max = maximumDate ? stripTime(maximumDate) : undefined;
  const isDisabled = (d: Date) => (min && d < min) || (max && d > max);

  const weeks = buildWeeks(viewDate.getFullYear(), viewDate.getMonth());

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
        <Pressable
          onPress={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
          hitSlop={10}
          style={{ padding: spacing.xs }}
        >
          <MaterialCommunityIcons name="chevron-left" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text
          style={[
            typography.bodyBold,
            { color: colors.textPrimary, flex: 1, textAlign: 'center', textTransform: 'capitalize' },
          ]}
        >
          {monthLabels[viewDate.getMonth()]} {viewDate.getFullYear()}
        </Text>
        <Pressable
          onPress={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
          hitSlop={10}
          style={{ padding: spacing.xs }}
        >
          <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row' }}>
        {weekdayLabels.map((label, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.xs }}>
            <Text style={[typography.tiny, { color: colors.textSecondary }]}>{label}</Text>
          </View>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} style={{ flexDirection: 'row' }}>
          {week.map((day, di) => {
            if (!day) return <View key={di} style={{ flex: 1, aspectRatio: 1 }} />;
            const selected = isSameDay(day, value);
            const isToday = isSameDay(day, today);
            const disabled = !!isDisabled(day);
            return (
              // The whole cell is the touch target (>= 44dp on phones); the circle is purely visual.
              <Pressable
                key={di}
                onPress={() =>
                  !disabled &&
                  onChange(new Date(day.getFullYear(), day.getMonth(), day.getDate(), value.getHours(), value.getMinutes()))
                }
                disabled={disabled}
                style={{ flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}
              >
                <View
                  style={{
                    width: '78%',
                    aspectRatio: 1,
                    borderRadius: radius.pill,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: selected ? colors.accentPrimary : 'transparent',
                    borderWidth: isToday && !selected ? 1.5 : 0,
                    borderColor: colors.accentPrimary,
                  }}
                >
                  <Text
                    style={[
                      typography.body,
                      { color: selected ? colors.onAccent : disabled ? colors.textSecondary : colors.textPrimary, opacity: disabled ? 0.35 : 1 },
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
