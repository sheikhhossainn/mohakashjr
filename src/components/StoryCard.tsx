import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Space } from '../theme/layout';

export interface StoryCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Kept for API compatibility. Cards are neutral; colour lives in content, not borders. */
  accent?: 'primary' | 'gold' | 'emerald' | 'coral' | 'pink' | 'purple' | 'cyan' | 'none';
  variant?: 'flat' | 'elevated' | 'tinted' | 'dark';
}

/**
 * StoryCard — the one card surface in Mohakash Jr.
 * Dark navy surface, hairline border, no shadow/accent stacking.
 * 'elevated' = one step lighter, 'tinted' = soft nebula tint.
 */
export const StoryCard: React.FC<StoryCardProps> = ({
  children,
  style,
  variant = 'flat',
}) => {
  const variantStyle =
    variant === 'elevated'
      ? styles.elevated
      : variant === 'tinted'
        ? styles.tinted
        : variant === 'dark'
          ? styles.dark
          : null;

  return <View style={[styles.card, variantStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Space.lg + 4,
  },
  elevated: {
    backgroundColor: Colors.surfaceElevated,
  },
  tinted: {
    backgroundColor: Colors.primaryBg,
    borderColor: 'rgba(140,155,255,0.28)',
  },
  dark: {
    backgroundColor: Colors.spaceCard,
  },
});
