import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Easing } from 'react-native';
import Svg, { Rect, Circle, Path, Defs, LinearGradient, RadialGradient, Stop, G, Line, Ellipse } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { StoryCard } from '../StoryCard';
import { GentleButton } from '../GentleButton';
import { PlanetImage } from '../PlanetImage';
import { CosmicTopicIllustration } from '../CosmicTopicIllustration';
import { ConfettiEffect } from '../ConfettiEffect';
import { AstronautAvatar } from '../AstronautAvatar';
import { DestinationId } from '../../content/spaceDestinations';
import {
  PLANETARY_MISSIONS,
  PlanetaryMission,
  PlanetaryMissionStage,
} from '../../content/planetaryMissionsData';
import { useAppStore } from '../../state/useAppStore';
import { tapHaptic, successHaptic } from '../../utils/haptics';
import {
  Rocket,
  Shield,
  Gauge,
  Thermometer,
  Compass,
  CheckCircle2,
  ChevronLeft,
  Flame,
  Camera,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Award,
  RotateCcw,
  Orbit,
  ArrowRight,
  Radio,
} from 'lucide-react-native';

interface PlanetaryMissionSimulatorProps {
  destinationId: DestinationId;
  onExit: () => void;
  onComplete?: (earnedXP: number) => void;
}

