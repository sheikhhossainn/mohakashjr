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
          borderColor: 'rgba(255, 184, 0, 0.45)',
          shadowColor: '#FFB800',
          shadowOpacity: 0.28,
          shadowRadius: 10,
        };
      case 'emerald':
        return {
          borderColor: 'rgba(16, 185, 129, 0.45)',
          shadowColor: '#10B981',
          shadowOpacity: 0.28,
          shadowRadius: 10,
        };
      case 'coral':
        return {
          borderColor: 'rgba(255, 71, 87, 0.45)',
          shadowColor: '#FF4757',
          shadowOpacity: 0.28,
          shadowRadius: 10,
        };
      case 'pink':
        return {
          borderColor: 'rgba(255, 77, 139, 0.45)',
          shadowColor: '#FF4D8B',
          shadowOpacity: 0.28,
          shadowRadius: 10,
        };
      case 'purple':
        return {
          borderColor: 'rgba(139, 92, 246, 0.45)',
          shadowColor: '#8B5CF6',
          shadowOpacity: 0.28,
          shadowRadius: 10,
        };
      case 'cyan':
        return {
          borderColor: 'rgba(0, 240, 255, 0.45)',
          shadowColor: '#00F0FF',
          shadowOpacity: 0.28,
          shadowRadius: 10,
        };
      case 'blue':
        return {
          borderColor: 'rgba(56, 189, 248, 0.45)',
          shadowColor: '#38BDF8',
          shadowOpacity: 0.28,
          shadowRadius: 10,
        };
      case 'none':
      default:
        return {
          borderColor: Colors.border,
          shadowColor: '#000000',
          shadowOpacity: 0.25,
          shadowRadius: 8,
        };
    }
  };

  const glowStyle = getGlowStyles();

  return (
    <View style={[styles.clayOuter, glowStyle, style]}>
      {/* Specular Top Lighting Edge for 3D Clay Depth */}
      <View style={styles.specularRim} />
      <View style={[styles.innerCore, innerStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  clayOuter: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 3.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.35)',
    padding: 2,
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: 'hidden',
  },
  specularRim: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
    zIndex: 1,
  },
  innerCore: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 21,
    padding: 16,
  },
});
