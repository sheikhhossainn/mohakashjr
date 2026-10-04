import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Radius } from '../../src/theme/layout';
import { DoubleBezelCard } from '../../src/components/DoubleBezelCard';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { ScalePressable } from '../../src/components/ScalePressable';
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

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBn = (n: number) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

export default function QuizHubScreen() {
  const router = useRouter();
  const { quizAttempts } = useAppStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    getLessons().then((data) => setLessons(data));
  }, []);

  const doneCount = lessons.filter((l) => (quizAttempts[l.id] || []).length > 0).length;

  return (
    <View style={styles.root}>
    <ScreenHeader title="কুইজ হাব" subtitle="জানা যাচাই করো, XP জিতে নাও" />
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
            <Text style={styles.xpBonusText}>+৬০ XP পর্যন্ত</Text>
          </View>
        </View>

        <Text style={styles.placementTitle}>তোমার মহাকাশ জ্ঞান যাচাই করো</Text>
        <Text style={styles.placementDesc}>
          ৫টি প্রশ্নের উত্তর দিয়ে দেখো তুমি মহাকাশ সম্পর্কে কতটা জানো, আর জিতে নাও XP!
        </Text>

        <TactileButton
          title="চ্যালেঞ্জ শুরু করো"
          onPress={() => router.push('/quiz/placement')}
          variant="gold"
          size="normal"
        />
      </DoubleBezelCard>

      {/* Per-Lesson Quizzes List */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>পাঠ ভিত্তিক কুইজ</Text>
        <Text style={styles.sectionCount}>
          {toBn(doneCount)}/{toBn(lessons.length)} সম্পন্ন
        </Text>
      </View>

      <View style={styles.quizList}>
        {lessons.map((lesson, idx) => {
          const attempts = quizAttempts[lesson.id] || [];
          const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : null;

          return (
            <ScalePressable
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
                      ? `সেরা স্কোর: ${toBn(bestScore ?? 0)}/${toBn(attempts[0].total_questions)} (${toBn(attempts.length)} বার চেষ্টা)`
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
                  <Text style={styles.startBadgeText}>খেলো</Text>
                  <ChevronRight size={14} color={Colors.primary} />
                </View>
              )}
            </ScalePressable>
          );
        })}
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 620,
    alignSelf: 'center',
    width: '100%',
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
    fontFamily: Typography.family.notoBold,
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
    fontFamily: Typography.family.notoBold,
  },
  placementTitle: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontFamily: Typography.family.notoBold,
    lineHeight: Typography.lineHeight.h2,
    marginBottom: 6,
  },
  placementDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.notoBold,
    lineHeight: Typography.lineHeight.h3,
  },
  quizList: {
    gap: 10,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
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
    backgroundColor: Colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizTextCol: {
    flex: 1,
  },
  quizLessonTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoBold,
    marginBottom: 2,
  },
  quizLessonMeta: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionCount: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
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
    fontFamily: Typography.family.notoBold,
  },
  startBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  startBadgeText: {
    color: Colors.primary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoBold,
  },
});
