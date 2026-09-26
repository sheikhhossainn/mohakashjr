import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { DoubleBezelCard } from '../DoubleBezelCard';
import { TactileButton } from '../TactileButton';
import { ConfettiEffect } from '../ConfettiEffect';
import { MascotReaction } from '../MascotReaction';
import { AnimatedXPBar } from '../AnimatedXPBar';
import {
  LunarRegion,
  evaluateMoonLandingMission,
  MissionTelemetryResult,
} from '../../content/missionData';
import { useAppStore } from '../../state/useAppStore';
import {
  Award,
  Star,
  RotateCcw,
  Home,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Rocket,
  Info,
  Scale,
  Wind,
  Zap,
} from 'lucide-react-native';

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function toBengaliNumber(num: number): string {
  return num
    .toString()
    .split('')
    .map((d) => BENGALI_DIGITS[parseInt(d, 10)] || d)
    .join('');
}

interface MissionDebriefViewProps {
  selectedSite: LunarRegion;
  selectedCargoIds: string[];
  onPlayAgain: () => void;
  onExitMission: () => void;
}

export const MissionDebriefView: React.FC<MissionDebriefViewProps> = ({
  selectedSite,
  selectedCargoIds,
  onPlayAgain,
  onExitMission,
}) => {
  const { xp, addXP } = useAppStore();
  const [initialUserXP] = useState(xp);
  const [hasAwardedXP, setHasAwardedXP] = useState(false);

  // Evaluate mission result
  const result: MissionTelemetryResult = evaluateMoonLandingMission(
    selectedSite.id,
    selectedCargoIds
  );

  // Credit XP once on mount
  useEffect(() => {
    if (!hasAwardedXP && result.earnedXP > 0) {
      addXP(result.earnedXP);
      setHasAwardedXP(true);
    }
  }, [hasAwardedXP, result.earnedXP, addXP]);

  const isSuccess = result.status === 'perfect' || result.status === 'success';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Victory Confetti for 2 or 3 Star Missions */}
      {result.starRating >= 2 && <ConfettiEffect active />}

      {/* Hero Debrief Status Card */}
      <DoubleBezelCard
        glow={result.starRating === 3 ? 'gold' : isSuccess ? 'emerald' : 'coral'}
        tag="মিশন কন্ট্রোল ডিব্রিফ 📡"
        style={styles.heroCard}
      >
        {/* Animated Mascot Reaction */}
        <View style={styles.mascotSlot}>
          <MascotReaction
            state={
              result.starRating === 3
                ? 'celebrate'
                : isSuccess
                ? 'correct'
                : result.status === 'warning'
                ? 'thinking'
                : 'incorrect'
            }
            size={110}
            showSpeechBubble
            bubbleText={result.verdictTitle_bn}
          />
        </View>

        <Text style={styles.verdictTitle}>{result.verdictTitle_bn}</Text>
        <Text style={styles.verdictDescription}>{result.verdictDescription_bn}</Text>

        {/* 3-Star Rating Rating Header */}
        <View style={styles.starsRow}>
          {[1, 2, 3].map((starIndex) => (
            <View key={starIndex} style={styles.starWrapper}>
              <Star
                size={32}
                color={starIndex <= result.starRating ? Colors.gold : 'rgba(255, 255, 255, 0.2)'}
                fill={starIndex <= result.starRating ? Colors.gold : 'transparent'}
              />
            </View>
          ))}
        </View>

        {/* Overall Score Meter */}
        <View style={styles.scorePill}>
          <Award size={16} color={Colors.thermalGold} />
          <Text style={styles.scoreText}>
            মিশন মূল্যায়ন স্কোর: <Text style={styles.scoreVal}>{toBengaliNumber(result.totalScore)} / ১০০</Text>
          </Text>
        </View>
      </DoubleBezelCard>

      {/* Animated Reusable XP Bar Filling */}
      <AnimatedXPBar
        startXP={initialUserXP}
        earnedXP={result.earnedXP}
        label_bn="মিশন পুরস্কার ও ক্যাডেট পদোন্নতি"
      />

      {/* Flight Director Telemetry Report */}
      <View style={styles.telemetrySection}>
        <View style={styles.sectionHeader}>
          <Rocket size={16} color={Colors.hudCyan} />
          <Text style={styles.sectionTitle}>ফ্লাইট ডিরেক্টর টেলিমেট্রি লগ</Text>
        </View>

        {/* 4 Diagnostic Stat Gauges */}
        <View style={styles.statsGrid}>
          {/* Payload weight */}
          <View style={styles.statCard}>
            <View style={styles.statCardTop}>
              <Scale size={14} color={result.isOverweight ? Colors.coral : Colors.hudCyan} />
              <Text style={styles.statCardLabel}>পেলোড ওজন</Text>
            </View>
            <Text
              style={[
                styles.statCardNumber,
                result.isOverweight && { color: Colors.coral },
              ]}
            >
              {toBengaliNumber(result.totalWeight_kg)} কেজি
            </Text>
            <Text style={styles.statCardSub}>সীমা: ৫০০ কেজি</Text>
          </View>

          {/* Oxygen Level */}
          <View style={styles.statCard}>
            <View style={styles.statCardTop}>
              <Wind size={14} color={result.oxygenLevel >= 70 ? Colors.emerald : Colors.coral} />
              <Text style={styles.statCardLabel}>অক্সিজেন সঞ্চয়</Text>
            </View>
            <Text
              style={[
                styles.statCardNumber,
                { color: result.oxygenLevel >= 70 ? Colors.emerald : Colors.coral },
              ]}
            >
              {toBengaliNumber(result.oxygenLevel)}%
            </Text>
            <Text style={styles.statCardSub}>প্রয়োজন: ৭০%</Text>
          </View>

          {/* Power Level */}
          <View style={styles.statCard}>
            <View style={styles.statCardTop}>
              <Zap size={14} color={result.powerLevel >= 40 ? Colors.thermalGold : Colors.coral} />
              <Text style={styles.statCardLabel}>বিদ্যুৎ উৎপাদন</Text>
            </View>
            <Text
              style={[
                styles.statCardNumber,
                { color: result.powerLevel >= 40 ? Colors.thermalGold : Colors.coral },
              ]}
            >
              {toBengaliNumber(result.powerLevel)}%
            </Text>
            <Text style={styles.statCardSub}>সাইট ইফিসিয়েন্সি</Text>
          </View>

          {/* Science Score */}
          <View style={styles.statCard}>
            <View style={styles.statCardTop}>
              <Award size={14} color={Colors.plasmaViolet} />
              <Text style={styles.statCardLabel}>বিজ্ঞান প্রাপ্তি</Text>
            </View>
            <Text style={[styles.statCardNumber, { color: Colors.plasmaViolet }]}>
              {toBengaliNumber(result.scienceScore)}%
            </Text>
            <Text style={styles.statCardSub}>গবেষণা রেকর্ড</Text>
          </View>
        </View>

        {/* Detailed Pedagogical Feedback Checklist */}
        <View style={styles.feedbackList}>
          {result.feedbackPoints_bn.map((point, index) => {
            const isNegative = point.startsWith('⚠️') || point.startsWith('❌') || point.startsWith('⚡');

            return (
              <View
                key={index}
                style={[
                  styles.feedbackItem,
                  isNegative ? styles.feedbackItemAlert : styles.feedbackItemSuccess,
                ]}
              >
                {isNegative ? (
                  <AlertTriangle size={16} color={Colors.coral} style={styles.feedbackIcon} />
                ) : (
                  <CheckCircle2 size={16} color={Colors.emerald} style={styles.feedbackIcon} />
                )}
                <Text style={styles.feedbackText}>{point}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* NASA Artemis Real-World Science Callout */}
      <DoubleBezelCard glow="cyan" tag="নাসা আর্টেমিস বৈজ্ঞানিক সত্য 🪐" style={styles.nasaCard}>
        <View style={styles.nasaRow}>
          <Info size={18} color={Colors.hudCyan} />
          <Text style={styles.nasaText}>{result.nasaArtemisInsight_bn}</Text>
        </View>
      </DoubleBezelCard>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TactileButton
          title="আবার খেলো 🔄"
          onPress={onPlayAgain}
          variant="outline"
          size="normal"
          icon={<RotateCcw size={16} color="#FFFFFF" />}
        />

        <TactileButton
          title="ড্যাশবোর্ডে ফিরে যাও 🏠"
          onPress={onExitMission}
          variant="primary"
          size="normal"
          icon={<Home size={16} color="#FFFFFF" />}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  heroCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mascotSlot: {
    marginVertical: 10,
    alignItems: 'center',
  },
  verdictTitle: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.heavy,
    textAlign: 'center',
    marginBottom: 6,
  },
  verdictDescription: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 10,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  starWrapper: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.35)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semiBold,
  },
  scoreVal: {
    color: Colors.thermalGold,
    fontWeight: Typography.weight.heavy,
  },
  telemetrySection: {
    backgroundColor: 'rgba(14, 18, 60, 0.85)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.25)',
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statCardLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
  },
  statCardNumber: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.heavy,
  },
  statCardSub: {
    color: Colors.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
  feedbackList: {
    gap: 8,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  feedbackItemSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  feedbackItemAlert: {
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  feedbackIcon: {
    marginTop: 2,
  },
  feedbackText: {
    flex: 1,
    color: Colors.text,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
  },
  nasaCard: {
    marginBottom: 20,
  },
  nasaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  nasaText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
  },
  actionButtons: {
    gap: 12,
  },
});
