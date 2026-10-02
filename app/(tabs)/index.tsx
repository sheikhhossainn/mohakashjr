import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { StoryCard } from '../../src/components/StoryCard';
import { GentleButton } from '../../src/components/GentleButton';
import { XPProgressBar } from '../../src/components/XPProgressBar';
import { AstronautAvatar } from '../../src/components/AstronautAvatar';
import { SpaceChoiceBadge } from '../../src/components/SpaceChoiceBadge';
import { AnimatedMascot } from '../../src/components/AnimatedMascot';
import { SpaceTelemetryHUD } from '../../src/components/SpaceTelemetryHUD';
import { useAppStore, ARCHETYPES, RANK_THRESHOLDS } from '../../src/state/useAppStore';
import { getLessons } from '../../src/services/lessonService';
import { Lesson } from '../../src/content/schema';
import {
  Sparkles,
  BookOpen,
  Rocket,
  Zap,
  HelpCircle,
  Star,
  Target,
  Award,
  BatteryCharging,
  RefreshCw,
  Clock,
  Flame,
  CheckCircle2,
  Circle,
  ChevronRight,
  Bot,
  Compass,
} from 'lucide-react-native';

const COSMIC_FACTS = [
  'সূর্য এতো বিশাল যে তার ভেতর প্রায় ১৩ লক্ষ পৃথিবী এঁটে যেতে পারে! ☀️',
  'মহাকাশে কোনো শব্দ নেই — শব্দের চলাচলে বাতাস লাগে, যা সেখানে অনুপস্থিত! 🤫',
  'চাঁদে তোমার ওজন পৃথিবীর মাত্র ৬ ভাগের ১ ভাগ হবে! 🌕',
  'শনি গ্রহের ঘনত্ব এতোটাই কম — বিশাল সমুদ্র থাকলে এটি ভেসে থাকত! 🪐',
  'ISS নভোচারীরা প্রতি ২৪ ঘণ্টায় ১৬ বার সূর্যোদয় দেখেন! 🚀',
  'শুক্র গ্রহে অ্যাসিড মেঘ আছে, তাপমাত্রা প্রায় ৪৬৫°C! 🌋',
  'চাঁদে নভোচারীদের পায়ের ছাপ কোটি বছর অক্ষত থাকবে! 👣',
];

