import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Lightbulb, ChevronDown, ChevronUp, CheckCircle, Sparkles, AlertCircle } from 'lucide-react-native';
import { AnimatedMascot } from './AnimatedMascot';

interface MascotFeedbackSlotProps {
  state: 'correct' | 'incorrect' | 'celebrate' | 'neutral';
  title?: string;
  message?: string;
  hint?: string;
  customComponent?: React.ReactNode;
}

export const MascotFeedbackSlot: React.FC<MascotFeedbackSlotProps> = ({
  state,
  title,
  message,
  hint,
  customComponent,
}) => {
  const [showHint, setShowHint] = useState(false);

  const getTheme = () => {
    switch (state) {
      case 'correct':
        return {
          border: 'rgba(16, 185, 129, 0.45)',
          bg: '#14273E',
          text: Colors.emerald,
          defaultTitle: 'দারুণ বলেছ, নভোচারী! 🌟',
          icon: <CheckCircle size={18} color={Colors.emerald} />,
          mood: 'excited' as const,
        };
      case 'incorrect':
        return {
          border: 'rgba(255, 71, 87, 0.45)',
          bg: '#2C1B33',
          text: Colors.coral,
          defaultTitle: 'একটু ভুল হয়েছে, চলো শিখি! 🚀',
          icon: <AlertCircle size={18} color={Colors.coral} />,
          mood: 'thinking' as const,
        };
      case 'celebrate':
        return {
          border: 'rgba(255, 184, 0, 0.45)',
          bg: '#2E271E',
          text: Colors.gold,
          defaultTitle: 'অসাধারণ পারফরম্যান্স! 🏆',
          icon: <Sparkles size={18} color={Colors.gold} />,
          mood: 'waving' as const,
        };
      case 'neutral':
      default:
        return {
          border: 'rgba(56, 189, 248, 0.45)',
          bg: '#181E52',
          text: Colors.cyan,
          defaultTitle: 'অ্যাস্ট্রো-বন্ধুর মহাকাশ পরামর্শ 👨‍🚀',
          icon: <Sparkles size={18} color={Colors.cyan} />,
          mood: 'happy' as const,
        };
    }
  };

  const theme = getTheme();

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.bubbleCard, { borderColor: theme.border, backgroundColor: theme.bg }]}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            {theme.icon}
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {title || theme.defaultTitle}
            </Text>
          </View>
        </View>

        {/* Mascot + Speech Body */}
        <View style={styles.bodyRow}>
          {customComponent ? (
            <View style={styles.avatarSlot}>{customComponent}</View>
          ) : (
            <View style={styles.avatarSlot}>
              <AnimatedMascot size={54} mood={theme.mood} />
            </View>
          )}

          <View style={styles.speechTextCol}>
            <Text style={styles.speechText}>
              {message || 'প্রশ্নের প্রতিটি অপশন মন দিয়ে পড়ে সঠিক উত্তরটি বেছে নাও!'}
            </Text>
          </View>
        </View>

        {/* Scientific Hint Accordion */}
        {hint && (
          <View style={styles.hintBox}>
            <Pressable
              style={styles.hintTrigger}
              onPress={() => setShowHint(!showHint)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <View style={styles.hintTriggerLeft}>
                <Lightbulb size={15} color={Colors.gold} />
                <Text style={styles.hintTriggerText}>
                  {showHint ? 'ইঙ্গিত লুকাও' : 'মহাকাশ বিজ্ঞানীর গোপন ইঙ্গিত 💡'}
                </Text>
              </View>
              {showHint ? (
                <ChevronUp size={16} color={Colors.gold} />
              ) : (
                <ChevronDown size={16} color={Colors.gold} />
              )}
            </Pressable>

            {showHint && (
              <View style={styles.hintContent}>
                <Text style={styles.hintBody}>{hint}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 12,
  },
  bubbleCard: {
    borderRadius: 22,
    borderWidth: 2,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: Typography.size.bodySmall,
    fontWeight: Typography.weight.bold,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarSlot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  speechTextCol: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  speechText: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontWeight: Typography.weight.medium,
  },
  hintBox: {
    marginTop: 12,
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.25)',
    overflow: 'hidden',
  },
  hintTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  hintTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hintTriggerText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  hintContent: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  hintBody: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
  },
});
