import React, { useState } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { PressScaleView } from './PressScaleView';

interface ScalePressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Style for the outer scaling wrapper (layout: flex, margin, alignSelf). */
  wrapperStyle?: StyleProp<ViewStyle>;
  scale?: number;
  children: React.ReactNode;
}

/** Pressable with the shared press-in scale transition. Drop-in for chips, icon buttons, rows. */
export const ScalePressable: React.FC<ScalePressableProps> = ({
  style,
  wrapperStyle,
  scale = 0.96,
  onPressIn,
  onPressOut,
  children,
  ...rest
}) => {
  const [pressed, setPressed] = useState(false);
  return (
    <PressScaleView pressed={pressed && !rest.disabled} sink={0} scale={scale} style={wrapperStyle}>
      <Pressable
        {...rest}
        style={style}
        onPressIn={(e) => {
          setPressed(true);
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          setPressed(false);
          onPressOut?.(e);
        }}
      >
        {children}
      </Pressable>
    </PressScaleView>
  );
};
