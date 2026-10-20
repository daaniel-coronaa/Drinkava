import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useTheme } from '@/theme';
import { hapticSelect } from '@/utils/haptics';

type Option<K extends string> = { key: K; label: string };

type Props<K extends string> = {
  options: Option<K>[];
  value: K;
  onChange: (key: K) => void;
};

// Segmented control with an indicator that slides between options. Each segment is 44dp
// tall; the track and indicator radii are concentric (track md, indicator md − padding).
// In light mode the track uses `border` — surfaceElevated is white and would vanish inside cards.
export function Segmented<K extends string>({ options, value, onChange }: Props<K>) {
  const { colors, mode, radius, spacing, typography } = useTheme();
  const [width, setWidth] = useState(0);
  const measured = useRef(false);
  const x = useSharedValue(0);

  const index = Math.max(0, options.findIndex((o) => o.key === value));
  const segmentWidth = width > 0 ? (width - spacing.xs * 2) / options.length : 0;

  useEffect(() => {
    if (segmentWidth === 0) return;
    const target = index * segmentWidth;
    if (!measured.current) {
      measured.current = true;
      x.set(target);
    } else {
      x.set(withSpring(target, { damping: 22, stiffness: 260 }));
    }
  }, [index, segmentWidth, x]);

  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.track, { backgroundColor: mode === 'light' ? colors.border : colors.surfaceElevated, borderRadius: radius.md, padding: spacing.xs }]}
    >
      {segmentWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            { left: spacing.xs, top: spacing.xs, bottom: spacing.xs, width: segmentWidth, borderRadius: radius.md - spacing.xs, backgroundColor: colors.accentPrimary },
            indicator,
          ]}
        />
      ) : null}
      {options.map((option) => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => {
              if (!selected) {
                hapticSelect();
                onChange(option.key);
              }
            }}
            style={styles.segment}
          >
            <Text style={[typography.bodyBold, { fontSize: 14, color: selected ? colors.onAccent : colors.textSecondary, textAlign: 'center' }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row' },
  indicator: { position: 'absolute' },
  segment: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
