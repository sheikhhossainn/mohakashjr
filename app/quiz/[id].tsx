import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { ScalePressable } from '../../src/components/ScalePressable';
import { StoryCard } from '../../src/components/StoryCard';
import { GentleButton } from '../../src/components/GentleButton';
import { MascotFeedbackSlot } from '../../src/components/MascotFeedbackSlot';
import { AstronautAvatar } from '../../src/components/AstronautAvatar';
import { ConfettiEffect } from '../../src/components/ConfettiEffect';
import { CosmicTopicIllustration } from '../../src/components/CosmicTopicIllustration';
import { QuizQuestion, QuizAttemptRecord } from '../../src/content/schema';
import { getQuizQuestionsByLessonId, saveQuizAttempt } from '../../src/services/quizService';
import { useAppStore } from '../../src/state/useAppStore';
import {
  RotateCcw,
  Star,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react-native';

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const OPTION_PREFIXES = ['ক', 'খ', 'গ', 'ঘ'];

/** XP a full run is worth: 10 per correct answer, +10 for a perfect score. */
function xpForScore(score: number, total: number): number {
  return score * 10 + (total > 0 && score === total ? 10 : 0);
}

function toBengaliNumber(num: number): string {
  return num
    .toString()
    .split('')
    .map((d) => BENGALI_DIGITS[parseInt(d, 10)] || d)
    .join('');
}

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { recordQuizAttempt, rank, quizAttempts } = useAppStore();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<QuizAttemptRecord['answers']>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (id) {
      getQuizQuestionsByLessonId(id).then((data) => {
        setQuestions(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.root}>
      <ScreenHeader title="কুইজ অভিযান" subtitle={id === 'placement' ? 'অভিযাত্রা সূচনা' : 'কৌতূহল যাচাই'} />
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primaryLight} />
        <Text style={styles.loadingText}>মহাকাশ কুইজ সাজানো হচ্ছে...</Text>
      </View>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.root}>
      <ScreenHeader title="কুইজ অভিযান" subtitle={id === 'placement' ? 'অভিযাত্রা সূচনা' : 'কৌতূহল যাচাই'} />
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>এই পাঠের জন্য কোনো প্রশ্ন পাওয়া যায়নি।</Text>
        <GentleButton
          title="পাঠশালায় ফিরে যাও"
          onPress={() => router.back()}
          variant="primary"
          icon={<BookOpen size={17} color="#FFFFFF" />}
        />
      </View>
      </View>
    );
  }

  const currentQ = questions[currentIndex];
  const isCorrect = selectedOption === currentQ.correct_index;

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const correct = index === currentQ.correct_index;
    if (correct) {
      setScore((s) => s + 1);
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        question_id: currentQ.id,
        chosen_index: index,
        is_correct: correct,
      },
    ]);

    // Smooth auto-scroll to reveal the explanation card and Next button immediately
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    } else {
      // `score` already counts the answer just given
      const finalScore = score;

      // Only pay out XP for beating the best earlier run, so replaying can't farm XP
      const previousBestXP = (quizAttempts[id as string] || []).reduce(
        (best, a) => Math.max(best, xpForScore(a.score, a.total_questions)),
        0
      );
      const newXP = Math.max(0, xpForScore(finalScore, questions.length) - previousBestXP);

      const attemptRecord: QuizAttemptRecord = {
        lesson_id: id as string,
        score: finalScore,
        total_questions: questions.length,
        xp_earned: newXP,
        answers: answersHistory,
        completed_at: new Date().toISOString(),
      };

      setEarnedXP(newXP);
      recordQuizAttempt(attemptRecord);
      saveQuizAttempt(attemptRecord);
      setIsQuizComplete(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setAnswersHistory([]);
    setIsQuizComplete(false);
    setEarnedXP(0);
  };

  // Completion Victory Screen
  if (isQuizComplete) {
    const finalScore = score;
    const isPerfect = finalScore === questions.length;

    return (
      <View style={styles.root}>
      <ScreenHeader title="কুইজ অভিযান" subtitle={id === 'placement' ? 'অভিযাত্রা সূচনা' : 'কৌতূহল যাচাই'} />
      <ScrollView contentContainerStyle={styles.summaryContainer} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="light-content" />
        {finalScore > 0 && <ConfettiEffect active />}

        <StoryCard accent={isPerfect ? 'gold' : 'primary'} style={styles.summaryCardWrapper}>
          {/* Avatar Celebration */}
          <View style={styles.avatarWrapper}>
            <AstronautAvatar size={82} rank={rank} showHalo />
          </View>

          <Text style={styles.summaryTitle}>দারুণ অন্বেষণ!</Text>
          <Text style={styles.summarySubtitle}>
            তুমি {toBengaliNumber(questions.length)}টি অনুসন্ধানের মধ্যে {toBengaliNumber(finalScore)}টির রহস্য উন্মোচন করেছো!
          </Text>

          {/* Star Rating Display */}
          <View style={styles.starsRow}>
            {[...Array(questions.length)].map((_, i) => (
              <Star
                key={i}
                size={28}
                color={i < finalScore ? Colors.gold : 'rgba(255, 255, 255, 0.15)'}
                fill={i < finalScore ? Colors.gold : 'transparent'}
              />
            ))}
          </View>

          {/* XP Reward Showcase */}
          <View style={styles.xpRewardBox}>
            <Zap size={22} color={Colors.gold} fill={Colors.gold} />
            <View>
              <Text style={styles.xpRewardTitle}>
                {earnedXP > 0 ? `+${toBengaliNumber(earnedXP)} XP অর্জিত হয়েছে!` : 'নতুন XP নেই'}
              </Text>
              <Text style={styles.xpRewardDesc}>
                {earnedXP > 0
                  ? 'তোমার মহাকাশ গবেষণার ঝুলিতে জমা হয়েছে'
                  : 'আগের সেরা স্কোরের চেয়ে বেশি নম্বর পেলে নতুন XP পাবে'}
              </Text>
            </View>
          </View>

          {/* Mascot Celebrate Reaction */}
          <View style={{ width: '100%' }}>
            <MascotFeedbackSlot
              state={finalScore > 0 ? 'celebrate' : 'incorrect'}
              title={isPerfect ? 'অনবদ্য নৈপুণ্য!' : 'দারুণ প্রচেষ্টা!'}
              message={
                isPerfect
                  ? 'চমৎকার! মহাকাশ বিজ্ঞানের প্রতিটি জটিল প্রশ্নের বিজ্ঞানসম্মত রহস্য বুঝে নিয়েছো।'
                  : 'খুব ভালো চেষ্টা করেছো! মহাকাশের রহস্য ধীরে ধীরে আরও পরিষ্কার হয়ে উঠবে।'
              }
            />
          </View>

          {/* Action CTAs */}
          <View style={styles.summaryActions}>
            <GentleButton
              title="পরবর্তী পাঠশালায় চলো"
              onPress={() => router.push('/(tabs)/lessons')}
              variant="gold"
              size="normal"
            />
            <GentleButton
              title="আবার বোঝার চেষ্টা করো"
              onPress={handleRetry}
              variant="outline"
              size="normal"
              icon={<RotateCcw size={16} color={Colors.text} />}
            />
          </View>
        </StoryCard>
      </ScrollView>
      </View>
    );
  }

  // Active Quiz Deck
  return (
    <View style={styles.root}>
    <ScreenHeader title="কুইজ অভিযান" subtitle={id === 'placement' ? 'অভিযাত্রা সূচনা' : 'কৌতূহল যাচাই'} />
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" />

      {/* Calm Stepper Header */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperTopRow}>
          <View style={styles.stepperBadge}>
            <HelpCircle size={14} color={Colors.gold} />
            <Text style={styles.stepperTag}>
              {id === 'placement' ? 'অভিযাত্রা সূচনা' : 'কৌতূহল যাচাই'}
            </Text>
          </View>
          <Text style={styles.stepperCounter}>
            প্রশ্ন {toBengaliNumber(currentIndex + 1)} / {toBengaliNumber(questions.length)}
          </Text>
        </View>

        <View style={styles.stepperTrack}>
          <View
            style={[
              styles.stepperFill,
              { width: `${((currentIndex + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Question Prompt in Single-Surface StoryCard with Dynamic Topic Illustration */}
      <StoryCard accent="primary" style={styles.questionCardMargin}>
        <View style={styles.questionTopRow}>
          <View style={styles.questionTextCol}>
            <Text style={styles.promptLabel}>একটু ভাবো তো...</Text>
            <Text style={styles.promptText}>{currentQ.prompt_bn}</Text>
          </View>
          <View style={styles.questionIllustrationBox}>
            <CosmicTopicIllustration
              textToDetect={`${currentQ.prompt_bn} ${currentQ.explanation_bn}`}
              size={60}
            />
          </View>
        </View>
      </StoryCard>

      {/* 4 Interactive Option Cards */}
      <View style={styles.optionsList}>
        {currentQ.options_bn.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrectAnswer = idx === currentQ.correct_index;

          let cardStyle = styles.optionCard;
          let badgeStyle = styles.optionBadge;
          let badgeTextStyle = styles.badgeLabel;
          let optionTextStyle = styles.optionText;

          if (isAnswerSubmitted) {
            if (isCorrectAnswer) {
              cardStyle = { ...cardStyle, ...styles.optionCardCorrect };
              badgeStyle = { ...badgeStyle, ...styles.optionBadgeCorrect };
              badgeTextStyle = { ...badgeTextStyle, color: '#0B1026', fontFamily: Typography.family.heading };
              optionTextStyle = { ...optionTextStyle, color: '#FFFFFF', fontFamily: Typography.family.notoBold };
            } else if (isSelected) {
              cardStyle = { ...cardStyle, ...styles.optionCardIncorrect };
              badgeStyle = { ...badgeStyle, ...styles.optionBadgeIncorrect };
              badgeTextStyle = { ...badgeTextStyle, color: '#0B1026', fontFamily: Typography.family.heading };
              optionTextStyle = { ...optionTextStyle, color: '#FFFFFF', fontFamily: Typography.family.notoBold };
            } else {
              cardStyle = { ...cardStyle, ...styles.optionCardDimmed };
            }
          } else if (isSelected) {
            cardStyle = { ...cardStyle, ...styles.optionCardSelected };
            badgeStyle = { ...badgeStyle, ...styles.optionBadgeSelected };
            badgeTextStyle = { ...badgeTextStyle, color: '#0B1026', fontFamily: Typography.family.heading };
          }

          return (
            <ScalePressable
              key={idx}
              scale={0.98}
              style={cardStyle}
              onPress={() => handleSelectOption(idx)}
              disabled={isAnswerSubmitted}
            >
              <View style={badgeStyle}>
                <Text style={badgeTextStyle}>{OPTION_PREFIXES[idx]}</Text>
              </View>
              <View style={styles.optionTextCol}>
                <Text style={optionTextStyle}>{option}</Text>
              </View>

              {isAnswerSubmitted && isCorrectAnswer && (
                <CheckCircle2 size={22} color={Colors.emerald} style={styles.indicatorIcon} />
              )}
              {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                <AlertCircle size={22} color={Colors.coral} style={styles.indicatorIcon} />
              )}
            </ScalePressable>
          );
        })}
      </View>

      {/* Immediate Natural Explanation & Mascot Slot */}
      {isAnswerSubmitted && (
        <View style={styles.feedbackContainer}>
          <MascotFeedbackSlot
            state={isCorrect ? 'correct' : 'incorrect'}
            message={
              !isCorrect
                ? currentQ.explanation_bn.replace(/^(দারুণ!|সঠিক!)\s*/, 'মহাকাশ তথ্য: ')
                : currentQ.explanation_bn
            }
            hint={currentQ.hint_bn}
          />

          <View style={styles.nextButtonWrap}>
            <GentleButton
              title={currentIndex + 1 < questions.length ? 'পরবর্তী প্রশ্ন' : 'ফলাফল দেখো'}
              onPress={handleNextQuestion}
              variant="primary"
              size="large"
              fullWidth
              icon={<ArrowRight size={18} color="#FFFFFF" />}
            />
          </View>
        </View>
      )}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 50,
    maxWidth: 620,
    alignSelf: 'center',
    width: '100%',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.body,
    fontFamily: Typography.family.notoRegular,
    marginTop: 12,
  },
  emptyTitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.body,
    fontFamily: Typography.family.notoRegular,
    textAlign: 'center',
    marginBottom: 16,
  },
  stepperContainer: {
    marginBottom: 18,
  },
  stepperTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepperBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 200, 107, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  stepperTag: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.heading,
  },
  stepperCounter: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingSemi,
  },
  stepperTrack: {
    height: 8,
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepperFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  questionCardMargin: {
    marginBottom: 18,
  },
  questionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  questionTextCol: {
    flex: 1,
  },
  questionIllustrationBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  promptLabel: {
    color: Colors.primary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoSemiBold,
    marginBottom: 4,
  },
  promptText: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontFamily: Typography.family.notoBold,
    lineHeight: Typography.lineHeight.h2,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    backgroundColor: '#1E2858',
  },
  optionCardCorrect: {
    borderColor: '#5DD39E',
    borderWidth: 1.5,
    backgroundColor: '#142938',
  },
  optionCardIncorrect: {
    borderColor: '#FF7A90',
    borderWidth: 1.5,
    backgroundColor: '#2F1B2B',
  },
  optionCardDimmed: {
    opacity: 0.45,
  },
  optionBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.surfaceWarm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    overflow: 'hidden',
  },
  optionBadgeSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionBadgeCorrect: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  optionBadgeIncorrect: {
    backgroundColor: Colors.coral,
    borderColor: Colors.coral,
  },
  badgeLabel: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
    backgroundColor: 'transparent',
  },
  optionTextCol: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  optionText: {
    color: Colors.text,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    fontFamily: Typography.family.notoRegular,
    backgroundColor: 'transparent',
  },
  indicatorIcon: {
    marginLeft: 8,
  },
  feedbackContainer: {
    marginTop: 18,
  },
  nextButtonWrap: {
    marginTop: 14,
  },
  summaryContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: 20,
    maxWidth: 580,
    alignSelf: 'center',
    width: '100%',
  },
  summaryCardWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  summaryTitle: {
    color: Colors.text,
    fontSize: Typography.size.hero,
    fontFamily: Typography.family.heading,
    marginBottom: 6,
  },
  summarySubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.body,
    fontFamily: Typography.family.notoRegular,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: Typography.lineHeight.body,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  xpRewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 200, 107, 0.12)',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.gold,
    gap: 12,
    width: '100%',
    marginBottom: 14,
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
  summaryActions: {
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
});
