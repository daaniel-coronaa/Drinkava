import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function QuantityStepper({ value, onChange, min = 1, max }: Props) {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        style={{ width: 40, height: 40, borderRadius: radius.pill, backgroundColor: colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' }}
      >
        <MaterialCommunityIcons name="minus" size={20} color={colors.textPrimary} />
      </Pressable>
      <Text style={[typography.h1, { color: colors.textPrimary, minWidth: 40, textAlign: 'center' }]}>{value}</Text>
      <Pressable
        onPress={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
        style={{ width: 40, height: 40, borderRadius: radius.pill, backgroundColor: colors.accentPrimary, alignItems: 'center', justifyContent: 'center' }}
      >
        <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
