import React, { useRef } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

export interface GentleButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'gold' | 'emerald' | 'coral' | 'pink' | 'purple' | 'outline' | 'ghost' | 'secondary';
  size?: 'small' | 'normal' | 'large';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

/**
 * GentleButton — Calm, tactile action button with natural spring dynamics.
 * Eliminates aggressive 3D "extrusion lips" in favor of soft surfaces
 * and responsive micro-spring physics.
 */
export const GentleButton: React.FC<GentleButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'normal',
  icon,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.92,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getTheme = () => {
    if (disabled) {
      return {
        bg: 'rgba(255, 255, 255, 0.06)',
        border: 'transparent',
        text: Colors.textMuted,
        iconColor: Colors.textMuted,
      };
    }

    switch (variant) {
      case 'gold':
        return {
          bg: Colors.gold,
          border: 'transparent',
          text: Colors.textDark,
          iconColor: Colors.textDark,
        };
      case 'emerald':
        return {
          bg: Colors.emerald,
          border: 'transparent',
          text: Colors.textDark,
          iconColor: Colors.textDark,
        };
      case 'coral':
        return {
          bg: Colors.coral,
          border: 'transparent',
          text: '#FFFFFF',
          iconColor: '#FFFFFF',
        };
      case 'purple':
        return {
          bg: Colors.purple,
          border: 'transparent',
          text: '#FFFFFF',
          iconColor: '#FFFFFF',
        };
      case 'pink':
        return {
          bg: Colors.pink,
          border: 'transparent',
          text: Colors.textDark,
          iconColor: Colors.textDark,
        };
      case 'secondary':
        return {
          bg: Colors.surfaceElevated,
          border: 'rgba(255, 255, 255, 0.08)',
          text: Colors.text,
          iconColor: Colors.text,
        };
      case 'outline':
        return {
          bg: 'transparent',
          border: 'rgba(255, 255, 255, 0.2)',
          text: Colors.text,
          iconColor: Colors.text,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          border: 'transparent',
          text: Colors.textSecondary,
          iconColor: Colors.textSecondary,
        };
      case 'primary':
      default:
        return {
          bg: Colors.primary,
          border: 'transparent',
          text: '#FFFFFF',
          iconColor: '#FFFFFF',
        };
    }
  };

  const theme = getTheme();

  const getSizing = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 14,
          fontSize: Typography.size.caption,
          minHeight: 40,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 28,
          borderRadius: 20,
          fontSize: Typography.size.h3,
          minHeight: 56,
        };
      case 'normal':
      default:
        return {
          paddingVertical: 13,
          paddingHorizontal: 22,
          borderRadius: 16,
          fontSize: Typography.size.bodySmall,
          minHeight: 48,
        };
    }
  };

  const sizing = getSizing();

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          {
            backgroundColor: theme.bg,
            borderColor: theme.border,
            borderWidth: theme.border !== 'transparent' ? 1 : 0,
            borderRadius: sizing.borderRadius,
            paddingVertical: sizing.paddingVertical,
            paddingHorizontal: sizing.paddingHorizontal,
            minHeight: sizing.minHeight,
            width: fullWidth ? '100%' : undefined,
          },
        ]}
      >
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.label,
              {
                color: theme.text,
                fontSize: sizing.fontSize,
                fontFamily: Typography.family.hindSemiBold,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: Typography.weight.bold,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
