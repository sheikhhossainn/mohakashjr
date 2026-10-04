import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Svg, { Rect, Circle, Path, Defs, LinearGradient, Stop, G, Line, Text as SvgText } from 'react-native-svg';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { StoryCard } from '../../src/components/StoryCard';
import { GentleButton } from '../../src/components/GentleButton';
import { MascotReaction } from '../../src/components/MascotReaction';
import { AstronautAvatar } from '../../src/components/AstronautAvatar';
import { MoonLandingMission, MissionStage } from '../../src/components/mission';
import { useAppStore } from '../../src/state/useAppStore';
import { getTranslation } from '../../src/i18n/translations';
import {
  Rocket,
  Shield,
  Fuel,
  Flame,
  Compass,
  Award,
  Play,
  Sparkles,
  ChevronRight,
  UserCheck,
} from 'lucide-react-native';

export default function MissionScreen() {
  const language = useAppStore((state) => state.language);
  const displayName = useAppStore((state) => state.displayName);
  const rank = useAppStore((state) => state.rank);
  const xp = useAppStore((state) => state.xp);

  const t = getTranslation(language).missionGame;
  const rankTitles = getTranslation(language).ranks;

  const [isMissionActive, setIsMissionActive] = useState(false);
  const [missionStartStage, setMissionStartStage] = useState<MissionStage>('suit_up');

  const startMissionAtStage = (stage: MissionStage) => {
    setMissionStartStage(stage);
    setIsMissionActive(true);
  };

  // If cadet has launched the mission, show the full multi-stage simulation game
  if (isMissionActive) {
    return (
      <MoonLandingMission
        initialStage={missionStartStage}
        onExitMission={() => setIsMissionActive(false)}
      />
    );
  }

  // 5 Interactive Flight Stations
  const flightStations: {
    stage: MissionStage;
    number: string;
    title: string;
    subtitle: string;
    icon: any;
    accent: 'cyan' | 'primary' | 'gold' | 'emerald' | 'coral';
    badge: string;
  }[] = [
    {
      stage: 'suit_up',
      number: '০১',
      title: t.suitUp.heading,
      subtitle: t.stages.suit_up,
      icon: Shield,
      accent: 'primary',
      badge: 'সুরক্ষা ৫ স্তর',
    },
    {
      stage: 'fueling',
      number: '০২',
      title: t.fueling.heading,
      subtitle: t.stages.fueling,
      icon: Fuel,
      accent: 'cyan',
      badge: 'LOX + LH2',
    },
    {
      stage: 'cockpit_ignition',
      number: '০৩',
      title: t.ignition.heading,
      subtitle: t.stages.cockpit_ignition,
      icon: Flame,
      accent: 'coral',
      badge: '১১.২ কিমি/সে',
    },
    {
      stage: 'lunar_descent',
      number: '০৪',
      title: t.descent.heading,
      subtitle: t.stages.lunar_descent,
      icon: Compass,
      accent: 'gold',
      badge: 'রেট্রো থ্রাস্টার',
    },
    {
      stage: 'moonwalk',
      number: '০৫',
      title: t.moonwalk.heading,
      subtitle: t.stages.moonwalk,
      icon: Award,
      accent: 'emerald',
      badge: '+১২০ XP মেডেল',
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Mission Control Briefing Card */}
      <StoryCard accent="primary" style={styles.heroCard}>
        <View style={styles.tagRow}>
          <View style={styles.missionTag}>
            <Rocket size={13} color={Colors.primaryLight} />
            <Text style={styles.missionTagText}>{t.badge}</Text>
          </View>
          <View style={styles.statusLiveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.statusLiveText}>{t.statusLive}</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>{t.title}</Text>
        <Text style={styles.heroDescription}>{t.subtitle}</Text>

        {/* Illustrated Vector Graphic: Earth to Moon Flight Path */}
        <View style={styles.flightGraphicWrapper}>
          <Svg width={290} height={120} viewBox="0 0 290 120">
            <Defs>
              <LinearGradient id="heroSpace" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#080C26" />
                <Stop offset="100%" stopColor="#141A40" />
              </LinearGradient>
              <LinearGradient id="flightVector" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#38BDF8" />
                <Stop offset="50%" stopColor="#FFC86B" />
                <Stop offset="100%" stopColor="#5ED6C0" />
              </LinearGradient>
            </Defs>

            {/* Space Void Background */}
            <Rect x="0" y="0" width="290" height="120" rx="14" fill="url(#heroSpace)" />

            {/* Stars */}
            <Circle cx="30" cy="20" r="1.5" fill="#FFFFFF" opacity={0.6} />
            <Circle cx="90" cy="15" r="1" fill="#FFFFFF" opacity={0.8} />
            <Circle cx="160" cy="25" r="1.5" fill="#FFFFFF" opacity={0.5} />
            <Circle cx="210" cy="18" r="1" fill="#FFFFFF" opacity={0.7} />
            <Circle cx="270" cy="30" r="1.5" fill="#FFFFFF" opacity={0.6} />

            {/* Blue Earth on Left */}
            <Circle cx="40" cy="65" r="22" fill="#0284C7" />
            <Circle cx="40" cy="65" r="20" fill="#0EA5E9" />
            <Path d="M 30 60 Q 42 52 50 62 Q 46 72 35 68 Z" fill="#22C55E" opacity={0.8} />
            <SvgText x="26" y="100" fill="#94A3B8" fontSize="9" fontWeight="bold">পৃথিবী (Earth)</SvgText>

            {/* Curved Flight Path Arc */}
            <Path
              d="M 58 55 Q 145 10 230 55"
              stroke="url(#flightVector)"
              strokeWidth="2.5"
              strokeDasharray="5 3"
              fill="none"
            />

            {/* Rocket in Mid-flight */}
            <G transform="translate(140, 26) rotate(15)">
              <Path d="M 0 -8 L -4 6 L 4 6 Z" fill="#FFFFFF" />
              <Path d="M -3 6 L 0 12 L 3 6 Z" fill="#FF6B35" />
            </G>

            {/* Moon on Right */}
            <Circle cx="245" cy="65" r="18" fill="#CBD5E1" />
            <Circle cx="240" cy="60" r="5" fill="#94A3B8" />
            <Circle cx="252" cy="70" r="4" fill="#94A3B8" />
            <Circle cx="244" cy="74" r="3" fill="#94A3B8" />
            <SvgText x="232" y="100" fill="#FFC86B" fontSize="9" fontWeight="bold">চাঁদ (Moon)</SvgText>
          </Svg>
        </View>

        {/* Astro-Buddy Encouragement */}
        <View style={styles.mascotSlot}>
          <MascotReaction
            state="thinking"
            size={76}
            showSpeechBubble
            bubbleText="কমান্ডার, ল্যান্ডার প্রস্তুত! তুমি কি লুনার চ্যালেঞ্জের জন্য তৈরি?"
          />
        </View>

        {/* Primary Launch Action Button */}
        <View style={styles.primaryLaunchBtnWrapper}>
          <GentleButton
            title={t.startMissionBtn}
            onPress={() => startMissionAtStage('suit_up')}
            variant="gold"
            size="large"
            fullWidth
            icon={<Play size={18} color={Colors.textDark} fill={Colors.textDark} />}
          />
        </View>
      </StoryCard>

      {/* Cadet Flight Readiness Dossier */}
      <StoryCard accent="none" style={styles.cadetDossierCard}>
        <View style={styles.cadetDossierRow}>
          <AstronautAvatar rank={rank} size={54} />
          <View style={styles.cadetDossierInfo}>
            <View style={styles.dossierBadgeRow}>
              <UserCheck size={14} color={Colors.emerald} />
              <Text style={styles.dossierBadgeText}>ফ্লাইট কমান্ডার অনুমোদন</Text>
            </View>
            <Text style={styles.cadetNameText}>{displayName}</Text>
            <Text style={styles.cadetRankText}>
              {rankTitles[rank] || rank} • {xp} XP অর্জিত
            </Text>
          </View>
        </View>
      </StoryCard>

      {/* Flight Path Roadmap (5 Stations) */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>{t.flightPathTitle}</Text>
        <Text style={styles.sectionCode}>{t.flightPathSubtitle}</Text>
      </View>

      {/* 5 Interactive Station Cards */}
      <View style={styles.stationsList}>
        {flightStations.map((station) => {
          const IconComponent = station.icon;
          return (
            <Pressable
              key={station.stage}
              onPress={() => startMissionAtStage(station.stage)}
              style={({ pressed }) => [
                styles.stationPressable,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={station.title}
            >
              <StoryCard accent={station.accent} style={styles.stationCard}>
                <View style={styles.stationContentRow}>
                  <View style={styles.stationLeftBox}>
                    <View style={styles.stationIconBox}>
                      <IconComponent size={22} color={Colors[station.accent] || Colors.primaryLight} />
                    </View>
                    <Text style={styles.stationStepNum}>ধাপ {station.number}</Text>
                  </View>

                  <View style={styles.stationDetails}>
                    <View style={styles.stationBadgeRow}>
                      <Text style={styles.stationSubTag}>{station.subtitle}</Text>
                      <View style={styles.stationBadge}>
                        <Text style={styles.stationBadgeText}>{station.badge}</Text>
                      </View>
                    </View>
                    <Text style={styles.stationTitle}>{station.title}</Text>
                  </View>

                  <View style={styles.chevronBox}>
                    <ChevronRight size={18} color={Colors.textMuted} />
                  </View>
                </View>
              </StoryCard>
            </Pressable>
          );
        })}
      </View>

      {/* Bottom Launch Button */}
      <View style={styles.bottomLaunchSection}>
        <GentleButton
          title={t.startMissionBtn}
          onPress={() => startMissionAtStage('suit_up')}
          variant="emerald"
          size="large"
          fullWidth
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
    padding: 16,
    paddingBottom: 48,
    maxWidth: 620,
    alignSelf: 'center',
    width: '100%',
  },
  heroCard: {
    marginBottom: 14,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  missionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(107, 138, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  missionTagText: {
    color: Colors.primaryLight,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  statusLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(94, 214, 192, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.emerald,
  },
  statusLiveText: {
    color: Colors.emerald,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindSemiBold,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: Typography.size.hero,
    fontFamily: Typography.family.hindBold,
    marginBottom: 6,
  },
  heroDescription: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    marginBottom: 12,
  },
  flightGraphicWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 10,
  },
  mascotSlot: {
    marginVertical: 10,
    alignItems: 'center',
  },
  primaryLaunchBtnWrapper: {
    marginTop: 6,
  },
  cadetDossierCard: {
    marginBottom: 14,
    padding: 12,
  },
  cadetDossierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cadetDossierInfo: {
    flex: 1,
  },
  dossierBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  dossierBadgeText: {
    color: Colors.emerald,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindSemiBold,
  },
  cadetNameText: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontFamily: Typography.family.hindBold,
  },
  cadetRankText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 4,
    marginTop: 6,
    marginBottom: 10,
  },
  sectionHeading: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.hindBold,
  },
  sectionCode: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },
  stationsList: {
    gap: 10,
    marginBottom: 14,
  },
  stationPressable: {
    borderRadius: 16,
  },
  stationCard: {
    padding: 12,
  },
  stationContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stationLeftBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
  },
  stationIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  stationStepNum: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  stationDetails: {
    flex: 1,
  },
  stationBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  stationSubTag: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  stationBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  stationBadgeText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontFamily: Typography.family.notoRegular,
  },
  stationTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.hindBold,
  },
  chevronBox: {
    paddingRight: 4,
  },
  bottomLaunchSection: {
    marginTop: 6,
    marginBottom: 20,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
