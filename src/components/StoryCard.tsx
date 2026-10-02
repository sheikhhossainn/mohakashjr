import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../theme/colors';

export interface StoryCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accent?: 'primary' | 'gold' | 'emerald' | 'coral' | 'pink' | 'purple' | 'cyan' | 'none';
  variant?: 'flat' | 'elevated' | 'tinted';
}

/**
 * StoryCard — Single-surface warm card for Mohakash Jr.
 * Replaces the multi-layered "DoubleBezel" cockpit container with a calm,
 * book-like illustrated surface.
 */
export const StoryCard: React.FC<StoryCardProps> = ({
  children,
  style,
  accent = 'none',
  variant = 'flat',
}) => {
  const getAccentBorder = () => {
    switch (accent) {
      case 'primary':
        return { borderColor: 'rgba(107, 138, 255, 0.3)' };
      case 'gold':
        return { borderColor: 'rgba(255, 200, 107, 0.35)' };
      case 'emerald':
        return { borderColor: 'rgba(94, 214, 192, 0.35)' };
      case 'coral':
        return { borderColor: 'rgba(255, 138, 128, 0.35)' };
      case 'pink':
        return { borderColor: 'rgba(232, 160, 191, 0.35)' };
      case 'purple':
        return { borderColor: 'rgba(180, 142, 255, 0.35)' };
      case 'cyan':
        return { borderColor: 'rgba(126, 200, 227, 0.3)' };
      case 'none':
      default:
        return { borderColor: Colors.border };
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return styles.elevated;
      case 'tinted':
        return styles.tinted;
      case 'flat':
      default:
        return styles.flat;
    }
  };

  return (
    <View style={[styles.card, getVariantStyle(), getAccentBorder(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 3,
  },
  flat: {
    backgroundColor: Colors.surface,
  },
  elevated: {
    backgroundColor: Colors.surfaceElevated,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 5,
  },
  tinted: {
    backgroundColor: Colors.surfaceCard,
  },
});
