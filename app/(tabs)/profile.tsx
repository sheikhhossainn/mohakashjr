import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Radius, Space } from '../../src/theme/layout';
import { StoryCard } from '../../src/components/StoryCard';
import { XPProgressBar } from '../../src/components/XPProgressBar';
import { AstronautAvatar } from '../../src/components/AstronautAvatar';
import { SpaceChoiceBadge } from '../../src/components/SpaceChoiceBadge';
import { GentleButton } from '../../src/components/GentleButton';
import { LanguageSwitch } from '../../src/components/LanguageSwitch';
import { useAppStore, RANK_THRESHOLDS, ARCHETYPES } from '../../src/state/useAppStore';
import { RankTier } from '../../src/content/schema';
import {
  CheckCircle2,
  Shield,
  BookOpen,
  Target,
  Zap,
  Star,
  Award,
  Lock,
  HardDrive,
  Trash2,
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
    deleteLocalData,
    cadetArchetype,
    language,
  } = useAppStore();

  const t = getTranslation(language);

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const threshold = RANK_THRESHOLDS[rank];
  const archetypeInfo = ARCHETYPES[cadetArchetype] || ARCHETYPES.pilot;

  const totalQuizzesAnswered = Object.values(quizAttempts).reduce(
    (acc, attempts) => acc + attempts.length,
    0
  );

  const suitTiers: {
    tier: RankTier;
    title: string;
    unlocked: boolean;
    condition: string;
  }[] = [
    {
      tier: 'Cadet',
      title: language === 'en' ? 'Space Cadet Suit' : 'স্পেস ক্যাডেট স্যুট',
      unlocked: true,
      condition: language === 'en' ? 'Starting tier' : 'শুরুর স্তর',
    },
    {
      tier: 'Astronaut',
      title: language === 'en' ? 'Golden Visor Suit' : 'গোল্ডেন ভিসার স্যুট',
      unlocked: rank !== 'Cadet',
      condition: language === 'en' ? 'Unlocks at 201 XP' : '২০১ XP অর্জনে আনলক',
    },
    {
      tier: 'Mission Specialist',
      title: language === 'en' ? 'Deep Space Nebula Suit' : 'ডিপ স্পেস নেবুলা স্যুট',
      unlocked: rank === 'Mission Specialist' || rank === 'Commander',
      condition: language === 'en' ? 'Unlocks at 601 XP' : '৬০১ XP অর্জনে আনলক',
    },
    {
      tier: 'Commander',
      title: language === 'en' ? 'Mars Commander Golden Suit' : 'মার্স কমান্ডার গোল্ডেন স্যুট',
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
      icon: <Award size={20} color={Colors.gold} />,
      unlocked: rank !== 'Cadet',
    },
  ];

  const handleDeleteData = async () => {
    setConfirmingDelete(false);
    await deleteLocalData();
    router.replace('/splash');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Language ──────────────────────────────────────── */}
      <View style={styles.langSettingsCard}>
        <View style={styles.langSettingsTitleRow}>
          <Languages size={20} color={Colors.primary} />
          <Text style={styles.langSettingsTitle}>{language === 'en' ? 'Language' : 'ভাষা'}</Text>
        </View>

        <LanguageSwitch />
      </View>

      {/* Astronaut ID Badge Card */}
      <StoryCard accent="primary" style={styles.profileCard}>
        <View style={styles.dossierHeader}>
          <View style={styles.idChip}>
            <Text style={styles.idChipText} numberOfLines={1}>
              {t.profile.localIdTitle}
            </Text>
          </View>
          <View style={styles.activePill}>
            <HardDrive size={12} color={Colors.emerald} />
            <Text style={styles.activePillText} numberOfLines={1}>
              {t.profile.savedOnDevice}
            </Text>
          </View>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarPedestal}>
            <View style={styles.avatarGlowBackdrop} />
            <AstronautAvatar size={96} rank={rank} showHalo animated />
          </View>
          <Text style={styles.nameText}>{displayName}</Text>

          <View style={styles.rankPill}>
            <Shield size={13} color={Colors.gold} />
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

      {/* Rank Suit Progression Tiers */}
      <Text style={styles.sectionHeading}>{t.profile.suitSectionTitle}</Text>
      <View style={styles.suitGrid}>
        {suitTiers.map((suit) => (
          <StoryCard
            key={suit.tier}
            style={[styles.suitCard, !suit.unlocked && styles.suitCardLocked]}
          >
            <View style={[styles.suitAvatarWrap, !suit.unlocked && styles.suitAvatarWrapLocked]}>
              <AstronautAvatar
                size={48}
                rank={suit.tier}
                showHalo={false}
                animated={suit.unlocked}
              />
            </View>
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

      {/* My Data — everything lives on this device */}
      <View style={styles.dataCard}>
        <View style={styles.dataHeader}>
          <View style={styles.dataIconBox}>
            <HardDrive size={18} color={Colors.primaryLight} />
          </View>
          <View style={styles.dataTextCol}>
            <Text style={styles.dataTitle}>{t.profile.dataSectionTitle}</Text>
            <Text style={styles.dataSub}>{t.profile.dataSectionSub}</Text>
          </View>
        </View>

        {confirmingDelete ? (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>{t.profile.deleteDataTitle}</Text>
            <Text style={styles.confirmMessage}>{t.profile.deleteDataMessage}</Text>
            <View style={styles.confirmRow}>
              <GentleButton
                title={t.profile.deleteDataCancel}
                onPress={() => setConfirmingDelete(false)}
                variant="outline"
                size="normal"
                style={styles.confirmBtn}
              />
              <GentleButton
                title={t.profile.deleteDataConfirm}
                onPress={handleDeleteData}
                variant="coral"
                size="normal"
                style={styles.confirmBtn}
              />
            </View>
          </View>
        ) : (
          <GentleButton
            title={t.profile.deleteDataBtn}
            onPress={() => setConfirmingDelete(true)}
            variant="outline"
            size="normal"
            fullWidth
            icon={<Trash2 size={16} color={Colors.coral} />}
            textStyle={{ color: Colors.coral }}
          />
        )}
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
    gap: 8,
    marginBottom: 16,
  },
  idChip: {
    flexShrink: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  idChipText: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.headingSemi,
  },
  activePill: {
    flexShrink: 1,
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
    flexShrink: 1,
    color: Colors.emerald,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPedestal: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121832',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
    marginBottom: 6,
  },
  avatarGlowBackdrop: {
    position: 'absolute',
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  nameText: {
    color: Colors.text,
    fontSize: Typography.size.h1,
    fontFamily: Typography.family.heading,
    marginTop: 6,
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
    fontFamily: Typography.family.heading,
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
    fontFamily: Typography.family.heading,
  },
  archetypeMotto: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },
  archetypeDescText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
  sectionHeading: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.heading,
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
    opacity: 0.65,
  },
  suitAvatarWrap: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#131A33',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  suitAvatarWrapLocked: {
    backgroundColor: '#0F1426',
    borderColor: 'rgba(255, 255, 255, 0.04)',
    opacity: 0.6,
  },
  suitTitle: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.heading,
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
    fontFamily: Typography.family.heading,
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
    fontFamily: Typography.family.heading,
    marginBottom: 2,
  },
  badgeDesc: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  badgeCheck: {},
  langSettingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Space.lg,
    marginBottom: Space.lg,
    gap: Space.md,
  },
  langSettingsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  langSettingsTitle: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    lineHeight: Typography.lineHeight.h3,
    fontFamily: Typography.family.heading,
  },
  dataCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: Colors.border,
    borderBottomColor: Colors.borderMedium,
    padding: Space.lg,
    marginTop: 10,
    marginBottom: 20,
    gap: Space.lg,
  },
  dataHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.md,
  },
  dataIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataTextCol: {
    flex: 1,
  },
  dataTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.heading,
    marginBottom: 2,
  },
  dataSub: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
  confirmBox: {
    backgroundColor: Colors.coralBg,
    borderRadius: Radius.sm + 4,
    borderWidth: 1,
    borderColor: Colors.coral,
    padding: Space.md,
    gap: Space.sm,
  },
  confirmTitle: {
    color: Colors.coral,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.heading,
  },
  confirmMessage: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
  confirmRow: {
    flexDirection: 'row',
    gap: Space.md,
    marginTop: Space.xs,
  },
  confirmBtn: {
    flex: 1,
  },
});
