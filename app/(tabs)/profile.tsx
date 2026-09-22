import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { DoubleBezelCard } from '../../src/components/DoubleBezelCard';
import { XPProgressBar } from '../../src/components/XPProgressBar';
import { AstronautAvatar } from '../../src/components/AstronautAvatar';
import { SpaceChoiceBadge } from '../../src/components/SpaceChoiceBadge';
import { TactileButton } from '../../src/components/TactileButton';
import { useAppStore, RANK_THRESHOLDS, ARCHETYPES } from '../../src/state/useAppStore';
import {
  CheckCircle2,
  WifiOff,
  RotateCcw,
  Sparkles,
  BookOpen,
  Target,
  Zap,
  Star,
  Award,
  Rocket,
  Shield,
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
      desc_bn: 'চাঁদ সম্পর্কিত পাঠ ও কুইজ জয় করার কৃতিত্ব',
      icon: <Award size={20} color={Colors.cyan} />,
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
      name_bn: 'অফিসিয়াল নভোচারী মেডেল 🏆',
      desc_bn: 'ক্যাডেট স্তর সফলভাবে পার করে মহাকাশচারী পদ অর্জন',
      icon: <Sparkles size={20} color={Colors.gold} />,
      unlocked: rank !== 'Cadet',
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Cute Astronaut ID Badge Card */}
      <DoubleBezelCard glow="blue" style={styles.profileCardMargin}>
        <View style={styles.dossierHeader}>
          <View style={styles.idChip}>
            <Text style={styles.idChipText}>মহাকাশ একাডেমি অফিসিয়াল আইডি</Text>
          </View>
          <View style={styles.activePill}>
            <View style={styles.activeDot} />
            <Text style={styles.activePillText}>সক্রিয় ক্যাডেট</Text>
          </View>
        </View>

        <View style={styles.avatarSection}>
          <AstronautAvatar size={88} rank={rank} showHalo />

          <Text style={styles.nameText}>{displayName}</Text>

          <View style={styles.rankPill}>
            <Sparkles size={14} color={Colors.gold} />
            <Text style={styles.rankPillText}>{threshold.label_bn}</Text>
          </View>
        </View>

        {/* Cadet Psychometric Archetype Badge */}
        <View style={[styles.archetypeDossierBox, { borderColor: archetypeInfo.accentColor }]}>
          <View style={styles.archetypeHeader}>
            <SpaceChoiceBadge type={cadetArchetype} size={42} isSelected />
            <View style={{ flex: 1 }}>
              <Text style={[styles.archetypeTitle, { color: archetypeInfo.accentColor }]}>{archetypeInfo.title_bn}</Text>
              <Text style={styles.archetypeMotto}>"{archetypeInfo.motto_bn}"</Text>
            </View>
          </View>
          <Text style={styles.archetypeDescText}>{archetypeInfo.description_bn}</Text>
        </View>
      </DoubleBezelCard>

      {/* Experience & Onboarding Replay Shortcuts */}
      <View style={styles.shortcutsRow}>
        <TactileButton
          title="ওরিয়েন্টেশন পরীক্ষা ✨"
          onPress={() => router.push('/onboarding')}
          variant="outline"
          size="small"
          style={styles.shortcutBtn}
        />
        <TactileButton
          title="মঙ্গল স্প্ল্যাশ দৃশ্য 🚀"
          onPress={() => router.push('/splash')}
          variant="outline"
          size="small"
          style={styles.shortcutBtn}
        />
      </View>

      {/* Rank Suit Progression Tiers */}
      <Text style={styles.sectionHeading}>স্পেসস্যুট ও পদমর্যাদা অগ্রগতি</Text>
      <View style={styles.suitGrid}>
        {suitTiers.map((suit) => (
          <View
            key={suit.tier}
            style={[
              styles.suitCard,
              suit.unlocked ? styles.suitCardUnlocked : styles.suitCardLocked,
            ]}
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
          </View>
        ))}
      </View>

      {/* Gamified XP Progress */}
      <Text style={styles.sectionHeading}>র‍্যাঙ্ক অগ্রগতি ও মাইলস্টোন</Text>
      <XPProgressBar compact={false} />

      {/* Stats Bento Grid */}
      <Text style={styles.sectionHeading}>মিশন পরিসংখ্যান</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Zap size={20} color={Colors.gold} fill={Colors.gold} style={styles.statIcon} />
          <Text style={styles.statNumber}>{xp}</Text>
          <Text style={styles.statLabel}>মোট অর্জিত XP</Text>
        </View>

        <View style={styles.statBox}>
          <BookOpen size={20} color={Colors.cyan} style={styles.statIcon} />
          <Text style={styles.statNumber}>{completedLessonIds.length}</Text>
          <Text style={styles.statLabel}>পড়া সম্পন্ন</Text>
        </View>

        <View style={styles.statBox}>
          <Target size={20} color={Colors.emerald} style={styles.statIcon} />
          <Text style={styles.statNumber}>{totalQuizzesAnswered}</Text>
          <Text style={styles.statLabel}>কুইজ সম্পন্ন</Text>
        </View>
      </View>

      {/* Space Mission Badges Collection */}
      <Text style={styles.sectionHeading}>আমার মহাকাশ পদক সংগ্রহশালা</Text>
      <View style={styles.badgeList}>
        {badges.map((badge) => (
          <DoubleBezelCard
            key={badge.id}
            glow={badge.unlocked ? 'gold' : 'none'}
            style={badge.unlocked ? styles.badgeUnlockedShell : styles.badgeLockedShell}
          >
            <View style={styles.badgeCardContent}>
              <View
                style={[
                  styles.badgeIconCircle,
                  badge.unlocked ? styles.badgeActiveCircle : styles.badgeInactiveCircle,
                ]}
              >
                {badge.icon}
              </View>
              <View style={styles.badgeInfo}>
                <Text style={[styles.badgeName, !badge.unlocked && styles.textLocked]}>
                  {badge.name_bn}
                </Text>
                <Text style={styles.badgeDesc}>{badge.desc_bn}</Text>
              </View>
              <View style={badge.unlocked ? styles.badgeStatusActive : styles.badgeStatusLocked}>
                {badge.unlocked ? (
                  <CheckCircle2 size={18} color={Colors.emerald} />
                ) : (
                  <Text style={styles.lockText}>লকড</Text>
                )}
              </View>
            </View>
          </DoubleBezelCard>
        ))}
      </View>

      {/* Offline Status */}
      <View style={styles.offlineCard}>
        <WifiOff size={18} color={Colors.cyan} />
        <View style={styles.offlineTextCol}>
          <Text style={styles.offlineTitle}>অফলাইন মোড সক্রিয়</Text>
          <Text style={styles.offlineSubtitle}>
            ইন্টারনেট সংযোগ ছাড়াও যেকোনো সময় সব পাঠ ও কুইজ পড়তে পারবে।
          </Text>
        </View>
      </View>

      {/* Reset Progress */}
      <Pressable style={styles.resetButton} onPress={resetProgress}>
        <RotateCcw size={14} color={Colors.coral} />
        <Text style={styles.resetButtonText}>অগ্রগতি রিসেট করো</Text>
      </Pressable>
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
  profileCardMargin: {
    marginBottom: 12,
  },
  dossierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  idChip: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  idChipText: {
    color: Colors.cyan,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.emeraldBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 5,
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
    fontWeight: Typography.weight.bold,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  nameText: {
    color: Colors.text,
    fontSize: Typography.size.h1,
    fontWeight: Typography.weight.heavy,
    marginTop: 10,
    marginBottom: 6,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldBg,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
    gap: 6,
  },
  rankPillText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  archetypeDossierBox: {
    marginTop: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  archetypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  archetypeEmoji: {
    fontSize: 26,
  },
  archetypeTitle: {
    color: Colors.gold,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
  },
  archetypeMotto: {
    color: Colors.cyan,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.medium,
  },
  archetypeDescText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
    lineHeight: Typography.lineHeight.caption,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  shortcutBtn: {
    flex: 1,
  },
  sectionHeading: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontWeight: Typography.weight.bold,
    marginTop: 14,
    marginBottom: 10,
  },
  suitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 6,
  },
  suitCard: {
    width: '48%',
    backgroundColor: Colors.surfaceCard,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.3)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  suitCardUnlocked: {
    borderColor: 'rgba(56, 189, 248, 0.4)',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  suitCardLocked: {
    opacity: 0.6,
  },
  suitIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  suitTitle: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    textAlign: 'center',
    marginBottom: 4,
  },
  textMuted: {
    color: Colors.textMuted,
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
    fontWeight: Typography.weight.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceCard,
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 3.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.35)',
    borderColor: 'rgba(255, 255, 255, 0.10)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 2,
  },
  statIcon: {
    marginBottom: 4,
  },
  statNumber: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.heavy,
    marginBottom: 2,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.semiBold,
  },
  badgeList: {
    gap: 10,
  },
  badgeUnlockedShell: {
    marginBottom: 2,
  },
  badgeLockedShell: {
    opacity: 0.55,
    marginBottom: 2,
  },
  badgeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeActiveCircle: {
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
  },
  badgeInactiveCircle: {
    backgroundColor: Colors.surface,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    marginBottom: 2,
  },
  textLocked: {
    color: Colors.textMuted,
  },
  badgeDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
    lineHeight: Typography.lineHeight.caption,
  },
  badgeStatusActive: {
    padding: 4,
  },
  badgeStatusLocked: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  lockText: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  offlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 20,
    marginTop: 18,
    gap: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  offlineTextCol: {
    flex: 1,
  },
  offlineTitle: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    marginBottom: 2,
  },
  offlineSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
    lineHeight: Typography.lineHeight.caption,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 14,
    gap: 6,
  },
  resetButtonText: {
    color: Colors.coral,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semiBold,
  },
});
