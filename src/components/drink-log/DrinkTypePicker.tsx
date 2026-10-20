import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/PressableScale';

import { useTranslation } from '@/context/SettingsContext';
import { useTheme } from '@/theme';
import { enter } from '@/theme/motion';
import type { DrinkType } from '@/types';
import { drinkTypeIcons } from '@/utils/drinkType';
import { hapticSelect } from '@/utils/haptics';

const TYPES: DrinkType[] = ['beer', 'wine', 'cocktail', 'shot', 'other'];

type Props = {
  value: DrinkType;
  onChange: (type: DrinkType) => void;
};

export function DrinkTypePicker({ value, onChange }: Props) {
  const { colors, spacing, radius, typography } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.wrap, { gap: spacing.sm }]}>
      {TYPES.map((type, index) => {
        const active = type === value;
        return (
          <Animated.View key={type} entering={enter(index)}>
          <PressableScale
            onPress={() => {
              if (!active) hapticSelect();
              onChange(type);
            }}
            style={[
              styles.item,
              {
                borderRadius: radius.lg,
                borderWidth: active ? 1.5 : StyleSheet.hairlineWidth,
                borderColor: active ? colors.accentPrimary : colors.border,
                backgroundColor: active ? colors.accentPrimaryMuted : colors.surface,
              },
            ]}
          >
            <MaterialCommunityIcons name={drinkTypeIcons[type]} size={24} color={active ? colors.accentText : colors.textSecondary} />
            <Text style={[typography.caption, { color: active ? colors.accentText : colors.textSecondary, marginTop: 4 }]}>
              {t(`drinkTypes.${type}`)}
            </Text>
          </PressableScale>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  item: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
});
