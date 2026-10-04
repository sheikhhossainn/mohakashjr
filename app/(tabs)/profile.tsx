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
  ShieldCheck,
  UserPlus,
  LogOut,
  User,
  Languages,
} from 'lucide-react-native';
import { getTranslation } from '../../src/i18n/translations';

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
    currentUser,
    isGuest,
    logoutUser,
    language,
    setLanguage,
  } = useAppStore();

  const t = getTranslation(language);

  const handleSwitchAccount = async () => {
    await logoutUser();
    router.replace('/auth' as any);
  };

  const threshold = RANK_THRESHOLDS[rank];
  const archetypeInfo = ARCHETYPES[cadetArchetype] || ARCHETYPES.pilot;

  const totalQuizzesAnswered = Object.values(quizAttempts).reduce(
    (acc, attempts) => acc + attempts.length,
    0
  );

  const suitTiers = [
    {
      tier: 'Cadet',
      title: language === 'en' ? 'Space Cadet Suit' : 'স্পেস ক্যাডেট স্যুট',
      icon: '👨‍🚀',
      unlocked: true,
      condition: language === 'en' ? 'Starting tier' : 'শুরুর স্তর',
    },
    {
      tier: 'Astronaut',
      title: language === 'en' ? 'Golden Visor Suit' : 'গোল্ডেন ভিসার স্যুট',
      icon: '🌟',
      unlocked: rank !== 'Cadet',
      condition: language === 'en' ? 'Unlocks at 201 XP' : '২০১ XP অর্জনে আনলক',
    },
    {
      tier: 'Mission Specialist',
      title: language === 'en' ? 'Deep Space Nebula Suit' : 'ডিপ স্পেস নেবুলা স্যুট',
      icon: '🌌',
      unlocked: rank === 'Mission Specialist' || rank === 'Commander',
      condition: language === 'en' ? 'Unlocks at 601 XP' : '৬০১ XP অর্জনে আনলক',
    },
    {
      tier: 'Commander',
      title: language === 'en' ? 'Mars Commander Golden Suit' : 'মার্স কমান্ডার গোল্ডেন স্যুট',
      icon: '👑',
      unlocked: rank === 'Commander',
      condition: language === 'en' ? 'Unlocks at 1201 XP' : '১২০১ XP অর্জনে আনলক',
    },
  ];

  const badges = [
    {
      id: 'apollo-11',
      name: t.profile.badge1Title,
      desc: t.profile.badge1Desc,
      icon: <Star size={20} color={Colors.gold} fill={Colors.gold} />,
      unlocked: completedLessonIds.length >= 1,
    },
    {
      id: 'artemis-lunar',
      name: t.profile.badge2Title,
      desc: t.profile.badge2Desc,
      icon: <Award size={20} color={Colors.primaryLight} />,
      unlocked: completedLessonIds.includes('lesson-1'),
    },
    {
      id: 'propulsion-ace',
      name: t.profile.badge3Title,
      desc: t.profile.badge3Desc,
      icon: <Zap size={20} color={Colors.emerald} fill={Colors.emerald} />,
      unlocked: totalQuizzesAnswered >= 1,
    },
    {
      id: 'astronaut-insignia',
      name: t.profile.badge4Title,
      desc: t.profile.badge4Desc,
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
      {/* ── Language Settings Card ──────────────────────── */}
      <View style={styles.langSettingsCard}>
        <View style={styles.langSettingsHeader}>
          <View style={styles.langSettingsTitleRow}>
            <Languages size={16} color={Colors.cyan} />
            <Text style={styles.langSettingsTitle}>{t.profile.langSectionTitle}</Text>
          </View>
          <View style={styles.langActiveBadge}>
            <Text style={styles.langActiveBadgeText}>
              {language === 'bn' ? 'বাংলা সক্রিয় 🇧🇩' : 'English Active 🇺🇸'}
            </Text>
          </View>
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
              <CheckCircle2 size={14} color={Colors.cyan} style={{ marginLeft: 4 }} />
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
              <CheckCircle2 size={14} color={Colors.cyan} style={{ marginLeft: 4 }} />
            )}
          </Pressable>
        </View>
      </View>

      {/* Astronaut ID Badge Card */}
      <StoryCard accent={isGuest ? 'gold' : 'primary'} style={styles.profileCard}>
        <View style={styles.dossierHeader}>
          <View style={[styles.idChip, isGuest && styles.idChipGuest]}>
            <Text style={[styles.idChipText, isGuest && styles.idChipTextGuest]}>
              {isGuest
                ? t.profile.visitorPassTitle
                : `@${currentUser?.username || 'cadet'} · ${language === 'en' ? 'Official Cadet ID 🛰️' : 'অফিসিয়াল আইডি 🛰️'}`}
            </Text>
          </View>
          <View style={[styles.activePill, isGuest && styles.activePillGuest]}>
            <View style={[styles.activeDot, isGuest && styles.activeDotGuest]} />
            <Text style={[styles.activePillText, isGuest && styles.activePillTextGuest]}>
              {isGuest ? t.common.guestBadge : t.common.verifiedBadge}
            </Text>
          </View>
        </View>

        <View style={styles.avatarSection}>
          <AstronautAvatar size={84} rank={rank} showHalo />
          <Text style={styles.nameText}>{displayName}</Text>

          <View style={styles.rankPill}>
            <Sparkles size={14} color={Colors.gold} />
            <Text style={styles.rankPillText}>
              {language === 'en' ? threshold.label_en : threshold.label_bn}
            </Text>
          </View>
        </View>

        {/* Cadet Psychometric Archetype Badge */}
        <View style={[styles.archetypeDossierBox, { borderColor: archetypeInfo.accentColor + '40' }]}>
          <View style={styles.archetypeHeader}>
            <SpaceChoiceBadge type={cadetArchetype} size={40} isSelected />
            <View style={{ flex: 1 }}>
              <Text style={[styles.archetypeTitle, { color: archetypeInfo.accentColor }]}>
                {language === 'en' ? archetypeInfo.title_en : archetypeInfo.title_bn}
              </Text>
              <Text style={styles.archetypeMotto}>
                "{language === 'en' ? archetypeInfo.motto_en : archetypeInfo.motto_bn}"
              </Text>
            </View>
          </View>
          <Text style={styles.archetypeDescText}>
            {language === 'en' ? archetypeInfo.description_en : archetypeInfo.description_bn}
          </Text>
        </View>
      </StoryCard>

      {/* Account Status / Upgrade Prompt */}
      {isGuest ? (
        <View style={styles.guestAlertBanner}>
          <View style={styles.guestAlertHeader}>
            <View style={styles.guestAlertIconBox}>
              <UserPlus size={18} color={Colors.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.guestAlertTitle}>{t.profile.guestAlertTitle}</Text>
              <Text style={styles.guestAlertSub}>
                {language === 'en'
                  ? `You are currently in Guest Mode. Register an account to permanently preserve your ${xp} XP and progress.`
                  : `বর্তমানে তুমি অতিথি মোডে আছো। তোমার ${xp} XP ও সমাপ্ত পাঠগুলো সংরক্ষণ করতে একটি স্থায়ী অ্যাকাউন্ট খোলো।`}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <GentleButton
              title={t.profile.guestUpgradeBtn}
              variant="primary"
              size="normal"
              onPress={() => router.push('/auth' as any)}
            />
          </View>
        </View>
      ) : (
        <View style={styles.accountVerifiedBanner}>
          <ShieldCheck size={16} color={Colors.emerald} />
          <Text style={styles.accountVerifiedText}>
            {language === 'en'
              ? `ID: @${currentUser?.username} · ${t.profile.accountVerifiedSub}`
              : `আইডি: @${currentUser?.username} · ${t.profile.accountVerifiedSub}`}
          </Text>
        </View>
      )}

      {/* Account Action Buttons */}
      <View style={styles.accountActionCard}>
        <View style={styles.accountActionTextCol}>
          <Text style={styles.accountActionTitle}>
            {isGuest ? t.profile.accountManagementGuestTitle : t.profile.accountManagementTitle}
          </Text>
          <Text style={styles.accountActionSub}>
            {isGuest ? t.profile.accountManagementGuestSub : t.profile.accountManagementSub}
          </Text>
        </View>
        <GentleButton
          title={isGuest ? t.common.login : t.common.logout}
          variant="outline"
          size="normal"
          onPress={handleSwitchAccount}
        />
      </View>

      {/* Experience & Onboarding Replay Shortcuts */}
      <View style={styles.shortcutsRow}>
        <GentleButton
          title={t.profile.shortcutsOrientation}
          onPress={() => router.push('/onboarding')}
          variant="outline"
          size="normal"
          style={styles.shortcutBtn}
        />
        <GentleButton
          title={t.profile.shortcutsMars}
          onPress={() => router.push('/splash')}
          variant="outline"
          size="normal"
          style={styles.shortcutBtn}
        />
      </View>

      {/* Rank Suit Progression Tiers */}
      <Text style={styles.sectionHeading}>{t.profile.suitSectionTitle}</Text>
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
                {suit.unlocked ? t.common.unlocked : suit.condition}
              </Text>
            </View>
          </StoryCard>
        ))}
      </View>

      {/* Gamified XP Progress */}
      <Text style={styles.sectionHeading}>{t.profile.xpProgressionTitle}</Text>
      <StoryCard style={styles.progressCard}>
        <XPProgressBar compact={false} />
      </StoryCard>

      {/* Stats Bento Grid */}
      <Text style={styles.sectionHeading}>{t.profile.missionStatsTitle}</Text>
      <View style={styles.statsGrid}>
        <StoryCard style={styles.statBox}>
          <Zap size={20} color={Colors.gold} fill={Colors.gold} style={styles.statIcon} />
          <Text style={styles.statNumber}>{xp}</Text>
          <Text style={styles.statLabel}>{t.profile.statTotalXP}</Text>
        </StoryCard>

        <StoryCard style={styles.statBox}>
          <BookOpen size={20} color={Colors.primaryLight} style={styles.statIcon} />
          <Text style={styles.statNumber}>{completedLessonIds.length}</Text>
          <Text style={styles.statLabel}>{t.profile.statLessonsCompleted}</Text>
        </StoryCard>

        <StoryCard style={styles.statBox}>
          <Target size={20} color={Colors.emerald} style={styles.statIcon} />
          <Text style={styles.statNumber}>{totalQuizzesAnswered}</Text>
          <Text style={styles.statLabel}>{t.profile.statQuizzesPassed}</Text>
        </StoryCard>
      </View>

      {/* Badges Collection */}
      <Text style={styles.sectionHeading}>{t.profile.badgeSectionTitle}</Text>
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
              <Text style={[styles.badgeTitle, !b.unlocked && styles.textMuted]}>{b.name}</Text>
              <Text style={styles.badgeDesc}>{b.desc}</Text>
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
          title={t.profile.resetBtn}
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
  idChipGuest: {
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    borderColor: 'rgba(255, 184, 0, 0.35)',
  },
  idChipTextGuest: {
    color: Colors.gold,
  },
  activePillGuest: {
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
  },
  activeDotGuest: {
    backgroundColor: Colors.gold,
  },
  activePillTextGuest: {
    color: Colors.gold,
  },
  guestAlertBanner: {
    backgroundColor: 'rgba(255, 184, 0, 0.10)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    borderColor: 'rgba(255, 184, 0, 0.35)',
    borderBottomColor: 'rgba(0, 0, 0, 0.35)',
    padding: 14,
    marginBottom: 12,
  },
  guestAlertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  guestAlertIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 184, 0, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  guestAlertTitle: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.heavy,
    marginBottom: 3,
  },
  guestAlertSub: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
    lineHeight: Typography.lineHeight.caption,
  },
  accountVerifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.28)',
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
  },
  accountVerifiedText: {
    color: Colors.emerald,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
    flex: 1,
  },
  accountActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(14, 18, 60, 0.88)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderBottomColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  accountActionTextCol: {
    flex: 1,
  },
  accountActionTitle: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    marginBottom: 2,
  },
  accountActionSub: {
    color: Colors.textMuted,
    fontSize: 11,
    lineHeight: 14,
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
  langSettingsCard: {
    backgroundColor: 'rgba(14, 18, 60, 0.88)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.35)',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0, 240, 255, 0.50)',
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  langSettingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  langSettingsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langSettingsTitle: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
  },
  langActiveBadge: {
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  langActiveBadgeText: {
    color: Colors.cyan,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
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
    fontWeight: Typography.weight.medium,
  },
  langSegmentTextActive: {
    color: Colors.text,
    fontWeight: Typography.weight.bold,
  },
});
