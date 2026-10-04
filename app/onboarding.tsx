import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  ActivityIndicator,
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
import { authDatabase, UserAccount } from '../src/services/authDatabase';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  Award,
  Compass,
  Zap,
  CheckSquare2,
  User,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Rocket,
  ShieldCheck,
  CheckCircle2,
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
    topicTitle_bn: 'মহাকাশের কোন জিনিসটি তোমাকে সবচেয়ে বেশি টানে? 🚀',
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
    topicTitle_bn: 'তোমার নিজস্ব মহাকাশযানের বিশেষ ক্ষমতা কেমন হবে? 🛸',
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
  const {
    completeCadetOrientation,
    signUpUser,
    loginUser,
    continueAsGuest,
    isAuthLoading,
    authError,
  } = useAppStore();

  const [step, setStep] = useState(0); // 0: Welcome, 1..3: Questions, 4: Reveal, 5: Auth
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [cadetName, setCadetName] = useState('সোহান');

  // Auth Station States (Step 5)
  const [authMode, setAuthMode] = useState<'signup' | 'login' | 'guest'>('signup');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [savedUsers, setSavedUsers] = useState<UserAccount[]>([]);
  const [localAuthError, setLocalAuthError] = useState<string | null>(null);

  useEffect(() => {
    authDatabase.getAllUsers().then(setSavedUsers);
  }, [step]);

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
    } else if (step === 4) {
      setStep(5); // Advance to credentialing / auth station
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const calculatedArchetypeKey = calculateArchetype(answers);
  const archetypeInfo = ARCHETYPES[calculatedArchetypeKey];

  // Auth Station Actions
  const handleSignUp = async () => {
    setLocalAuthError(null);
    if (!username.trim()) {
      setLocalAuthError('ইউজারনেম বা কল-সাইন প্রদান করো।');
      return;
    }
    if (username.trim().length < 3) {
      setLocalAuthError('ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে।');
      return;
    }
    if (!password || password.length < 4) {
      setLocalAuthError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    const res = await signUpUser({
      username: username.trim().toLowerCase(),
      displayName: cadetName.trim() || 'ক্যাডেট',
      password,
      cadetArchetype: calculatedArchetypeKey,
      psychometricAnswers: answers,
    });

    if (res.success) {
      completeCadetOrientation(cadetName, answers);
      router.replace('/(tabs)');
    } else if (res.error) {
      setLocalAuthError(res.error);
    }
  };

  const handleLogin = async () => {
    setLocalAuthError(null);
    if (!username.trim() || !password) {
      setLocalAuthError('ইউজারনেম ও পাসওয়ার্ড দুটিই পূরণ করো।');
      return;
    }

    const res = await loginUser(username.trim().toLowerCase(), password);
    if (res.success) {
      router.replace('/(tabs)');
    } else if (res.error) {
      setLocalAuthError(res.error);
    }
  };

  const handleGuest = async () => {
    setLocalAuthError(null);
    await continueAsGuest(cadetName, calculatedArchetypeKey, answers);
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

              {/* Returning User Quick Login */}
              <Pressable
                onPress={() => {
                  setAuthMode('login');
                  setStep(5);
                }}
                style={styles.alreadyHaveAccountBtn}
              >
                <Text style={styles.alreadyHaveAccountText}>
                  তোমার কি ইতিমধ্যে একটি অ্যাকাউন্ট আছে?{' '}
                  <Text style={{ color: Colors.primaryLight, fontFamily: Typography.family.hindBold }}>
                    লগইন করো ➔
                  </Text>
                </Text>
              </Pressable>
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
                title={hasSelection ? 'পরবর্তী ➔' : 'কমপক্ষে ১টি বেছে নাও'}
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
              title="একাউন্টে অগ্রগতি সংরক্ষণ করো ➔"
              onPress={() => setStep(5)}
              variant="gold"
              size="large"
              fullWidth
            />

            <Pressable onPress={handleGuest} style={{ paddingVertical: 10, alignItems: 'center' }}>
              <Text style={{ color: Colors.primaryLight, fontSize: 13, fontFamily: Typography.family.hindSemiBold }}>
                সরাসরি অতিথি মোডে শুরু করো ➔
              </Text>
            </Pressable>
          </View>
        )}

        {/* Step 5: Official Academy Credentialing (Sign Up, Log In, Guest) */}
        {step === 5 && (
          <View style={styles.authWrapper}>
            <View style={styles.topBadgeRow}>
              <Sparkles size={13} color={Colors.cyan} />
              <Text style={styles.topBadgeText}>একাডেমি ক্রেডেনশিয়াল স্টেশন 🛰️</Text>
              <Sparkles size={13} color={Colors.cyan} />
            </View>

            {/* 3-Way Mode Switcher Tabs */}
            <View style={styles.authTabBar}>
              <Pressable
                style={[styles.authTabBtn, authMode === 'signup' && styles.authTabBtnActive]}
                onPress={() => {
                  setAuthMode('signup');
                  setLocalAuthError(null);
                }}
              >
                <Rocket size={13} color={authMode === 'signup' ? '#080D27' : Colors.cyan} />
                <Text style={[styles.authTabBtnText, authMode === 'signup' && styles.authTabBtnTextActive]}>
                  সাইন আপ
                </Text>
              </Pressable>

              <Pressable
                style={[styles.authTabBtn, authMode === 'login' && styles.authTabBtnActive]}
                onPress={() => {
                  setAuthMode('login');
                  setLocalAuthError(null);
                }}
              >
                <ShieldCheck size={13} color={authMode === 'login' ? '#080D27' : Colors.gold} />
                <Text style={[styles.authTabBtnText, authMode === 'login' && styles.authTabBtnTextActive]}>
                  লগইন
                </Text>
              </Pressable>

              <Pressable
                style={[styles.authTabBtn, authMode === 'guest' && styles.authTabBtnActive]}
                onPress={() => {
                  setAuthMode('guest');
                  setLocalAuthError(null);
                }}
              >
                <Compass size={13} color={authMode === 'guest' ? '#080D27' : Colors.emerald} />
                <Text style={[styles.authTabBtnText, authMode === 'guest' && styles.authTabBtnTextActive]}>
                  অতিথি
                </Text>
              </Pressable>
            </View>

            {/* Error Banner */}
            {(localAuthError || authError) && (
              <View style={styles.authErrorBanner}>
                <AlertCircle size={15} color={Colors.coral} />
                <Text style={styles.authErrorText}>{localAuthError || authError}</Text>
              </View>
            )}

            {/* ── SIGN UP ── */}
            {authMode === 'signup' && (
              <StoryCard accent="cyan" style={styles.authCardShell}>
                <View style={styles.authSectionHeader}>
                  <SpaceChoiceBadge type={calculatedArchetypeKey} size={34} isSelected />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.authCardTitle, { color: archetypeInfo.accentColor }]}>
                      {archetypeInfo.title_bn}
                    </Text>
                    <Text style={styles.authCardSub}>নতুন অ্যাকাউন্ট তৈরি করো ও তথ্য সংরক্ষণ করো</Text>
                  </View>
                </View>

                {/* Input: Callsign / Username */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>ইউজারনেম / স্পেস কল-সাইন:</Text>
                  <View style={styles.fieldInputShell}>
                    <User size={15} color={Colors.cyan} />
                    <TextInput
                      style={styles.fieldTextInput}
                      value={username}
                      onChangeText={(val) => setUsername(val.toLowerCase().replace(/\s+/g, '_'))}
                      placeholder="যেমন: roket_pilot_10"
                      placeholderTextColor={Colors.textMuted}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Input: Password */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>সিকিউরিটি পাসওয়ার্ড:</Text>
                  <View style={styles.fieldInputShell}>
                    <KeyRound size={15} color={Colors.cyan} />
                    <TextInput
                      style={styles.fieldTextInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড"
                      placeholderTextColor={Colors.textMuted}
                      secureTextEntry={!showPassword}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                      {showPassword ? (
                        <EyeOff size={16} color={Colors.textMuted} />
                      ) : (
                        <Eye size={16} color={Colors.textMuted} />
                      )}
                    </Pressable>
                  </View>
                </View>

                <View style={styles.authBtnRow}>
                  <GentleButton
                    title={isAuthLoading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট নিশ্চিত করো ➔'}
                    onPress={handleSignUp}
                    variant="primary"
                    size="large"
                    disabled={isAuthLoading}
                    fullWidth
                  />
                </View>
              </StoryCard>
            )}

            {/* ── LOGIN ── */}
            {authMode === 'login' && (
              <StoryCard accent="gold" style={styles.authCardShell}>
                <View style={styles.authSectionHeader}>
                  <ShieldCheck size={26} color={Colors.gold} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.authCardTitle}>ক্যাডেট অ্যাকাউন্টে লগইন</Text>
                    <Text style={styles.authCardSub}>পূর্ববর্তী সংরক্ষিত অগ্রগতিতে ফিরে যাও</Text>
                  </View>
                </View>

                {/* Quick Pick if previous accounts exist */}
                {savedUsers.length > 0 && (
                  <View style={styles.quickPickBox}>
                    <Text style={styles.quickPickLabel}>সংরক্ষিত ক্যাডেট (১-ট্যাপ):</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {savedUsers.map((u) => (
                        <Pressable
                          key={u.id}
                          style={[
                            styles.quickChip,
                            username === u.username && styles.quickChipActive,
                          ]}
                          onPress={() => {
                            setUsername(u.username);
                            setCadetName(u.displayName);
                            setLocalAuthError(null);
                          }}
                        >
                          <AstronautAvatar size={22} rank={u.rank} />
                          <Text style={styles.quickChipText}>@{u.username}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>ইউজারনেম / কল-সাইন:</Text>
                  <View style={styles.fieldInputShell}>
                    <User size={15} color={Colors.gold} />
                    <TextInput
                      style={styles.fieldTextInput}
                      value={username}
                      onChangeText={(val) => setUsername(val.toLowerCase().replace(/\s+/g, '_'))}
                      placeholder="ইউজারনেম"
                      placeholderTextColor={Colors.textMuted}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>পাসওয়ার্ড:</Text>
                  <View style={styles.fieldInputShell}>
                    <KeyRound size={15} color={Colors.gold} />
                    <TextInput
                      style={styles.fieldTextInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="পাসওয়ার্ড"
                      placeholderTextColor={Colors.textMuted}
                      secureTextEntry={!showPassword}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                      {showPassword ? (
                        <EyeOff size={16} color={Colors.textMuted} />
                      ) : (
                        <Eye size={16} color={Colors.textMuted} />
                      )}
                    </Pressable>
                  </View>
                </View>

                <View style={styles.authBtnRow}>
                  <GentleButton
                    title={isAuthLoading ? 'যাচাই করা হচ্ছে...' : 'লগইন করো ➔'}
                    onPress={handleLogin}
                    variant="gold"
                    size="large"
                    disabled={isAuthLoading}
                    fullWidth
                  />
                </View>
              </StoryCard>
            )}

            {/* ── GUEST ── */}
            {authMode === 'guest' && (
              <StoryCard accent="emerald" style={styles.authCardShell}>
                <View style={styles.authSectionHeader}>
                  <Compass size={26} color={Colors.emerald} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.authCardTitle}>অতিথি হিসেবে অন্বেষণ</Text>
                    <Text style={styles.authCardSub}>পাসওয়ার্ড ছাড়া দ্রুত খেলা শুরু করো</Text>
                  </View>
                </View>

                <View style={styles.guestNotice}>
                  <CheckCircle2 size={16} color={Colors.emerald} />
                  <Text style={styles.guestNoticeText}>
                    কোনো পাসওয়ার্ড ছাড়াই তুমি অবিলম্বে সব পাঠ, কুইজ এবং চন্দ্রাভিযান খেলতে পারবে। পরবর্তীতে যেকোনো সময় তোমার প্রোফাইল থেকে স্থায়ী অ্যাকাউন্ট তৈরি করে নিতে পারবে।
                  </Text>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>তোমার ক্যাডেট নাম:</Text>
                  <View style={styles.fieldInputShell}>
                    <User size={15} color={Colors.emerald} />
                    <TextInput
                      style={styles.fieldTextInput}
                      value={cadetName}
                      onChangeText={setCadetName}
                      placeholder="নাম লেখো"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>
                </View>

                <View style={styles.authBtnRow}>
                  <GentleButton
                    title="অতিথি হিসেবে ড্যাশবোর্ডে প্রবেশ করো ➔"
                    onPress={handleGuest}
                    variant="emerald"
                    size="large"
                    disabled={isAuthLoading}
                    fullWidth
                  />
                </View>
              </StoryCard>
            )}
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
  alreadyHaveAccountBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  alreadyHaveAccountText: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindRegular,
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
    fontFamily: Typography.family.hindBold,
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindSemiBold,
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
    fontFamily: Typography.family.hindBold,
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
    fontFamily: Typography.family.hindSemiBold,
  },
  optionsList: {
    gap: 10,
    marginBottom: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(22, 27, 61, 0.70)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
  },
  optionCardSelected: {
    backgroundColor: 'rgba(107, 138, 255, 0.16)',
    borderColor: Colors.primaryLight,
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
    fontFamily: Typography.family.hindBold,
    marginBottom: 2,
  },
  optionTitleSelected: {
    color: Colors.primaryLight,
  },
  optionSubtitle: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
  unselectedRing: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
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
    marginTop: 8,
    marginBottom: 14,
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

  // ── Step 5: Auth Station Styles ──────────────────────────
  authWrapper: {
    gap: 14,
  },
  authTabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(14, 18, 60, 0.85)',
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 4,
  },
  authTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
  },
  authTabBtnActive: {
    backgroundColor: Colors.cyan,
  },
  authTabBtnText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: Typography.family.hindBold,
  },
  authTabBtnTextActive: {
    color: '#080D27',
    fontFamily: Typography.family.hindBold,
  },
  authErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 71, 87, 0.16)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.coral,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  authErrorText: {
    flex: 1,
    color: Colors.coral,
    fontSize: 12,
    fontFamily: Typography.family.hindSemiBold,
  },
  authCardShell: {
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  authSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  authCardTitle: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontFamily: Typography.family.hindBold,
    marginBottom: 2,
  },
  authCardSub: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindSemiBold,
    marginBottom: 6,
  },
  fieldInputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 12, 38, 0.9)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    height: 46,
    gap: 10,
  },
  fieldTextInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.hindSemiBold,
  },
  authBtnRow: {
    marginTop: 8,
  },
  quickPickBox: {
    marginBottom: 14,
  },
  quickPickLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindSemiBold,
    marginBottom: 6,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginRight: 8,
  },
  quickChipActive: {
    borderColor: Colors.cyan,
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
  },
  quickChipText: {
    color: Colors.text,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  guestNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    padding: 10,
    marginBottom: 14,
  },
  guestNoticeText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
});
