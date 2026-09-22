import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { DoubleBezelCard } from '../../src/components/DoubleBezelCard';
import { TactileButton } from '../../src/components/TactileButton';
import { Lesson } from '../../src/content/schema';
import { getLessonById } from '../../src/services/lessonService';
import { useAppStore } from '../../src/state/useAppStore';
import {
  Clock,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Zap,
} from 'lucide-react-native';

export default function LessonReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { completeLesson, completedLessonIds } = useAppStore();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getLessonById(id).then((data) => {
        setLesson(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>মহাকাশ পাঠ লোড হচ্ছে...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>দুঃখিত! পাঠটি খুঁজে পাওয়া যায়নি।</Text>
      </View>
    );
  }

  const handleStartQuiz = () => {
    completeLesson(lesson.id);
    router.push(`/quiz/${lesson.id}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Badge Row */}
        <View style={styles.badgeRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>
              {lesson.level === 'Cadet' ? 'ক্যাডেট পাঠ' : 'মহাকাশচারী পাঠ'}
            </Text>
          </View>
          <View style={styles.metaBadge}>
            <Clock size={12} color={Colors.textSecondary} />
            <Text style={styles.metaBadgeText}>{lesson.read_time_minutes} মিনিট পাঠ</Text>
          </View>
          <View style={styles.xpBadge}>
            <Zap size={12} color={Colors.gold} fill={Colors.gold} />
            <Text style={styles.xpBadgeText}>+{lesson.xp_reward} XP বোনাস</Text>
          </View>
        </View>

        {/* Hero Title & Mission Brief */}
        <Text style={styles.title}>{lesson.title_bn}</Text>
        <Text style={styles.summary}>{lesson.summary_bn}</Text>

        <View style={styles.divider} />

        {/* Chunked Story Content Blocks */}
        {lesson.blocks.map((block, idx) => {
          if (block.type === 'nasa_fact') {
            return (
              <DoubleBezelCard key={idx} glow="gold" style={styles.blockMargin}>
                <View style={styles.calloutHeader}>
                  <Sparkles size={18} color={Colors.gold} />
                  <Text style={styles.nasaFactTitle}>{block.heading_bn || 'নাসার মজার বিজ্ঞান তথ্য'}</Text>
                </View>
                <Text style={styles.calloutText}>{block.text_bn}</Text>
              </DoubleBezelCard>
            );
          }

          if (block.type === 'analogy') {
            return (
              <DoubleBezelCard key={idx} glow="blue" style={styles.blockMargin}>
                <View style={styles.calloutHeader}>
                  <Lightbulb size={18} color={Colors.primary} />
                  <Text style={styles.analogyTitle}>{block.heading_bn || 'দৈনন্দিন জীবনের সাথে তুলনা'}</Text>
                </View>
                <Text style={styles.calloutText}>{block.text_bn}</Text>
              </DoubleBezelCard>
            );
          }

          if (block.type === 'did_you_know') {
            return (
              <DoubleBezelCard key={idx} glow="purple" style={styles.blockMargin}>
                <View style={styles.calloutHeader}>
                  <HelpCircle size={18} color={Colors.purple} />
                  <Text style={styles.didYouKnowTitle}>{block.heading_bn || 'তুমি কি জানো?'}</Text>
                </View>
                <Text style={styles.calloutText}>{block.text_bn}</Text>
              </DoubleBezelCard>
            );
          }

          return (
            <View key={idx} style={styles.paragraphBlock}>
              {block.heading_bn && (
                <View style={styles.headingRow}>
                  <View style={styles.headingAccentBar} />
                  <Text style={styles.paragraphHeading}>{block.heading_bn}</Text>
                </View>
              )}
              <Text style={styles.paragraphText}>{block.text_bn}</Text>
            </View>
          );
        })}

        {/* Official NASA Reference Footnote */}
        {lesson.nasa_source && (
          <View style={styles.sourceFooter}>
            <View style={styles.sourceHeaderRow}>
              <ExternalLink size={13} color={Colors.primary} />
              <Text style={styles.sourceLabel}>তথ্যসূত্র: নাসা বিজ্ঞান ডাটাবেস (NASA Science)</Text>
            </View>
            <Text style={styles.sourceUrl}>{lesson.nasa_source}</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={styles.floatingBottomBar}>
        <View style={styles.bottomBarLeft}>
          <Text style={styles.bottomBarTitle}>পাঠের জ্ঞান যাচাই কুইজ</Text>
          <Text style={styles.bottomBarSubtitle}>সঠিক উত্তরে অতিরিক্ত XP অর্জন করো!</Text>
        </View>

        <TactileButton
          title="কুইজে অংশ নাও ➔"
          onPress={handleStartQuiz}
          variant="gold"
          size="normal"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.body,
    marginTop: 12,
  },
  errorText: {
    color: Colors.coral,
    fontSize: Typography.size.body,
  },
  content: {
    padding: 18,
    paddingBottom: 120,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelBadgeText: {
    color: Colors.primary,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  metaBadgeText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  xpBadgeText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.heavy,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.size.hero,
    fontWeight: Typography.weight.heavy,
    lineHeight: Typography.lineHeight.hero,
    marginBottom: 8,
  },
  summary: {
    color: Colors.textSecondary,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 18,
  },
  blockMargin: {
    marginBottom: 16,
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  nasaFactTitle: {
    color: Colors.gold,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
  },
  analogyTitle: {
    color: Colors.primary,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
  },
  didYouKnowTitle: {
    color: Colors.purple,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
  },
  calloutText: {
    color: Colors.text,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
  },
  paragraphBlock: {
    marginBottom: 20,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  headingAccentBar: {
    width: 3,
    height: 18,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  paragraphHeading: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.bold,
  },
  paragraphText: {
    color: Colors.text,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
  },
  sourceFooter: {
    marginTop: 10,
    padding: 14,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sourceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sourceLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semiBold,
  },
  sourceUrl: {
    color: Colors.primary,
    fontSize: Typography.size.micro,
  },
  floatingBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#12173E',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBarLeft: {
    flex: 1,
    marginRight: 10,
  },
  bottomBarTitle: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  bottomBarSubtitle: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
  },
});
