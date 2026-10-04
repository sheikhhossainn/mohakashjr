import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Radius, Space, Touch } from '../theme/layout';
import { tapHaptic } from '../utils/haptics';
import { useAppStore } from '../state/useAppStore';
import type { AppLanguage } from '../i18n/translations';

const OPTIONS: { code: AppLanguage; label: string }[] = [
  { code: 'bn', label: 'বাংলা' },
  { code: 'en', label: 'English' },
];
const PAD = 4;
const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);

/**
 * LanguageSwitch — sliding segmented control.
 *
 * Why it's built this way: changing the language re-renders the whole app in the new
 * language. If that happens while the highlight is sliding, the JS thread is busy and the
 * slide stutters. So the slide is driven by a shared value on the UI thread (no React
 * renders at all while it moves), and the language is committed only once it has landed.
 */
export const LanguageSwitch: React.FC = () => {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const reduced = useReducedMotion();

  const [trackWidth, setTrackWidth] = useState(0);
  const segmentWidth = Math.max(0, (trackWidth - PAD * 2) / OPTIONS.length);

  // 0 = first option, 1 = second option
  const progress = useSharedValue(OPTIONS.findIndex((o) => o.code === language));

  // Stay in sync if the language changes from somewhere else
  useEffect(() => {
    progress.set(OPTIONS.findIndex((o) => o.code === language));
  }, [language, progress]);

  const select = (code: AppLanguage, index: number) => {
    if (code === language && Math.round(progress.get()) === index) return;
    tapHaptic();
    progress.set(
      withTiming(index, { duration: reduced ? 0 : 260, easing: EASE_IN_OUT }, (finished) => {
        'worklet';
        if (finished) scheduleOnRN(setLanguage, code);
      })
    );
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.get() * segmentWidth }],
  }));

  return (
    <View style={styles.track} onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)}>
      {trackWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[styles.indicator, { width: segmentWidth }, indicatorStyle]}
        />
      )}

      {OPTIONS.map((opt, index) => (
        <Segment key={opt.code} label={opt.label} index={index} progress={progress} onPress={() => select(opt.code, index)} />
      ))}
    </View>
  );
};

const Segment: React.FC<{
  label: string;
  index: number;
  progress: ReturnType<typeof useSharedValue<number>>;
  onPress: () => void;
}> = ({ label, index, progress, onPress }) => {
  // 1 when the highlight sits on this segment, 0 when it is on the other one
  const textStyle = useAnimatedStyle(() => {
    const near = interpolate(progress.get(), [index - 1, index, index + 1], [0, 1, 0], 'clamp');
    return { color: interpolateColor(near, [0, 1], [Colors.textSecondary, Colors.text]) };
  });
  const checkStyle = useAnimatedStyle(() => {
    const near = interpolate(progress.get(), [index - 1, index, index + 1], [0, 1, 0], 'clamp');
    return { opacity: near, transform: [{ scale: 0.6 + 0.4 * near }] };
  });

  return (
    <Pressable
      style={styles.segment}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Animated.Text style={[styles.segmentText, textStyle]}>{label}</Animated.Text>
      <Animated.View style={checkStyle}>
        <CheckCircle2 size={20} color={Colors.primary} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: PAD,
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radius.sm + 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  indicator: {
    position: 'absolute',
    top: PAD,
    bottom: PAD,
    left: PAD,
    borderRadius: Radius.sm + 4,
    backgroundColor: Colors.primaryBg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
    minHeight: Touch.primary,
  },
  segmentText: {
    fontSize: Typography.size.body,
    fontFamily: Typography.family.headingSemi,
  },
});
