import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Tiny tactile confirmations — no-ops on web.
const run = (fn: () => Promise<void>) => {
  if (Platform.OS !== 'web') fn().catch(() => {});
};

export const hapticSelect = () => run(() => Haptics.selectionAsync());
export const hapticSuccess = () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const hapticError = () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