export default function DashboardScreen() {
  const router = useRouter();
  const {
    displayName,
    rank,
    xp,
    addXP,
    completedLessonIds,
    quizAttempts,
    cadetArchetype,
  } = useAppStore();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [factIndex, setFactIndex] = useState(0);
  const [fuelCharged, setFuelCharged] = useState(false);
  const [mascotMood, setMascotMood] = useState<'happy' | 'waving' | 'excited' | 'thinking'>('waving');

  useEffect(() => {
    getLessons().then(setLessons);
  }, []);

  const archetypeInfo = ARCHETYPES[cadetArchetype] || ARCHETYPES.pilot;
  const rankInfo = RANK_THRESHOLDS[rank];

  // Smart next lesson
  const nextLesson = lessons.find((l) => !completedLessonIds.includes(l.id)) || lessons[0];
  const allDone = lessons.length > 0 && completedLessonIds.length >= lessons.length;

  // Archetype affinity check
  const isAffinityLesson =
    nextLesson &&
    ((cadetArchetype === 'pilot' && ['lesson-1', 'lesson-3', 'lesson-7'].includes(nextLesson.id)) ||
      (cadetArchetype === 'astronomer' && ['lesson-2', 'lesson-6', 'lesson-8'].includes(nextLesson.id)) ||
      (cadetArchetype === 'engineer' && ['lesson-3', 'lesson-5', 'lesson-6'].includes(nextLesson.id)) ||
      (cadetArchetype === 'explorer' && ['lesson-1', 'lesson-4', 'lesson-7'].includes(nextLesson.id)));

  // Quest progress
  const totalQuizzes = Object.values(quizAttempts).reduce((a, b) => a + b.length, 0);
  const q1Done = completedLessonIds.length > 0;
  const q2Done = totalQuizzes > 0;
  const q3Done = xp >= 50;
  const doneCount = (q1Done ? 1 : 0) + (q2Done ? 1 : 0) + (q3Done ? 1 : 0);

  const handleRecharge = () => {
    if (!fuelCharged) {
      addXP(25);
      setFuelCharged(true);
      setMascotMood('excited');
      setTimeout(() => setMascotMood('happy'), 2200);
    }
  };

  const getBuddyMessage = () => {
    if (completedLessonIds.length === 0)
      return `স্বাগতম ${displayName}! তুমি একজন ${archetypeInfo.title_bn} — আজ তোমার প্রথম মহাকাশ পাঠটি শুরু করো! 🚀`;
    if (allDone)
      return `সাবাশ ${displayName}! সব পাঠ জয় করেছ। এবার চন্দ্রপৃষ্ঠে ল্যান্ডার নামানোর অভিযানে যোগ দাও! 🏆`;
    if (isAffinityLesson)
      return `আজকের পাঠটি বিশেষভাবে একজন ${archetypeInfo.title_bn}-এর জন্য তৈরি — রকেটের শক্তি পূর্ণ করো! ⚡`;
    return `প্রিয় ${displayName}! প্রতিদিন পাঠ ও কুইজ জয় করে নতুন পদমর্যাদা জয় করো। মহাকাশ তোমার অপেক্ষায়!`;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Status HUD ──────────────────────────────────────── */}
      <SpaceTelemetryHUD />

      {/* ── HERO: Cadet Identity Card ───────────────────────── */}
      <StoryCard accent="primary" style={styles.heroCard}>
        {/* Archetype + Rank badges */}
        <View style={styles.heroBadgeRow}>
          <View style={[styles.archetypePill, { borderColor: archetypeInfo.accentColor + '50' }]}>
            <SpaceChoiceBadge type={cadetArchetype} size={22} isSelected />
            <Text style={[styles.archetypePillText, { color: archetypeInfo.accentColor }]}>
              {archetypeInfo.title_bn}
            </Text>
          </View>
          <View style={styles.rankPill}>
            <Star size={12} color={Colors.gold} fill={Colors.gold} />
            <Text style={styles.rankPillText}>{rankInfo.label_bn}</Text>
          </View>
        </View>

        {/* Greeting & Avatar */}
        <View style={styles.heroMain}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroGreeting}>সালাম, {displayName}! 👨‍🚀</Text>
            <Text style={styles.heroMotto}>"{archetypeInfo.motto_bn}"</Text>
          </View>
          <AstronautAvatar size={74} rank={rank} showHalo />
        </View>

        {/* Fuel Cell Energy Recharge */}
        <View style={styles.softDivider} />
        {!fuelCharged ? (
          <Pressable
            style={({ pressed }) => [styles.rechargeBtn, pressed && styles.pressedState]}
            onPress={handleRecharge}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <View style={styles.rechargeIconBox}>
              <BatteryCharging size={16} color={Colors.gold} />
            </View>
            <View style={styles.rechargeTextBox}>
              <Text style={styles.rechargeLabel}>দৈনিক মহাকাশ জ্বালানি সংগ্রহ</Text>
              <Text style={styles.rechargeSub}>থ্রাস্টার চার্জ করে +২৫ XP নাও</Text>
            </View>
            <View style={styles.rechargeXpBadge}>
              <Zap size={12} color={Colors.gold} fill={Colors.gold} />
              <Text style={styles.rechargeXpText}>+২৫</Text>
            </View>
          </Pressable>
        ) : (
          <View style={styles.fuelFullRow}>
            <CheckCircle2 size={16} color={Colors.emerald} />
            <Text style={styles.fuelFullText}>মহাকাশ জ্বালানি পূর্ণ হয়েছে! 🚀</Text>
          </View>
        )}
      </StoryCard>

      {/* ── Astro-Buddy Comms ────────────────────────────────── */}
      <View style={styles.buddyContainer}>
        <Pressable
          onPress={() => setMascotMood(mascotMood === 'waving' ? 'excited' : 'waving')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AnimatedMascot size={64} mood={mascotMood} />
        </Pressable>

        <StoryCard style={styles.buddyBubbleCard}>
          <View style={styles.buddyHeader}>
            <View style={styles.buddyTitleRow}>
              <Sparkles size={13} color={Colors.pink} />
              <Text style={styles.buddyTitle}>অ্যাস্ট্রো-বন্ধুর বার্তা</Text>
            </View>
            <Pressable
              style={styles.factCycleBtn}
              onPress={() => setFactIndex((i) => (i + 1) % COSMIC_FACTS.length)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <RefreshCw size={11} color={Colors.primaryLight} />
              <Text style={styles.factCycleText}>রহস্য বদলাও</Text>
            </Pressable>
          </View>
          <Text style={styles.buddyMsg}>{getBuddyMessage()}</Text>

          <Pressable
            style={({ pressed }) => [styles.buddyChatBtn, pressed && styles.pressedState]}
            onPress={() => router.push('/tutor' as any)}
          >
            <Bot size={14} color={Colors.primaryLight} />
            <Text style={styles.buddyChatText}>ক্যাপ্টেন রোভারের সাথে কথা বলো</Text>
            <ChevronRight size={13} color={Colors.primaryLight} />
          </Pressable>
        </StoryCard>
      </View>

      {/* ── XP Rank Progress ─────────────────────────────────── */}
      <StoryCard style={styles.xpCard}>
        <View style={styles.xpCardHeader}>
          <Compass size={15} color={Colors.gold} />
          <Text style={styles.xpCardTitle}>মহাকাশচারী অগ্রগতি ও অভিজ্ঞতা</Text>
        </View>
        <XPProgressBar compact={false} />
      </StoryCard>

      {/* ── Smart Mission Dispatch (Next Lesson) ─────────────── */}
      <StoryCard accent={allDone ? 'emerald' : isAffinityLesson ? 'gold' : 'primary'} style={styles.dispatchCard}>
        <View style={styles.dispatchHeader}>
          <View style={styles.dispatchBadge}>
            <Flame size={13} color={allDone ? Colors.emerald : Colors.gold} />
            <Text style={[styles.dispatchBadgeText, { color: allDone ? Colors.emerald : Colors.gold }]}>
              {allDone ? 'সকল পাঠ সম্পন্ন! 🏆' : 'আজকের প্রধান অভিযান'}
            </Text>
          </View>
          {!allDone && nextLesson && (
            <View style={styles.dispatchXP}>
              <Zap size={12} color={Colors.gold} fill={Colors.gold} />
              <Text style={styles.dispatchXPText}>+{nextLesson.xp_reward} XP</Text>
            </View>
          )}
        </View>

        {!allDone && nextLesson ? (
          <>
            <Text style={styles.dispatchTitle}>{nextLesson.title_bn}</Text>
            <Text style={styles.dispatchDesc}>{nextLesson.summary_bn}</Text>
            <View style={styles.dispatchMeta}>
              <Clock size={13} color={Colors.textMuted} />
              <Text style={styles.dispatchMetaText}>{nextLesson.read_time_minutes} মিনিট পাঠ</Text>
              <Text style={styles.dispatchMetaDot}>·</Text>
              <Text style={styles.dispatchMetaText}>পাঠ #{nextLesson.order_index}</Text>
            </View>
            <GentleButton
              title="পাঠ শুরু করো ➔"
              onPress={() => router.push(`/lessons/${nextLesson.id}`)}
              variant="gold"
              size="normal"
            />
          </>
        ) : (
          <>
            <Text style={styles.dispatchTitle}>মহাকাশ পাঠশালা বিজয়ী! 🏆</Text>
            <Text style={styles.dispatchDesc}>
              তুমি সফলভাবে সব পাঠ সম্পন্ন করেছ। এবার চাঁদের পৃষ্ঠে ল্যান্ডার নামানোর অভিযানে অংশ নাও!
            </Text>
            <GentleButton
              title="চন্দ্রাভিযান শুরু করো ➔"
              onPress={() => router.push('/(tabs)/mission')}
              variant="emerald"
              size="normal"
            />
          </>
        )}
      </StoryCard>

      {/* ── Daily Cadet Quests ───────────────────────────────── */}
      <StoryCard style={styles.questCard}>
        <View style={styles.questHeader}>
          <View style={styles.questTitleRow}>
            <Target size={15} color={Colors.primaryLight} />
            <Text style={styles.questTitle}>আজকের অভিযাত্রা লক্ষ্য</Text>
          </View>
          <View style={styles.questCounter}>
            <Text style={styles.questCounterText}>{doneCount} / ৩</Text>
          </View>
        </View>

        {/* Quest 1 */}
        <Pressable
          style={styles.questRow}
          onPress={() => router.push('/(tabs)/lessons')}
        >
          {q1Done
            ? <CheckCircle2 size={18} color={Colors.emerald} />
            : <Circle size={18} color="rgba(255,255,255,0.2)" />}
          <View style={styles.questInfo}>
            <Text style={[styles.questItemTitle, q1Done && styles.questItemTitleDone]}>
              ১টি মহাকাশ পাঠ সমাপ্ত করো
            </Text>
            <Text style={styles.questItemSub}>
              {q1Done ? '✓ সম্পন্ন হয়েছে!' : `${completedLessonIds.length} / ১ পাঠ সম্পন্ন`}
            </Text>
          </View>
          <Text style={styles.questItemXP}>+২০ XP</Text>
        </Pressable>

        <View style={styles.thinDivider} />

        {/* Quest 2 */}
        <Pressable
          style={styles.questRow}
          onPress={() => router.push('/quiz')}
        >
          {q2Done
            ? <CheckCircle2 size={18} color={Colors.emerald} />
            : <Circle size={18} color="rgba(255,255,255,0.2)" />}
          <View style={styles.questInfo}>
            <Text style={[styles.questItemTitle, q2Done && styles.questItemTitleDone]}>
              ১টি কুইজ ডেক পরীক্ষা দাও
            </Text>
            <Text style={styles.questItemSub}>
              {q2Done ? '✓ সম্পন্ন হয়েছে!' : 'কৌতূহল যাচাই করে পয়েন্ট নাও'}
            </Text>
          </View>
          <Text style={styles.questItemXP}>+১৫ XP</Text>
        </Pressable>

        <View style={styles.thinDivider} />

        {/* Quest 3 */}
        <View style={styles.questRow}>
          {q3Done
            ? <CheckCircle2 size={18} color={Colors.emerald} />
            : <Circle size={18} color="rgba(255,255,255,0.2)" />}
          <View style={styles.questInfo}>
            <Text style={[styles.questItemTitle, q3Done && styles.questItemTitleDone]}>
              ৫০+ XP শক্তি অর্জন করো
            </Text>
            <Text style={styles.questItemSub}>
              {Math.min(xp, 50)} / ৫০ XP সংগ্রহ হয়েছে
            </Text>
          </View>
          <Text style={styles.questItemXP}>+৫০ XP</Text>
        </View>
      </StoryCard>

      {/* ── 2×2 Navigation Modules Grid ──────────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>মহাকাশ মডিউল</Text>
        <Text style={styles.sectionSubtitle}>অন্বেষণ হাব</Text>
      </View>

      <View style={styles.bentoGrid}>
        {/* Lessons */}
        <Pressable
          style={({ pressed }) => [styles.bentoTile, pressed && styles.pressedState]}
          onPress={() => router.push('/(tabs)/lessons')}
        >
          <View style={[styles.bentoIcon, { backgroundColor: 'rgba(107, 138, 255, 0.15)' }]}>
            <BookOpen size={20} color={Colors.primaryLight} />
          </View>
          <Text style={styles.bentoTileTitle}>পাঠাগার 📖</Text>
          <Text style={styles.bentoTileSub}>{completedLessonIds.length}/{lessons.length || 8}টি সমাপ্ত</Text>
          <View style={styles.bentoFooter}>
            <Text style={[styles.bentoAction, { color: Colors.primaryLight }]}>পাঠ শুরু</Text>
            <ChevronRight size={13} color={Colors.primaryLight} />
          </View>
        </Pressable>

        {/* Quiz */}
        <Pressable
          style={({ pressed }) => [styles.bentoTile, pressed && styles.pressedState]}
          onPress={() => router.push('/quiz')}
        >
          <View style={[styles.bentoIcon, { backgroundColor: 'rgba(94, 214, 192, 0.15)' }]}>
            <HelpCircle size={20} color={Colors.emerald} />
          </View>
          <Text style={styles.bentoTileTitle}>কুইজ ডেক 🎮</Text>
          <Text style={styles.bentoTileSub}>{totalQuizzes}টি কুইজ সম্পন্ন</Text>
          <View style={styles.bentoFooter}>
            <Text style={[styles.bentoAction, { color: Colors.emerald }]}>কুইজ নাও</Text>
            <ChevronRight size={13} color={Colors.emerald} />
          </View>
        </Pressable>

        {/* Mission */}
        <Pressable
          style={({ pressed }) => [styles.bentoTile, pressed && styles.pressedState]}
          onPress={() => router.push('/(tabs)/mission')}
        >
          <View style={[styles.bentoIcon, { backgroundColor: 'rgba(180, 142, 255, 0.15)' }]}>
            <Rocket size={20} color={Colors.purple} />
          </View>
          <Text style={styles.bentoTileTitle}>চন্দ্রাভিযান 🌕</Text>
          <Text style={styles.bentoTileSub}>ল্যান্ডিং সিমুলেটর</Text>
          <View style={styles.bentoFooter}>
            <Text style={[styles.bentoAction, { color: Colors.purple }]}>অভিযান</Text>
            <ChevronRight size={13} color={Colors.purple} />
          </View>
        </Pressable>

        {/* Profile */}
        <Pressable
          style={({ pressed }) => [styles.bentoTile, pressed && styles.pressedState]}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <View style={[styles.bentoIcon, { backgroundColor: 'rgba(255, 200, 107, 0.15)' }]}>
            <Award size={20} color={Colors.gold} />
          </View>
          <Text style={styles.bentoTileTitle}>ক্যাডেট ডসিয়ার 👨‍🚀</Text>
          <Text style={styles.bentoTileSub}>পদবী ও অগ্রগতি</Text>
          <View style={styles.bentoFooter}>
            <Text style={[styles.bentoAction, { color: Colors.gold }]}>প্রোফাইল</Text>
            <ChevronRight size={13} color={Colors.gold} />
          </View>
        </Pressable>
      </View>

      {/* ── AI Tutor Mission Mentor Card ─────────────────────── */}
      <Pressable
        style={({ pressed }) => [styles.tutorCard, pressed && styles.pressedState]}
        onPress={() => router.push('/tutor' as any)}
      >
        <View style={styles.tutorLeft}>
          <View style={styles.tutorIconCircle}>
            <Bot size={22} color={Colors.primaryLight} />
          </View>
          <View style={styles.tutorTextBox}>
            <View style={styles.tutorTitleRow}>
              <Text style={styles.tutorTitle}>ক্যাপ্টেন রোভার এআই 🛰️</Text>
              <View style={styles.tutorBadge}>
                <Text style={styles.tutorBadgeText}>অফলাইন + অনলাইন</Text>
              </View>
            </View>
            <Text style={styles.tutorSub}>মহাকাশ নিয়ে তোমার যেকোনো প্রশ্ন বাংলায় জিজ্ঞেস করো!</Text>
          </View>
        </View>
        <ChevronRight size={16} color={Colors.primaryLight} />
      </Pressable>

      {/* ── Cosmic Fact Widget ───────────────────────────────── */}
      <StoryCard style={styles.factCard}>
        <View style={styles.factHeader}>
          <View style={styles.factTitleRow}>
            <Sparkles size={14} color={Colors.gold} />
            <Text style={styles.factTitle}>আজকের মহাজাগতিক বিস্ময়</Text>
          </View>
          <Pressable
            style={styles.factNextBtn}
            onPress={() => setFactIndex((i) => (i + 1) % COSMIC_FACTS.length)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <RefreshCw size={12} color={Colors.primaryLight} />
            <Text style={styles.factNextText}>পরবর্তী</Text>
          </Pressable>
        </View>
        <Text style={styles.factBody}>{COSMIC_FACTS[factIndex]}</Text>
      </StoryCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: 8,
    paddingBottom: 60,
    maxWidth: 620,
    alignSelf: 'center',
    width: '100%',
  },
  pressedState: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },

  // ── Hero ──────────────────────────────────────────────
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  archetypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  archetypePillText: {
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 200, 107, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 107, 0.25)',
  },
  rankPillText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  heroMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeft: {
    flex: 1,
    paddingRight: 12,
  },
  heroGreeting: {
    color: Colors.text,
    fontSize: Typography.size.h1,
    fontFamily: Typography.family.hindBold,
    marginBottom: 4,
  },
  heroMotto: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    fontStyle: 'italic',
  },
  softDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 14,
    marginBottom: 12,
  },
  rechargeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 200, 107, 0.10)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 107, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  rechargeIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 200, 107, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rechargeTextBox: { flex: 1 },
  rechargeLabel: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
  },
  rechargeSub: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  rechargeXpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 200, 107, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rechargeXpText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  fuelFullRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    backgroundColor: 'rgba(94, 214, 192, 0.12)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(94, 214, 192, 0.25)',
    paddingVertical: 9,
  },
  fuelFullText: {
    color: Colors.emerald,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindSemiBold,
  },

  // ── Astro-Buddy Comms ─────────────────────────────────
  buddyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 14,
    gap: 12,
  },
  buddyBubbleCard: {
    flex: 1,
    padding: 16,
  },
  buddyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  buddyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  buddyTitle: {
    color: Colors.pink,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
  },
  factCycleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(107, 138, 255, 0.10)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  factCycleText: {
    color: Colors.primaryLight,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindSemiBold,
  },
  buddyMsg: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    marginBottom: 10,
  },
  buddyChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(107, 138, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  buddyChatText: {
    color: Colors.primaryLight,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindSemiBold,
  },

  // ── XP Card ───────────────────────────────────────────
  xpCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
  },
  xpCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  xpCardTitle: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
  },

  // ── Dispatch ──────────────────────────────────────────
  dispatchCard: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  dispatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dispatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 200, 107, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dispatchBadgeText: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
  },
  dispatchXP: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 200, 107, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dispatchXPText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  dispatchTitle: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontFamily: Typography.family.hindBold,
    marginBottom: 6,
  },
  dispatchDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    marginBottom: 12,
  },
  dispatchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  dispatchMetaText: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },
  dispatchMetaDot: {
    color: Colors.textMuted,
  },

  // ── Quests ────────────────────────────────────────────
  questCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  questTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  questTitle: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.hindBold,
  },
  questCounter: {
    backgroundColor: 'rgba(107, 138, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  questCounterText: {
    color: Colors.primaryLight,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  questInfo: {
    flex: 1,
  },
  questItemTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.hindSemiBold,
  },
  questItemTitleDone: {
    color: Colors.emerald,
    textDecorationLine: 'line-through',
  },
  questItemSub: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
    marginTop: 2,
  },
  questItemXP: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
  },
  thinDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 10,
  },

  // ── Bento Grid ────────────────────────────────────────
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.hindBold,
  },
  sectionSubtitle: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  bentoTile: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },
  bentoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bentoTileTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.hindBold,
    marginBottom: 2,
  },
  bentoTileSub: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
    marginBottom: 12,
  },
  bentoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bentoAction: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindSemiBold,
  },

  // ── AI Tutor ──────────────────────────────────────────
  tutorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(107, 138, 255, 0.25)',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tutorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  tutorIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(107, 138, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorTextBox: {
    flex: 1,
  },
  tutorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  tutorTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.hindBold,
  },
  tutorBadge: {
    backgroundColor: 'rgba(94, 214, 192, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tutorBadgeText: {
    color: Colors.emerald,
    fontSize: 10,
    fontFamily: Typography.family.hindSemiBold,
  },
  tutorSub: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },

  // ── NASA Fact ─────────────────────────────────────────
  factCard: {
    marginHorizontal: 16,
  },
  factHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  factTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  factTitle: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
  },
  factNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(107, 138, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  factNextText: {
    color: Colors.primaryLight,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindSemiBold,
  },
  factBody: {
    color: Colors.text,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    fontFamily: Typography.family.notoRegular,
  },
});
