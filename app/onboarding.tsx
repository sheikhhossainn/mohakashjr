import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
  Users,
  CheckCircle2,
} from 'lucide-react-native';

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
    scenario_bn: 'ভবিষ্যতে মানবজাতির সবচেয়ে বড় মহাকাশ জয়ের কোন ঐতিহাসিক মুহূর্তে তুমি প্রথম উপস্থিত থাকতে চাও?',
    options: [
      {
        title_bn: 'আলোর গতিতে অন্য নক্ষত্রে যাত্রা',
        subtitle_bn: 'সৌরজগত ছাড়িয়ে আলোর গতিতে হাইপারড্রাইভ রকেট নিয়ে মানবজাতির প্রথম নক্ষত্রযাত্রী হওয়া!',
        type: 'pilot',
      },
      {
        title_bn: 'মহাবিশ্বের প্রথম ব্ল্যাকহোলের ছবি তোলা',
        subtitle_bn: 'মহাকর্ষের গভীর রহস্য ভেদ করে ব্ল্যাকহোল আর কোয়াসারের গোপন রহস্যের ছবি মানুষের সামনে আনা!',
        type: 'astronomer',
      },
      {
        title_bn: 'চাঁদে মানুষের প্রথম শহর তৈরি',
        subtitle_bn: 'চাঁদের মাটির নিচে রোবট দিয়ে স্বয়ংক্রিয় বায়ো-ডোম স্পেস কলোনি ও রকেট স্টেশন গড়ে তোলা!',
        type: 'engineer',
      },
      {
        title_bn: 'মঙ্গল গ্রহে জীবনের প্রথম চিহ্ন খোঁজা',
        subtitle_bn: 'লাল গ্রহ মঙ্গলের প্রাচীন হ্রদের তলদেশে ড্রিল করে ভিনগ্রহের প্রথম জীবাশ্ম আবিষ্কার করা!',
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

  const [step, setStep] = useState(0); // 0: Welcome, 1: Q1, 2: Q2, 3: Q3, 4: Result/Reveal, 5: Auth/Account Station
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [cadetName, setCadetName] = useState('সোহান');

  // Auth Station States (Step 5)
  const [authMode, setAuthMode] = useState<'signup' | 'login' | 'guest'>('signup');
  const [username, setUsername] = useState('cadet_' + Math.floor(100 + Math.random() * 900));
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localAuthError, setLocalAuthError] = useState<string | null>(null);
  const [savedUsers, setSavedUsers] = useState<UserAccount[]>([]);

  useEffect(() => {
    authDatabase.getAllUsers().then((users) => {
      setSavedUsers(users.filter((u) => !u.isGuest));
    });
  }, []);

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
    } else if (step === 4) {
      setStep(5); // Go to Account / Auth Station
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const calculatedArchetypeKey = calculateArchetype(answers);
  const archetypeInfo = ARCHETYPES[calculatedArchetypeKey];

  // Auth actions
  const handleSignUp = async () => {
    setLocalAuthError(null);
    if (!username.trim()) {
      setLocalAuthError('ইউজারনেম বা কল-সাইন প্রদান করো।');
      return;
    }
    if (!cadetName.trim()) {
      setLocalAuthError('তোমার নাম প্রদান করো।');
      return;
    }
    if (!password.trim() || password.trim().length < 3) {
      setLocalAuthError('পাসওয়ার্ড কমপক্ষে ৩ অক্ষরের হতে হবে।');
      return;
    }

    const res = await signUpUser({
      username,
      displayName: cadetName,
      password,
      cadetArchetype: calculatedArchetypeKey,
      psychometricAnswers: answers,
    });

    if (res.success) {
      router.replace('/(tabs)');
    } else if (res.error) {
      setLocalAuthError(res.error);
    }
  };

  const handleLogin = async () => {
    setLocalAuthError(null);
    if (!username.trim()) {
      setLocalAuthError('ইউজারনেম প্রদান করো।');
      return;
    }
    if (!password.trim()) {
      setLocalAuthError('পাসওয়ার্ড প্রদান করো।');
      return;
    }

    const res = await loginUser(username, password);
    if (res.success) {
      router.replace('/(tabs)');
    } else if (res.error) {
      setLocalAuthError(res.error);
    }
  };

  const handleGuest = async () => {
    setLocalAuthError(null);
    await continueAsGuest(cadetName, calculatedArchetypeKey, answers);
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

            {/* Quick returning user login shortcut */}
            <Pressable
              onPress={() => {
                setAuthMode('login');
                setStep(5);
              }}
              style={styles.alreadyHaveAccountBtn}
            >
              <Text style={styles.alreadyHaveAccountText}>
                তোমার কি ইতিমধ্যে একটি অ্যাকাউন্ট আছে?{' '}
                <Text style={{ color: Colors.cyan, fontWeight: 'bold' }}>লগইন করো ➔</Text>
              </Text>
            </Pressable>
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
              title="অ্যাকাউন্ট তৈরি ও ক্রেডেনশিয়াল ➔"
              onPress={() => setStep(5)}
              variant="gold"
              size="large"
              style={styles.fullBtn}
            />
          </View>
        )}

        {/* ── Step 5: Official Academy Credentialing (Sign Up, Log In, Guest) ── */}
        {step === 5 && (
          <View style={styles.authWrapper}>
            <View style={styles.topBadgeRow}>
              <Sparkles size={14} color={Colors.cyan} />
              <Text style={styles.topBadgeText}>একাডেমি ক্রেডেনশিয়াল স্টেশন 🛰️</Text>
              <Sparkles size={14} color={Colors.cyan} />
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

            {/* ── SIGN UP ────────────────────────────── */}
            {authMode === 'signup' && (
              <DoubleBezelCard glow="cyan" style={styles.authCardShell}>
                <View style={styles.authSectionHeader}>
                  <SpaceChoiceBadge type={calculatedArchetypeKey} size={32} isSelected />
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
                    />
                  </View>
                </View>

                {/* Input: Name */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>তোমার নাম:</Text>
                  <View style={styles.fieldInputShell}>
                    <Sparkles size={15} color={Colors.gold} />
                    <TextInput
                      style={styles.fieldTextInput}
                      value={cadetName}
                      onChangeText={setCadetName}
                      placeholder="তোমার নাম লেখো"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>
                </View>

                {/* Input: Password */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>পাসকোড / পাসওয়ার্ড:</Text>
                  <View style={styles.fieldInputShell}>
                    <KeyRound size={15} color={Colors.coral} />
                    <TextInput
                      style={styles.fieldTextInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="কমপক্ষে ৩ অক্ষরের পাসওয়ার্ড"
                      placeholderTextColor={Colors.textMuted}
                      secureTextEntry={!showPassword}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <EyeOff size={15} color={Colors.textMuted} />
                      ) : (
                        <Eye size={15} color={Colors.textMuted} />
                      )}
                    </Pressable>
                  </View>
                </View>

                <View style={styles.authBtnRow}>
                  <TactileButton
                    title="পেছনে"
                    onPress={() => setStep(4)}
                    variant="outline"
                    size="normal"
                    style={{ flex: 1 }}
                  />
                  <TactileButton
                    title={isAuthLoading ? 'তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি 🚀'}
                    onPress={handleSignUp}
                    variant="gold"
                    size="normal"
                    disabled={isAuthLoading}
                    style={{ flex: 2 }}
                  />
                </View>
              </DoubleBezelCard>
            )}

            {/* ── LOGIN ──────────────────────────────── */}
            {authMode === 'login' && (
              <DoubleBezelCard glow="gold" style={styles.authCardShell}>
                <View style={styles.authSectionHeader}>
                  <ShieldCheck size={24} color={Colors.gold} />
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

                {/* Username */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>ইউজারনেম / কল-সাইন:</Text>
                  <View style={styles.fieldInputShell}>
                    <User size={15} color={Colors.cyan} />
                    <TextInput
                      style={styles.fieldTextInput}
                      value={username}
                      onChangeText={(val) => setUsername(val.toLowerCase())}
                      placeholder="ইউজারনেম লেখো"
                      placeholderTextColor={Colors.textMuted}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>পাসওয়ার্ড:</Text>
                  <View style={styles.fieldInputShell}>
                    <KeyRound size={15} color={Colors.coral} />
                    <TextInput
                      style={styles.fieldTextInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="পাসওয়ার্ড লেখো"
                      placeholderTextColor={Colors.textMuted}
                      secureTextEntry={!showPassword}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <EyeOff size={15} color={Colors.textMuted} />
                      ) : (
                        <Eye size={15} color={Colors.textMuted} />
                      )}
                    </Pressable>
                  </View>
                </View>

                <View style={styles.authBtnRow}>
                  <TactileButton
                    title="পেছনে"
                    onPress={() => setStep(4)}
                    variant="outline"
                    size="normal"
                    style={{ flex: 1 }}
                  />
                  <TactileButton
                    title={isAuthLoading ? 'লগইন হচ্ছে...' : 'লগইন করো ➔'}
                    onPress={handleLogin}
                    variant="primary"
                    size="normal"
                    disabled={isAuthLoading}
                    style={{ flex: 2 }}
                  />
                </View>
              </DoubleBezelCard>
            )}

            {/* ── GUEST ──────────────────────────────── */}
            {authMode === 'guest' && (
              <DoubleBezelCard glow="emerald" style={styles.authCardShell}>
                <View style={styles.authSectionHeader}>
                  <Compass size={24} color={Colors.emerald} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.authCardTitle}>অতিথি হিসেবে অন্বেষণ</Text>
                    <Text style={styles.authCardSub}>পাসওয়ার্ড ছাড়া দ্রুত খেলা শুরু করো</Text>
                  </View>
                </View>

                <View style={styles.guestNotice}>
                  <CheckCircle2 size={16} color={Colors.emerald} />
                  <Text style={styles.guestNoticeText}>
                    কোনো পাসওয়ার্ড ছাড়াই তুমি অবিলম্বে সব পাঠ, কুইজ এবং চন্দ্রাভিযান খেলতে পারবে। পরবর্তীতে যেকোনো সময় তোমার প্রোফাইল থেকে স্থায়ী অ্যাকাউন্ট তৈরি করে নিতে পারবে।
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
                  <TactileButton
                    title="পেছনে"
                    onPress={() => setStep(4)}
                    variant="outline"
                    size="normal"
                    style={{ flex: 1 }}
                  />
                  <TactileButton
                    title={isAuthLoading ? 'শুরু হচ্ছে...' : 'অতিথি হিসেবে চলো 🛸'}
                    onPress={handleGuest}
                    variant="emerald"
                    size="normal"
                    disabled={isAuthLoading}
                    style={{ flex: 2 }}
                  />
                </View>
              </DoubleBezelCard>
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
    alignItems: 'center',
    gap: 16,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
    marginBottom: 4,
  },
  topBadgeText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontFamily: Typography.fontSans,
    fontWeight: Typography.weight.bold,
  },
  welcomeCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 24,
  },
  mascotBox: {
    marginBottom: 16,
  },
  welcomeTitle: {
    color: Colors.text,
    fontSize: Typography.size.h1,
    fontFamily: Typography.fontSans,
    fontWeight: Typography.weight.heavy,
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.fontSans,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.bodySmall,
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  guidanceBox: {
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.2)',
  },
  guidanceText: {
    color: Colors.cyan,
    fontSize: Typography.size.caption,
    fontFamily: Typography.fontSans,
    textAlign: 'center',
    fontWeight: Typography.weight.semiBold,
  },
  fullBtn: {
    width: '100%',
  },
  alreadyHaveAccountBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  alreadyHaveAccountText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontFamily: Typography.fontSans,
  },

  // Questions Flow
  questionWrapper: {
    gap: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stepPill: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  stepPillText: {
    color: Colors.primaryLight,
    fontSize: Typography.size.caption,
    fontFamily: Typography.fontSans,
    fontWeight: Typography.weight.bold,
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
    fontFamily: Typography.fontSans,
  },
  scenarioCard: {
    paddingVertical: 16,
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
    fontFamily: Typography.fontSans,
    fontWeight: Typography.weight.bold,
  },
  scenarioText: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontFamily: Typography.fontSans,
    lineHeight: Typography.lineHeight.body,
    fontWeight: Typography.weight.medium,
  },
  multiSelectHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  multiSelectHintText: {
    color: Colors.gold,
    fontSize: 11,
    fontFamily: Typography.fontSans,
    fontWeight: Typography.weight.semiBold,
  },

  // Choice Cards
  choicesList: {
    gap: 10,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 18, 60, 0.88)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    gap: 12,
  },
  choiceTextContainer: {
    flex: 1,
  },
  choiceTitle: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontFamily: Typography.fontSans,
    fontWeight: Typography.weight.bold,
    marginBottom: 2,
  },
  choiceSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.fontSans,
    lineHeight: Typography.lineHeight.caption,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedRing: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },

  // Nav Row
  navRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  prevBtn: {
    flex: 1,
  },
  nextBtn: {
    flex: 2,
  },
  disabledNextBtn: {
    opacity: 0.6,
  },

  // Result / Archetype Reveal
  resultWrapper: {
    alignItems: 'center',
    gap: 16,
  },
  archetypeCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarHolder: {
    position: 'relative',
    marginBottom: 12,
  },
  archetypeBadgeFloating: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#080D27',
    borderRadius: 16,
    borderWidth: 2,
    padding: 2,
  },
  archetypeTitle: {
    fontSize: 22,
    fontFamily: Typography.fontSans,
    fontWeight: Typography.weight.heavy,
    textAlign: 'center',
    marginBottom: 4,
  },
  archetypeMotto: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.fontSans,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 14,
  },
  archetypeDescCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: 14,
  },
  archetypeDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.fontSans,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  focusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'center',
  },
  focusChipText: {
    color: Colors.gold,
    fontSize: 11,
    fontFamily: Typography.fontSans,
    fontWeight: Typography.weight.bold,
  },
  nameSection: {
    width: '100%',
    marginBottom: 12,
  },
  nameFieldLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.fontSans,
    fontWeight: Typography.weight.bold,
    marginBottom: 6,
  },
  nameInputBox: {
    backgroundColor: 'rgba(8, 12, 38, 0.85)',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
  },
  nameInput: {
    color: '#FFFFFF',
    fontSize: Typography.size.body,
    fontFamily: Typography.fontSans,
  },
  roleNotice: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 8,
    padding: 8,
    width: '100%',
  },
  roleNoticeText: {
    color: Colors.cyan,
    fontSize: 11,
    fontFamily: Typography.fontSans,
    lineHeight: 16,
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
    fontWeight: Typography.weight.bold,
  },
  authTabBtnTextActive: {
    color: '#080D27',
    fontWeight: Typography.weight.heavy,
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
    fontWeight: Typography.weight.semiBold,
  },
  authCardShell: {
    paddingVertical: 18,
  },
  authSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  authCardTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weight.heavy,
    marginBottom: 2,
  },
  authCardSub: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: Typography.weight.semiBold,
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
    fontSize: 14,
  },
  authBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  quickPickBox: {
    marginBottom: 14,
  },
  quickPickLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: Typography.weight.semiBold,
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
    fontSize: 11,
    fontWeight: Typography.weight.bold,
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
    fontSize: 11,
    lineHeight: 16,
  },
});
