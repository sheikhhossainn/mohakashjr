import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
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
  ChevronLeft,
  BookOpen,
} from 'lucide-react-native';

export default function LessonReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>মহাকাশ পাঠের পৃষ্ঠা খোলা হচ্ছে...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>দুঃখিত! পাঠটি খুঁজে পাওয়া যায়নি।</Text>
      </View>
    );
  }

  const handleStartQuiz = () => {
    completeLesson(lesson.id);
    router.push(`/quiz/${lesson.id}`);
  };

  const getIllustrationTopic = (lessonId: string): IllustrationTopic => {
    if (lessonId.includes('1') || lessonId.includes('moon')) return 'moon';
    if (lessonId.includes('2') || lessonId.includes('mars')) return 'mars';
    if (lessonId.includes('3') || lessonId.includes('iss')) return 'iss';
    if (lessonId.includes('4') || lessonId.includes('jwst')) return 'jwst';
    if (lessonId.includes('5')) return 'earth';
    if (lessonId.includes('6')) return 'sun';
    if (lessonId.includes('7')) return 'stars';
    return 'rocket';
  };

  const topic = getIllustrationTopic(lesson.id);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

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

      {/* Floating Bottom Navigation Bar */}
      <View style={styles.floatingBottomBar}>
        <GentleButton
          title="ফিরে যাও"
          onPress={() => router.back()}
          variant="ghost"
          size="normal"
          icon={<ChevronLeft size={18} color={Colors.textSecondary} />}
        />

        <GentleButton
          title="কৌতূহল যাচাই কুইজ ➔"
          onPress={handleStartQuiz}
          variant="gold"
          size="normal"
          icon={<BookOpen size={17} color={Colors.textDark} />}
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
    paddingBottom: 110,
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
    fontFamily: Typography.family.hindSemiBold,
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
    fontFamily: Typography.family.hindBold,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.size.hero,
    fontFamily: Typography.family.hindBold,
    lineHeight: Typography.lineHeight.hero,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  summary: {
    color: Colors.textSecondary,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    fontFamily: Typography.family.notoRegular,
  },
  softDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
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
    fontFamily: Typography.family.hindBold,
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
    borderColor: 'rgba(255, 255, 255, 0.06)',
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
    fontFamily: Typography.family.hindSemiBold,
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
    backgroundColor: 'rgba(15, 17, 40, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
