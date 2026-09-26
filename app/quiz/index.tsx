import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { DoubleBezelCard } from '../../src/components/DoubleBezelCard';
import { TactileButton } from '../../src/components/TactileButton';
import { Lesson } from '../../src/content/schema';
import { getLessons } from '../../src/services/lessonService';
import { useAppStore } from '../../src/state/useAppStore';
import {
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  Zap,
  Sparkles,
} from 'lucide-react-native';

export default function QuizHubScreen() {
  const router = useRouter();
  const { quizAttempts } = useAppStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    getLessons().then((data) => setLessons(data));
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Placement Challenge Banner */}
      <DoubleBezelCard glow="gold" style={styles.bannerMargin}>
        <View style={styles.bannerTagRow}>
          <View style={styles.bannerTag}>
            <Sparkles size={13} color={Colors.gold} />
            <Text style={styles.bannerTagText}>নাসা স্পেস চ্যালেঞ্জ</Text>
          </View>
          <View style={styles.xpBonusBadge}>
            <Zap size={12} color={Colors.gold} fill={Colors.gold} />
            <Text style={styles.xpBonusText}>+৫০ বোনাস XP</Text>
          </View>
        </View>

        <Text style={styles.placementTitle}>তোমার মহাকাশ জ্ঞান যাচাই করো 🌟</Text>
        <Text style={styles.placementDesc}>
          ক্যাডেট স্তর থেকে সরাসরি মহাকাশচারী স্তরে পদোন্নতি পেতে প্রশ্নের উত্তর দাও এবং বোনাস XP জিতে নাও!
        </Text>

        <TactileButton
          title="চ্যালেঞ্জ শুরু করো ➔"
          onPress={() => router.push('/quiz/placement')}
          variant="gold"
          size="normal"
        />
      </DoubleBezelCard>

      {/* Per-Lesson Quizzes List */}
      <Text style={styles.sectionTitle}>পাঠ ভিত্তিক কুইজসমূহ</Text>

      <View style={styles.quizList}>
        {lessons.map((lesson, idx) => {
          const attempts = quizAttempts[lesson.id] || [];
          const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : null;

          return (
            <Pressable
              key={lesson.id}
              style={styles.quizCard}
              onPress={() => router.push(`/quiz/${lesson.id}`)}
            >
              <View style={styles.quizCardLeft}>
                <View style={styles.quizIconCircle}>
                  <HelpCircle size={20} color={Colors.primary} />
                </View>
                <View style={styles.quizTextCol}>
                  <Text style={styles.quizLessonTitle}>{lesson.title_bn}</Text>
                  <Text style={styles.quizLessonMeta}>
                    {attempts.length > 0
                      ? `সেরা স্কোর: ${bestScore} (${attempts.length} বার চেষ্টা)`
                      : 'এখনও মূল্যায়ন করা হয়নি'}
                  </Text>
                </View>
              </View>

              {attempts.length > 0 ? (
                <View style={styles.scorePill}>
                  <CheckCircle2 size={14} color={Colors.emerald} />
                  <Text style={styles.scorePillText}>সম্পন্ন</Text>
                </View>
              ) : (
                <View style={styles.startBadge}>
                  <Text style={styles.startBadgeText}>খেলো ➔</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  bannerMargin: {
    marginBottom: 20,
  },
  bannerTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bannerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  bannerTagText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  xpBonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 184, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  xpBonusText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.heavy,
  },
  placementTitle: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.heavy,
    marginBottom: 6,
  },
  placementDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontWeight: Typography.weight.bold,
    marginBottom: 12,
  },
  quizList: {
    gap: 10,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceCard,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  quizCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  quizIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizTextCol: {
    flex: 1,
  },
  quizLessonTitle: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    marginBottom: 2,
  },
  quizLessonMeta: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.emeraldBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
  },
  scorePillText: {
    color: Colors.emerald,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  startBadge: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  startBadgeText: {
    color: Colors.primary,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
});
