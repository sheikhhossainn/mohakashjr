import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { DoubleBezelCard } from '../src/components/DoubleBezelCard';
import { TactileButton } from '../src/components/TactileButton';
import { AnimatedMascot } from '../src/components/AnimatedMascot';
import { AstronautAvatar } from '../src/components/AstronautAvatar';
import { SpaceChoiceBadge } from '../src/components/SpaceChoiceBadge';
import { ConfettiEffect } from '../src/components/ConfettiEffect';
import { useAppStore, ARCHETYPES, calculateArchetype, CadetArchetype } from '../src/state/useAppStore';
import { Sparkles, ArrowRight, ArrowLeft, Check, Star, Award, Compass, Zap, CheckSquare2 } from 'lucide-react-native';

interface PsychometricOption {
  title_bn: string;
  subtitle_bn: string;
  type: CadetArchetype;
}

interface PsychometricQuestion {
  id: number;
  stepNumber: number;
  tag: string;
  topicTitle_bn: string;
  scenario_bn: string;
  options: PsychometricOption[];
}

const QUESTIONS: PsychometricQuestion[] = [
  {
    id: 1,
    stepNumber: 1,
    tag: 'কৌতূহল ০১: মহাকাশ অভিযানের স্বপ্ন',
    topicTitle_bn: 'মহাকাশের স্বপ্ন 🌌',
    scenario_bn: 'যদি তোমাকে একটি সত্যিকারের মহাকাশ অভিযানে পাঠানো হয়, মহাকাশে পৌঁছে তোমার সবচেয়ে বেশি কী করতে আনন্দ লাগবে?',
    options: [
      {
        title_bn: 'ঝড়ের গতিতে রকেট চালানো',
        subtitle_bn: 'মহাশূন্যের বুক চিরে সুপারসনিক গতিতে রকেট নিয়ে ছুটে বেড়াব!',
        type: 'pilot',
      },
      {
        title_bn: 'তারা ও দূর গ্যালাক্সি দেখা',
        subtitle_bn: 'বিশাল স্পেস টেলিস্কোপ দিয়ে দূর তারা, নেবুলা আর শনির বলয় দেখব!',
        type: 'astronomer',
      },
      {
        title_bn: 'রোভার ও রকেট ইঞ্জিন তৈরি',
        subtitle_bn: 'নিজের হাতে মার্স রোভারের রোবটিক হাত আর শক্তিশালী থ্রাস্টার বানাব!',
        type: 'engineer',
      },
      {
        title_bn: 'অচেনা গ্রহে নেমে ঘুরে বেড়ানো',
        subtitle_bn: 'রহস্যময় দূর গ্রহে পা রেখে অদ্ভুত স্ফটিক গুহা আর এলিয়েন জগৎ খুঁজব!',
        type: 'explorer',
      },
    ],
  },
  {
    id: 2,
    stepNumber: 2,
    tag: 'কৌতূহল ০২: স্পেসশিপে তোমার স্পেশাল কেবিন',
    topicTitle_bn: 'স্পেসশিপের দায়িত্ব 🚀',
    scenario_bn: 'তোমার মহাকাশযান যখন কোটি মাইল দূরে দূরবর্তী কোনো গ্রহে উড়ে যাচ্ছে, তুমি কোন কেবিনে বসে সবচেয়ে বেশি কাজ করতে চাইবে?',
    options: [
      {
        title_bn: 'ককপিট ও স্টিয়ারিং কন্ট্রোল',
        subtitle_bn: 'হাতে জয়স্টিক নিয়ে স্পেসশিপকে গ্রহ ও উল্কাপিণ্ডের পাশ দিয়ে ওড়াব!',
        type: 'pilot',
      },
      {
        title_bn: 'স্টার-অবজারভেটরি কাঁচের ডোম',
        subtitle_bn: 'মহাকাশের মানচিত্র দেখে নতুন নতুন নক্ষত্রপুঞ্জের ছবি তুলব!',
        type: 'astronomer',
      },
      {
        title_bn: 'রোবটিক্স ও টেক ল্যাব',
        subtitle_bn: 'রোবটের সার্কিট টিউন করব আর রকেটের নতুন শক্তিশালী পার্টস জুড়ব!',
        type: 'engineer',
      },
      {
        title_bn: 'ল্যান্ডার ও এক্সপিডিশন ডেক',
        subtitle_bn: 'স্পেসস্যুট প্রস্তুত করে নতুন অচেনা গ্রহে নামার প্রথম প্ল্যান বানাব!',
        type: 'explorer',
      },
    ],
  },
  {
    id: 3,
    stepNumber: 3,
    tag: 'কৌতূহল ০৩: মহাজাগতিক বিস্ময় ও রোমাঞ্চ',
    topicTitle_bn: 'ভবিষ্যতের মহাকাশ লক্ষ্য 🌟',
    scenario_bn: 'বড় হয়ে বিজ্ঞানী বা নভোচারী হলে, মহাকাশের কোন রোমাঞ্চকর রহস্যটি তুমি সবার আগে সমাধান করতে চাও?',
    options: [
      {
        title_bn: 'আলোর গতিতে অন্য তারায় যাওয়া',
        subtitle_bn: 'সবার চেয়ে দ্রুততম গতিতে অন্য সৌরজগতে পৌঁছে বিশ্বরেকর্ড গড়া!',
        type: 'pilot',
      },
      {
        title_bn: 'ব্ল্যাকহোল ও সৃষ্টির রহস্য',
        subtitle_bn: 'রহস্যময় ব্ল্যাকহোলের শেষ সীমানা ও তারার জন্মরহস্য উন্মোচন করা!',
        type: 'astronomer',
      },
      {
        title_bn: 'চাঁদ ও মঙ্গলে মানুষের শহর',
        subtitle_bn: 'রোবট আর থ্রিডি প্রিন্টার দিয়ে অন্য গ্রহে সুরক্ষিত মহাকাশ শহর তৈরি করা!',
        type: 'engineer',
      },
      {
        title_bn: 'অন্য গ্রহে বন্ধু বা এলিয়েন খোঁজা',
        subtitle_bn: 'বহু দূর কোনো গ্রহে বন্ধুভাবাপন্ন এলিয়েন প্রাণ আছে কি না খুঁজে বের করা!',
        type: 'explorer',
      },
    ],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeCadetOrientation } = useAppStore();

  const [step, setStep] = useState(0); // 0: Welcome, 1: Q1, 2: Q2, 3: Q3, 4: Result/Reveal
  // No options selected by default as requested!
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [cadetName, setCadetName] = useState('সোহান');

  const currentQIndex = step - 1;
  const currentQ = QUESTIONS[currentQIndex];
  const currentSelections = answers[currentQIndex] || [];
  const hasSelection = currentSelections.length > 0;

  // Toggle multi-select choice
  const handleToggleChoice = (questionId: number, choiceIndex: number) => {
    const qIdx = questionId - 1;
    setAnswers((prev) => {
      const current = prev[qIdx] || [];
      const exists = current.includes(choiceIndex);
      const updated = exists
        ? current.filter((idx) => idx !== choiceIndex)
        : [...current, choiceIndex];
      return {
        ...prev,
        [qIdx]: updated,
      };
    });
  };

  const handleNext = () => {
    // Guard: Kid must select at least 1 option before advancing
    if (step >= 1 && step <= 3 && !hasSelection) {
      return;
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      handleFinalize();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleFinalize = () => {
    completeCadetOrientation(cadetName, answers);
    router.replace('/(tabs)');
  };

  const calculatedArchetypeKey = calculateArchetype(answers);
  const archetypeInfo = ARCHETYPES[calculatedArchetypeKey];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Step 0: Welcome & Orientation Briefing */}
      {step === 0 && (
        <View style={styles.welcomeWrapper}>
          <View style={styles.topBadgeRow}>
            <Sparkles size={14} color={Colors.gold} />
            <Text style={styles.topBadgeText}>মহাকাশ একাডেমি ওরিয়েন্টেশন</Text>
            <Sparkles size={14} color={Colors.gold} />
          </View>

          <DoubleBezelCard glow="cyan" style={styles.welcomeCard}>
            <View style={styles.mascotBox}>
              <AnimatedMascot size={120} mood="waving" />
            </View>

            <Text style={styles.welcomeTitle}>স্বাগতম নতুন ক্যাডেট! 👨‍🚀</Text>
            <Text style={styles.welcomeDesc}>
              আমি তোমার গাইড অ্যাস্ট্রো-বন্ধু! মহাকাশ একাডেমিতে যোগ দেওয়ার আগে ৩টি মজার কৌতূহলের উত্তর দাও। তুমি চাইলে একাধিক বিষয় একসাথে বেছে নিতে পারো!
            </Text>

            <View style={styles.guidanceBox}>
              <Text style={styles.guidanceText}>
                ✨ কোনো ভুল উত্তর নেই! তোমার যা যা করতে ভালো লাগে, এক বা একাধিক বিষয় বেছে নাও।
              </Text>
            </View>
          </DoubleBezelCard>

          <TactileButton
            title="কৌতূহল আবিষ্কার শুরু করো ➔"
            onPress={() => setStep(1)}
            variant="gold"
            size="large"
            style={styles.fullBtn}
          />
        </View>
      )}

      {/* Steps 1 to 3: Multi-Select Kid Space Interest Questions */}
      {step >= 1 && step <= 3 && currentQ && (
        <View style={styles.questionWrapper}>
          {/* Header Progress Strip */}
          <View style={styles.progressRow}>
            <View style={styles.stepPill}>
              <Text style={styles.stepPillText}>প্রশ্ন {step} / ৩</Text>
            </View>
            <Text style={styles.tagText}>{currentQ.tag}</Text>
          </View>

          {/* Scenario Prompt Card */}
          <DoubleBezelCard glow="blue" style={styles.scenarioCard}>
            <View style={styles.scenarioIconHeader}>
              <Compass size={18} color={Colors.cyan} />
              <Text style={styles.scenarioSubtitle}>{currentQ.topicTitle_bn}</Text>
            </View>
            <Text style={styles.scenarioText}>{currentQ.scenario_bn}</Text>

            {/* Multi-Select Friendly Tip */}
            <View style={styles.multiSelectHintPill}>
              <Sparkles size={12} color={Colors.gold} />
              <Text style={styles.multiSelectHintText}>
                একাধিক উত্তর বেছে নিতে পারো (যেগুলো তোমার পছন্দ)
              </Text>
            </View>
          </DoubleBezelCard>

          {/* 4 Vector Illustration Multi-Select Choice Cards */}
          <View style={styles.choicesList}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = currentSelections.includes(idx);
              const archetypeMeta = ARCHETYPES[opt.type];
              return (
                <Pressable
                  key={idx}
                  style={[
                    styles.choiceCard,
                    isSelected && {
                      borderColor: archetypeMeta.accentColor,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderBottomColor: archetypeMeta.accentColor,
                    },
                  ]}
                  onPress={() => handleToggleChoice(currentQ.id, idx)}
                >
                  <SpaceChoiceBadge
                    type={opt.type}
                    size={48}
                    isSelected={isSelected}
                  />

                  <View style={styles.choiceTextContainer}>
                    <Text
                      style={[
                        styles.choiceTitle,
                        isSelected && { color: archetypeMeta.accentColor },
                      ]}
                    >
                      {opt.title_bn}
                    </Text>
                    <Text style={styles.choiceSubtitle}>
                      {opt.subtitle_bn}
                    </Text>
                  </View>

                  {isSelected ? (
                    <View
                      style={[
                        styles.checkBadge,
                        { backgroundColor: archetypeMeta.accentColor },
                      ]}
                    >
                      <Check size={14} color="#0B1026" strokeWidth={3.5} />
                    </View>
                  ) : (
                    <View style={styles.unselectedRing} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Navigation Controls */}
          <View style={styles.navRow}>
            <TactileButton
              title="পেছনে"
              onPress={handlePrev}
              variant="outline"
              size="normal"
              icon={<ArrowLeft size={16} color="#FFFFFF" />}
              style={styles.prevBtn}
            />
            <TactileButton
              title={
                !hasSelection
                  ? 'কমপক্ষে ১টি বেছে নাও'
                  : step === 3
                  ? 'ক্যাডেট পরিচয়পত্র দেখো ➔'
                  : 'পরবর্তী প্রশ্ন ➔'
              }
              onPress={handleNext}
              variant={hasSelection ? 'primary' : 'outline'}
              size="normal"
              icon={hasSelection ? <ArrowRight size={16} color="#FFFFFF" /> : undefined}
              style={[styles.nextBtn, !hasSelection && styles.disabledNextBtn]}
            />
          </View>
        </View>
      )}

      {/* Step 4: Official Cadet Identity & Archetype Reveal */}
      {step === 4 && (
        <View style={styles.resultWrapper}>
          <ConfettiEffect active />

          <View style={styles.topBadgeRow}>
            <Sparkles size={14} color={Colors.gold} />
            <Text style={styles.topBadgeText}>অফিসিয়াল স্পেস ক্যাডেট পরিচয়পত্র</Text>
            <Sparkles size={14} color={Colors.gold} />
          </View>

          <DoubleBezelCard glow="gold" style={styles.archetypeCard}>
            {/* Cadet Uniform Avatar based on Rank Tier: Cadet */}
            <View style={styles.avatarHolder}>
              <AstronautAvatar size={92} rank="Cadet" showHalo />
              <View
                style={[
                  styles.archetypeBadgeFloating,
                  { borderColor: archetypeInfo.accentColor },
                ]}
              >
                <SpaceChoiceBadge
                  type={calculatedArchetypeKey}
                  size={38}
                  isSelected
                />
              </View>
            </View>

            {/* Revealed Archetype Title & Motto */}
            <Text style={[styles.archetypeTitle, { color: archetypeInfo.accentColor }]}>
              {archetypeInfo.title_bn}
            </Text>
            <Text style={styles.archetypeMotto}>"{archetypeInfo.motto_bn}"</Text>

            <View style={styles.archetypeDescCard}>
              <Text style={styles.archetypeDesc}>{archetypeInfo.description_bn}</Text>
              <View style={styles.focusChip}>
                <Star size={12} color={Colors.gold} fill={Colors.gold} />
                <Text style={styles.focusChipText}>
                  প্রস্তাবিত বিশেষায়িত পাঠ: {archetypeInfo.recommendedFocus_bn}
                </Text>
              </View>
            </View>

            {/* Cadet Name Registration Input */}
            <View style={styles.nameSection}>
              <Text style={styles.nameFieldLabel}>তোমার অফিসিয়াল ক্যাডেট নাম:</Text>
              <View style={styles.nameInputBox}>
                <TextInput
                  style={styles.nameInput}
                  value={cadetName}
                  onChangeText={setCadetName}
                  placeholder="তোমার নাম লেখো..."
                  placeholderTextColor={Colors.textMuted}
                  maxLength={20}
                />
              </View>
            </View>

            {/* Strict Rank Progression Rule Reminder */}
            <View style={styles.roleNotice}>
              <Text style={styles.roleNoticeText}>
                ⭐ সকল নতুন শিক্ষার্থী স্পেস ক্যাডেট হিসেবে যাত্রা শুরু করে। পাঠ ও কুইজ জয় করে পয়েন্ট অর্জন করলে তোমার পদবী উন্নীত হবে!
              </Text>
            </View>
          </DoubleBezelCard>

          <TactileButton
            title="ক্যাডেট হিসেবে মিশন শুরু করো 🚀"
            onPress={handleFinalize}
            variant="gold"
            size="large"
            style={styles.fullBtn}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 18,
    paddingTop: 40,
    paddingBottom: 40,
    minHeight: '100%',
    justifyContent: 'center',
  },
  welcomeWrapper: {
    width: '100%',
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
    marginBottom: 16,
    alignSelf: 'center',
  },
  topBadgeText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  welcomeCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  mascotBox: {
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  welcomeTitle: {
    color: Colors.text,
    fontSize: Typography.size.hero,
    fontWeight: Typography.weight.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    textAlign: 'center',
    marginBottom: 16,
  },
  guidanceBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  guidanceText: {
    color: Colors.cyan,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    textAlign: 'center',
    fontWeight: Typography.weight.semiBold,
  },
  fullBtn: {
    width: '100%',
  },
  questionWrapper: {
    width: '100%',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stepPill: {
    backgroundColor: Colors.cyanBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderGlowBlue,
  },
  stepPillText: {
    color: Colors.cyan,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  tagText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semiBold,
  },
  scenarioCard: {
    marginBottom: 16,
  },
  scenarioIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  scenarioSubtitle: {
    color: Colors.cyan,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  scenarioText: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    lineHeight: Typography.lineHeight.h3,
    fontWeight: Typography.weight.bold,
  },
  multiSelectHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.25)',
  },
  multiSelectHintText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  choicesList: {
    gap: 12,
    marginBottom: 20,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  choiceTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  choiceTitle: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.black,
    marginBottom: 2,
  },
  choiceSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontWeight: Typography.weight.medium,
  },
  unselectedRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    marginLeft: 4,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  prevBtn: {
    flex: 1,
  },
  nextBtn: {
    flex: 2,
  },
  disabledNextBtn: {
    opacity: 0.65,
  },
  resultWrapper: {
    width: '100%',
  },
  archetypeCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  avatarHolder: {
    position: 'relative',
    marginVertical: 10,
    alignItems: 'center',
  },
  archetypeBadgeFloating: {
    position: 'absolute',
    bottom: -6,
    right: -10,
    backgroundColor: Colors.surfaceCard,
    borderRadius: 22,
    borderWidth: 2,
    overflow: 'hidden',
  },
  archetypeTitle: {
    fontSize: Typography.size.h1,
    fontWeight: Typography.weight.black,
    textAlign: 'center',
    marginBottom: 4,
  },
  archetypeMotto: {
    color: Colors.cyan,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    textAlign: 'center',
    marginBottom: 12,
  },
  archetypeDescCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  archetypeDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    textAlign: 'center',
    marginBottom: 10,
  },
  focusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  focusChipText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  nameSection: {
    width: '100%',
    marginBottom: 12,
  },
  nameFieldLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    marginBottom: 6,
  },
  nameInputBox: {
    backgroundColor: 'rgba(10, 14, 45, 0.85)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  nameInput: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
  },
  roleNotice: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.3)',
  },
  roleNoticeText: {
    color: Colors.cyan,
    fontSize: Typography.size.micro,
    lineHeight: Typography.lineHeight.caption,
    textAlign: 'center',
  },
});
