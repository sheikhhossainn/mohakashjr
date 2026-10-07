import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
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
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  Award,
  Compass,
  Zap,
} from 'lucide-react-native';

interface Option {
  title_bn: string;
  subtitle_bn: string;
  type: CadetArchetype;
}

interface Question {
  id: number;
  stepNumber: number;
  tag: string;
  topicTitle_bn: string;
  scenario_bn: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    stepNumber: 1,
    tag: 'কৌতূহল ০১: মহাকাশ রোমাঞ্চ ও স্বপ্ন',
    topicTitle_bn: 'মহাকাশের কোন জিনিসটি তোমাকে সবচেয়ে বেশি টানে?',
    scenario_bn: 'কল্পনা করো, তুমি আজই প্রথম নাসা মহাকাশ কেন্দ্রে প্রবেশ করেছ! চারদিকে তাকিয়ে সবার আগে কোন রোমাঞ্চকর কাজটিতে অংশ নিতে চাও?',
    options: [
      {
        title_bn: 'রোকেট চালনা ও গতি',
        subtitle_bn: 'ধোঁয়া আর আগুন উড়িয়ে শব্দগতির চেয়েও দ্রুত বেগে রকেট ছোটানো!',
        type: 'pilot',
      },
      {
        title_bn: 'নক্ষত্র ও গ্যালাক্সি পর্যবেক্ষণ',
        subtitle_bn: 'বিশাল টেলিস্কোপ দিয়ে কোটি আলোকবর্ষ দূরের অজানা তারার জগৎ দেখা!',
        type: 'astronomer',
      },
      {
        title_bn: 'স্পেসশিপ ও রোভার ডিজাইন',
        subtitle_bn: 'চাঁদ আর মঙ্গলে চলার জন্য শক্তিশালী রোভার ও রোবট তৈরি করা!',
        type: 'engineer',
      },
      {
        title_bn: 'ভিনগ্রহে প্রাণের সন্ধান',
        subtitle_bn: 'অন্য কোনো গ্রহে গাছের মতো উদ্ভিদ বা ক্ষুদ্র প্রাণের চিহ্ন খুঁজে বের করা!',
        type: 'explorer',
      },
    ],
  },
  {
    id: 2,
    stepNumber: 2,
    tag: 'কৌতূহল ০২: তোমার ব্যক্তিগত মহাকাশযান',
    topicTitle_bn: 'তোমার নিজস্ব মহাকাশযানের বিশেষ ক্ষমতা কেমন হবে?',
    scenario_bn: 'নভোচারী প্রকৌশলীরা তোমাকে একটি অত্যাধুনিক ব্যক্তিগত স্পেসশিপ উপহার দিলেন! তুমি এর প্রধান বৈশিষ্ট্য হিসেবে কোনটি পছন্দ করবে?',
    options: [
      {
        title_bn: 'হাইপারড্রাইভ স্টেলার ক্রুজার',
        subtitle_bn: 'সৌরজগতের যেকোনো গ্রহে চোখের পলকে নির্ভুলভাবে পৌঁছানোর সুপার-থ্রাস্টার!',
        type: 'pilot',
      },
      {
        title_bn: 'সুপার-টেলিস্কোপ অবজারভেটরি',
        subtitle_bn: 'মহাবিশ্বের গভীরতম প্রান্তে আলোর সংকেত ও ছায়াপথ স্ক্যান করার লেন্স!',
        type: 'astronomer',
      },
      {
        title_bn: 'স্মার্ট রোভার ও রোবট ল্যাব',
        subtitle_bn: 'যেকোনো প্রতিকূল পাথুরে গ্রহে নামার স্বয়ংক্রিয় রোবট মেকানিক্যাল হাত ও ল্যাব!',
        type: 'engineer',
      },
      {
        title_bn: 'অরবিটাল ল্যাব ও গ্রিনহাউস',
        subtitle_bn: 'মহাশূন্যের শূন্যতায় জল, বাতাস আর পুষ্টিকর খাদ্য উৎপাদনের ইকোসিস্টেম!',
        type: 'explorer',
      },
    ],
  },
  {
    id: 3,
    stepNumber: 3,
    tag: 'কৌতূহল ০৩: মহাজাগতিক বিস্ময় ও রোমাঞ্চ',
    topicTitle_bn: 'ভবিষ্যতের মহাকাশ লক্ষ্য',
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

  const [step, setStep] = useState(0); // 0: Welcome, 1..3: Questions, 4: Reveal
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
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const calculatedArchetypeKey = calculateArchetype(answers);
  const archetypeInfo = ARCHETYPES[calculatedArchetypeKey];

  const handleStartMission = () => {
    completeCadetOrientation(cadetName, answers);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
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
              <Compass size={13} color={Colors.gold} />
              <Text style={styles.topBadgeText}>মহাকাশ একাডেমি ওরিয়েন্টেশন</Text>
            </View>

            <StoryCard accent="primary" style={styles.welcomeCard}>
              <View style={styles.mascotBox}>
                <AnimatedMascot size={86} mood="waving" />
              </View>

              <Text style={styles.welcomeTitle}>স্বাগতম, মহাকাশযাত্রী!</Text>
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
                title="আমার ক্যাডেট রূপ নির্ধারণ করো"
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
                <Compass size={16} color={Colors.primaryLight} />
                <Text style={styles.scenarioSubtitle}>{currentQ.topicTitle_bn}</Text>
              </View>
              <Text style={styles.scenarioText}>{currentQ.scenario_bn}</Text>

              <View style={styles.multiSelectHintPill}>
                <Text style={styles.multiSelectHintText}>পছন্দমতো একাধিক উত্তর বেছে নিতে পারো</Text>
              </View>
            </StoryCard>

            {/* Options List */}
            <View style={styles.optionsList}>
              {currentQ.options.map((option, index) => {
                const isSelected = currentSelections.includes(index);
                return (
                  <Pressable
                    key={index}
                    style={({ pressed }) => [
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                      pressed && styles.optionPressed,
                    ]}
                    onPress={() => handleToggleChoice(currentQ.id, index)}
                  >
                    <View style={styles.optionContent}>
                      <SpaceChoiceBadge
                        type={option.type}
                        size={38}
                        isSelected={isSelected}
                      />
                      <View style={styles.optionTextBox}>
                        <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                          {option.title_bn}
                        </Text>
                        <Text style={styles.optionSubtitle}>{option.subtitle_bn}</Text>
                      </View>
                    </View>

                    {isSelected ? (
                      <View style={styles.checkBadge}>
                        <Check size={13} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    ) : (
                      <View style={styles.unselectedRing} />
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.navButtonsRow}>
              <GentleButton
                title="পূর্ববর্তী"
                onPress={handlePrev}
                variant="outline"
                size="normal"
                icon={<ArrowLeft size={16} color={Colors.textSecondary} />}
                style={styles.backBtn}
              />
              <GentleButton
                title={hasSelection ? 'পরবর্তী' : 'কমপক্ষে ১টি বেছে নাও'}
                onPress={handleNext}
                variant={hasSelection ? 'primary' : 'outline'}
                size="normal"
                disabled={!hasSelection}
                style={styles.nextBtn}
              />
            </View>
          </View>
        )}

        {/* Step 4: Cadet Identity & Archetype Reveal */}
        {step === 4 && (
          <View style={styles.resultWrapper}>
            <ConfettiEffect active />

            <View style={styles.topBadgeRow}>
              <Award size={13} color={Colors.gold} />
              <Text style={styles.topBadgeText}>অফিসিয়াল স্পেস ক্যাডেট পরিচয়পত্র</Text>
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
              title="মিশন শুরু করো"
              onPress={handleStartMission}
              variant="gold"
              size="large"
              fullWidth
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    alignItems: 'center',
    gap: 16,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: Typography.family.heading,
  },
  welcomeCard: {
    width: '100%',
    alignItems: 'center',
    padding: 22,
  },
  mascotBox: {
    marginBottom: 14,
  },
  welcomeTitle: {
    color: Colors.text,
    fontSize: Typography.size.hero,
    lineHeight: Typography.lineHeight.hero,
    fontFamily: Typography.family.heading,
    textAlign: 'center',
    marginBottom: 10,
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
    backgroundColor: Colors.surfaceWarm,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
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
    lineHeight: Typography.lineHeight.caption + 4,
    fontFamily: Typography.family.heading,
  },
  featureDesc: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    lineHeight: Typography.lineHeight.micro + 2,
    fontFamily: Typography.family.notoRegular,
    marginTop: 2,
  },
  // Questions Flow
  questionWrapper: {
    gap: 14,
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
    fontFamily: Typography.family.heading,
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingSemi,
  },
  scenarioCard: {
    padding: 18,
    marginBottom: 6,
  },
  scenarioIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  scenarioSubtitle: {
    color: Colors.primaryLight,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.heading,
  },
  scenarioText: {
    color: Colors.text,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    fontFamily: Typography.family.notoRegular,
    marginBottom: 12,
  },
  multiSelectHintPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 200, 107, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  multiSelectHintText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.headingSemi,
  },
  optionsList: {
    gap: 10,
    marginBottom: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 14,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  optionCardSelected: {
    backgroundColor: Colors.backgroundTertiary,
    borderColor: Colors.primary,
  },
  optionPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionTextBox: {
    flex: 1,
  },
  optionTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
    marginBottom: 2,
  },
  optionTitleSelected: {
    color: Colors.primary,
  },
  optionSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
  unselectedRing: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.borderMedium,
    marginLeft: 4,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  navButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  backBtn: {
    flex: 1,
  },
  nextBtn: {
    flex: 2,
  },

  // Result / Archetype Reveal
  resultWrapper: {
    alignItems: 'center',
    gap: 16,
  },
  archetypeCard: {
    marginBottom: 22,
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  avatarHolder: {
    position: 'relative',
    marginBottom: 16,
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
    fontFamily: Typography.family.heading,
    textAlign: 'center',
    marginBottom: 4,
  },
  archetypeMotto: {
    color: Colors.primaryLight,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingSemi,
    textAlign: 'center',
    marginBottom: 14,
  },
  archetypeDescCard: {
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 16,
    padding: 14,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
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
    backgroundColor: Colors.goldBg,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  focusChipText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
  },
  nameSection: {
    width: '100%',
    marginTop: 8,
    marginBottom: 14,
  },
  nameFieldLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.heading,
    marginBottom: 6,
  },
  nameInputBox: {
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.borderMedium,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  nameInput: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontFamily: Typography.family.heading,
  },
  roleNotice: {
    backgroundColor: Colors.primaryBg,
    padding: 12,
    borderRadius: 14,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(59, 91, 219, 0.15)',
  },
  roleNoticeText: {
    color: Colors.primary,
    fontSize: Typography.size.micro,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
    textAlign: 'center',
  },
});
