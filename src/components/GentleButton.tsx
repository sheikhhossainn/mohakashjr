import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { PressScaleView } from './PressScaleView';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { tapHaptic } from '../utils/haptics';

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
 * GentleButton 2.0 — Duolingo-inspired clay button with warm palette.
 *
 * Visual design:
 * - Solid fill colors (no glass/dark-void)
 * - 3px bottom "clay shadow" for physical depth (Duolingo pattern)
 * - Spring scale on press — feels tactile and alive
 * - Minimum 48pt touch target for children's hands
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
  const [pressed, setPressed] = useState(false);

  const handlePressIn = () => {
    if (disabled) return;
    tapHaptic();
    setPressed(true);
  };

  const handlePressOut = () => setPressed(false);

  const getTheme = () => {
    if (disabled) {
      return {
        bg: Colors.surfaceWarm,
        shadow: Colors.surface,
        text: Colors.textMuted,
        iconColor: Colors.textMuted,
      };
    }

    switch (variant) {
      case 'gold':
        return {
          bg: Colors.gold,
          shadow: Colors.goldDark,
          text: '#1A1A2E',
          iconColor: '#1A1A2E',
        };
      case 'emerald':
        return {
          bg: Colors.emerald,
          shadow: Colors.emeraldDark,
          text: Colors.textDark,
          iconColor: Colors.textDark,
        };
      case 'coral':
        return {
          bg: Colors.coral,
          shadow: Colors.coralDark,
          text: Colors.textDark,
          iconColor: Colors.textDark,
        };
      case 'purple':
        return {
          bg: Colors.purple,
          shadow: Colors.purpleDark,
          text: Colors.textDark,
          iconColor: Colors.textDark,
        };
      case 'pink':
        return {
          bg: Colors.pink,
          shadow: Colors.pinkDark,
          text: Colors.textDark,
          iconColor: Colors.textDark,
        };
      case 'secondary':
        return {
          bg: Colors.surfaceElevated,
          shadow: Colors.borderMedium,
          text: Colors.primary,
          iconColor: Colors.primary,
        };
      case 'outline':
        return {
          bg: Colors.surface,
          shadow: Colors.borderMedium,
          text: Colors.primary,
          iconColor: Colors.primary,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          shadow: 'transparent',
          text: Colors.textSecondary,
          iconColor: Colors.textSecondary,
        };
      case 'primary':
      default:
        return {
          bg: Colors.primary,
          shadow: Colors.primaryDark,
          text: Colors.textDark,
          iconColor: Colors.textDark,
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
          fontSize: Typography.size.bodySmall,
          minHeight: 48,
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
          minHeight: 52,
        };
    }
  };

  const sizing = getSizing();

  return (
    <PressScaleView
      pressed={pressed}
      sink={2}
      style={[
        { width: fullWidth ? '100%' : undefined },
        style,
      ]}
    >
      {/* Clay shadow layer — sits behind the button, gives 3D depth */}
      {theme.shadow !== 'transparent' && (
        <View
          style={[
            styles.clayLayer,
            {
              backgroundColor: theme.shadow,
              borderRadius: sizing.borderRadius,
              bottom: -3,
            },
          ]}
        />
      )}
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          {
            backgroundColor: theme.bg,
            borderColor: variant === 'outline' ? Colors.borderMedium : 'transparent',
            borderWidth: variant === 'outline' ? 1.5 : 0,
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
                fontFamily: Typography.family.headingSemi,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      </Pressable>
    </PressScaleView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  // The clay shadow layer — creates Duolingo-style physical depth
  clayLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 0,
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
  },
});
