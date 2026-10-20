import { FadeIn, FadeInDown, LinearTransition, ReduceMotion } from 'react-native-reanimated';

// One motion language: short springs, staggered entrances, nothing bouncy or slow.
// Everything honors the system "reduce motion" setting.

// Staggered rise for list items; the stagger caps so long lists don't feel sluggish.
export const enter = (index = 0) =>
  FadeInDown.delay(Math.min(index, 8) * 55)
    .springify()
    .damping(18)
    .stiffness(140)
    .reduceMotion(ReduceMotion.System);

export const fadeIn = (delay = 0) => FadeIn.delay(delay).duration(320).reduceMotion(ReduceMotion.System);

// For containers whose height changes (a challenge card moving from pending to approved).
export const smoothLayout = LinearTransition.springify().damping(20).stiffness(180).reduceMotion(ReduceMotion.System);
