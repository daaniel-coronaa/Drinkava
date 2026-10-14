import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '@/context/SettingsContext';
import { useTheme } from '@/theme';
import type { DrinkType } from '@/types';
import { drinkTypeIcons } from '@/utils/drinkType';

const TYPES: DrinkType[] = ['beer', 'wine', 'cocktail', 'shot', 'other'];

type Props = {
  value: DrinkType;
  onChange: (type: DrinkType) => void;
};

export function DrinkTypePicker({ value, onChange }: Props) {
  const { colors, spacing, radius, typography, drinkTypeColors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.wrap, { gap: spacing.sm }]}>
      {TYPES.map((type) => {
        const active = type === value;
        const accent = drinkTypeColors[type];
        return (
          <Pressable
            key={type}
            onPress={() => onChange(type)}
            style={[
              styles.item,
              {
                borderRadius: radius.lg,
                borderWidth: active ? 1.5 : StyleSheet.hairlineWidth,
                borderColor: active ? accent : colors.border,
                backgroundColor: active ? `${accent}${colors.tintAlpha}` : colors.surface,
              },
            ]}
          >
            <MaterialCommunityIcons name={drinkTypeIcons[type]} size={24} color={active ? accent : colors.textSecondary} />
            <Text style={[typography.caption, { color: active ? accent : colors.textSecondary, marginTop: 4 }]}>
              {t(`drinkTypes.${type}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  item: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
});
