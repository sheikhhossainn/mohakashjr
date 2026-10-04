import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Radius, Space, Gutter, Touch } from '../../src/theme/layout';
import { StoryCard } from '../../src/components/StoryCard';
import { GentleButton } from '../../src/components/GentleButton';
import { AppLogo } from '../../src/components/AppLogo';
import { PlanetImage } from '../../src/components/PlanetImage';
import { ProgressRing } from '../../src/components/ProgressRing';
import { StarField } from '../../src/components/StarField';
import { useAppStore, RANK_THRESHOLDS } from '../../src/state/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLessons } from '../../src/services/lessonService';
import { SPACE_FACTS } from '../../src/content/spaceFacts';
import { Lesson } from '../../src/content/schema';
import { tapHaptic, successHaptic } from '../../src/utils/haptics';
import {
  BookOpen,
  HelpCircle,
  Zap,
  Bot,
  Play,
  RefreshCw,
  Lightbulb,
  Check,
  Gift,
  Rocket,
} from 'lucide-react-native';
import { getTranslation } from '../../src/i18n/translations';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    rank,
    xp,
    addXP,
    completedLessonIds,
    quizAttempts,
    language,
  } = useAppStore();

  const t = getTranslation(language);
  const en = language === 'en';

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * SPACE_FACTS.length));
  const [bonusClaimed, setBonusClaimed] = useState(false);

  const factFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    getLessons().then(setLessons);
  }, []);

  const rankInfo = RANK_THRESHOLDS[rank];
  const nextLesson = lessons.find((l) => !completedLessonIds.includes(l.id)) || lessons[0];
  const allDone = lessons.length > 0 && completedLessonIds.length >= lessons.length;
  const lessonProgress = lessons.length ? completedLessonIds.length / lessons.length : 0;

  const totalQuizzes = Object.values(quizAttempts).reduce((a, b) => a + b.length, 0);
  const quests = [
    {
      key: 'lesson',
      done: completedLessonIds.length > 0,
      progress: completedLessonIds.length > 0 ? 1 : 0,
      color: Colors.primary,
      Icon: BookOpen,
      label: en ? 'Read a lesson' : 'একটি পাঠ পড়ো',
      reward: 20,
      onPress: () => router.push('/(tabs)/lessons' as any),
    },
    {
      key: 'quiz',
      done: totalQuizzes > 0,
      progress: totalQuizzes > 0 ? 1 : 0,
      color: Colors.gold,
      Icon: HelpCircle,
      label: en ? 'Play a quiz' : 'একটি কুইজ খেলো',
      reward: 15,
      onPress: () => router.push('/quiz' as any),
    },
    {
      key: 'xp',
      done: xp >= 50,
      progress: Math.min(xp, 50) / 50,
      color: Colors.emerald,
      Icon: Zap,
      label: en ? 'Earn 50 XP' : '৫০ XP জমাও',
      reward: 25,
      onPress: () => router.push('/(tabs)/lessons' as any),
    },
  ];
  const doneCount = quests.filter((q) => q.done).length;

  const cycleFact = () => {
    tapHaptic();
    Animated.timing(factFade, { toValue: 0, duration: 160, useNativeDriver: true }).start(() => {
      // jump to a different random fact so it never repeats back-to-back
      setFactIndex((i) => (i + 1 + Math.floor(Math.random() * (SPACE_FACTS.length - 1))) % SPACE_FACTS.length);
      Animated.timing(factFade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const claimBonus = () => {
    if (bonusClaimed) return;
    successHaptic();
    addXP(25);
    setBonusClaimed(true);
  };

  const startNext = () => {
    if (allDone) router.push('/(tabs)/mission' as any);
    else if (nextLesson) router.push(`/lessons/${nextLesson.id}` as any);
  };

  const currentFact = SPACE_FACTS[factIndex];
  const rankLabel = en ? rankInfo?.label_en : rankInfo?.label_bn;

  const nextTitle = allDone
    ? (en ? 'You finished every lesson!' : 'সব পাঠ শেষ করেছ!')
    : nextLesson
      ? (en ? (t.lessonsData[nextLesson.id]?.title || nextLesson.title_bn) : nextLesson.title_bn)
      : (en ? 'Start your first lesson' : 'প্রথম পাঠ শুরু করো');

  const nextSummary = allDone
    ? (en ? 'Land on the Moon to earn your medal.' : 'চাঁদে নেমে তোমার পদক জিতে নাও।')
    : nextLesson
      ? (en ? (t.lessonsData[nextLesson.id]?.summary || nextLesson.summary_bn) : nextLesson.summary_bn)
      : '';

  return (
    <View style={styles.root}>
      <StarField />

      {/* One merged top bar: the logo on the left, rank and XP on the right */}
      <View style={[styles.topBar, { paddingTop: insets.top + Space.sm }]}>
        <AppLogo size={44} />
        <View style={styles.topBarRight}>
          <View style={styles.rankChip} accessibilityLabel={rankLabel}>
            <Text style={styles.rankChipText} numberOfLines={1}>
              {rankLabel}
            </Text>
          </View>
          <View style={styles.xpChip} accessibilityLabel={`${xp} XP`}>
            <Zap size={18} color={Colors.gold} fill={Colors.gold} />
            <Text style={styles.xpChipText}>{xp}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 2. NEXT ADVENTURE ───────────────────────────────── */}
        <StoryCard variant="elevated" style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroTopText}>
              <Text style={styles.eyebrow}>{en ? 'NEXT ADVENTURE' : 'পরবর্তী অভিযান'}</Text>
              <Text style={styles.heroTitle} numberOfLines={3}>
                {nextTitle}
              </Text>
            </View>
            <PlanetImage id="moon" size={72} />
          </View>

          {!!nextSummary && (
            <Text style={styles.heroSummary} numberOfLines={2}>
              {nextSummary}
            </Text>
          )}

          {lessons.length > 0 && (
          <View style={styles.lessonProgressRow}>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.round(lessonProgress * 100)}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {completedLessonIds.length}/{lessons.length}
            </Text>
          </View>
          )}

          <GentleButton
            title={allDone ? (en ? 'Go to the Moon' : 'চাঁদে যাও') : (en ? 'Start' : 'শুরু করো')}
            onPress={startNext}
            variant={allDone ? 'emerald' : 'primary'}
            size="large"
            fullWidth
            icon={allDone ? <Rocket size={22} color={Colors.textDark} /> : <Play size={22} color={Colors.textDark} fill={Colors.textDark} />}
          />
        </StoryCard>

        {/* ── 3. TODAY'S QUESTS ───────────────────────────────── */}
        <StoryCard style={styles.questCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{en ? 'Daily Missions' : 'দৈনিক মিশন'}</Text>
            <Text style={styles.sectionMeta}>{doneCount}/3</Text>
          </View>

          <View style={styles.ringRow}>
            {quests.map((q) => (
              <Pressable
                key={q.key}
                onPress={q.onPress}
                style={({ pressed }) => [styles.ringItem, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`${q.label}, +${q.reward} XP${q.done ? (en ? ', done' : ', সম্পন্ন') : ''}`}
              >
                <ProgressRing size={68} strokeWidth={6} progress={q.progress} color={q.done ? Colors.emerald : q.color}>
                  {q.done ? (
                    <Check size={26} color={Colors.emerald} strokeWidth={3} />
                  ) : (
                    <q.Icon size={24} color={q.color} />
                  )}
                </ProgressRing>
                <Text style={[styles.ringLabel, q.done && styles.ringLabelDone]} numberOfLines={2}>
                  {q.label}
                </Text>
                <Text style={styles.ringReward}>+{q.reward} XP</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={claimBonus}
            disabled={bonusClaimed}
            style={({ pressed }) => [styles.bonusRow, bonusClaimed && styles.bonusRowDone, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={en ? 'Claim daily star bonus' : 'দৈনিক স্টার বোনাস নাও'}
            accessibilityState={{ disabled: bonusClaimed }}
          >
            {bonusClaimed ? (
              <Check size={22} color={Colors.emerald} strokeWidth={3} />
            ) : (
              <Gift size={22} color={Colors.gold} />
            )}
            <Text style={[styles.bonusText, bonusClaimed && { color: Colors.emerald }]}>
              {bonusClaimed
                ? (en ? 'Bonus collected!' : 'বোনাস পেয়ে গেছ!')
                : (en ? 'Daily star bonus' : 'দৈনিক স্টার বোনাস')}
            </Text>
            {!bonusClaimed && <Text style={styles.bonusReward}>+25 XP</Text>}
          </Pressable>
        </StoryCard>

        {/* ── 4. EXPLORE ──────────────────────────────────────── */}
        <Text style={[styles.sectionTitle, styles.exploreTitle]}>{en ? 'Explore' : 'ঘুরে দেখো'}</Text>
        <View style={styles.tileRow}>
          {[
            { key: 'lessons', label: t.tabs.lessons, Icon: BookOpen, color: Colors.primary, bg: Colors.primaryBg, to: '/(tabs)/lessons' },
            { key: 'quiz', label: en ? 'Quiz' : 'কুইজ', Icon: HelpCircle, color: Colors.gold, bg: Colors.goldBg, to: '/quiz' },
            { key: 'rover', label: en ? 'Ask Rover' : 'রোভার', Icon: Bot, color: Colors.purple, bg: Colors.purpleBg, to: '/tutor' },
          ].map((tile) => (
            <Pressable
              key={tile.key}
              onPress={() => router.push(tile.to as any)}
              style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
              accessibilityRole="button"
              accessibilityLabel={tile.label}
            >
              <View style={[styles.tileIcon, { backgroundColor: tile.bg }]}>
                <tile.Icon size={28} color={tile.color} />
              </View>
              <Text style={styles.tileLabel} numberOfLines={1}>
                {tile.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── 5. DID YOU KNOW ─────────────────────────────────── */}
        <StoryCard style={styles.factCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.factTitleRow}>
              <Lightbulb size={20} color={Colors.gold} />
              <Text style={[styles.sectionTitle, styles.factTitle]} numberOfLines={1}>{en ? 'Did you know?' : 'তুমি কি জানো?'}</Text>
            </View>
            <Pressable
              onPress={cycleFact}
              style={({ pressed }) => [styles.factNextBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={en ? 'Show another fact' : 'আরেকটি তথ্য দেখো'}
            >
              <RefreshCw size={20} color={Colors.primary} />
            </Pressable>
          </View>
          <Animated.Text style={[styles.factText, { opacity: factFade }]}>
            {en ? currentFact.en : currentFact.bn}
          </Animated.Text>
        </StoryCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: {
    paddingHorizontal: Gutter,
    paddingTop: Space.sm,
    paddingBottom: Space.huge,
    maxWidth: 620,
    alignSelf: 'center',
    width: '100%',
    gap: Space.lg,
  },
  pressed: { opacity: 0.75 },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Gutter,
    paddingBottom: Space.sm,
    maxWidth: 620,
    alignSelf: 'center',
    width: '100%',
  },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: Space.sm, flexShrink: 1 },
  rankChip: {
    flexShrink: 1,
    minHeight: Touch.min - 8,
    justifyContent: 'center',
    paddingHorizontal: Space.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryBg,
  },
  rankChipText: {
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.headingSemi,
    color: Colors.primary,
  },
  xpChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs + 2,
    minHeight: Touch.min,
    paddingHorizontal: Space.md + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.goldBg,
  },
  xpChipText: {
    fontSize: Typography.size.body,
    fontFamily: Typography.family.heading,
    color: Colors.gold,
  },

  // Hero
  heroCard: { gap: Space.md },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Space.md },
  heroTopText: { flex: 1 },
  eyebrow: {
    fontSize: Typography.size.micro,
    lineHeight: Typography.lineHeight.micro,
    fontFamily: Typography.family.headingSemi,
    color: Colors.primary,
    marginBottom: Space.xs,
  },
  heroTitle: {
    fontSize: Typography.size.h1,
    lineHeight: Typography.lineHeight.h1,
    fontFamily: Typography.family.heading,
    color: Colors.text,
  },
  heroSummary: {
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    color: Colors.textSecondary,
  },
  lessonProgressRow: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: Colors.borderLight, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: Colors.primary },
  progressText: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingSemi,
    color: Colors.textSecondary,
  },

  // Section chrome
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: {
    fontSize: Typography.size.h3,
    lineHeight: Typography.lineHeight.h3,
    fontFamily: Typography.family.heading,
    color: Colors.text,
  },
  sectionMeta: {
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.headingSemi,
    color: Colors.textSecondary,
  },

  // Quests
  questCard: { gap: Space.lg },
  ringRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Space.sm },
  ringItem: { flex: 1, alignItems: 'center', gap: Space.xs, minHeight: Touch.min },
  ringLabel: {
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.headingSemi,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Space.xs,
  },
  ringLabelDone: { color: Colors.textMuted },
  ringReward: {
    fontSize: Typography.size.micro,
    lineHeight: Typography.lineHeight.micro,
    fontFamily: Typography.family.headingSemi,
    color: Colors.gold,
  },
  bonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    minHeight: Touch.primary,
    paddingHorizontal: Space.lg,
    borderRadius: Radius.sm + 4,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(255,201,77,0.35)',
  },
  bonusRowDone: { backgroundColor: Colors.emeraldBg, borderColor: 'rgba(93,211,158,0.35)' },
  bonusText: {
    flex: 1,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.headingSemi,
    color: Colors.text,
  },
  bonusReward: {
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
    color: Colors.gold,
  },

  // Explore
  exploreTitle: { marginBottom: -Space.xs },
  tileRow: { flexDirection: 'row', gap: Space.md },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: Space.md,
    paddingVertical: Space.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tilePressed: { backgroundColor: Colors.surfaceWarm, transform: [{ scale: 0.97 }] },
  tileIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.sm + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.headingSemi,
    color: Colors.text,
  },

  // Fact
  factCard: { gap: Space.md },
  factTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Space.sm },
  factTitle: { flexShrink: 1, fontFamily: Typography.family.notoBold },
  factNextBtn: {
    width: Touch.min,
    height: Touch.min,
    marginRight: -Space.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factText: {
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    fontFamily: Typography.family.notoRegular,
    color: Colors.textSecondary,
  },
});
