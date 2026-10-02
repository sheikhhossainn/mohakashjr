import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { StoryCard } from '../../src/components/StoryCard';
import { XPProgressBar } from '../../src/components/XPProgressBar';
import { AstronautAvatar } from '../../src/components/AstronautAvatar';
import { SpaceChoiceBadge } from '../../src/components/SpaceChoiceBadge';
import { GentleButton } from '../../src/components/GentleButton';
import { useAppStore, RANK_THRESHOLDS, ARCHETYPES } from '../../src/state/useAppStore';
import {
  CheckCircle2,
  RotateCcw,
  Sparkles,
  BookOpen,
  Target,
  Zap,
  Star,
  Award,
  Lock,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    displayName,
    rank,
    xp,
    completedLessonIds,
    quizAttempts,
    resetProgress,
    cadetArchetype,
  } = useAppStore();

  const threshold = RANK_THRESHOLDS[rank];
  const archetypeInfo = ARCHETYPES[cadetArchetype] || ARCHETYPES.pilot;

  const totalQuizzesAnswered = Object.values(quizAttempts).reduce(
    (acc, attempts) => acc + attempts.length,
    0
  );

  const suitTiers = [
    {
      tier: 'Cadet',
      title: 'স্পেস ক্যাডেট স্যুট',
      icon: '👨‍🚀',
      unlocked: true,
      condition: 'শুরুর স্তর',
    },
    {
      tier: 'Astronaut',
      title: 'গোল্ডেন ভিসার স্যুট',
      icon: '🌟',
      unlocked: rank !== 'Cadet',
      condition: '২০১ XP অর্জনে আনলক',
    },
    {
      tier: 'Mission Specialist',
      title: 'ডিপ স্পেস নেবুলা স্যুট',
      icon: '🌌',
      unlocked: rank === 'Mission Specialist' || rank === 'Commander',
      condition: '৬০১ XP অর্জনে আনলক',
    },
    {
      tier: 'Commander',
      title: 'মার্স কমান্ডার গোল্ডেন স্যুট',
      icon: '👑',
      unlocked: rank === 'Commander',
      condition: '১২০১ XP অর্জনে আনলক',
    },
  ];

  const badges = [
    {
      id: 'apollo-11',
      name_bn: 'প্রথম পদক্ষেপ পদক 🌟',
      desc_bn: 'প্রথম মহাকাশ পাঠ সফলভাবে সম্পন্ন করার সম্মাননা',
      icon: <Star size={20} color={Colors.gold} fill={Colors.gold} />,
      unlocked: completedLessonIds.length >= 1,
    },
    {
      id: 'artemis-lunar',
      name_bn: 'চাঁদের গবেষক 🌕',
      desc_bn: 'চাঁদ সম্পর্কিত পাঠ ও কুইজ জয় করার কৃতিত্ব',
      icon: <Award size={20} color={Colors.primaryLight} />,
      unlocked: completedLessonIds.includes('lesson-1'),
    },
    {
      id: 'propulsion-ace',
      name_bn: 'রকেট বিজ্ঞানী ব্যাজ 🚀',
      desc_bn: 'রকেট বিজ্ঞান ও মহাকর্ষের কুইজে শতভাগ সঠিক উত্তর',
      icon: <Zap size={20} color={Colors.emerald} fill={Colors.emerald} />,
      unlocked: totalQuizzesAnswered >= 1,
    },
    {
      id: 'astronaut-insignia',
      name_bn: 'অফিসিয়াল নভোচারী মেডেল 🏆',
      desc_bn: 'ক্যাডেট স্তর সফলভাবে পার করে মহাকাশচারী পদ অর্জন',
      icon: <Sparkles size={20} color={Colors.gold} />,
      unlocked: rank !== 'Cadet',
    },
  ];

  const handleConfirmReset = () => {
    Alert.alert(
      'অগ্রগতি রিসেট',
      'তুমি কি সত্যি তোমার সমস্ত মহাকাশ অগ্রগতি নতুন করে শুরু করতে চাও?',
      [
        { text: 'না', style: 'cancel' },
        { text: 'হ্যাঁ, রিসেট করো', style: 'destructive', onPress: () => resetProgress() },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Astronaut ID Badge Card */}
      <StoryCard accent="primary" style={styles.profileCard}>
        <View style={styles.dossierHeader}>
          <View style={styles.idChip}>
            <Text style={styles.idChipText}>মহাকাশ একাডেমি অফিসিয়াল আইডি</Text>
          </View>
          <View style={styles.activePill}>
            <View style={styles.activeDot} />
            <Text style={styles.activePillText}>সক্রিয় ক্যাডেট</Text>
          </View>
        </View>

        <View style={styles.avatarSection}>
          <AstronautAvatar size={84} rank={rank} showHalo />
          <Text style={styles.nameText}>{displayName}</Text>

          <View style={styles.rankPill}>
            <Sparkles size={14} color={Colors.gold} />
            <Text style={styles.rankPillText}>{threshold.label_bn}</Text>
          </View>
        </View>

        {/* Cadet Psychometric Archetype Badge */}
        <View style={[styles.archetypeDossierBox, { borderColor: archetypeInfo.accentColor + '40' }]}>
          <View style={styles.archetypeHeader}>
            <SpaceChoiceBadge type={cadetArchetype} size={40} isSelected />
            <View style={{ flex: 1 }}>
              <Text style={[styles.archetypeTitle, { color: archetypeInfo.accentColor }]}>{archetypeInfo.title_bn}</Text>
              <Text style={styles.archetypeMotto}>"{archetypeInfo.motto_bn}"</Text>
            </View>
          </View>
          <Text style={styles.archetypeDescText}>{archetypeInfo.description_bn}</Text>
        </View>
      </StoryCard>

      {/* Experience & Onboarding Replay Shortcuts */}
      <View style={styles.shortcutsRow}>
        <GentleButton
          title="ওরিয়েন্টেশন পরীক্ষা ✨"
          onPress={() => router.push('/onboarding')}
          variant="secondary"
          size="small"
          style={styles.shortcutBtn}
        />
        <GentleButton
          title="স্প্ল্যাশ দৃশ্য 🚀"
          onPress={() => router.push('/splash')}
          variant="secondary"
          size="small"
          style={styles.shortcutBtn}
        />
      </View>

      {/* Rank Suit Progression Tiers */}
      <Text style={styles.sectionHeading}>স্পেসস্যুট ও পদমর্যাদা অগ্রগতি</Text>
      <View style={styles.suitGrid}>
        {suitTiers.map((suit) => (
          <StoryCard
            key={suit.tier}
            style={[styles.suitCard, !suit.unlocked && styles.suitCardLocked]}
          >
            <Text style={styles.suitIcon}>{suit.icon}</Text>
            <Text style={[styles.suitTitle, !suit.unlocked && styles.textMuted]}>
              {suit.title}
            </Text>
            <View style={suit.unlocked ? styles.suitStatusUnlocked : styles.suitStatusLocked}>
              {suit.unlocked ? (
                <CheckCircle2 size={12} color={Colors.emerald} />
              ) : (
                <Lock size={12} color={Colors.textMuted} />
              )}
              <Text style={[styles.suitStatusText, { color: suit.unlocked ? Colors.emerald : Colors.textMuted }]}>
                {suit.unlocked ? 'আনলকড' : suit.condition}
              </Text>
            </View>
          </StoryCard>
        ))}
      </View>

      {/* Gamified XP Progress */}
      <Text style={styles.sectionHeading}>র‍্যাঙ্ক অগ্রগতি ও মাইলস্টোন</Text>
      <StoryCard style={styles.progressCard}>
        <XPProgressBar compact={false} />
      </StoryCard>

      {/* Stats Bento Grid */}
      <Text style={styles.sectionHeading}>অভিযাত্রা পরিসংখ্যান</Text>
      <View style={styles.statsGrid}>
        <StoryCard style={styles.statBox}>
          <Zap size={20} color={Colors.gold} fill={Colors.gold} style={styles.statIcon} />
          <Text style={styles.statNumber}>{xp}</Text>
          <Text style={styles.statLabel}>মোট অর্জিত XP</Text>
        </StoryCard>

        <StoryCard style={styles.statBox}>
          <BookOpen size={20} color={Colors.primaryLight} style={styles.statIcon} />
          <Text style={styles.statNumber}>{completedLessonIds.length}</Text>
          <Text style={styles.statLabel}>পড়া সম্পন্ন</Text>
        </StoryCard>

        <StoryCard style={styles.statBox}>
          <Target size={20} color={Colors.emerald} style={styles.statIcon} />
          <Text style={styles.statNumber}>{totalQuizzesAnswered}</Text>
          <Text style={styles.statLabel}>কুইজ সম্পন্ন</Text>
        </StoryCard>
      </View>

      {/* Badges Collection */}
      <Text style={styles.sectionHeading}>অর্জিত মহাকাশ পদক</Text>
      <View style={styles.badgesList}>
        {badges.map((b) => (
          <StoryCard
            key={b.id}
            accent={b.unlocked ? 'gold' : 'none'}
            style={[styles.badgeItemCard, !b.unlocked && styles.badgeLocked]}
          >
            <View style={[styles.badgeIconWrap, b.unlocked ? styles.badgeUnlockedWrap : styles.badgeLockedWrap]}>
              {b.icon}
            </View>
            <View style={styles.badgeInfo}>
              <Text style={[styles.badgeTitle, !b.unlocked && styles.textMuted]}>{b.name_bn}</Text>
              <Text style={styles.badgeDesc}>{b.desc_bn}</Text>
            </View>
            {b.unlocked ? (
              <View style={styles.badgeCheck}>
                <CheckCircle2 size={16} color={Colors.emerald} />
              </View>
            ) : (
              <Lock size={15} color={Colors.textMuted} />
            )}
          </StoryCard>
        ))}
      </View>

      {/* Danger Zone / Reset */}
      <View style={styles.resetWrap}>
        <GentleButton
          title="নতুন করে শুরু করো (রিসেট)"
          onPress={handleConfirmReset}
          variant="outline"
          size="normal"
          icon={<RotateCcw size={15} color={Colors.textSecondary} />}
          textStyle={{ color: Colors.textSecondary }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 60,
    maxWidth: 620,
    alignSelf: 'center',
    width: '100%',
  },
  profileCard: {
    marginBottom: 16,
  },
  dossierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  idChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  idChipText: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindSemiBold,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(94, 214, 192, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.emerald,
  },
  activePillText: {
    color: Colors.emerald,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  nameText: {
    color: Colors.text,
    fontSize: Typography.size.h1,
    fontFamily: Typography.family.hindBold,
    marginTop: 10,
    marginBottom: 6,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 200, 107, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 107, 0.25)',
  },
  rankPillText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
  },
  archetypeDossierBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  archetypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  archetypeTitle: {
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.hindBold,
  },
  archetypeMotto: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
    fontStyle: 'italic',
  },
  archetypeDescText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  shortcutBtn: {
    flex: 1,
  },
  sectionHeading: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.hindBold,
    marginBottom: 12,
    marginTop: 4,
  },
  suitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  suitCard: {
    width: '48%',
    padding: 14,
    alignItems: 'center',
  },
  suitCardLocked: {
    opacity: 0.55,
  },
  suitIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  suitTitle: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
    textAlign: 'center',
    marginBottom: 6,
  },
  suitStatusUnlocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  suitStatusLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  suitStatusText: {
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  textMuted: {
    color: Colors.textMuted,
  },
  progressCard: {
    marginBottom: 20,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
  },
  statIcon: {
    marginBottom: 6,
  },
  statNumber: {
    color: Colors.text,
    fontSize: Typography.size.h1,
    fontFamily: Typography.family.hindBold,
    marginBottom: 2,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
    textAlign: 'center',
  },
  badgesList: {
    gap: 10,
    marginBottom: 24,
  },
  badgeItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeUnlockedWrap: {
    backgroundColor: 'rgba(255, 200, 107, 0.15)',
  },
  badgeLockedWrap: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.hindBold,
    marginBottom: 2,
  },
  badgeDesc: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  badgeCheck: {},
  resetWrap: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});
