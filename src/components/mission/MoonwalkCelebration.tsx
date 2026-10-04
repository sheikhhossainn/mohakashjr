import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import Svg, { Rect, Circle, Path, Defs, LinearGradient, Stop, G, Line, Polygon } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { StoryCard } from '../StoryCard';
import { GentleButton } from '../GentleButton';
import { MascotReaction } from '../MascotReaction';
import { useAppStore } from '../../state/useAppStore';
import { getTranslation } from '../../i18n/translations';
import { LunarRegion } from '../../content/missionData';
import {
  Award,
  Sparkles,
  Flag,
  Footprints,
  Gem,
  CheckCircle2,
  RotateCcw,
  Check,
  ChevronLeft,
} from 'lucide-react-native';

interface MoonwalkCelebrationProps {
  selectedSite: LunarRegion;
  onPlayAgain: () => void;
  onExit: () => void;
}

export const MoonwalkCelebration: React.FC<MoonwalkCelebrationProps> = ({
  selectedSite,
  onPlayAgain,
  onExit,
}) => {
  const language = useAppStore((state) => state.language);
  const addXP = useAppStore((state) => state.addXP);
  const t = getTranslation(language).missionGame.moonwalk;

  // 3 Interactive Surface Actions
  const [hasDescended, setHasDescended] = useState(false);
  const [hasPlantedFlag, setHasPlantedFlag] = useState(false);
  const [hasCollectedSample, setHasCollectedSample] = useState(false);
  const [hasAwardedXP, setHasAwardedXP] = useState(false);

  const allActionsDone = hasDescended && hasPlantedFlag && hasCollectedSample;

  // Credit 120 XP upon completing all actions
  useEffect(() => {
    if (allActionsDone && !hasAwardedXP) {
      addXP(120);
      setHasAwardedXP(true);
    }
  }, [allActionsDone, hasAwardedXP, addXP]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.stageTag}>
          <Text style={styles.stageTagText}>ধাপ ৫ / ৫ • FINAL STAGE</Text>
        </View>
        <View style={styles.regionBadge}>
          <Text style={styles.regionBadgeText}>{selectedSite.name_bn}</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.headerBlock}>
        <Text style={styles.title}>{t.heading}</Text>
        <Text style={styles.subtitle}>{t.desc}</Text>
      </View>

      {/* Illustrated Moon Surface Scene */}
      <StoryCard accent={allActionsDone ? 'gold' : 'primary'} style={styles.sceneCard}>
        <View style={styles.moonCanvasWrapper}>
          <Svg width={300} height={210} viewBox="0 0 300 210">
            <Defs>
              <LinearGradient id="cosmosVoid" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#040614" />
                <Stop offset="100%" stopColor="#0F1128" />
              </LinearGradient>
              <LinearGradient id="regolithDust" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#64748B" />
                <Stop offset="60%" stopColor="#475569" />
                <Stop offset="100%" stopColor="#1E293B" />
              </LinearGradient>
              <LinearGradient id="goldVisorSmall" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFF275" />
                <Stop offset="100%" stopColor="#FFB800" />
              </LinearGradient>
            </Defs>

            {/* Dark Space Sky */}
            <Rect x="0" y="0" width="300" height="210" rx="16" fill="url(#cosmosVoid)" />

            {/* Stars */}
            <Circle cx="20" cy="30" r="1.5" fill="#FFFFFF" opacity={0.6} />
            <Circle cx="80" cy="18" r="1" fill="#FFFFFF" opacity={0.8} />
            <Circle cx="140" cy="35" r="1.5" fill="#FFFFFF" opacity={0.5} />
            <Circle cx="220" cy="22" r="1" fill="#FFFFFF" opacity={0.7} />
            <Circle cx="280" cy="40" r="1.5" fill="#FFFFFF" opacity={0.6} />

            {/* Blue Marble Earth Rising */}
            <Circle cx="250" cy="45" r="16" fill="#0284C7" />
            <Circle cx="250" cy="45" r="15" fill="#0EA5E9" />
            <Path d="M 242 42 Q 252 36 258 44 Q 254 52 246 49 Z" fill="#22C55E" opacity={0.8} />
            <Path d="M 238 45 Q 248 40 255 42" stroke="#FFFFFF" strokeWidth="2" opacity={0.5} />

            {/* Lunar Regolith Horizon */}
            <Path d="M 0 150 Q 80 138 160 148 Q 230 155 300 142 L 300 210 L 0 210 Z" fill="url(#regolithDust)" />
            {/* Crater shadows */}
            <Circle cx="60" cy="175" r="20" fill="#334155" />
            <Circle cx="62" cy="177" r="16" fill="#1E293B" />
            <Circle cx="240" cy="185" r="26" fill="#334155" />
            <Circle cx="242" cy="187" r="22" fill="#1E293B" />

            {/* Lunar Lander on the Left */}
            <G>
              {/* Descent Stage Base */}
              <Rect x="20" y="105" width="40" height="26" rx="4" fill="#FFC86B" stroke="#D97706" strokeWidth="1.5" />
              {/* Ascent Cabin */}
              <Circle cx="40" cy="98" r="12" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
              <Circle cx="40" cy="98" r="5" fill="#0284C7" />
              {/* Lander Legs */}
              <Line x1="20" y1="120" x2="10" y2="148" stroke="#CBD5E1" strokeWidth="2" />
              <Line x1="60" y1="120" x2="70" y2="148" stroke="#CBD5E1" strokeWidth="2" />
              <Circle cx="10" cy="148" r="3" fill="#64748B" />
              <Circle cx="70" cy="148" r="3" fill="#64748B" />
              {/* Exit Ladder */}
              <Line x1="45" y1="105" x2="45" y2="152" stroke="#94A3B8" strokeWidth="1.5" />
              <Line x1="42" y1="115" x2="48" y2="115" stroke="#94A3B8" strokeWidth="1.5" />
              <Line x1="42" y1="125" x2="48" y2="125" stroke="#94A3B8" strokeWidth="1.5" />
              <Line x1="42" y1="135" x2="48" y2="135" stroke="#94A3B8" strokeWidth="1.5" />
              <Line x1="42" y1="145" x2="48" y2="145" stroke="#94A3B8" strokeWidth="1.5" />
            </G>

            {/* Astronaut Character on Lunar Surface */}
            {hasDescended ? (
              <G>
                {/* Boot Print Trail in Regolith */}
                <Circle cx="75" cy="165" r="3" fill="#1E293B" />
                <Circle cx="90" cy="162" r="3" fill="#1E293B" />
                <Circle cx="105" cy="166" r="3" fill="#1E293B" />

                {/* Astronaut Standing in Center */}
                {/* PLSS Backpack */}
                <Rect x="114" y="118" width="16" height="22" rx="3" fill="#475569" stroke="#64748B" strokeWidth="1" />
                {/* EVA Suit Body */}
                <Rect x="122" y="122" width="22" height="28" rx="6" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
                {/* Suit Legs */}
                <Rect x="124" y="148" width="8" height="18" rx="3" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
                <Rect x="134" y="148" width="8" height="18" rx="3" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
                {/* Heavy Boots */}
                <Rect x="122" y="162" width="10" height="6" rx="2" fill="#475569" />
                <Rect x="134" y="162" width="10" height="6" rx="2" fill="#475569" />
                {/* Arms */}
                <Line x1="124" y1="126" x2="116" y2="138" stroke="#F1F5F9" strokeWidth="4" strokeLinecap="round" />
                <Line x1="142" y1="126" x2={hasPlantedFlag ? '154' : '150'} y2={hasPlantedFlag ? '122' : '138'} stroke="#F1F5F9" strokeWidth="4" strokeLinecap="round" />
                {/* Helmet with Golden Visor */}
                <Circle cx="133" cy="112" r="12" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
                <Rect x="126" y="106" width="14" height="11" rx="4" fill="url(#goldVisorSmall)" stroke="#D97706" strokeWidth="1" />
              </G>
            ) : (
              // Astronaut standing at top of ladder
              <G>
                <Circle cx="45" cy="94" r="7" fill="#F8FAFC" />
                <Rect x="42" y="90" width="7" height="6" rx="2" fill="url(#goldVisorSmall)" />
              </G>
            )}

            {/* Planted Mission Flag */}
            {hasPlantedFlag && (
              <G>
                {/* Flagpole */}
                <Line x1="168" y1="108" x2="168" y2="168" stroke="#E2E8F0" strokeWidth="2.5" />
                {/* Bangladesh / Mohakash Academy Flag */}
                <Rect x="168" y="108" width="42" height="26" rx="3" fill="#006A4E" stroke="#004D38" strokeWidth="1" />
                <Circle cx="186" cy="121" r="8" fill="#F42A41" />
                {/* Gold Academy Star Badge */}
                <Circle cx="198" cy="116" r="2.5" fill={Colors.gold} />
              </G>
            )}

            {/* Collected Lunar Sample Ice Core */}
            {hasCollectedSample && (
              <G>
                {/* Sample Container Box on ground */}
                <Rect x="100" y="160" width="16" height="12" rx="3" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
                <Circle cx="108" cy="166" r="3" fill="#E0F2FE" />
                {/* Sparkle beam */}
                <Line x1="108" y1="152" x2="108" y2="157" stroke={Colors.cyan} strokeWidth="1.5" />
                <Line x1="103" y1="155" x2="113" y2="155" stroke={Colors.cyan} strokeWidth="1.5" />
              </G>
            )}
          </Svg>
        </View>

        {/* Status Callout */}
        <View style={styles.statusCallout}>
          <Text style={styles.statusCalloutText}>
            {allActionsDone
              ? t.missionDebriefTitle
              : !hasDescended
              ? 'মই বেয়ে চাঁদের মাটিতে নামতে বোতাম চাপো'
              : !hasPlantedFlag
              ? 'জাতীয় পতাকা স্থাপন করো'
              : 'বৈজ্ঞানিক গবেষণার জন্য চন্দ্রশিলা সংগ্রহ করো'}
          </Text>
        </View>
      </StoryCard>

      {/* 3 Interactive Moonwalk Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Action 1: Descend */}
        <Pressable
          onPress={() => setHasDescended(true)}
          disabled={hasDescended}
          style={({ pressed }) => [
            styles.actionCard,
            hasDescended && styles.actionCardDone,
            pressed && !hasDescended && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t.stepDescend}
        >
          <View style={[styles.actionIconBox, { backgroundColor: 'rgba(107, 138, 255, 0.15)' }]}>
            <Footprints size={20} color={Colors.primaryLight} />
          </View>
          <View style={styles.actionDetails}>
            <Text style={styles.actionTitle}>{t.stepDescend}</Text>
            <Text style={styles.actionSub}>
              {hasDescended ? t.stepDescended : 'চাঁদের মাটিতে প্রথম মানব পদক্ষেপ'}
            </Text>
          </View>
          {hasDescended ? (
            <CheckCircle2 size={22} color={Colors.emerald} />
          ) : (
            <View style={styles.actionPendingDot} />
          )}
        </Pressable>

        {/* Action 2: Plant Flag */}
        <Pressable
          onPress={() => setHasPlantedFlag(true)}
          disabled={!hasDescended || hasPlantedFlag}
          style={({ pressed }) => [
            styles.actionCard,
            hasPlantedFlag && styles.actionCardDone,
            (!hasDescended || hasPlantedFlag) && styles.actionCardDisabled,
            pressed && hasDescended && !hasPlantedFlag && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t.stepFlag}
        >
          <View style={[styles.actionIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
            <Flag size={20} color="#EF4444" />
          </View>
          <View style={styles.actionDetails}>
            <Text style={styles.actionTitle}>{t.stepFlag}</Text>
            <Text style={styles.actionSub}>
              {hasPlantedFlag ? t.stepFlagDone : 'বাংলাদেশ ও মহাকাশ একাডেমি পতাকা'}
            </Text>
          </View>
          {hasPlantedFlag ? (
            <CheckCircle2 size={22} color={Colors.emerald} />
          ) : (
            <View style={styles.actionPendingDot} />
          )}
        </Pressable>

        {/* Action 3: Collect Sample */}
        <Pressable
          onPress={() => setHasCollectedSample(true)}
          disabled={!hasPlantedFlag || hasCollectedSample}
          style={({ pressed }) => [
            styles.actionCard,
            hasCollectedSample && styles.actionCardDone,
            (!hasPlantedFlag || hasCollectedSample) && styles.actionCardDisabled,
            pressed && hasPlantedFlag && !hasCollectedSample && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t.stepSample}
        >
          <View style={[styles.actionIconBox, { backgroundColor: 'rgba(0, 240, 255, 0.15)' }]}>
            <Gem size={20} color={Colors.cyan} />
          </View>
          <View style={styles.actionDetails}>
            <Text style={styles.actionTitle}>{t.stepSample}</Text>
            <Text style={styles.actionSub}>
              {hasCollectedSample ? t.stepSampleDone : 'প্রাচীন লুনার বেসাল্ট ও বরফের স্ফটিক'}
            </Text>
          </View>
          {hasCollectedSample ? (
            <CheckCircle2 size={22} color={Colors.emerald} />
          ) : (
            <View style={styles.actionPendingDot} />
          )}
        </Pressable>
      </View>

      {/* Completion & Rewards Banner */}
      {allActionsDone && (
        <StoryCard accent="emerald" style={styles.rewardCard}>
          <View style={styles.rewardHeader}>
            <Award size={24} color={Colors.gold} />
            <Text style={styles.rewardTitle}>{t.missionDebriefTitle}</Text>
          </View>
          <Text style={styles.rewardXP}>{t.xpEarned}</Text>

          {/* Astro-Buddy Cheering Mascot */}
          <View style={styles.mascotSlot}>
            <MascotReaction
              state="celebrate"
              size={80}
              showSpeechBubble
              bubbleText="সাবাশ কমান্ডার! চাঁদের বুকে তোমার অভিযান স্মরণীয় হয়ে থাকবে!"
            />
          </View>

          {/* Navigation Action Buttons */}
          <View style={styles.buttonGroup}>
            <GentleButton
              title={t.exitBtn}
              onPress={onExit}
              variant="emerald"
              size="large"
              fullWidth
            />
            <GentleButton
              title={t.playAgainBtn}
              onPress={onPlayAgain}
              variant="gold"
              size="normal"
              fullWidth
              icon={<RotateCcw size={16} color={Colors.textDark} />}
            />
          </View>
        </StoryCard>
      )}
    </ScrollView>
  );
};

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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stageTag: {
    backgroundColor: 'rgba(94, 214, 192, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stageTagText: {
    color: Colors.emerald,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  regionBadge: {
    backgroundColor: 'rgba(255, 200, 107, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  regionBadgeText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindSemiBold,
  },
  headerBlock: {
    marginBottom: 14,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.size.hero,
    fontFamily: Typography.family.hindBold,
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
  },
  sceneCard: {
    padding: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  moonCanvasWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusCallout: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 10,
  },
  statusCalloutText: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoSemiBold,
  },
  actionsContainer: {
    gap: 10,
    marginBottom: 14,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 12,
  },
  actionCardDone: {
    borderColor: 'rgba(94, 214, 192, 0.4)',
    backgroundColor: 'rgba(94, 214, 192, 0.05)',
  },
  actionCardDisabled: {
    opacity: 0.6,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDetails: {
    flex: 1,
  },
  actionTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.hindBold,
    marginBottom: 2,
  },
  actionSub: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  actionPendingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.borderLight,
    marginRight: 6,
  },
  rewardCard: {
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  rewardTitle: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontFamily: Typography.family.hindBold,
  },
  rewardXP: {
    color: Colors.gold,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.hindBold,
    marginBottom: 10,
  },
  mascotSlot: {
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonGroup: {
    width: '100%',
    gap: 8,
    marginTop: 10,
  },
  pressed: {
    opacity: 0.8,
  },
});
