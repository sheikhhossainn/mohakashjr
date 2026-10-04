import * as Haptics from 'expo-haptics';

/** Fire-and-forget haptics. Never throws (web / unsupported devices). */
const safe = (fn: () => Promise<void>) => {
  try {
    fn().catch(() => {});
  } catch {
    // no-op
  }
};

export const tapHaptic = () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
export const successHaptic = () =>
  safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const gentleErrorHaptic = () =>
  safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
