import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WonderBox } from '../../src/components/WonderBox';
import { GentleButton } from '../../src/components/GentleButton';
import { IllustrationHeader, IllustrationTopic } from '../../src/components/IllustrationHeader';
import { Lesson } from '../../src/content/schema';
import { getLessonById } from '../../src/services/lessonService';
import { useAppStore } from '../../src/state/useAppStore';
import {
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react-native';

export default function LessonReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeLesson } = useAppStore();
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
      <View style={styles.container}>
        <ScreenHeader title="মহাকাশ পাঠাগার" subtitle="পড়ো, জানো, কুইজ দাও" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>মহাকাশ পাঠের পৃষ্ঠা খোলা হচ্ছে...</Text>
        </View>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="মহাকাশ পাঠাগার" subtitle="পড়ো, জানো, কুইজ দাও" />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>দুঃখিত! পাঠটি খুঁজে পাওয়া যায়নি।</Text>
        </View>
      </View>
    );
  }

  const handleStartQuiz = () => {
    completeLesson(lesson.id);
    router.push(`/quiz/${lesson.id}`);
  };

  // Banner scene that matches each lesson's subject
  const LESSON_TOPICS: Record<string, IllustrationTopic> = {
    'lesson-1': 'moon', // Apollo 11
    'lesson-2': 'earth', // microgravity
    'lesson-3': 'rocket', // rockets
    'lesson-4': 'moon', // lunar ice
    'lesson-5': 'stars', // spacesuits
    'lesson-6': 'iss', // space station
    'lesson-7': 'mars', // Mars rovers
    'lesson-8': 'jwst', // Webb telescope
  };
  const getIllustrationTopic = (lessonId: string): IllustrationTopic => LESSON_TOPICS[lessonId] ?? 'rocket';

  const topic = getIllustrationTopic(lesson.id);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader title="মহাকাশ পাঠাগার" subtitle="পড়ো, জানো, কুইজ দাও" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Full-width Storybook Illustration Header */}
        <IllustrationHeader topic={topic} height={190} />

        {/* Content Body with Generous Book Margins */}
        <View style={styles.bookPage}>
          {/* Metadata Badges */}
          <View style={styles.badgeRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>
                {lesson.level === 'Cadet' ? 'ক্যাডেট অভিযাত্রা' : 'মহাকাশচারী অভিযাত্রা'}
              </Text>
            </View>
            <View style={styles.metaBadge}>
              <Clock size={13} color={Colors.textSecondary} />
              <Text style={styles.metaBadgeText}>{lesson.read_time_minutes} মিনিট পাঠ</Text>
            </View>
            <View style={styles.xpBadge}>
              <Sparkles size={13} color={Colors.gold} />
              <Text style={styles.xpBadgeText}>+{lesson.xp_reward} XP</Text>
            </View>
          </View>

          {/* Chapter Heading */}
          <Text style={styles.title}>{lesson.title_bn}</Text>
          <Text style={styles.summary}>{lesson.summary_bn}</Text>

          <View style={styles.softDivider} />

          {/* Content Story Blocks */}
          {lesson.blocks.map((block, idx) => {
            if (block.type === 'nasa_fact') {
              return (
                <WonderBox
                  key={idx}
                  type="fact"
                  title={block.heading_bn || 'নাসার মজার বিজ্ঞান তথ্য'}
                >
                  {block.text_bn}
                </WonderBox>
              );
            }

            if (block.type === 'analogy') {
              return (
                <WonderBox
                  key={idx}
                  type="analogy"
                  title={block.heading_bn || 'সহজ কথায় বুঝে নাও'}
                >
                  {block.text_bn}
                </WonderBox>
              );
            }

            if (block.type === 'did_you_know') {
              return (
                <WonderBox
                  key={idx}
                  type="curiosity"
                  title={block.heading_bn || 'তুমি কি জানো?'}
                >
                  {block.text_bn}
                </WonderBox>
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

          {/* Wonder Reflection Box */}
          <WonderBox type="wonder" title="একটু ভাবো ও আলোচনা করো">
            মহাকাশের এই অবিশ্বাস্য তথ্যটি তোমার মনের ভেতরে কেমন অনুভূতি জাগায়? তোমার বন্ধুদের সাথে কি এটি আলোচনা করেছো?
          </WonderBox>

          {/* Official NASA Science Source */}
          {lesson.nasa_source && (
            <View style={styles.sourceFooter}>
              <View style={styles.sourceHeaderRow}>
                <ExternalLink size={13} color={Colors.primaryLight} />
                <Text style={styles.sourceLabel}>তথ্যসূত্র: নাসা বিজ্ঞান ডাটাবেস (NASA Science)</Text>
              </View>
              <Text style={styles.sourceUrl}>{lesson.nasa_source}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* One CTA, pinned above the home indicator */}
      <View style={[styles.floatingBottomBar, { paddingBottom: Math.max(insets.bottom, 12) + 2 }]}>
        <GentleButton
          title="কৌতূহল যাচাই কুইজ"
          onPress={handleStartQuiz}
          variant="gold"
          size="large"
          fullWidth
          icon={<BookOpen size={18} color={Colors.textDark} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.body,
    fontFamily: Typography.family.notoRegular,
    marginTop: 12,
  },
  errorText: {
    color: Colors.coral,
    fontSize: Typography.size.body,
    fontFamily: Typography.family.notoRegular,
  },
  content: {
    paddingBottom: 120,
  },
  bookPage: {
    paddingHorizontal: 22,
    paddingTop: 20,
    maxWidth: 620,
    alignSelf: 'center',
    width: '100%',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  levelBadge: {
    backgroundColor: 'rgba(107, 138, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  levelBadgeText: {
    color: Colors.primaryLight,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingSemi,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  metaBadgeText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 200, 107, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  xpBadgeText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.heading,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.size.hero,
    fontFamily: Typography.family.heading,
    lineHeight: Typography.lineHeight.hero,
    marginBottom: 10,
  },
  summary: {
    color: Colors.textSecondary,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    fontFamily: Typography.family.notoRegular,
  },
  softDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 22,
  },
  paragraphBlock: {
    marginBottom: 24,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  headingAccentBar: {
    width: 3.5,
    height: 20,
    backgroundColor: Colors.primaryLight,
    borderRadius: 2,
  },
  paragraphHeading: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontFamily: Typography.family.heading,
  },
  paragraphText: {
    color: Colors.text,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    fontFamily: Typography.family.notoRegular,
    opacity: 0.94,
  },
  sourceFooter: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
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
    fontFamily: Typography.family.headingSemi,
  },
  sourceUrl: {
    color: Colors.primaryLight,
    fontSize: Typography.size.micro,
  },
  floatingBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
});
