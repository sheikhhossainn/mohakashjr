import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Radius, Space, Gutter } from '../theme/layout';
import { StoryCard } from './StoryCard';
import { GentleButton } from './GentleButton';
import { ScalePressable } from './ScalePressable';
import { PlanetImage } from './PlanetImage';
import { StarField } from './StarField';
import {
  SPACE_DESTINATIONS,
  DestinationId,
  getDestinationById,
} from '../content/spaceDestinations';
import { useAppStore } from '../state/useAppStore';
import { getTranslation, AppLanguage } from '../i18n/translations';
import { tapHaptic, successHaptic, gentleErrorHaptic } from '../utils/haptics';
import {
  ChevronLeft,
  ChevronRight,
  Rocket,
  Sparkles,
  Scale,
  Clock,
  Compass,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Orbit,
  BookOpen,
  Minus,
  Plus,
  ShieldAlert,
  Flame,
  Snowflake,
} from 'lucide-react-native';

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const OPTION_PREFIXES = ['ক', 'খ', 'গ', 'ঘ'];
const PRESET_WEIGHTS = [20, 30, 40, 50, 60];

function formatNumber(num: number | string, isBangla: boolean): string {
  const str = num.toString();
  if (!isBangla) return str;
  return str
    .split('')
    .map((char) => {
      const parsed = parseInt(char, 10);
      return !isNaN(parsed) && BENGALI_DIGITS[parsed] !== undefined
        ? BENGALI_DIGITS[parsed]
        : char;
    })
    .join('');
}

interface PlanetaryDossierProps {
  destinationId: DestinationId;
  language: AppLanguage;
  onBack: () => void;
  onLaunchMoon: () => void;
  onLaunchMission?: (id: DestinationId) => void;
  onSelectDestination: (id: DestinationId) => void;
}

