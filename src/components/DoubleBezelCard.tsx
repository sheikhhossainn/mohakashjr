import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../theme/colors';

interface DoubleBezelCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  glow?: 'cyan' | 'gold' | 'purple' | 'emerald' | 'coral' | 'pink' | 'blue' | 'none';
  tag?: string;
}

/**
 * DoubleBezelCard — Refactored to Single-Surface Illustrated Cosmos aesthetic.
 * Maintained for backward compatibility across existing routes while removing
 * aggressive nested bezels, glowing borders, and visual clutter.
 */
export const DoubleBezelCard: React.FC<DoubleBezelCardProps> = ({
  children,
  style,
  innerStyle,
  glow = 'none',
}) => {
  const getGlowStyles = () => {
    switch (glow) {
      case 'gold':
        return {
          borderColor: 'rgba(255, 200, 107, 0.35)',
          backgroundColor: Colors.surface,
        };
      case 'emerald':
        return {
          borderColor: 'rgba(94, 214, 192, 0.35)',
          backgroundColor: Colors.surface,
        };
      case 'coral':
        return {
          borderColor: 'rgba(255, 138, 128, 0.35)',
          backgroundColor: Colors.surface,
        };
      case 'pink':
        return {
          borderColor: 'rgba(232, 160, 191, 0.35)',
          backgroundColor: Colors.surface,
        };
      case 'purple':
        return {
          borderColor: 'rgba(180, 142, 255, 0.35)',
          backgroundColor: Colors.surface,
        };
      case 'cyan':
      case 'blue':
        return {
          borderColor: 'rgba(107, 138, 255, 0.35)',
          backgroundColor: Colors.surface,
        };
      case 'none':
      default:
        return {
          borderColor: Colors.border,
          backgroundColor: Colors.surface,
        };
    }
  };

  const glowStyle = getGlowStyles();

  return (
    <View style={[styles.singleSurface, glowStyle, style]}>
      <View style={[styles.innerContent, innerStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  singleSurface: {
    borderRadius: 22,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  innerContent: {
    padding: 18,
  },
});
