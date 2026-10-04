import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

/**
 * MessageIn — chat bubble entrance as a one-shot CSS animation (opacity + 8px rise, 220ms ease-out).
 * Plays once on mount; skipped entirely for reduced motion.
 */
export const MessageIn: React.FC<{ style?: StyleProp<ViewStyle>; children: React.ReactNode }> = ({
  style,
  children,
}) => {
  const reduced = useReducedMotion();
  return (
    <Animated.View
      style={[
        style,
        reduced
          ? null
          : {
              animationName: {
                from: { opacity: 0, transform: [{ translateY: 8 }] },
                to: { opacity: 1, transform: [{ translateY: 0 }] },
              },
              animationDuration: '220ms',
              animationTimingFunction: 'ease-out',
              animationFillMode: 'both',
            },
      ]}
    >
      {children}
    </Animated.View>
  );
};
