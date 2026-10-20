import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, ReduceMotion } from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/PressableScale';

import { useTheme } from '@/theme';
import { hapticSelect } from '@/utils/haptics';

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
      <PressableScale
        accessibilityLabel="-"
        scaleTo={0.9}
        onPress={() => {
          if (value > min) hapticSelect();
          onChange(Math.max(min, value - 1));
        }}
        style={{ width: 44, height: 44, borderRadius: radius.pill, backgroundColor: colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' }}
      >
        <MaterialCommunityIcons name="minus" size={20} color={colors.textPrimary} />
      </PressableScale>
      <View style={{ minWidth: 48, height: typography.h1.lineHeight, alignItems: 'center', overflow: 'hidden' }}>
        {/* Re-keyed per value so each change rolls in like a counter. */}
        <Animated.Text
          key={value}
          entering={FadeInDown.springify().damping(14).stiffness(220).reduceMotion(ReduceMotion.System)}
          exiting={FadeOutUp.duration(120).reduceMotion(ReduceMotion.System)}
          style={[typography.h1, { color: colors.textPrimary, textAlign: 'center' }]}
        >
          {value}
        </Animated.Text>
      </View>
      <PressableScale
        accessibilityLabel="+"
        scaleTo={0.9}
        onPress={() => {
          if (max === undefined || value < max) hapticSelect();
          onChange(max !== undefined ? Math.min(max, value + 1) : value + 1);
        }}
        style={{ width: 44, height: 44, borderRadius: radius.pill, backgroundColor: colors.accentPrimary, alignItems: 'center', justifyContent: 'center' }}
      >
        <MaterialCommunityIcons name="plus" size={20} color={colors.onAccent} />
      </PressableScale>
    </View>
  );
}
