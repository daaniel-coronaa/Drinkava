import { useEffect } from 'react';
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useTheme } from '@/theme';

// The Drinkava mark: a Didone "D" (heavy stem, hairline bowl) with rising bubbles.
// Geometry mirrors scripts/generate-brand-assets.mjs — change both together.
const BOX = { left: 275, right: 749, top: 250, bottom: 774 };
const STEM_W = 72;
const BOWL_STROKE = 14;
const BUBBLES = [
  [548, 622, 30],
  [500, 505, 20],
  [556, 410, 13],
  [512, 335, 8],
] as const;

const R = (BOX.bottom - BOX.top - BOWL_STROKE) / 2;
const CX = BOX.right - R - BOWL_STROKE / 2;
const Y_TOP = BOX.top + BOWL_STROKE / 2;
const Y_BOTTOM = BOX.bottom - BOWL_STROKE / 2;
const JOIN_X = BOX.left + STEM_W - 8;
const BOWL = `M${JOIN_X} ${Y_TOP} H${CX} A${R} ${R} 0 0 1 ${CX} ${Y_BOTTOM} H${JOIN_X}`;

// Spritz foil: bright apricot into deep orange on dark; deeper oranges on light so the
// hairline bowl keeps contrast against paper.
const FOIL = {
  dark: ['#FFC08A', '#FF8A3D', '#E8601C'],
  light: ['#EE7433', '#E8601C', '#A94408'],
} as const;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// A bubble that drifts up through its resting position and fades in/out, looping forever.
function RisingBubble({ x, y, r, index }: { x: number; y: number; r: number; index: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withDelay(index * 650, withRepeat(withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.quad) }), -1, false)),
    );
  }, [index, progress]);

  const props = useAnimatedProps(() => {
    const p = progress.get();
    return {
      cy: y + 34 - 68 * p,
      opacity: interpolate(p, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
    };
  });

  return <AnimatedCircle cx={x} animatedProps={props} r={r} fill="url(#foil)" />;
}

type Props = {
  height?: number;
  // Bubbles rise in a loop and a soft warm glow sits behind the mark (welcome screen only).
  animated?: boolean;
};

export function BrandMark({ height = 96, animated = false }: Props) {
  const { mode } = useTheme();
  const reduceMotion = useReducedMotion();
  const live = animated && !reduceMotion;
  const [from, mid, to] = FOIL[mode];
  const pad = animated ? 150 : 12;
  const w = BOX.right - BOX.left + pad * 2;
  const h = BOX.bottom - BOX.top + pad * 2;
  const markH = BOX.bottom - BOX.top + 24;

  return (
    <Svg width={(height * w) / markH} height={(height * h) / markH} viewBox={`${BOX.left - pad} ${BOX.top - pad} ${w} ${h}`}>
      <Defs>
        <LinearGradient id="foil" gradientUnits="userSpaceOnUse" x1={BOX.left} y1={BOX.top} x2={BOX.right} y2={BOX.bottom}>
          <Stop offset="0" stopColor={from} />
          <Stop offset="0.5" stopColor={mid} />
          <Stop offset="1" stopColor={to} />
        </LinearGradient>
        <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={mid} stopOpacity={mode === 'dark' ? 0.28 : 0.16} />
          <Stop offset="1" stopColor={mid} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      {animated ? (
        <Rect x={BOX.left - pad} y={BOX.top - pad} width={w} height={h} fill="url(#glow)" />
      ) : null}
      <Rect x={BOX.left} y={BOX.top} width={STEM_W} height={BOX.bottom - BOX.top} fill="url(#foil)" />
      <Path d={BOWL} fill="none" stroke="url(#foil)" strokeWidth={BOWL_STROKE} />
      {BUBBLES.map(([x, y, r], i) =>
        live ? (
          <RisingBubble key={`${x}-${y}`} x={x} y={y} r={r} index={i} />
        ) : (
          <Circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="url(#foil)" />
        ),
      )}
    </Svg>
  );
}