export const PlanetaryMissionSimulator: React.FC<PlanetaryMissionSimulatorProps> = ({
  destinationId,
  onExit,
  onComplete,
}) => {
  const language = useAppStore((s) => s.language);
  const addXP = useAppStore((s) => s.addXP);
  const rank = useAppStore((s) => s.rank);
  const isEn = language === 'en';

  const mission: PlanetaryMission =
    PLANETARY_MISSIONS[destinationId] || PLANETARY_MISSIONS.mars;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageTaskCompleted, setStageTaskCompleted] = useState(false);
  const [togglesState, setTogglesState] = useState<Record<string, boolean>>({});
  const [isSimulatingAction, setIsSimulatingAction] = useState(false);
  const [isMissionFinished, setIsMissionFinished] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  // Animation values
  const actionShakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanProgressAnim = useRef(new Animated.Value(0)).current;

  const currentStage: PlanetaryMissionStage = mission.stages[currentStageIndex];

  // Reset stage task state upon advancing
  useEffect(() => {
    setStageTaskCompleted(false);
    setTogglesState({});
    setIsSimulatingAction(false);
    scanProgressAnim.setValue(0);
  }, [currentStageIndex]);

  // Credit 120 XP upon finishing
  useEffect(() => {
    if (isMissionFinished && !xpAwarded) {
      addXP(120);
      setXpAwarded(true);
      if (onComplete) onComplete(120);
    }
  }, [isMissionFinished, xpAwarded, addXP, onComplete]);

  const handleToggle = (id: string) => {
    tapHaptic();
    setTogglesState((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      const required = currentStage.task.requiredToggles || [];
      const allActive = required.every((req) => updated[req.id]);
      if (allActive) {
        successHaptic();
        setStageTaskCompleted(true);
      } else {
        setStageTaskCompleted(false);
      }
      return updated;
    });
  };

  const handleExecuteAction = () => {
    if (isSimulatingAction) return;
    tapHaptic();
    setIsSimulatingAction(true);

    // Rumble effect for burns or deployments
    Animated.sequence([
      Animated.timing(actionShakeAnim, { toValue: -4, duration: 60, useNativeDriver: true }),
      Animated.timing(actionShakeAnim, { toValue: 4, duration: 60, useNativeDriver: true }),
      Animated.timing(actionShakeAnim, { toValue: -2, duration: 60, useNativeDriver: true }),
      Animated.timing(actionShakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();

    // Timed simulation of task completion
    setTimeout(() => {
      successHaptic();
      setIsSimulatingAction(false);
      setStageTaskCompleted(true);
    }, 1200);
  };

  const handleNextStage = () => {
    tapHaptic();
    if (currentStageIndex + 1 < mission.stages.length) {
      setCurrentStageIndex((i) => i + 1);
    } else {
      successHaptic();
      setIsMissionFinished(true);
    }
  };

  const handleReplay = () => {
    tapHaptic();
    setCurrentStageIndex(0);
    setStageTaskCompleted(false);
    setTogglesState({});
    setIsMissionFinished(false);
    setXpAwarded(false);
  };

  // ─── Completion & Flight Debrief Screen ──────────────────────────────────
  if (isMissionFinished) {
    return (
      <View style={styles.root}>
        <ConfettiEffect active />
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <StoryCard accent="gold" style={styles.debriefCard}>
            <View style={styles.avatarWrapper}>
              <AstronautAvatar size={82} rank={rank} showHalo />
            </View>

            <View style={styles.missionBadgePill}>
              <Award size={14} color={Colors.gold} />
              <Text style={styles.missionBadgeText}>{mission.badgeCode}</Text>
            </View>

            <Text style={styles.debriefHeading}>
              {isEn ? 'Mission Accomplished!' : 'অভিযান সফলভাবে সমাপ্ত!'}
            </Text>
            <Text style={styles.debriefTitle}>
              {isEn ? mission.missionName_en : mission.missionName_bn}
            </Text>

            <Text style={styles.debriefSummary}>
              {isEn
                ? `You executed all 5 historic stages of the ${mission.craftName_en} at ${mission.landingZone_en}. NASA telemetry records downlinked!`
                : `তুমি ${mission.landingZone_bn}-এ ${mission.craftName_bn}-এর ৫টি ঐতিহাসিক পর্যায় নিখুঁতভাবে পরিচালনা করেছ। নাসার বৈজ্ঞানিক তথ্য সফলভাবে আর্কাইভড!`}
            </Text>

            {/* XP Award Showcase Box */}
            <View style={styles.xpRewardBox}>
              <Sparkles size={24} color={Colors.gold} fill={Colors.gold} />
              <View>
                <Text style={styles.xpRewardTitle}>+১২০ XP অর্জিত হয়েছে!</Text>
                <Text style={styles.xpRewardDesc}>
                  {isEn ? 'Added to your NASA Cadet Dossier' : 'তোমার মহাকাশ ক্যাডেট ডসিয়ারে জমা হয়েছে'}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.debriefActions}>
              <GentleButton
                title={isEn ? 'Fly Again' : 'আবার অভিযান পরিচালনা করো'}
                onPress={handleReplay}
                variant="outline"
                size="normal"
                icon={<RotateCcw size={16} color={Colors.text} />}
              />
              <GentleButton
                title={isEn ? 'Return to Solar System' : 'সৌরজগত হাবে ফিরে চলো'}
                onPress={onExit}
                variant="gold"
                size="normal"
                icon={<Orbit size={18} color={Colors.textDark} />}
              />
            </View>
          </StoryCard>
        </ScrollView>
      </View>
    );
  }

  // ─── Active Simulation Flight Deck ───────────────────────────────────────
  return (
    <View style={styles.root}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <Pressable onPress={onExit} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="পেছনে">
            <ChevronLeft size={20} color={Colors.textSecondary} />
            <Text style={styles.backBtnText}>{isEn ? 'Exit Mission' : 'অভিযান ত্যাগ করো'}</Text>
          </Pressable>

          <View style={styles.stageIndicatorTag}>
            <Text style={styles.stageIndicatorText}>
              {isEn ? `Stage ${currentStage.order} / 5` : `পর্যায় ${currentStage.stageNumber} / ০৫`}
            </Text>
          </View>
        </View>

        {/* Mission Briefing Header Card */}
        <StoryCard accent="primary" style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerTitleCol}>
              <View style={styles.agencyBadgeRow}>
                <Text style={styles.agencyText}>{mission.agency}</Text>
                <Text style={styles.yearText}>• {mission.historicYear}</Text>
              </View>
              <Text style={styles.missionTitleText}>
                {isEn ? currentStage.title_en : currentStage.title_bn}
              </Text>
              <Text style={styles.missionSubText}>
                {isEn ? currentStage.subtitle_en : currentStage.subtitle_bn}
              </Text>
            </View>
            <View style={styles.planetAvatarBox}>
              <PlanetImage id={destinationId} size={64} />
            </View>
          </View>

          {/* Stepper Progress Bar */}
          <View style={styles.stepperTrack}>
            <View
              style={[
                styles.stepperFill,
                { width: `${(currentStage.order / mission.stages.length) * 100}%` },
              ]}
            />
          </View>
        </StoryCard>

        {/* Live Flight Telemetry Cockpit HUD */}
        <Animated.View style={{ transform: [{ translateX: actionShakeAnim }] }}>
          <StoryCard accent="none" style={styles.hudCard}>
            <View style={styles.hudHeaderRow}>
              <View style={styles.hudTitleGroup}>
                <View style={styles.hudLiveDot} />
                <Text style={styles.hudHeading}>
                  {isEn ? 'NASA FLIGHT TELEMETRY HUD' : 'নাসা ফ্লাইট টেলিমেট্রি ককপিট'}
                </Text>
              </View>
              <Text style={styles.craftBadge}>{isEn ? mission.craftName_en : mission.craftName_bn}</Text>
            </View>

            <View style={styles.hudGrid}>
              <View style={styles.hudCell}>
                <Text style={styles.hudCellLabel}>{isEn ? 'ALTITUDE' : 'উচ্চতা'}</Text>
                <Text style={styles.hudCellValue}>
                  {isEn ? currentStage.telemetry.altitude_en : currentStage.telemetry.altitude}
                </Text>
              </View>

              <View style={styles.hudCellDivider} />

              <View style={styles.hudCell}>
                <Text style={styles.hudCellLabel}>{isEn ? 'VELOCITY' : 'গতিবেগ'}</Text>
                <Text style={[styles.hudCellValue, { color: Colors.gold }]}>
                  {isEn ? currentStage.telemetry.velocity_en : currentStage.telemetry.velocity}
                </Text>
              </View>
            </View>

            <View style={styles.hudGridLower}>
              <View style={styles.hudCell}>
                <Text style={styles.hudCellLabel}>{isEn ? 'TEMPERATURE' : 'তাপমাত্রা'}</Text>
                <Text style={[styles.hudCellValue, { color: Colors.cyanLight }]}>
                  {isEn ? currentStage.telemetry.temperature_en : currentStage.telemetry.temperature}
                </Text>
              </View>

              <View style={styles.hudCellDivider} />

              <View style={styles.hudCell}>
                <Text style={styles.hudCellLabel}>{isEn ? 'PRESSURE' : 'বায়ুচাপ'}</Text>
                <Text style={styles.hudCellValue}>
                  {isEn ? currentStage.telemetry.pressure_en : currentStage.telemetry.pressure}
                </Text>
              </View>
            </View>
          </StoryCard>
        </Animated.View>

        {/* Historical Event & Science Fact Card */}
        <StoryCard accent="none" style={styles.historyCard}>
          <View style={styles.historyTopRow}>
            <Radio size={16} color={Colors.cyanLight} />
            <Text style={styles.historyTag}>
              {isEn ? 'HISTORIC MISSION EVENT' : 'ঐতিহাসিক মহাকাশ ঘটনা'}
            </Text>
          </View>
          <Text style={styles.historyBody}>
            {isEn ? currentStage.historicEvent_en : currentStage.historicEvent_bn}
          </Text>

          <View style={styles.scienceFactSubBox}>
            <Sparkles size={14} color={Colors.gold} />
            <Text style={styles.scienceFactText}>
              {isEn ? currentStage.nasaScienceFact_en : currentStage.nasaScienceFact_bn}
            </Text>
          </View>
        </StoryCard>

        {/* Interactive Flight Deck Controls for this Stage */}
        <StoryCard accent={stageTaskCompleted ? 'emerald' : 'gold'} style={styles.interactiveActionCard}>
          <Text style={styles.actionPromptLabel}>
            {isEn ? 'COMMANDER ACTION REQUIRED:' : 'কমান্ডার অ্যাকশন নির্দেশ:'}
          </Text>
          <Text style={styles.actionInstruction}>
            {isEn ? currentStage.task.instruction_en : currentStage.task.instruction_bn}
          </Text>

          {/* Toggle Switches Mode */}
          {currentStage.task.type === 'toggle_systems' && currentStage.task.requiredToggles && (
            <View style={styles.togglesList}>
              {currentStage.task.requiredToggles.map((tog) => {
                const active = !!togglesState[tog.id];
                return (
                  <Pressable
                    key={tog.id}
                    onPress={() => handleToggle(tog.id)}
                    style={[styles.toggleRow, active && styles.toggleRowActive]}
                    accessibilityRole="switch"
                    accessibilityLabel={isEn ? tog.label_en : tog.label_bn}
                  >
                    <View style={styles.toggleTextGroup}>
                      <Text style={[styles.toggleLabel, active && styles.toggleLabelActive]}>
                        {isEn ? tog.label_en : tog.label_bn}
                      </Text>
                      <Text style={styles.toggleStatus}>{active ? (isEn ? 'ONLINE' : 'সক্রিয়') : (isEn ? 'STANDBY' : 'অফ')}</Text>
                    </View>
                    {active ? (
                      <ToggleRight size={28} color={Colors.emerald} />
                    ) : (
                      <ToggleLeft size={28} color={Colors.textMuted} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Thruster / Parachute / Camera Action Button */}
          {currentStage.task.type !== 'toggle_systems' && (
            <View style={styles.actionBtnWrap}>
              <GentleButton
                title={
                  isSimulatingAction
                    ? (isEn ? 'Executing...' : 'সম্পাদিত হচ্ছে...')
                    : stageTaskCompleted
                    ? (isEn ? 'Step Completed' : 'ধাপ সফলভাবে সম্পন্ন')
                    : isEn
                    ? currentStage.task.actionButton_en
                    : currentStage.task.actionButton_bn
                }
                onPress={handleExecuteAction}
                disabled={isSimulatingAction || stageTaskCompleted}
                variant={stageTaskCompleted ? 'emerald' : 'primary'}
                size="large"
                fullWidth
                icon={
                  stageTaskCompleted ? (
                    <CheckCircle2 size={20} color={Colors.textDark} />
                  ) : currentStage.task.type === 'thrust_burn' ? (
                    <Flame size={20} color="#FFFFFF" fill="#FF8A00" />
                  ) : (
                    <Rocket size={20} color="#FFFFFF" />
                  )
                }
              />
            </View>
          )}

          {/* Feedback message upon completing step */}
          {stageTaskCompleted && (
            <View style={styles.successBanner}>
              <CheckCircle2 size={16} color={Colors.emerald} />
              <Text style={styles.successBannerText}>
                {isEn ? currentStage.task.successMessage_en : currentStage.task.successMessage_bn}
              </Text>
            </View>
          )}
        </StoryCard>

        {/* Advance or Complete Stage CTA */}
        <View style={styles.footerActionRow}>
          <GentleButton
            title={
              currentStageIndex + 1 < mission.stages.length
                ? isEn
                  ? `Proceed to Stage ${currentStage.order + 1} →`
                  : `পরবর্তী পর্যায় (${mission.stages[currentStageIndex + 1]?.stageNumber}) শুরু করো →`
                : isEn
                ? 'Finish Mission & Collect +120 XP!'
                : 'অভিযান সম্পন্ন করে +১২০ XP অর্জন করো!'
            }
            onPress={handleNextStage}
            disabled={!stageTaskCompleted}
            variant="gold"
            size="large"
            fullWidth
            icon={currentStageIndex + 1 < mission.stages.length ? <ArrowRight size={18} color={Colors.textDark} /> : <Award size={18} color={Colors.textDark} />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
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
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  backBtnText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },
  stageIndicatorTag: {
    backgroundColor: 'rgba(255, 200, 107, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stageIndicatorText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.heading,
  },
  headerCard: {
    marginBottom: 12,
    padding: 14,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  headerTitleCol: {
    flex: 1,
  },
  agencyBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  agencyText: {
    color: Colors.cyanLight,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
  },
  yearText: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  missionTitleText: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.heading,
    marginBottom: 2,
  },
  missionSubText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },
  planetAvatarBox: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  stepperFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  hudCard: {
    marginBottom: 12,
    backgroundColor: '#0F172A',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1.5,
    padding: 14,
  },
  hudHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  hudTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hudLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.emerald,
  },
  hudHeading: {
    color: '#94A3B8',
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
  },
  craftBadge: {
    color: Colors.cyanLight,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoSemiBold,
  },
  hudGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  hudGridLower: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
  },
  hudCell: {
    flex: 1,
  },
  hudCellDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
  },
  hudCellLabel: {
    color: '#64748B',
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.headingSemi,
    marginBottom: 2,
  },
  hudCellValue: {
    color: '#F8FAFC',
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
  },
  historyCard: {
    marginBottom: 12,
    padding: 14,
    backgroundColor: Colors.surface,
  },
  historyTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  historyTag: {
    color: Colors.cyanLight,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
  },
  historyBody: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    marginBottom: 10,
  },
  scienceFactSubBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(255, 200, 107, 0.08)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 107, 0.18)',
  },
  scienceFactText: {
    flex: 1,
    color: Colors.gold,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
  interactiveActionCard: {
    marginBottom: 14,
    padding: 14,
  },
  actionPromptLabel: {
    color: Colors.primary,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
    marginBottom: 4,
  },
  actionInstruction: {
    color: Colors.text,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    fontFamily: Typography.family.notoBold,
    marginBottom: 12,
  },
  togglesList: {
    gap: 8,
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleRowActive: {
    backgroundColor: 'rgba(93, 211, 158, 0.12)',
    borderColor: Colors.emerald,
  },
  toggleTextGroup: {
    flex: 1,
  },
  toggleLabel: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.headingSemi,
  },
  toggleLabelActive: {
    color: Colors.emerald,
  },
  toggleStatus: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
    marginTop: 2,
  },
  actionBtnWrap: {
    marginTop: 4,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(93, 211, 158, 0.15)',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.emerald,
  },
  successBannerText: {
    flex: 1,
    color: Colors.emerald,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingSemi,
  },
  footerActionRow: {
    marginTop: 4,
  },
  debriefCard: {
    alignItems: 'center',
    padding: 20,
    textAlign: 'center',
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  missionBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 200, 107, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 10,
  },
  missionBadgeText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
  },
  debriefHeading: {
    color: Colors.emerald,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.heading,
    marginBottom: 4,
  },
  debriefTitle: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontFamily: Typography.family.heading,
    textAlign: 'center',
    marginBottom: 12,
  },
  debriefSummary: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.body,
    textAlign: 'center',
    marginBottom: 18,
    fontFamily: Typography.family.notoRegular,
  },
  xpRewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 200, 107, 0.12)',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gold,
    width: '100%',
    marginBottom: 20,
  },
  xpRewardTitle: {
    color: Colors.gold,
    fontSize: Typography.size.body,
    fontFamily: Typography.family.heading,
  },
  xpRewardDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },
  debriefActions: {
    width: '100%',
    gap: 10,
  },
});
