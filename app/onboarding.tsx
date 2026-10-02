import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { StoryCard } from '../src/components/StoryCard';
import { GentleButton } from '../src/components/GentleButton';
import { AnimatedMascot } from '../src/components/AnimatedMascot';
import { AstronautAvatar } from '../src/components/AstronautAvatar';
import { SpaceChoiceBadge } from '../src/components/SpaceChoiceBadge';
import { ConfettiEffect } from '../src/components/ConfettiEffect';
import { useAppStore, ARCHETYPES, calculateArchetype, CadetArchetype } from '../src/state/useAppStore';
import { Sparkles, ArrowRight, ArrowLeft, Check, Star, Award, Compass, Zap } from 'lucide-react-native';

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
    scenario_bn: 'যদি তোমাকে একটি সত্যিকারের মহাকাশ অভিযানে পাঠানো হয়, মহাকাশে পৌঁছে তোমার সবচেয়ে বেশি কী করতে আনন্দ লাগবে?',
    options: [
      {
        title_bn: 'ঝড়ের গতিতে রকেট চালানো',
        subtitle_bn: 'মহাশূন্যের বুক চিরে সুপারসনিক গতিতে রকেট নিয়ে ছুটে বেড়াব!',
        type: 'pilot',
      },
      {
        title_bn: 'তারা ও দূর গ্যালাক্সি দেখা',
        subtitle_bn: 'বিশাল স্পেস টেলিস্কোপ দিয়ে দূর তারা, নেবুলা আর শনির বলয় দেখব!',
        type: 'astronomer',
      },
      {
        title_bn: 'রোভার ও রকেট ইঞ্জিন তৈরি',
        subtitle_bn: 'নিজের হাতে মার্স রোভারের রোবটিক হাত আর শক্তিশালী থ্রাস্টার বানাব!',
        type: 'engineer',
      },
      {
        title_bn: 'অচেনা গ্রহে নেমে ঘুরে বেড়ানো',
        subtitle_bn: 'রহস্যময় দূর গ্রহে পা রেখে অদ্ভুত স্ফটিক গুহা আর এলিয়েন জগৎ খুঁজব!',
        type: 'explorer',
      },
    ],
  },
  {
    id: 2,
    stepNumber: 2,
    tag: 'কৌতূহল ০২: স্পেসশিপে তোমার স্পেশাল কেবিন',
    topicTitle_bn: 'স্পেসশিপের দায়িত্ব 🚀',
    scenario_bn: 'তোমার মহাকাশযান যখন কোটি মাইল দূরে দূরবর্তী কোনো গ্রহে উড়ে যাচ্ছে, তুমি কোন কেবিনে বসে সবচেয়ে বেশি কাজ করতে চাইবে?',
    options: [
      {
        title_bn: 'ককপিট ও স্টিয়ারিং কন্ট্রোল',
        subtitle_bn: 'হাতে জয়স্টিক নিয়ে স্পেসশিপকে গ্রহ ও উল্কাপিণ্ডের পাশ দিয়ে ওড়াব!',
        type: 'pilot',
      },
      {
        title_bn: 'স্টার-অবজারভেটরি কাঁচের ডোম',
        subtitle_bn: 'মহাকাশের মানচিত্র দেখে নতুন নতুন নক্ষত্রপুঞ্জের ছবি তুলব!',
        type: 'astronomer',
      },
      {
        title_bn: 'রোবটিক্স ও টেক ল্যাব',
        subtitle_bn: 'রোবটের সার্কিট টিউন করব আর রকেটের নতুন শক্তিশালী পার্টস জুড়ব!',
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
    tag: 'কৌতূহল ০৩: মহাজাগতিক বিস্ময় ও রোমাঞ্চ',
    topicTitle_bn: 'ভবিষ্যতের মহাকাশ লক্ষ্য 🌟',
    scenario_bn: 'বড় হয়ে বিজ্ঞানী বা নভোচারী হলে, মহাকাশের কোন রোমাঞ্চকর রহস্যটি তুমি সবার আগে সমাধান করতে চাও?',
    options: [
      {
        title_bn: 'আলোর গতিতে অন্য তারায় যাওয়া',
        subtitle_bn: 'সবার চেয়ে দ্রুততম গতিতে অন্য সৌরজগতে পৌঁছে বিশ্বরেকর্ড গড়া!',
        type: 'pilot',
      },
      {
        title_bn: 'ব্ল্যাকহোল ও সৃষ্টির রহস্য',
        subtitle_bn: 'রহস্যময় ব্ল্যাকহোলের শেষ সীমানা ও তারার জন্মরহস্য উন্মোচন করা!',
        type: 'astronomer',
      },
      {
        title_bn: 'চাঁদ ও মঙ্গলে মানুষের শহর',
        subtitle_bn: 'রোবট আর থ্রিডি প্রিন্টার দিয়ে অন্য গ্রহে সুরক্ষিত মহাকাশ শহর তৈরি করা!',
        type: 'engineer',
      },
      {
        title_bn: 'অন্য গ্রহে বন্ধু বা এলিয়েন খোঁজা',
        subtitle_bn: 'বহু দূর কোনো গ্রহে বন্ধুভাবাপন্ন এলিয়েন প্রাণ আছে কি না খুঁজে বের করা!',
        type: 'explorer',
      },
    ],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeCadetOrientation } = useAppStore();

  const [step, setStep] = useState(0); // 0: Welcome, 1: Q1, 2: Q2, 3: Q3, 4: Result/Reveal
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [cadetName, setCadetName] = useState('সোহান');

  const currentQIndex = step - 1;
  const currentQ = QUESTIONS[currentQIndex];
  const currentSelections = answers[currentQIndex] || [];
  const hasSelection = currentSelections.length > 0;

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
      <StatusBar barStyle="light-content" />

      {/* Step 0: Welcome & Orientation Briefing */}
      {step === 0 && (
        <View style={styles.welcomeWrapper}>
          <View style={styles.topBadgeRow}>
            <Sparkles size={13} color={Colors.gold} />
            <Text style={styles.topBadgeText}>মহাকাশ একাডেমি ওরিয়েন্টেশন</Text>
            <Sparkles size={13} color={Colors.gold} />
          </View>

          <StoryCard accent="primary" style={styles.welcomeCard}>
            <View style={styles.mascotBox}>
              <AnimatedMascot size={86} mood="waving" />
            </View>

            <Text style={styles.welcomeTitle}>স্বাগতম, মহাকাশযাত্রী! 🚀</Text>
            <Text style={styles.welcomeSubtitle}>
              বাংলাদেশ থেকে মঙ্গল গ্রহের অভিযাত্রায় তুমিই হতে পারো পরবর্তী শীর্ষ স্পেস ক্যাডেট।
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIconBubble, { backgroundColor: 'rgba(255, 200, 107, 0.15)' }]}>
                  <Compass size={18} color={Colors.gold} />
                </View>
                <View style={styles.featureTextBox}>
                  <Text style={styles.featureTitle}>কৌতূহলভিত্তিক অনুসন্ধান</Text>
                  <Text style={styles.featureDesc}>৩টি সহজ প্রশ্নের মাধ্যমে জানো তোমার ক্যাডেট ধরন</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIconBubble, { backgroundColor: 'rgba(107, 138, 255, 0.15)' }]}>
                  <Zap size={18} color={Colors.primaryLight} />
                </View>
                <View style={styles.featureTextBox}>
                  <Text style={styles.featureTitle}>অফিসিয়াল নাসার বিজ্ঞান পাঠ</Text>
                  <Text style={styles.featureDesc}>বাস্তব তথ্য ও সহজ উপমায় সাজানো ৮টি রোমাঞ্চকর পাঠ</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIconBubble, { backgroundColor: 'rgba(94, 214, 192, 0.15)' }]}>
                  <Award size={18} color={Colors.emerald} />
                </View>
                <View style={styles.featureTextBox}>
                  <Text style={styles.featureTitle}>পদমর্যাদা ও চন্দ্রাভিযান</Text>
                  <Text style={styles.featureDesc}>ক্যাডেট থেকে মহাকাশচারী পদে পৌঁছাও</Text>
                </View>
              </View>
            </View>

            <GentleButton
              title="আমার ক্যাডেট রূপ নির্ধারণ করো ➔"
              onPress={() => setStep(1)}
              variant="gold"
              size="large"
              fullWidth
            />
          </StoryCard>
        </View>
      )}

      {/* Steps 1, 2, 3: Questions */}
      {step >= 1 && step <= 3 && currentQ && (
        <View style={styles.questionWrapper}>
          <View style={styles.stepHeader}>
            <View style={styles.stepPill}>
              <Text style={styles.stepPillText}>ধাপ {step} / ৩</Text>
            </View>
            <Text style={styles.tagText}>{currentQ.tag}</Text>
          </View>

          <StoryCard accent="primary" style={styles.scenarioCard}>
            <View style={styles.scenarioIconHeader}>
              <Sparkles size={16} color={Colors.primaryLight} />
              <Text style={styles.scenarioSubtitle}>{currentQ.topicTitle_bn}</Text>
            </View>
            <Text style={styles.scenarioText}>{currentQ.scenario_bn}</Text>

            <View style={styles.multiSelectHintPill}>
              <Text style={styles.multiSelectHintText}>💡 পছন্দমতো একাধিক উত্তর বেছে নিতে পারো</Text>
            </View>
          </StoryCard>

          {/* Choices List */}
          <View style={styles.choicesList}>
            {currentQ.options.map((option, idx) => {
              const isSelected = currentSelections.includes(idx);
              const archetypeData = ARCHETYPES[option.type];

              return (
                <Pressable
                  key={idx}
                  style={[
                    styles.choiceCard,
                    isSelected && {
                      borderColor: archetypeData.accentColor,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                  ]}
                  onPress={() => handleToggleChoice(currentQ.id, idx)}
                >
                  <SpaceChoiceBadge
                    type={option.type}
                    size={38}
                    isSelected={isSelected}
                  />

                  <View style={styles.choiceTextContainer}>
                    <Text style={styles.choiceTitle}>{option.title_bn}</Text>
                    <Text style={styles.choiceSubtitle}>{option.subtitle_bn}</Text>
                  </View>

                  {isSelected ? (
                    <View
                      style={[
                        styles.checkBadge,
                        { backgroundColor: archetypeData.accentColor },
                      ]}
                    >
                      <Check size={14} color="#0F1128" strokeWidth={3} />
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
            <GentleButton
              title="পেছনে"
              onPress={handlePrev}
              variant="outline"
              size="normal"
              icon={<ArrowLeft size={16} color={Colors.text} />}
              style={styles.prevBtn}
            />
            <GentleButton
              title={
                !hasSelection
                  ? 'কমপক্ষে ১টি বেছে নাও'
                  : step === 3
                  ? 'ক্যাডেট পরিচয়পত্র দেখো ➔'
                  : 'পরবর্তী প্রশ্ন ➔'
              }
              onPress={handleNext}
              variant={hasSelection ? 'gold' : 'outline'}
              size="normal"
              disabled={!hasSelection}
              icon={hasSelection ? <ArrowRight size={16} color={Colors.textDark} /> : undefined}
              style={styles.nextBtn}
            />
          </View>
        </View>
      )}

      {/* Step 4: Official Cadet Identity & Archetype Reveal */}
      {step === 4 && (
        <View style={styles.resultWrapper}>
          <ConfettiEffect active />

          <View style={styles.topBadgeRow}>
            <Sparkles size={13} color={Colors.gold} />
            <Text style={styles.topBadgeText}>অফিসিয়াল স্পেস ক্যাডেট পরিচয়পত্র</Text>
            <Sparkles size={13} color={Colors.gold} />
          </View>

          <StoryCard accent="gold" style={styles.archetypeCard}>
            <View style={styles.avatarHolder}>
              <AstronautAvatar size={88} rank="Cadet" showHalo />
              <View
                style={[
                  styles.archetypeBadgeFloating,
                  { borderColor: archetypeInfo.accentColor },
                ]}
              >
                <SpaceChoiceBadge
                  type={calculatedArchetypeKey}
                  size={36}
                  isSelected
                />
              </View>
            </View>

            <Text style={[styles.archetypeTitle, { color: archetypeInfo.accentColor }]}>
              {archetypeInfo.title_bn}
            </Text>
            <Text style={styles.archetypeMotto}>"{archetypeInfo.motto_bn}"</Text>

            <View style={styles.archetypeDescCard}>
              <Text style={styles.archetypeDesc}>{archetypeInfo.description_bn}</Text>
              <View style={styles.focusChip}>
                <Star size={12} color={Colors.gold} fill={Colors.gold} />
                <Text style={styles.focusChipText}>
                  প্রস্তাবিত বিশেষায়িত পাঠ: {archetypeInfo.recommendedFocus_bn}
                </Text>
              </View>
            </View>

            <View style={styles.nameSection}>
              <Text style={styles.nameFieldLabel}>তোমার অফিসিয়াল ক্যাডেট নাম:</Text>
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

            <View style={styles.roleNotice}>
              <Text style={styles.roleNoticeText}>
                ⭐ সকল নতুন শিক্ষার্থী স্পেস ক্যাডেট হিসেবে যাত্রা শুরু করে। পাঠ ও কুইজ জয় করে পয়েন্ট অর্জন করলে তোমার পদবী উন্নীত হবে!
              </Text>
            </View>
          </StoryCard>

          <GentleButton
            title="ক্যাডেট হিসেবে মিশন শুরু করো 🚀"
            onPress={handleFinalize}
            variant="gold"
            size="large"
            fullWidth
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 36,
    paddingBottom: 48,
    minHeight: '100%',
    justifyContent: 'center',
    maxWidth: 620,
    alignSelf: 'center',
    width: '100%',
  },
  welcomeWrapper: {
    width: '100%',
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 200, 107, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 107, 0.25)',
    marginBottom: 16,
    alignSelf: 'center',
  },
  topBadgeText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
  },
  welcomeCard: {
    alignItems: 'center',
    padding: 22,
  },
  mascotBox: {
    marginBottom: 14,
  },
  welcomeTitle: {
    color: Colors.text,
    fontSize: Typography.size.hero,
    fontFamily: Typography.family.hindBold,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresList: {
    width: '100%',
    gap: 12,
    marginBottom: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 12,
    borderRadius: 16,
  },
  featureIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextBox: {
    flex: 1,
  },
  featureTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.hindBold,
  },
  featureDesc: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
    marginTop: 2,
  },
  questionWrapper: {
    width: '100%',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  stepPill: {
    backgroundColor: 'rgba(107, 138, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  stepPillText: {
    color: Colors.primaryLight,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  tagText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindSemiBold,
  },
  scenarioCard: {
    marginBottom: 18,
  },
  scenarioIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  scenarioSubtitle: {
    color: Colors.primaryLight,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
  },
  scenarioText: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    lineHeight: Typography.lineHeight.h3,
    fontFamily: Typography.family.hindBold,
  },
  multiSelectHintPill: {
    backgroundColor: 'rgba(255, 200, 107, 0.10)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 12,
  },
  multiSelectHintText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindSemiBold,
  },
  choicesList: {
    gap: 12,
    marginBottom: 22,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  choiceTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  choiceTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.hindBold,
    marginBottom: 2,
  },
  choiceSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
  unselectedRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    marginLeft: 4,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
  resultWrapper: {
    width: '100%',
  },
  archetypeCard: {
    marginBottom: 22,
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
    right: -8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  archetypeTitle: {
    fontSize: Typography.size.h1,
    fontFamily: Typography.family.hindBold,
    textAlign: 'center',
    marginBottom: 4,
  },
  archetypeMotto: {
    color: Colors.primaryLight,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindSemiBold,
    textAlign: 'center',
    marginBottom: 14,
  },
  archetypeDescCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    marginBottom: 16,
  },
  archetypeDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    textAlign: 'center',
    marginBottom: 10,
  },
  focusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 200, 107, 0.12)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  focusChipText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  nameSection: {
    width: '100%',
    marginBottom: 12,
  },
  nameFieldLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindBold,
    marginBottom: 6,
  },
  nameInputBox: {
    backgroundColor: 'rgba(15, 17, 40, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  nameInput: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontFamily: Typography.family.hindBold,
  },
  roleNotice: {
    backgroundColor: 'rgba(107, 138, 255, 0.12)',
    padding: 12,
    borderRadius: 14,
    marginTop: 4,
  },
  roleNoticeText: {
    color: Colors.primaryLight,
    fontSize: Typography.size.micro,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
    textAlign: 'center',
  },
});
