import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Lightbulb, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Trophy, HelpCircle } from 'lucide-react-native';
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
          border: 'rgba(93, 211, 158, 0.45)',
          bg: '#102830',
          text: Colors.emerald,
          defaultTitle: 'দারুণ বলেছ, নভোচারী!',
          icon: <CheckCircle2 size={18} color={Colors.emerald} />,
          mood: 'excited' as const,
        };
      case 'incorrect':
        return {
          border: 'rgba(255, 122, 144, 0.45)',
          bg: '#251724',
          text: Colors.coral,
          defaultTitle: 'একটু ভুল হয়েছে, চলো শিখি!',
          icon: <AlertCircle size={18} color={Colors.coral} />,
          mood: 'thinking' as const,
        };
      case 'celebrate':
        return {
          border: 'rgba(255, 201, 77, 0.45)',
          bg: '#231E18',
          text: Colors.gold,
          defaultTitle: 'অসাধারণ পারফরম্যান্স!',
          icon: <Trophy size={18} color={Colors.gold} />,
          mood: 'waving' as const,
        };
      case 'neutral':
      default:
        return {
          border: 'rgba(76, 201, 224, 0.40)',
          bg: '#122238',
          text: Colors.cyan,
          defaultTitle: 'অ্যাস্ট্রো-বন্ধুর মহাকাশ পরামর্শ',
          icon: <HelpCircle size={18} color={Colors.cyan} />,
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

        {/* Mascot + Speech Body (natural story layout, no nested text input box) */}
        <View style={styles.bodyRow}>
          {customComponent ? (
            <View style={styles.avatarSlot}>{customComponent}</View>
          ) : (
            <View style={styles.avatarSlot}>
              <AnimatedMascot size={52} mood={theme.mood} />
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
                  {showHint ? 'ইঙ্গিত লুকাও' : 'মহাকাশ বিজ্ঞানীর গোপন ইঙ্গিত'}
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
    marginVertical: 10,
    width: '100%',
    alignSelf: 'stretch',
  },
  bubbleCard: {
    width: '100%',
    alignSelf: 'stretch',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
    flexShrink: 1,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  avatarSlot: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  speechTextCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  speechText: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.body,
    fontFamily: Typography.family.notoRegular,
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
  },
  hintBox: {
    marginTop: 12,
    backgroundColor: 'rgba(255, 201, 77, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 77, 0.20)',
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
    fontFamily: Typography.family.heading,
  },
  hintContent: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  hintBody: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
});
