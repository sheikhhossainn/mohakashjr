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

interface TactileButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'gold' | 'emerald' | 'coral' | 'pink' | 'purple' | 'outline' | 'ghost' | 'cyan';
  size?: 'small' | 'normal' | 'large';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  callsign?: string;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'normal',
  icon,
  disabled = false,
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 3,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Chunky 3D Color Pairing (Main Face + 3D Bottom Lip)
  const getTheme = () => {
    if (disabled) {
      return {
        face: '#1A2142',
        lip: '#121730',
        text: '#5B6999',
        iconBg: 'rgba(255, 255, 255, 0.05)',
      };
    }
    switch (variant) {
      case 'gold':
        return {
          face: Colors.gold,
          lip: Colors.goldDark,
          text: Colors.textDark,
          iconBg: 'rgba(0, 0, 0, 0.12)',
        };
      case 'emerald':
        return {
          face: Colors.emerald,
          lip: Colors.emeraldDark,
          text: '#FFFFFF',
          iconBg: 'rgba(0, 0, 0, 0.12)',
        };
      case 'coral':
        return {
          face: Colors.coral,
          lip: Colors.coralDark,
          text: '#FFFFFF',
          iconBg: 'rgba(0, 0, 0, 0.15)',
        };
      case 'pink':
        return {
          face: Colors.pink,
          lip: Colors.pinkDark,
          text: '#FFFFFF',
          iconBg: 'rgba(0, 0, 0, 0.15)',
        };
      case 'purple':
        return {
          face: Colors.purple,
          lip: Colors.purpleDark,
          text: '#FFFFFF',
          iconBg: 'rgba(0, 0, 0, 0.15)',
        };
      case 'cyan':
        return {
          face: Colors.cyan,
          lip: Colors.cyanDark,
          text: Colors.textDark,
          iconBg: 'rgba(0, 0, 0, 0.12)',
        };
      case 'outline':
        return {
          face: 'rgba(255, 255, 255, 0.08)',
          lip: 'rgba(255, 255, 255, 0.18)',
          text: '#FFFFFF',
          iconBg: 'rgba(255, 255, 255, 0.1)',
        };
      case 'ghost':
        return {
          face: 'transparent',
          lip: 'transparent',
          text: Colors.textSecondary,
          iconBg: 'rgba(255, 255, 255, 0.06)',
        };
      case 'primary':
      default:
        return {
          face: Colors.primary,
          lip: Colors.primaryDark,
          text: '#FFFFFF',
          iconBg: 'rgba(0, 0, 0, 0.15)',
        };
    }
  };

  const theme = getTheme();

  const getSizing = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 9,
          paddingHorizontal: 14,
          borderRadius: 16,
          fontSize: Typography.size.caption,
          iconSize: 22,
        };
      case 'large':
        return {
          paddingVertical: 15,
          paddingHorizontal: 24,
          borderRadius: 22,
          fontSize: Typography.size.h2,
          iconSize: 28,
        };
      case 'normal':
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 18,
          fontSize: Typography.size.body,
          iconSize: 24,
        };
    }
  };

  const sizing = getSizing();

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
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
          styles.buttonBase,
          {
            backgroundColor: theme.face,
            borderBottomColor: theme.lip,
            borderBottomWidth: 4,
            borderRadius: sizing.borderRadius,
            paddingVertical: sizing.paddingVertical,
            paddingHorizontal: sizing.paddingHorizontal,
          },
        ]}
      >
        <View style={styles.contentRow}>
          <Text
            style={[
              styles.label,
              {
                color: theme.text,
                fontSize: sizing.fontSize,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>

          {icon && (
            <View
              style={[
                styles.iconBubble,
                {
                  width: sizing.iconSize,
                  height: sizing.iconSize,
                  borderRadius: sizing.iconSize / 2,
                  backgroundColor: theme.iconBg,
                },
              ]}
            >
              {icon}
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontWeight: Typography.weight.heavy,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  iconBubble: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
