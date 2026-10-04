import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

interface PressScaleViewProps {
  pressed: boolean;
  /** Extra downward nudge while pressed (clay-button feel). */
  sink?: number;
  scale?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/**
 * PressScaleView — press feedback as a Reanimated CSS transition.
 * Feedback starts on press-in; 120ms ease-out, no bounce (a button is pressed
 * dozens of times a session). Reduced motion keeps the state change but drops the movement.
 */
export const PressScaleView: React.FC<PressScaleViewProps> = ({
  pressed,
  sink = 2,
  scale = 0.97,
  style,
  children,
}) => {
  const reduced = useReducedMotion();
  const active = pressed && !reduced;

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY: active ? sink : 0 }, { scale: active ? scale : 1 }],
          transitionProperty: 'transform',
          transitionDuration: reduced ? 0 : 120,
          transitionTimingFunction: 'ease-out',
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};
