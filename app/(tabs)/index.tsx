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
  User,
  ShieldCheck,
  Languages,
} from 'lucide-react-native';
import { getTranslation } from '../../src/i18n/translations';

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
    currentUser,
    isGuest,
    language,
    setLanguage,
  } = useAppStore();

  const t = getTranslation(language);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [factIndex, setFactIndex] = useState(0);
  const [fuelCharged, setFuelCharged] = useState(false);
  const [mascotMood, setMascotMood] = useState<'happy' | 'waving' | 'excited' | 'thinking'>('waving');

  // Animation hooks for modern galactic micro-interactions
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const fuelScale = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    getLessons().then(setLessons);

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
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
      Animated.sequence([
        Animated.timing(fuelScale, { toValue: 1.06, duration: 120, useNativeDriver: true }),
        Animated.spring(fuelScale, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
      addXP(25);
      setFuelCharged(true);
      setMascotMood('excited');
      setTimeout(() => setMascotMood('happy'), 2200);
    }
  };

  const getBuddyMessage = () => {
    if (completedLessonIds.length === 0) {
      return language === 'en'
        ? `Welcome ${displayName}! You are a ${archetypeInfo.title_en} — launch your first space lesson today! 🚀`
        : `স্বাগতম ${displayName}! তুমি একজন ${archetypeInfo.title_bn} — আজ তোমার প্রথম মহাকাশ পাঠটি শুরু করো! 🚀`;
    }
    if (allDone) {
      return language === 'en'
        ? `Outstanding ${displayName}! You conquered all lessons. Now join the lunar lander touchdown mission! 🏆`
        : `সাবাশ ${displayName}! সব পাঠ জয় করেছ। এবার চন্দ্রপৃষ্ঠে ল্যান্ডার নামানোর অভিযানে যোগ দাও! 🏆`;
    }
    if (isAffinityLesson) {
      return language === 'en'
        ? `Today's mission is specially matched for a ${archetypeInfo.title_en} — power up thrusters! ⚡`
        : `আজকের পাঠটি বিশেষভাবে একজন ${archetypeInfo.title_bn}-এর জন্য তৈরি — রকেটের শক্তি পূর্ণ করো! ⚡`;
    }
    return language === 'en'
      ? `Hello Cadet ${displayName}! Complete daily lessons and quizzes to earn higher astronaut ranks. Deep space awaits!`
      : `প্রিয় ${displayName}! প্রতিদিন পাঠ ও কুইজ জয় করে নতুন পদমর্যাদা জয় করো। মহাকাশ তোমার অপেক্ষায়!`;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Top Cadet Command Bar ────────────────────────── */}
      <View style={styles.commandBar}>
        <View style={styles.statusGroup}>
          <Animated.View
            style={[
              styles.statusDot,
              {
                backgroundColor: isGuest ? Colors.gold : Colors.emerald,
                opacity: pulseAnim,
              },
            ]}
          />
          <Text style={[styles.statusText, { color: isGuest ? Colors.gold : Colors.emerald }]}>
            {isGuest ? t.common.guestMode : t.common.orbitSyncOnline}
          </Text>
        </View>

        <View style={styles.commandBarRight}>
          {/* Quick Language Toggle Pill */}
          <Pressable
            style={({ pressed }) => [
              styles.langToggleCapsule,
              pressed && styles.capsulePressed,
            ]}
            onPress={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Languages size={12} color={Colors.cyan} />
            <Text style={styles.langLabelText}>
              {language === 'bn' ? 'বাংলা 🇧🇩' : 'EN 🇺🇸'}
            </Text>
          </Pressable>

          {/* Account Capsule */}
          <Pressable
            style={({ pressed }) => [styles.accountCapsule, pressed && styles.capsulePressed]}
            onPress={() => router.push((isGuest ? '/auth' : '/(tabs)/profile') as any)}
          >
            <View style={[styles.accountIconBox, isGuest && styles.accountIconBoxGuest]}>
              {isGuest ? <User size={12} color={Colors.gold} /> : <ShieldCheck size={12} color={Colors.cyan} />}
            </View>
            <Text style={styles.accountNameText} numberOfLines={1}>
              {currentUser?.username ? `@${currentUser.username}` : displayName}
            </Text>
            <ChevronRight size={11} color={Colors.textMuted} />
          </Pressable>
        </View>
      </View>

      {/* ── Telemetry Strip ─────────────────────────────── */}
      <SpaceTelemetryHUD />

      {/* ── HERO: Cadet Identity Card ───────────────────────── */}
      <StoryCard accent="primary" style={styles.heroCard}>
        {/* Archetype + Rank badges */}
        <View style={styles.heroBadgeRow}>
          <View style={[styles.archetypePill, { borderColor: archetypeInfo.accentColor + '50' }]}>
            <SpaceChoiceBadge type={cadetArchetype} size={22} isSelected />
            <Text style={[styles.archetypePillText, { color: archetypeInfo.accentColor }]}>
              {language === 'en' ? archetypeInfo.title_en : archetypeInfo.title_bn}
            </Text>
          </View>
          <View style={styles.rankPill}>
            <Star size={12} color={Colors.gold} fill={Colors.gold} />
            <Text style={styles.rankPillText}>
              {language === 'en' ? rankInfo.label_en : rankInfo.label_bn}
            </Text>
          </View>
        </View>

        {/* Greeting & Avatar */}
        <View style={styles.heroMain}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroGreeting}>{t.dashboard.greeting}, {displayName}! 👨‍🚀</Text>
            <Text style={styles.heroMotto}>
              "{language === 'en' ? archetypeInfo.motto_en : archetypeInfo.motto_bn}"
            </Text>
          </View>
          <AstronautAvatar size={74} rank={rank} showHalo />
        </View>

        {/* Fuel Cell Energy Recharge */}
        <View style={styles.softDivider} />
        {!fuelCharged ? (
          <Animated.View style={{ transform: [{ scale: fuelScale }] }}>
            <Pressable
              style={({ pressed }) => [styles.rechargeBtn, pressed && styles.pressedState]}
              onPress={handleRecharge}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <View style={styles.rechargeIconBox}>
                <BatteryCharging size={16} color={Colors.gold} />
              </View>
              <View style={styles.rechargeTextBox}>
                <Text style={styles.rechargeLabel}>{t.dashboard.fuelRechargeTitle}</Text>
                <Text style={styles.rechargeSub}>{t.dashboard.fuelRechargeSub}</Text>
              </View>
              <View style={styles.rechargeXpBadge}>
                <Zap size={12} color={Colors.gold} fill={Colors.gold} />
                <Text style={styles.rechargeXpText}>+২৫</Text>
              </View>
            </Pressable>
          </Animated.View>
        ) : (
          <View style={styles.fuelFullRow}>
            <CheckCircle2 size={16} color={Colors.emerald} />
            <Text style={styles.fuelFullText}>{t.dashboard.fuelChargedTitle}</Text>
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
              <Text style={styles.buddyTitle}>{t.dashboard.buddyRadioTitle}</Text>
            </View>
            <Pressable
              style={styles.factCycleBtn}
              onPress={() => setFactIndex((i) => (i + 1) % t.cosmicFacts.length)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <RefreshCw size={11} color={Colors.primaryLight} />
              <Text style={styles.factCycleText}>{t.dashboard.buddyCycleBtn}</Text>
            </Pressable>
          </View>
          <Text style={styles.buddyMsg}>{getBuddyMessage()}</Text>

          <Pressable
            style={({ pressed }) => [styles.buddyChatBtn, pressed && styles.pressedState]}
            onPress={() => router.push('/tutor' as any)}
          >
            <Bot size={14} color={Colors.primaryLight} />
            <Text style={styles.buddyChatText}>{t.dashboard.chatWithRover}</Text>
            <ChevronRight size={13} color={Colors.primaryLight} />
          </Pressable>
        </StoryCard>
      </View>

      {/* ── XP Rank Progress ─────────────────────────────────── */}
      <StoryCard style={styles.xpCard}>
        <View style={styles.xpCardHeader}>
          <Star size={14} color={Colors.gold} fill={Colors.gold} />
          <Text style={styles.xpCardTitle}>{t.dashboard.rankTitle}</Text>
        </View>
        <XPProgressBar compact={false} />
      </StoryCard>

      {/* ── Smart Mission Dispatch (Next Lesson) ─────────────── */}
      <StoryCard accent={allDone ? 'emerald' : isAffinityLesson ? 'gold' : 'primary'} style={styles.dispatchCard}>
        <View style={styles.dispatchHeader}>
          <View style={styles.dispatchBadge}>
            <Flame size={13} color={allDone ? Colors.emerald : Colors.gold} />
            <Text style={[styles.dispatchBadgeText, { color: allDone ? Colors.emerald : Colors.gold }]}>
              {allDone ? t.dashboard.primeDirectiveAllDone : t.dashboard.primeDirectiveActive}
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
            <Text style={styles.dispatchTitle}>
              {language === 'en' ? (t.lessonsData[nextLesson.id]?.title || nextLesson.title_bn) : nextLesson.title_bn}
            </Text>
            <Text style={styles.dispatchDesc}>
              {language === 'en' ? (t.lessonsData[nextLesson.id]?.summary || nextLesson.summary_bn) : nextLesson.summary_bn}
            </Text>
            <View style={styles.dispatchMeta}>
              <Clock size={13} color={Colors.textMuted} />
              <Text style={styles.dispatchMetaText}>{nextLesson.read_time_minutes} {t.common.minutes}</Text>
              <Text style={styles.dispatchMetaDot}>·</Text>
              <Text style={styles.dispatchMetaText}>{t.common.lessonPrefix}{nextLesson.order_index}</Text>
            </View>
            <GentleButton
              title={t.dashboard.launchMission}
              onPress={() => router.push(`/lessons/${nextLesson.id}`)}
              variant="gold"
              size="normal"
            />
          </>
        ) : (
          <>
            <Text style={styles.dispatchTitle}>{t.dashboard.primeDirectiveAllDone}</Text>
            <Text style={styles.dispatchDesc}>
              {t.dashboard.allLessonsCelebration}
            </Text>
            <GentleButton
              title={t.dashboard.launchMoonMission}
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
            <Text style={styles.questTitle}>{t.dashboard.dailyQuestsTitle}</Text>
          </View>
          <View style={styles.questProgressContainer}>
            <View style={styles.questPillSegments}>
              <View style={[styles.questSegment, q1Done && styles.questSegmentDone]} />
              <View style={[styles.questSegment, q2Done && styles.questSegmentDone]} />
              <View style={[styles.questSegment, q3Done && styles.questSegmentDone]} />
            </View>
            <View style={styles.questCounter}>
              <Text style={styles.questCounterText}>{doneCount} / 3</Text>
            </View>
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
              {t.dashboard.quest1Title}
            </Text>
            <Text style={styles.questItemSub}>
              {q1Done ? t.common.completed : `${completedLessonIds.length} / 1 ${t.dashboard.quest1Sub}`}
            </Text>
          </View>
          <Text style={styles.questItemXP}>+20 XP</Text>
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
              {t.dashboard.quest2Title}
            </Text>
            <Text style={styles.questItemSub}>
              {q2Done ? t.common.completed : t.dashboard.quest2Sub}
            </Text>
          </View>
          <Text style={styles.questItemXP}>+15 XP</Text>
        </Pressable>

        <View style={styles.thinDivider} />

        {/* Quest 3 */}
        <View style={styles.questRow}>
          {q3Done
            ? <CheckCircle2 size={18} color={Colors.emerald} />
            : <Circle size={18} color="rgba(255,255,255,0.2)" />}
          <View style={styles.questInfo}>
            <Text style={[styles.questItemTitle, q3Done && styles.questItemTitleDone]}>
              {t.dashboard.quest3Title}
            </Text>
            <Text style={styles.questItemSub}>
              {q3Done ? t.common.completed : `${Math.min(xp, 50)} / 50 ${t.dashboard.quest3Sub}`}
            </Text>
          </View>
          <Text style={styles.questItemXP}>+50 XP</Text>
        </View>
      </StoryCard>

      {/* ── 2×2 Navigation Modules Grid ──────────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>{t.dashboard.bentoTitle}</Text>
        <Text style={styles.sectionSubtitle}>{t.dashboard.bentoTag}</Text>
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
          <Text style={styles.bentoTileTitle}>{t.dashboard.bentoLessonsTitle}</Text>
          <Text style={styles.bentoTileSub}>{completedLessonIds.length}/{lessons.length || 8} {t.dashboard.bentoLessonsSub}</Text>
          <View style={styles.bentoFooter}>
            <Text style={[styles.bentoAction, { color: Colors.primaryLight }]}>{t.dashboard.bentoLessonsAction}</Text>
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
          <Text style={styles.bentoTileTitle}>{t.dashboard.bentoQuizTitle}</Text>
          <Text style={styles.bentoTileSub}>{totalQuizzes} {t.dashboard.bentoQuizSub}</Text>
          <View style={styles.bentoFooter}>
            <Text style={[styles.bentoAction, { color: Colors.emerald }]}>{t.dashboard.bentoQuizAction}</Text>
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
          <Text style={styles.bentoTileTitle}>{t.dashboard.bentoMissionTitle}</Text>
          <Text style={styles.bentoTileSub}>{t.dashboard.bentoMissionSub}</Text>
          <View style={styles.bentoFooter}>
            <Text style={[styles.bentoAction, { color: Colors.purple }]}>{t.dashboard.bentoMissionAction}</Text>
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
          <Text style={styles.bentoTileTitle}>{t.dashboard.bentoProfileTitle}</Text>
          <Text style={styles.bentoTileSub}>{t.dashboard.bentoProfileSub}</Text>
          <View style={styles.bentoFooter}>
            <Text style={[styles.bentoAction, { color: Colors.gold }]}>{t.dashboard.bentoProfileAction}</Text>
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
              <Text style={styles.tutorTitle}>{t.dashboard.tutorTitle}</Text>
              <View style={styles.tutorBadge}>
                <Text style={styles.tutorBadgeText}>{t.dashboard.tutorBadge}</Text>
              </View>
            </View>
            <Text style={styles.tutorSub}>{t.dashboard.tutorSub}</Text>
          </View>
        </View>
        <ChevronRight size={16} color={Colors.primaryLight} />
      </Pressable>

      {/* ── Dashboard Settings & Language Control Card ───── */}
      <StoryCard accent="cyan" style={styles.langModuleCard}>
        <View style={styles.langModuleHeader}>
          <View style={styles.langModuleTitleRow}>
            <Languages size={15} color={Colors.cyan} />
            <Text style={styles.langModuleTitle}>{t.dashboard.langSwitcherTitle}</Text>
          </View>
          <Text style={styles.langModuleActiveTag}>
            {language === 'bn' ? 'বাংলা সক্রিয়' : 'English Active'}
          </Text>
        </View>

        <View style={styles.langSegmentRow}>
          <Pressable
            style={({ pressed }) => [
              styles.langSegmentBtn,
              language === 'bn' && styles.langSegmentBtnActive,
              pressed && styles.langSegmentBtnPressed,
            ]}
            onPress={() => setLanguage('bn')}
          >
            <Text style={styles.langSegmentFlag}>🇧🇩</Text>
            <Text style={[
              styles.langSegmentText,
              language === 'bn' && styles.langSegmentTextActive,
            ]}>
              বাংলা (Bangla)
            </Text>
            {language === 'bn' && (
              <CheckCircle2 size={13} color={Colors.cyan} style={{ marginLeft: 4 }} />
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.langSegmentBtn,
              language === 'en' && styles.langSegmentBtnActive,
              pressed && styles.langSegmentBtnPressed,
            ]}
            onPress={() => setLanguage('en')}
          >
            <Text style={styles.langSegmentFlag}>🇺🇸</Text>
            <Text style={[
              styles.langSegmentText,
              language === 'en' && styles.langSegmentTextActive,
            ]}>
              English
            </Text>
            {language === 'en' && (
              <CheckCircle2 size={13} color={Colors.cyan} style={{ marginLeft: 4 }} />
            )}
          </Pressable>
        </View>
      </StoryCard>

      {/* ── Cosmic Fact Widget ───────────────────────────────── */}
      <StoryCard style={styles.factCard}>
        <View style={styles.factHeader}>
          <View style={styles.factTitleRow}>
            <Sparkles size={14} color={Colors.gold} />
            <Text style={styles.factTitle}>{t.dashboard.factTitle}</Text>
          </View>
          <Pressable
            style={styles.factNextBtn}
            onPress={() => setFactIndex((i) => (i + 1) % t.cosmicFacts.length)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <RefreshCw size={12} color={Colors.primaryLight} />
            <Text style={styles.factNextText}>{t.dashboard.factNext}</Text>
          </Pressable>
        </View>
        <Text style={styles.factBody}>{t.cosmicFacts[factIndex % t.cosmicFacts.length]}</Text>
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

  // ── Command Bar ───────────────────────────────────────
  commandBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: 'rgba(22, 27, 61, 0.70)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  commandBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langToggleCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.35)',
  },
  langLabelText: {
    color: Colors.cyan,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  accountCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    maxWidth: 160,
  },
  capsulePressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  accountIconBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountIconBoxGuest: {
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
  },
  accountNameText: {
    color: Colors.text,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
    maxWidth: 90,
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
    backgroundColor: 'rgba(255, 200, 107, 0.20)',
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
    paddingVertical: 4,
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
    backgroundColor: 'rgba(255, 77, 139, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  factCycleText: {
    color: Colors.pink,
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
    backgroundColor: 'rgba(107, 138, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  buddyChatText: {
    color: Colors.primaryLight,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindSemiBold,
  },

  // ── XP Card ───────────────────────────────────────────
  xpCard: {
    marginHorizontal: 16,
    marginBottom: 14,
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
    backgroundColor: 'rgba(255, 200, 107, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dispatchBadgeText: {
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  dispatchXP: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 200, 107, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
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
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  dispatchMetaDot: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
  },

  // ── Quests ────────────────────────────────────────────
  questCard: {
    marginHorizontal: 16,
    marginBottom: 14,
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
  questProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questPillSegments: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  questSegment: {
    width: 14,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  questSegmentDone: {
    backgroundColor: Colors.emerald,
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
    paddingVertical: 10,
  },
  questInfo: { flex: 1 },
  questItemTitle: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindSemiBold,
    marginBottom: 2,
  },
  questItemTitleDone: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  questItemSub: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  questItemXP: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
  },
  thinDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },

  // ── Bento Grid ────────────────────────────────────────
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.hindBold,
  },
  sectionSubtitle: {
    color: Colors.primaryLight,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindSemiBold,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  bentoTile: {
    width: '48.4%',
    backgroundColor: 'rgba(22, 27, 61, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
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
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
    marginBottom: 2,
  },
  bentoTileSub: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
    marginBottom: 10,
  },
  bentoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bentoAction: {
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },

  // ── AI Tutor ──────────────────────────────────────────
  tutorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(22, 27, 61, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(107, 138, 255, 0.25)',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 14,
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
    backgroundColor: 'rgba(107, 138, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorTextBox: { flex: 1 },
  tutorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  tutorTitle: {
    color: Colors.text,
    fontSize: Typography.size.caption,
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

  // ── Language Settings Module ──────────────────────────
  langModuleCard: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  langModuleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  langModuleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langModuleTitle: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
  },
  langModuleActiveTag: {
    color: Colors.cyan,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  langSegmentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langSegmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  langSegmentBtnActive: {
    backgroundColor: 'rgba(0, 240, 255, 0.14)',
    borderColor: Colors.cyan,
    borderBottomWidth: 3,
    borderBottomColor: Colors.cyan,
  },
  langSegmentBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  langSegmentFlag: {
    fontSize: 14,
  },
  langSegmentText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.hindSemiBold,
  },
  langSegmentTextActive: {
    color: Colors.text,
    fontFamily: Typography.family.hindBold,
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
