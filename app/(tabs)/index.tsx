import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { DoubleBezelCard } from '../../src/components/DoubleBezelCard';
import { TactileButton } from '../../src/components/TactileButton';
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
} from 'lucide-react-native';

// ─── Rotating NASA Facts ────────────────────────────────────────────────────
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
      {/* ── Telemetry Strip ─────────────────────────────── */}
      <SpaceTelemetryHUD />

      {/* ── HERO: Cadet Command Center ───────────────────── */}
      <View style={styles.heroShell}>
        {/* Archetype + Rank badges */}
        <View style={styles.heroBadgeRow}>
          <View style={[styles.archetypePill, { borderColor: archetypeInfo.accentColor + '60' }]}>
            <SpaceChoiceBadge type={cadetArchetype} size={22} isSelected />
            <Text style={[styles.archetypePillText, { color: archetypeInfo.accentColor }]}>
              {archetypeInfo.title_bn}
            </Text>
          </View>
          <View style={styles.rankPill}>
            <Star size={11} color={Colors.gold} fill={Colors.gold} />
            <Text style={styles.rankPillText}>{rankInfo.label_bn}</Text>
          </View>
        </View>

        {/* Avatar + Greeting */}
        <View style={styles.heroMain}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroGreeting}>স্বাগতম, {displayName}! 👨‍🚀</Text>
            <Text style={styles.heroMotto}>"{archetypeInfo.motto_bn}"</Text>
          </View>
          <AstronautAvatar size={76} rank={rank} showHalo />
        </View>

        {/* Fuel Cell Recharge CTA */}
        <View style={styles.fuelDivider} />
        {!fuelCharged ? (
          <Pressable
            style={({ pressed }) => [styles.rechargeBtn, pressed && styles.rechargeBtnPressed]}
            onPress={handleRecharge}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <View style={styles.rechargeIconBox}>
              <BatteryCharging size={15} color={Colors.gold} />
            </View>
            <View style={styles.rechargeTextBox}>
              <Text style={styles.rechargeLabel}>দৈনিক মহাকাশ জ্বালানি রিচার্জ</Text>
              <Text style={styles.rechargeSub}>থ্রাস্টার চার্জ করে +২৫ XP নাও</Text>
            </View>
            <View style={styles.rechargeXpBadge}>
              <Zap size={11} color={Colors.gold} fill={Colors.gold} />
              <Text style={styles.rechargeXpText}>+২৫</Text>
            </View>
          </Pressable>
        ) : (
          <View style={styles.fuelFullRow}>
            <CheckCircle2 size={15} color={Colors.emerald} />
            <Text style={styles.fuelFullText}>থ্রাস্টার সর্বোচ্চ ক্ষমতায় চার্জড! 🚀</Text>
          </View>
        )}
      </View>

      {/* ── Astro-Buddy Comms ────────────────────────────── */}
      <View style={styles.buddyShell}>
        <Pressable
          onPress={() => setMascotMood(mascotMood === 'waving' ? 'excited' : 'waving')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AnimatedMascot size={66} mood={mascotMood} />
        </Pressable>

        <View style={styles.buddyBubble}>
          <View style={styles.buddyBubbleHeader}>
            <View style={styles.buddyBubbleTitleRow}>
              <Sparkles size={12} color={Colors.pink} />
              <Text style={styles.buddyBubbleTitle}>অ্যাস্ট্রো-বন্ধুর বার্তা</Text>
            </View>
            <Pressable
              style={styles.factCycleBtn}
              onPress={() => setFactIndex((i) => (i + 1) % COSMIC_FACTS.length)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <RefreshCw size={10} color={Colors.cyan} />
              <Text style={styles.factCycleBtnText}>তথ্য বদলাও</Text>
            </Pressable>
          </View>
          <Text style={styles.buddyBubbleMsg}>{getBuddyMessage()}</Text>
        </View>
      </View>

      {/* ── XP Rank Progress ─────────────────────────────── */}
      <View style={styles.xpShell}>
        <View style={styles.xpShellHeader}>
          <Star size={14} color={Colors.gold} fill={Colors.gold} />
          <Text style={styles.xpShellTitle}>নভোচারী র‍্যাঙ্ক ও অভিজ্ঞতা</Text>
        </View>
        <XPProgressBar compact={false} />
      </View>

      {/* ── Smart Mission Dispatch ───────────────────────── */}
      <View style={[
        styles.missionShell,
        allDone && styles.missionShellEmerald,
        isAffinityLesson && !allDone && styles.missionShellGold,
        !isAffinityLesson && !allDone && styles.missionShellCyan,
      ]}>
        {/* Header badges */}
        <View style={styles.missionHeader}>
          <View style={styles.missionBadgeRow}>
            <View style={[
              styles.missionTypeBadge,
              { backgroundColor: allDone ? Colors.emeraldBg : isAffinityLesson ? Colors.goldBg : Colors.cyanBg }
            ]}>
              <Flame size={12} color={allDone ? Colors.emerald : isAffinityLesson ? Colors.gold : Colors.cyan} />
              <Text style={[
                styles.missionTypeBadgeText,
                { color: allDone ? Colors.emerald : isAffinityLesson ? Colors.gold : Colors.cyan }
              ]}>
                {allDone ? 'সব পাঠ সমাপ্ত! 🏆' : 'আজকের প্রধান অভিযান'}
              </Text>
            </View>
            {isAffinityLesson && !allDone && (
              <View style={styles.affinityChip}>
                <Sparkles size={10} color={Colors.emerald} />
                <Text style={styles.affinityChipText}>তোমার পছন্দের বিষয়</Text>
              </View>
            )}
          </View>
          {!allDone && nextLesson && (
            <View style={styles.xpRewardBadge}>
              <Zap size={11} color={Colors.gold} fill={Colors.gold} />
              <Text style={styles.xpRewardText}>+{nextLesson.xp_reward} XP</Text>
            </View>
          )}
        </View>

        {/* Lesson content */}
        {!allDone && nextLesson ? (
          <>
            <Text style={styles.missionTitle}>{nextLesson.title_bn} 🌕</Text>
            <Text style={styles.missionDesc}>{nextLesson.summary_bn}</Text>
            <View style={styles.missionMeta}>
              <Clock size={12} color={Colors.textMuted} />
              <Text style={styles.missionMetaText}>{nextLesson.read_time_minutes} মিনিট</Text>
              <Text style={styles.missionMetaDot}>·</Text>
              <Text style={styles.missionMetaText}>পাঠ #{nextLesson.order_index}</Text>
            </View>
            <TactileButton
              title="অভিযানে চলো ➔"
              onPress={() => router.push(`/lessons/${nextLesson.id}`)}
              variant="gold"
              size="normal"
            />
          </>
        ) : (
          <>
            <Text style={styles.missionTitle}>মিশন পাঠশালা বিজয়ী! 🏆</Text>
            <Text style={styles.missionDesc}>
              সমস্ত পাঠ সফলভাবে জয় করেছ! এবার চন্দ্রপৃষ্ঠে ল্যান্ডার অবতরণ করিয়ে বাস্তব অভিযান শুরু করো।
            </Text>
            <TactileButton
              title="চন্দ্রাভিযান শুরু করো ➔"
              onPress={() => router.push('/(tabs)/mission')}
              variant="emerald"
              size="normal"
            />
          </>
        )}
      </View>

      {/* ── Daily Cadet Quests ───────────────────────────── */}
      <View style={styles.questShell}>
        <View style={styles.questShellHeader}>
          <View style={styles.questShellTitleRow}>
            <Target size={14} color={Colors.cyan} />
            <Text style={styles.questShellTitle}>আজকের ক্যাডেট মিশন</Text>
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
            ? <CheckCircle2 size={17} color={Colors.emerald} />
            : <Circle size={17} color="rgba(255,255,255,0.22)" />}
          <View style={styles.questInfo}>
            <Text style={[styles.questTitle, q1Done && styles.questTitleDone]}>
              ১টি মহাকাশ পাঠ সম্পন্ন করো
            </Text>
            <Text style={styles.questSub}>
              {q1Done ? '✓ সম্পন্ন!' : `${completedLessonIds.length} / ১ পাঠ পড়া হয়েছে`}
            </Text>
          </View>
          <View style={styles.questXP}>
            <Text style={styles.questXPText}>+২০ XP</Text>
          </View>
        </Pressable>

        <View style={styles.questDivider} />

        {/* Quest 2 */}
        <Pressable
          style={styles.questRow}
          onPress={() => router.push('/quiz')}
        >
          {q2Done
            ? <CheckCircle2 size={17} color={Colors.emerald} />
            : <Circle size={17} color="rgba(255,255,255,0.22)" />}
          <View style={styles.questInfo}>
            <Text style={[styles.questTitle, q2Done && styles.questTitleDone]}>
              ১টি কুইজ ডেক পরীক্ষা দাও
            </Text>
            <Text style={styles.questSub}>
              {q2Done ? '✓ সম্পন্ন!' : 'জ্ঞান যাচাই করে পয়েন্ট নাও'}
            </Text>
          </View>
          <View style={styles.questXP}>
            <Text style={styles.questXPText}>+১৫ XP</Text>
          </View>
        </Pressable>

        <View style={styles.questDivider} />

        {/* Quest 3 */}
        <View style={styles.questRow}>
          {q3Done
            ? <CheckCircle2 size={17} color={Colors.emerald} />
            : <Circle size={17} color="rgba(255,255,255,0.22)" />}
          <View style={styles.questInfo}>
            <Text style={[styles.questTitle, q3Done && styles.questTitleDone]}>
              ৫০+ XP শক্তি অর্জন করো
            </Text>
            <Text style={styles.questSub}>
              {Math.min(xp, 50)} / ৫০ XP সংগ্রহ হয়েছে
            </Text>
          </View>
          <View style={styles.questXP}>
            <Text style={styles.questXPText}>+৫০ XP</Text>
          </View>
        </View>
      </View>

      {/* ── 2×2 Mission Control Bento Grid ──────────────── */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>স্পেস স্টেশন মডিউল</Text>
        <Text style={styles.sectionTag}>নেভিগেশন হাব</Text>
      </View>

      <View style={styles.bentoGrid}>
        {/* Lessons */}
        <Pressable
          style={({ pressed }) => [styles.bentoTile, styles.bentoTileCyan, pressed && styles.bentoTilePressed]}
          onPress={() => router.push('/(tabs)/lessons')}
        >
          <View style={[styles.bentoIcon, { backgroundColor: Colors.cyanBg }]}>
            <BookOpen size={20} color={Colors.cyan} />
          </View>
          <Text style={styles.bentoTileTitle}>পাঠাগার 📖</Text>
          <Text style={styles.bentoTileSub}>{completedLessonIds.length}/{lessons.length || 6}টি সমাপ্ত</Text>
          <View style={styles.bentoFooter}>
            <Text style={[styles.bentoAction, { color: Colors.cyan }]}>পাঠ শুরু</Text>
            <ChevronRight size={12} color={Colors.cyan} />
          </View>
        </Pressable>

        {/* Quiz */}
        <Pressable
          style={({ pressed }) => [styles.bentoTile, styles.bentoTileEmerald, pressed && styles.bentoTilePressed]}
          onPress={() => router.push('/quiz')}
        >
          <View style={[styles.bentoIcon, { backgroundColor: Colors.emeraldBg }]}>
            <HelpCircle size={20} color={Colors.emerald} />
          </View>
          <Text style={styles.bentoTileTitle}>কুইজ ডেক 🎮</Text>
          <Text style={styles.bentoTileSub}>{totalQuizzes}টি পরীক্ষা সম্পন্ন</Text>
          <View style={styles.bentoFooter}>
            <Text style={[styles.bentoAction, { color: Colors.emerald }]}>কুইজ নাও</Text>
            <ChevronRight size={12} color={Colors.emerald} />
          </View>
        </Pressable>

        {/* Mission */}
        <Pressable
          style={({ pressed }) => [styles.bentoTile, styles.bentoTilePurple, pressed && styles.bentoTilePressed]}
          onPress={() => router.push('/(tabs)/mission')}
        >
          <View style={[styles.bentoIcon, { backgroundColor: Colors.purpleBg }]}>
            <Rocket size={20} color={Colors.purple} />
          </View>
          <Text style={styles.bentoTileTitle}>চন্দ্রাভিযান 🌕</Text>
          <Text style={styles.bentoTileSub}>ল্যান্ডিং সিমুলেটর</Text>
          <View style={styles.bentoFooter}>
            <Text style={[styles.bentoAction, { color: Colors.purple }]}>অভিযান</Text>
            <ChevronRight size={12} color={Colors.purple} />
          </View>
        </Pressable>

        {/* Profile */}
        <Pressable
          style={({ pressed }) => [styles.bentoTile, styles.bentoTileGold, pressed && styles.bentoTilePressed]}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <View style={[styles.bentoIcon, { backgroundColor: Colors.goldBg }]}>
            <Award size={20} color={Colors.gold} />
          </View>
          <Text style={styles.bentoTileTitle}>ক্যাডেট ডসিয়ার 👨‍🚀</Text>
          <Text style={styles.bentoTileSub}>স্যুট ও পদক</Text>
          <View style={styles.bentoFooter}>
            <Text style={[styles.bentoAction, { color: Colors.gold }]}>প্রোফাইল</Text>
            <ChevronRight size={12} color={Colors.gold} />
          </View>
        </Pressable>
      </View>

      {/* ── Cosmic Fact Widget ───────────────────────────── */}
      <View style={styles.factShell}>
        <View style={styles.factHeader}>
          <View style={styles.factTitleRow}>
            <Sparkles size={13} color={Colors.purple} />
            <Text style={styles.factTitle}>মহাজাগতিক বিস্ময় (NASA Fact)</Text>
          </View>
          <Pressable
            style={styles.factNextBtn}
            onPress={() => setFactIndex((i) => (i + 1) % COSMIC_FACTS.length)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <RefreshCw size={11} color={Colors.cyan} />
            <Text style={styles.factNextText}>পরবর্তী</Text>
          </Pressable>
        </View>
        <Text style={styles.factBody}>{COSMIC_FACTS[factIndex]}</Text>
      </View>
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS (Deep Cosmic Dark — matched to onboarding aesthetic)
// ─────────────────────────────────────────────────────────────────────────────

/** Reusable surface: translucent indigo dark glass */
const GLASS_SURFACE = 'rgba(14, 18, 60, 0.88)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.09)';
const GLOW_SHADOW = { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 };
const CARD_RADIUS = 22;
const INNER_RADIUS = 18;
/** Bottom clay elevation lip color */
const CLAY_LIP = 'rgba(0, 0, 0, 0.40)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingTop: 8,
    paddingBottom: 48,
  },

  // ── HERO ─────────────────────────────────────────────
  heroShell: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: GLASS_SURFACE,
    borderRadius: CARD_RADIUS,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: 'rgba(56, 189, 248, 0.30)',
    borderBottomColor: CLAY_LIP,
    padding: 16,
    shadowColor: '#38BDF8',
    ...GLOW_SHADOW,
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
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 11,
    borderWidth: 1.5,
  },
  archetypePillText: {
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.30)',
  },
  rankPillText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
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
    fontWeight: Typography.weight.heavy,
    lineHeight: Typography.lineHeight.h1,
    marginBottom: 3,
  },
  heroMotto: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontStyle: 'italic',
  },
  fuelDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 14,
    marginBottom: 12,
  },
  rechargeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 184, 0, 0.11)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    borderColor: 'rgba(255, 184, 0, 0.32)',
    borderBottomColor: 'rgba(0,0,0,0.38)',
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  rechargeBtnPressed: {
    opacity: 0.78,
    borderBottomWidth: 1.5,
    transform: [{ translateY: 2 }],
  },
  rechargeIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 184, 0, 0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rechargeTextBox: { flex: 1 },
  rechargeLabel: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.heavy,
  },
  rechargeSub: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    marginTop: 1,
  },
  rechargeXpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,184,0,0.22)',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rechargeXpText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.heavy,
  },
  fuelFullRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.13)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.28)',
    paddingVertical: 9,
  },
  fuelFullText: {
    color: Colors.emerald,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },

  // ── ASTRO-BUDDY ───────────────────────────────────────
  buddyShell: {
    marginHorizontal: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: GLASS_SURFACE,
    borderRadius: CARD_RADIUS,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: 'rgba(255, 77, 139, 0.28)',
    borderBottomColor: CLAY_LIP,
    padding: 14,
    shadowColor: Colors.pink,
    ...GLOW_SHADOW,
  },
  buddyBubble: {
    flex: 1,
    backgroundColor: 'rgba(255, 77, 139, 0.10)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 139, 0.25)',
  },
  buddyBubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  buddyBubbleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  buddyBubbleTitle: {
    color: Colors.pink,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.heavy,
  },
  factCycleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,240,255,0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  factCycleBtnText: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: Typography.weight.bold,
  },
  buddyBubbleMsg: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontWeight: Typography.weight.medium,
  },

  // ── XP PROGRESS ──────────────────────────────────────
  xpShell: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: GLASS_SURFACE,
    borderRadius: CARD_RADIUS,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: 'rgba(255, 184, 0, 0.28)',
    borderBottomColor: CLAY_LIP,
    padding: 16,
    shadowColor: Colors.gold,
    ...GLOW_SHADOW,
  },
  xpShellHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  xpShellTitle: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
  },

  // ── MISSION DISPATCH ──────────────────────────────────
  missionShell: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: GLASS_SURFACE,
    borderRadius: CARD_RADIUS,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: 'rgba(0, 240, 255, 0.28)',
    borderBottomColor: CLAY_LIP,
    padding: 16,
    shadowColor: Colors.cyan,
    ...GLOW_SHADOW,
  },
  missionShellEmerald: {
    borderColor: 'rgba(16, 185, 129, 0.32)',
    shadowColor: Colors.emerald,
  },
  missionShellGold: {
    borderColor: 'rgba(255, 184, 0, 0.32)',
    shadowColor: Colors.gold,
  },
  missionShellCyan: {
    borderColor: 'rgba(0, 240, 255, 0.28)',
    shadowColor: Colors.cyan,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  missionBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  missionTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  missionTypeBadgeText: {
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  affinityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.emeraldBg,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  affinityChipText: {
    color: Colors.emerald,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  xpRewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.goldBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  xpRewardText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.heavy,
  },
  missionTitle: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.heavy,
    marginBottom: 6,
    lineHeight: Typography.lineHeight.h2,
  },
  missionDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    marginBottom: 12,
  },
  missionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  missionMetaText: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
  },
  missionMetaDot: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
  },

  // ── DAILY QUESTS ─────────────────────────────────────
  questShell: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: GLASS_SURFACE,
    borderRadius: CARD_RADIUS,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: 'rgba(0, 240, 255, 0.22)',
    borderBottomColor: CLAY_LIP,
    padding: 16,
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  questShellHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  questShellTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questShellTitle: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
  },
  questCounter: {
    backgroundColor: 'rgba(0,240,255,0.14)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.22)',
  },
  questCounterText: {
    color: Colors.cyan,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.heavy,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 4,
  },
  questInfo: { flex: 1 },
  questTitle: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    marginBottom: 1,
  },
  questTitleDone: { color: Colors.emerald },
  questSub: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
  },
  questXP: {
    backgroundColor: 'rgba(255,184,0,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 7,
  },
  questXPText: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: Typography.weight.heavy,
  },
  questDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 8,
  },

  // ── BENTO GRID ────────────────────────────────────────
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontWeight: Typography.weight.bold,
  },
  sectionTag: {
    color: Colors.cyan,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: 0.4,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  bentoTile: {
    width: '47.5%',
    backgroundColor: GLASS_SURFACE,
    borderRadius: INNER_RADIUS,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderBottomColor: CLAY_LIP,
    padding: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  bentoTilePressed: {
    opacity: 0.82,
    borderBottomWidth: 1.5,
    transform: [{ translateY: 2 }],
  },
  bentoTileCyan: { borderColor: 'rgba(0,240,255,0.30)', shadowColor: Colors.cyan },
  bentoTileEmerald: { borderColor: 'rgba(16,185,129,0.30)', shadowColor: Colors.emerald },
  bentoTilePurple: { borderColor: 'rgba(139,92,246,0.30)', shadowColor: Colors.purple },
  bentoTileGold: { borderColor: 'rgba(255,184,0,0.30)', shadowColor: Colors.gold },
  bentoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bentoTileTitle: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.heavy,
    marginBottom: 3,
  },
  bentoTileSub: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    marginBottom: 10,
  },
  bentoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  bentoAction: {
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.heavy,
  },

  // ── COSMIC FACTS ─────────────────────────────────────
  factShell: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: GLASS_SURFACE,
    borderRadius: CARD_RADIUS,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: 'rgba(139, 92, 246, 0.28)',
    borderBottomColor: CLAY_LIP,
    padding: 16,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
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
    color: Colors.purpleLight,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  factNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,240,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  factNextText: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: Typography.weight.bold,
  },
  factBody: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontWeight: Typography.weight.medium,
  },
});
