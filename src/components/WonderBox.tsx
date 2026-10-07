import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Lightbulb, Compass, HelpCircle } from 'lucide-react-native';

export type WonderBoxType = 'analogy' | 'fact' | 'wonder' | 'curiosity';

interface WonderBoxProps {
  type?: WonderBoxType;
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * WonderBox — Illustrated insight box for natural learning absorption.
 * Employs subtle tinting and generous whitespace instead of harsh borders,
 * giving children a cozy, storybook callout experience.
 */
export const WonderBox: React.FC<WonderBoxProps> = ({
  type = 'fact',
  title,
  children,
  style,
}) => {
  const getTheme = () => {
    switch (type) {
      case 'analogy':
        return {
          bg: 'rgba(255, 200, 107, 0.10)',
          border: 'rgba(255, 200, 107, 0.25)',
          titleColor: Colors.gold,
          defaultTitle: 'সহজ কথায়',
          icon: <Lightbulb size={18} color={Colors.gold} />,
        };
      case 'wonder':
        return {
          bg: 'rgba(180, 142, 255, 0.10)',
          border: 'rgba(180, 142, 255, 0.25)',
          titleColor: Colors.purple,
          defaultTitle: 'একটু ভাবো...',
          icon: <HelpCircle size={18} color={Colors.purple} />,
        };
      case 'curiosity':
        return {
          bg: 'rgba(94, 214, 192, 0.10)',
          border: 'rgba(94, 214, 192, 0.25)',
          titleColor: Colors.emerald,
          defaultTitle: 'মহাকাশের রহস্য',
          icon: <Compass size={18} color={Colors.emerald} />,
        };
      case 'fact':
      default:
        return {
          bg: 'rgba(107, 138, 255, 0.10)',
          border: 'rgba(107, 138, 255, 0.25)',
          titleColor: Colors.primaryLight,
          defaultTitle: 'নাসার তথ্য',
          icon: <Compass size={18} color={Colors.primaryLight} />,
        };
    }
  };

  const theme = getTheme();
  const displayTitle = title || theme.defaultTitle;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bg,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>{theme.icon}</View>
        <Text
          style={[
            styles.title,
            {
              color: theme.titleColor,
              fontFamily: Typography.family.heading,
            },
          ]}
        >
          {displayTitle}
        </Text>
      </View>
      <View style={styles.contentWrap}>
        {typeof children === 'string' ? (
          <Text
            style={[
              styles.bodyText,
              {
                fontFamily: Typography.family.notoRegular,
              },
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.size.h3,
  },
  contentWrap: {},
  bodyText: {
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    color: Colors.text,
  },
});
