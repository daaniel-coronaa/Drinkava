import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';
import type { DrinkType } from '@/types';
import { drinkTypeIcons, drinkTypeLabels } from '@/utils/drinkType';

const TYPES: DrinkType[] = ['beer', 'wine', 'cocktail', 'shot', 'other'];

type Props = {
  value: DrinkType;
  onChange: (type: DrinkType) => void;
};

export function DrinkTypePicker({ value, onChange }: Props) {
  const { colors, spacing, radius, typography, drinkTypeColors } = useTheme();

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
                borderRadius: radius.md,
                borderWidth: 1.5,
                borderColor: active ? accent : colors.border,
                backgroundColor: active ? `${accent}1A` : colors.surface,
              },
            ]}
          >
            <MaterialCommunityIcons name={drinkTypeIcons[type]} size={24} color={active ? accent : colors.textSecondary} />
            <Text style={[typography.caption, { color: active ? accent : colors.textSecondary, marginTop: 4 }]}>
              {drinkTypeLabels[type]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  item: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center' },
});