export const PlanetaryDossier: React.FC<PlanetaryDossierProps> = ({
  destinationId,
  language,
  onBack,
  onLaunchMoon,
  onLaunchMission,
  onSelectDestination,
}) => {
  const insets = useSafeAreaInsets();
  const { addXP } = useAppStore();
  const t = getTranslation(language).spaceHub;
  const isEn = language === 'en';

  const destination = useMemo(
    () => getDestinationById(destinationId),
    [destinationId]
  );

  // Weight Lab State
  const [earthWeight, setEarthWeight] = useState(30);

  // Mini Quiz State (tracked per planet)
  const [quizState, setQuizState] = useState<
    Record<string, { selected: number | null; solved: boolean }>
  >({});
  const [rewardedQuizzes, setRewardedQuizzes] = useState<Set<string>>(new Set());

  const currentQuizState = quizState[destination.id] || {
    selected: null,
    solved: false,
  };

  // Calculate dynamic weight
  const destinationWeight = (earthWeight * destination.gravityMultiplier).toFixed(1);

  // Jump sensation calculation
  const getWeightSensation = () => {
    const mult = destination.gravityMultiplier;
    if (mult < 0.25) {
      return isEn
        ? 'Super Cosmic Jump! You feel light as a feather — a single leap sends you soaring over a two-story building!'
        : 'মহাজাগতিক লাফ! তুমি পাখির পালকের মতো হালকা অনুভব করবে — এক লাফে অনায়াসে দোতলা সমান উঁচুতে উঠে যাবে!';
    }
    if (mult < 0.6) {
      return isEn
        ? 'Superhero Agility! You can easily leap over high walls or car roofs with effortless balance.'
        : 'সুপারহিরোর মতো হালকা! এক লাফে তুমি যেকোনো উঁচু পাঁচিল বা গাড়ির ছাদ অনায়াসে টপকে যেতে পারবে।';
    }
    if (mult <= 1.2) {
      return isEn
        ? 'Earth-like Balance! Movement and walking feel comfortably familiar and natural.'
        : 'পৃথিবীর মতো চেনা অনুভূতি! এখানে স্বাভাবিকভাবে হাঁটাচলা করতে কোনো বিশেষ সমস্যা হবে না।';
    }
    return isEn
      ? 'Crushing Gravity! Your body feels made of heavy lead — even standing upright is exhausting!'
      : 'দানবীয় মাধ্যাকর্ষণ! শরীর সীসার মতো ভারী লাগবে, সোজা হয়ে দাঁড়ানোই চরম কষ্টসাধ্য হবে!';
  };

  const handleAdjustWeight = (delta: number) => {
    tapHaptic();
    setEarthWeight((prev) => Math.max(15, Math.min(100, prev + delta)));
  };

  const handleSelectQuizOption = (idx: number) => {
    if (currentQuizState.solved) return;

    const isCorrect = idx === destination.quickQuiz.correctIndex;
    if (isCorrect) {
      successHaptic();
      setQuizState((prev) => ({
        ...prev,
        [destination.id]: { selected: idx, solved: true },
      }));

      if (!rewardedQuizzes.has(destination.id)) {
        addXP(10);
        setRewardedQuizzes((prev) => new Set(prev).add(destination.id));
      }
    } else {
      gentleErrorHaptic();
      setQuizState((prev) => ({
        ...prev,
        [destination.id]: { selected: idx, solved: false },
      }));
    }
  };

  // Find index in array for previous / next navigation
  const currentIndex = SPACE_DESTINATIONS.findIndex((d) => d.id === destination.id);
  const prevDestination =
    SPACE_DESTINATIONS[(currentIndex - 1 + SPACE_DESTINATIONS.length) % SPACE_DESTINATIONS.length];
  const nextDestination =
    SPACE_DESTINATIONS[(currentIndex + 1) % SPACE_DESTINATIONS.length];

  return (
    <View style={styles.root}>
      <StarField />

      {/* Top Header Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) }]}>
        <ScalePressable
          onPress={() => {
            tapHaptic();
            onBack();
          }}
          style={styles.backButton}
        >
          <ChevronLeft size={22} color={Colors.text} />
          <Text style={styles.backButtonText}>{t.backToHub}</Text>
        </ScalePressable>

        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {isEn ? destination.planetType_en : destination.planetType_bn}
          </Text>
        </View>
      </View>

      {/* Quick Planet Selector Carousel */}
      <View style={styles.selectorBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorContent}
        >
          {SPACE_DESTINATIONS.map((d) => {
            const active = d.id === destination.id;
            const name = isEn ? d.name_en : d.name_bn;
            return (
              <Pressable
                key={d.id}
                onPress={() => {
                  tapHaptic();
                  onSelectDestination(d.id);
                }}
                style={[styles.selectorPill, active && styles.selectorPillActive]}
              >
                <PlanetImage id={d.id} size={20} />
                <Text
                  style={[
                    styles.selectorPillText,
                    active && styles.selectorPillTextActive,
                  ]}
                >
                  {name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content Body */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Planet Hero Card */}
        <View style={styles.heroSection}>
          <View style={styles.planetGlowContainer}>
            <View style={styles.haloRing} />
            <PlanetImage id={destination.id} size={130} />
          </View>

          <Text style={styles.heroTitle}>
            {isEn ? destination.name_en : destination.name_bn}
          </Text>
          <Text style={styles.heroTagline}>
            {isEn ? destination.tagline_en : destination.tagline_bn}
          </Text>
          <Text style={styles.heroSummary}>
            {isEn ? destination.summary_en : destination.summary_bn}
          </Text>

          {/* Quick Highlight Chips */}
          <View style={styles.heroChipRow}>
            <View style={styles.heroChip}>
              <Orbit size={13} color={Colors.primary} />
              <Text style={styles.heroChipText}>
                {isEn ? destination.fact_en : destination.fact_bn}
              </Text>
            </View>
            <View style={styles.heroChip}>
              <Scale size={13} color={Colors.gold} />
              <Text style={styles.heroChipText}>
                {isEn ? 'Gravity: ' : 'মাধ্যাকর্ষণ: '}
                {formatNumber(destination.gravityMultiplier, !isEn)}x
              </Text>
            </View>
          </View>
        </View>

        {/* 1. Interactive Weight Lab */}
        <StoryCard accent="gold" style={styles.cardMargin}>
          <View style={styles.sectionHeaderRow}>
            <Scale size={18} color={Colors.gold} />
            <View style={styles.sectionHeaderTextWrap}>
              <Text style={styles.sectionTitle}>{t.weightLabTitle}</Text>
              <Text style={styles.sectionSub}>{t.weightLabSub}</Text>
            </View>
          </View>

          {/* Earth Weight Picker */}
          <View style={styles.weightPickerContainer}>
            <Text style={styles.pickerLabel}>{t.earthWeightLabel}</Text>
            <View style={styles.presetRow}>
              {PRESET_WEIGHTS.map((w) => {
                const isSelected = earthWeight === w;
                return (
                  <ScalePressable
                    key={w}
                    onPress={() => {
                      tapHaptic();
                      setEarthWeight(w);
                    }}
                    style={[
                      styles.weightPresetChip,
                      isSelected && styles.weightPresetChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.weightPresetText,
                        isSelected && styles.weightPresetTextActive,
                      ]}
                    >
                      {formatNumber(w, !isEn)} {t.weightUnit}
                    </Text>
                  </ScalePressable>
                );
              })}
            </View>

            {/* Stepper Buttons for fine-tuning */}
            <View style={styles.stepperRow}>
              <ScalePressable
                onPress={() => handleAdjustWeight(-5)}
                style={styles.stepperButton}
              >
                <Minus size={16} color={Colors.textDark} />
              </ScalePressable>
              <Text style={styles.stepperValue}>
                {formatNumber(earthWeight, !isEn)} {t.weightUnit}
              </Text>
              <ScalePressable
                onPress={() => handleAdjustWeight(5)}
                style={styles.stepperButton}
              >
                <Plus size={16} color={Colors.textDark} />
              </ScalePressable>
            </View>
          </View>

          {/* Side-by-Side Comparison Display */}
          <View style={styles.comparisonGrid}>
            <View style={styles.comparisonCard}>
              <Text style={styles.comparisonPlanetLabel}>
                {isEn ? 'Earth' : 'পৃথিবী'}
              </Text>
              <Text style={styles.comparisonWeightValue}>
                {formatNumber(earthWeight, !isEn)} {t.weightUnit}
              </Text>
              <Text style={styles.comparisonSubLabel}>১০০% মহাকর্ষ</Text>
            </View>

            <View style={[styles.comparisonCard, styles.comparisonCardHighlight]}>
              <Text style={styles.comparisonPlanetLabelHighlight}>
                {isEn ? destination.name_en : destination.name_bn}
              </Text>
              <Text style={styles.comparisonWeightValueHighlight}>
                {formatNumber(destinationWeight, !isEn)} {t.weightUnit}
              </Text>
              <Text style={styles.comparisonSubLabelHighlight}>
                {formatNumber(Math.round(destination.gravityMultiplier * 100), !isEn)}% মহাকর্ষ
              </Text>
            </View>
          </View>

          {/* Sensation Callout */}
          <View style={styles.sensationBox}>
            <Sparkles size={16} color={Colors.gold} style={styles.sensationIcon} />
            <Text style={styles.sensationText}>{getWeightSensation()}</Text>
          </View>
        </StoryCard>

        {/* 2. Planetary Telemetry & Specs */}
        <StoryCard accent="primary" style={styles.cardMargin}>
          <View style={styles.sectionHeaderRow}>
            <Compass size={18} color={Colors.primary} />
            <View style={styles.sectionHeaderTextWrap}>
              <Text style={styles.sectionTitle}>{t.telemetryTitle}</Text>
              <Text style={styles.sectionSub}>
                {isEn
                  ? 'Key environmental telemetry from NASA missions'
                  : 'নাসার মহাকাশযান হতে সংগৃহীত পরিবেশ ও পরিসংখ্যান'}
              </Text>
            </View>
          </View>

          <View style={styles.specGrid}>
            {/* Distance */}
            <View style={styles.specTile}>
              <Orbit size={16} color={Colors.primaryLight} />
              <Text style={styles.specLabel}>{t.distanceFromSun}</Text>
              <Text style={styles.specValue}>
                {isEn ? destination.distance_en : destination.distance_bn}
              </Text>
            </View>

            {/* Day Length */}
            <View style={styles.specTile}>
              <Clock size={16} color={Colors.gold} />
              <Text style={styles.specLabel}>{t.dayLength}</Text>
              <Text style={styles.specValue}>
                {isEn ? destination.dayLength_en : destination.dayLength_bn}
              </Text>
            </View>

            {/* Year Length */}
            <View style={styles.specTile}>
              <Calendar size={16} color={Colors.emerald} />
              <Text style={styles.specLabel}>{t.yearLength}</Text>
              <Text style={styles.specValue}>
                {isEn ? destination.yearLength_en : destination.yearLength_bn}
              </Text>
            </View>

            {/* Temperature */}
            <View style={styles.specTile}>
              {destination.temperatureType === 'scorching' ? (
                <Flame size={16} color={Colors.coral} />
              ) : (
                <Snowflake size={16} color={Colors.primaryLight} />
              )}
              <Text style={styles.specLabel}>{t.avgTemp}</Text>
              <Text style={styles.specValue}>
                {isEn ? destination.temperatureLabel_en : destination.temperatureLabel_bn}
              </Text>
            </View>

            {/* Moons */}
            <View style={styles.specTile}>
              <Orbit size={16} color={Colors.gold} />
              <Text style={styles.specLabel}>{t.moons}</Text>
              <Text style={styles.specValue}>
                {formatNumber(destination.moonsCount, !isEn)}{' '}
                {destination.moonsCount > 0
                  ? `(${isEn ? destination.moonsDetail_en : destination.moonsDetail_bn})`
                  : ''}
              </Text>
            </View>

            {/* Diameter */}
            <View style={styles.specTile}>
              <Compass size={16} color={Colors.primary} />
              <Text style={styles.specLabel}>{t.diameter}</Text>
              <Text style={styles.specValue}>
                {isEn ? destination.diameterComparison_en : destination.diameterComparison_bn}
              </Text>
            </View>
          </View>
        </StoryCard>

        {/* 3. Relatable Bengali Analogy */}
        <StoryCard accent="gold" style={styles.cardMargin}>
          <View style={styles.sectionHeaderRow}>
            <BookOpen size={18} color={Colors.gold} />
            <Text style={styles.sectionTitle}>{t.analogyTitle}</Text>
          </View>
          <Text style={styles.analogyText}>
            {isEn ? destination.banglaAnalogy_en : destination.banglaAnalogy_bn}
          </Text>
        </StoryCard>

        {/* 4. Atmosphere & Life Support */}
        <StoryCard accent="none" style={[styles.cardMargin, styles.atmosphereCard]}>
          <View style={styles.sectionHeaderRow}>
            <ShieldAlert size={18} color={Colors.coral} />
            <View style={styles.sectionHeaderTextWrap}>
              <Text style={styles.sectionTitle}>{t.atmosphereTitle}</Text>
              <Text style={styles.warningTag}>{t.suitRequired}</Text>
            </View>
          </View>

          <View style={styles.atmosphereInfoBox}>
            <Text style={styles.atmosphereGasLabel}>
              {isEn ? 'Atmospheric Composition:' : 'বায়ুমণ্ডলের উপাদান:'}
            </Text>
            <Text style={styles.atmosphereGasValue}>
              {isEn ? destination.atmosphere.composition_en : destination.atmosphere.composition_bn}
            </Text>

            <View style={styles.suitRequirementBox}>
              <Text style={styles.suitRequirementHeader}>{t.suitNote}:</Text>
              <Text style={styles.suitRequirementText}>
                {isEn
                  ? destination.atmosphere.suitNeededReason_en
                  : destination.atmosphere.suitNeededReason_bn}
              </Text>
            </View>
          </View>
        </StoryCard>

        {/* 5. Famous NASA Robotic Explorers */}
        <StoryCard accent="primary" style={styles.cardMargin}>
          <View style={styles.sectionHeaderRow}>
            <Rocket size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>{t.missionsTitle}</Text>
          </View>

          <View style={styles.missionsList}>
            {destination.famousMissions.map((m, idx) => (
              <View key={idx} style={styles.missionItem}>
                <View style={styles.missionHeader}>
                  <View style={styles.missionNameGroup}>
                    <Text style={styles.missionName}>{m.name}</Text>
                    <View style={styles.agencyBadge}>
                      <Text style={styles.agencyBadgeText}>{m.agency}</Text>
                    </View>
                  </View>
                  <Text style={styles.missionYear}>
                    {formatNumber(m.year, !isEn)}
                  </Text>
                </View>
                <Text style={styles.missionHighlight}>
                  {isEn ? m.highlight_en : m.highlight_bn}
                </Text>
              </View>
            ))}
          </View>
        </StoryCard>

        {/* 6. Cadet Curiosity Check (Mini Quiz) */}
        <StoryCard accent="emerald" style={styles.cardMargin}>
          <View style={styles.sectionHeaderRow}>
            <HelpCircle size={18} color={Colors.emerald} />
            <View style={styles.sectionHeaderTextWrap}>
              <Text style={styles.sectionTitle}>{t.quizTitle}</Text>
              <Text style={styles.sectionSub}>
                {isEn ? 'Test your new planetary knowledge (+10 XP)' : 'তোমার নতুন মহাকাশ জ্ঞান যাচাই করো (+১০ XP)'}
              </Text>
            </View>
          </View>

          <Text style={styles.quizPrompt}>
            {isEn ? destination.quickQuiz.question_en : destination.quickQuiz.question_bn}
          </Text>

          <View style={styles.quizOptionsList}>
            {(isEn
              ? destination.quickQuiz.options_en
              : destination.quickQuiz.options_bn
            ).map((opt, idx) => {
              const isSelected = currentQuizState.selected === idx;
              const isCorrect = idx === destination.quickQuiz.correctIndex;
              const hasAnswered = currentQuizState.selected !== null;

              let optionStyle = styles.quizOptionCard;
              if (hasAnswered) {
                if (isCorrect) {
                  optionStyle = { ...optionStyle, ...styles.quizOptionCorrect };
                } else if (isSelected) {
                  optionStyle = { ...optionStyle, ...styles.quizOptionIncorrect };
                }
              }

              return (
                <ScalePressable
                  key={idx}
                  onPress={() => handleSelectQuizOption(idx)}
                  disabled={currentQuizState.solved}
                  style={optionStyle}
                >
                  <View style={styles.quizOptionPrefix}>
                    <Text style={styles.quizOptionPrefixText}>
                      {OPTION_PREFIXES[idx]}
                    </Text>
                  </View>
                  <Text style={styles.quizOptionText}>{opt}</Text>
                  {hasAnswered && isCorrect && (
                    <CheckCircle2 size={18} color={Colors.emerald} />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <AlertCircle size={18} color={Colors.coral} />
                  )}
                </ScalePressable>
              );
            })}
          </View>

          {/* Feedback & Explanation */}
          {currentQuizState.selected !== null && (
            <View
              style={[
                styles.quizFeedbackBox,
                currentQuizState.solved
                  ? styles.quizFeedbackCorrect
                  : styles.quizFeedbackIncorrect,
              ]}
            >
              <Text style={styles.quizFeedbackTitle}>
                {currentQuizState.solved ? t.correctAnswer : t.tryAgain}
              </Text>
              <Text style={styles.quizFeedbackText}>
                {isEn
                  ? destination.quickQuiz.explanation_en
                  : destination.quickQuiz.explanation_bn}
              </Text>
              {currentQuizState.solved && (
                <View style={styles.xpAwardRow}>
                  <Sparkles size={14} color={Colors.gold} />
                  <Text style={styles.xpAwardText}>{t.xpEarned}</Text>
                </View>
              )}
            </View>
          )}
        </StoryCard>

        {/* 7. Action Footer: Launch Mission or Navigate */}
        <View style={styles.actionFooter}>
          <View style={styles.launchMoonWrap}>
            <GentleButton
              title={
                destination.id === 'moon'
                  ? t.launchMoonCta
                  : (isEn
                      ? `Launch ${destination.name_en} Mission`
                      : `${destination.name_bn} অভিযান শুরু করো`)
              }
              onPress={() => {
                tapHaptic();
                if (destination.id === 'moon') {
                  onLaunchMoon();
                } else if (onLaunchMission) {
                  onLaunchMission(destination.id);
                }
              }}
              variant="gold"
              size="large"
              fullWidth
              icon={<Rocket size={18} color={Colors.textDark} />}
            />
          </View>

          {/* Navigation to Previous & Next Planet */}
          <View style={styles.navButtonsRow}>
            <GentleButton
              title={`${t.prevPlanet}: ${isEn ? prevDestination.name_en : prevDestination.name_bn}`}
              onPress={() => {
                tapHaptic();
                onSelectDestination(prevDestination.id);
              }}
              variant="outline"
              size="normal"
              icon={<ChevronLeft size={16} color={Colors.text} />}
            />
            <GentleButton
              title={`${t.nextPlanet}: ${isEn ? nextDestination.name_en : nextDestination.name_bn}`}
              onPress={() => {
                tapHaptic();
                onSelectDestination(nextDestination.id);
              }}
              variant="outline"
              size="normal"
              icon={<ChevronRight size={16} color={Colors.text} />}
            />
          </View>
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
    paddingHorizontal: Gutter,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Gutter,
    paddingBottom: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  backButtonText: {
    fontSize: Typography.size.bodySmall,
    color: Colors.text,
    fontFamily: Typography.family.headingMedium,
  },
  typeBadge: {
    backgroundColor: Colors.surfaceWarm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeBadgeText: {
    fontSize: Typography.size.caption,
    color: Colors.textSecondary,
    fontFamily: Typography.family.headingMedium,
  },
  selectorBar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
  },
  selectorContent: {
    paddingHorizontal: Gutter,
    gap: 8,
  },
  selectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceWarm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectorPillActive: {
    backgroundColor: Colors.primaryBg,
    borderColor: Colors.primary,
  },
  selectorPillText: {
    fontSize: Typography.size.caption,
    color: Colors.textSecondary,
    fontFamily: Typography.family.headingMedium,
  },
  selectorPillTextActive: {
    color: Colors.primary,
    fontFamily: Typography.family.heading,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  planetGlowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  haloRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
  },
  heroTitle: {
    fontSize: Typography.size.hero,
    fontFamily: Typography.family.heading,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  heroTagline: {
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.headingMedium,
    color: Colors.gold,
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSummary: {
    fontSize: Typography.size.body,
    lineHeight: 24,
    fontFamily: Typography.family.notoRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  heroChipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroChipText: {
    fontSize: Typography.size.caption,
    color: Colors.text,
    fontFamily: Typography.family.headingMedium,
  },
  cardMargin: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 14,
  },
  sectionHeaderTextWrap: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.heading,
    color: Colors.text,
  },
  sectionSub: {
    fontSize: Typography.size.caption,
    color: Colors.textSecondary,
    fontFamily: Typography.family.notoRegular,
    marginTop: 2,
  },
  weightPickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.headingMedium,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  weightPresetChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weightPresetChipActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  weightPresetText: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingMedium,
    color: Colors.text,
  },
  weightPresetTextActive: {
    color: Colors.textDark,
    fontFamily: Typography.family.heading,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 6,
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepperValue: {
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.heading,
    color: Colors.text,
    minWidth: 70,
    textAlign: 'center',
  },
  comparisonGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  comparisonCard: {
    flex: 1,
    padding: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  comparisonCardHighlight: {
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
    borderColor: Colors.gold,
  },
  comparisonPlanetLabel: {
    fontSize: Typography.size.caption,
    color: Colors.textSecondary,
    fontFamily: Typography.family.headingMedium,
    marginBottom: 4,
  },
  comparisonPlanetLabelHighlight: {
    fontSize: Typography.size.caption,
    color: Colors.gold,
    fontFamily: Typography.family.heading,
    marginBottom: 4,
  },
  comparisonWeightValue: {
    fontSize: Typography.size.h2,
    fontFamily: Typography.family.heading,
    color: Colors.text,
  },
  comparisonWeightValueHighlight: {
    fontSize: Typography.size.h2,
    fontFamily: Typography.family.heading,
    color: Colors.gold,
  },
  comparisonSubLabel: {
    fontSize: Typography.size.micro,
    color: Colors.textMuted,
    fontFamily: Typography.family.notoRegular,
    marginTop: 2,
  },
  comparisonSubLabelHighlight: {
    fontSize: Typography.size.micro,
    color: Colors.gold,
    fontFamily: Typography.family.headingMedium,
    marginTop: 2,
  },
  sensationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sensationIcon: {
    marginTop: 1,
  },
  sensationText: {
    flex: 1,
    fontSize: Typography.size.bodySmall,
    color: Colors.text,
    fontFamily: Typography.family.headingMedium,
    lineHeight: 20,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  specTile: {
    width: '48%',
    padding: 10,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  specLabel: {
    fontSize: Typography.size.micro,
    color: Colors.textMuted,
    fontFamily: Typography.family.headingMedium,
    textTransform: 'uppercase',
  },
  specValue: {
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
    color: Colors.text,
  },
  analogyText: {
    fontSize: Typography.size.body,
    lineHeight: 24,
    fontFamily: Typography.family.notoRegular,
    color: Colors.text,
  },
  atmosphereCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.04)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  warningTag: {
    fontSize: Typography.size.caption,
    color: Colors.coral,
    fontFamily: Typography.family.heading,
    marginTop: 2,
  },
  atmosphereInfoBox: {
    gap: 10,
  },
  atmosphereGasLabel: {
    fontSize: Typography.size.caption,
    color: Colors.textSecondary,
    fontFamily: Typography.family.headingMedium,
  },
  atmosphereGasValue: {
    fontSize: Typography.size.bodySmall,
    color: Colors.text,
    fontFamily: Typography.family.heading,
  },
  suitRequirementBox: {
    padding: 10,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suitRequirementHeader: {
    fontSize: Typography.size.caption,
    color: Colors.coral,
    fontFamily: Typography.family.heading,
    marginBottom: 4,
  },
  suitRequirementText: {
    fontSize: Typography.size.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontFamily: Typography.family.notoRegular,
  },
  missionsList: {
    gap: 12,
  },
  missionItem: {
    padding: 12,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  missionNameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  missionName: {
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
    color: Colors.text,
  },
  agencyBadge: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  agencyBadgeText: {
    fontSize: Typography.size.micro,
    color: Colors.primary,
    fontFamily: Typography.family.heading,
  },
  missionYear: {
    fontSize: Typography.size.caption,
    color: Colors.textMuted,
    fontFamily: Typography.family.headingMedium,
  },
  missionHighlight: {
    fontSize: Typography.size.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontFamily: Typography.family.notoRegular,
  },
  quizPrompt: {
    fontSize: Typography.size.body,
    lineHeight: 22,
    fontFamily: Typography.family.heading,
    color: Colors.text,
    marginBottom: 12,
  },
  quizOptionsList: {
    gap: 8,
    marginBottom: 12,
  },
  quizOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quizOptionCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: Colors.emerald,
  },
  quizOptionIncorrect: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: Colors.coral,
  },
  quizOptionPrefix: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quizOptionPrefixText: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.heading,
    color: Colors.text,
  },
  quizOptionText: {
    flex: 1,
    fontSize: Typography.size.bodySmall,
    color: Colors.text,
    fontFamily: Typography.family.notoRegular,
  },
  quizFeedbackBox: {
    padding: 12,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  quizFeedbackCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: Colors.emerald,
  },
  quizFeedbackIncorrect: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: Colors.coral,
  },
  quizFeedbackTitle: {
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
    color: Colors.text,
    marginBottom: 4,
  },
  quizFeedbackText: {
    fontSize: Typography.size.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontFamily: Typography.family.notoRegular,
  },
  xpAwardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  xpAwardText: {
    fontSize: Typography.size.caption,
    color: Colors.gold,
    fontFamily: Typography.family.heading,
  },
  actionFooter: {
    marginTop: 8,
    gap: 12,
  },
  launchMoonWrap: {
    marginBottom: 4,
  },
  navButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
});
