import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { DoubleBezelCard } from '../../src/components/DoubleBezelCard';
import { TactileButton } from '../../src/components/TactileButton';
import { MascotFeedbackSlot } from '../../src/components/MascotFeedbackSlot';
import { AstronautAvatar } from '../../src/components/AstronautAvatar';
import { ConfettiEffect } from '../../src/components/ConfettiEffect';
import { QuizQuestion, QuizAttemptRecord } from '../../src/content/schema';
import { getQuizQuestionsByLessonId, saveQuizAttempt } from '../../src/services/quizService';
import { useAppStore } from '../../src/state/useAppStore';
import {
  RotateCcw,
  Home,
  Star,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react-native';

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const OPTION_PREFIXES = ['ক', 'খ', 'গ', 'ঘ'];

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
  const { recordQuizAttempt, rank } = useAppStore();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<QuizAttemptRecord['answers']>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>কুইজ লোড হচ্ছে...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>এই পাঠের জন্য কোনো কুইজ পাওয়া যায়নি।</Text>
        <TactileButton
          title="পাঠশালায় ফিরে যাও"
          onPress={() => router.back()}
          variant="primary"
          icon={<Home size={16} color="#FFFFFF" />}
        />
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
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const isPerfect = finalScore === questions.length;
      const earnedXP = finalScore * 10 + (isPerfect ? 10 : 0);

      const attemptRecord: QuizAttemptRecord = {
        lesson_id: id as string,
        score: finalScore,
        total_questions: questions.length,
        xp_earned: earnedXP,
        answers: answersHistory,
        completed_at: new Date().toISOString(),
      };

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
  };

  // Completion Victory Screen (3-Star Celebration)
  if (isQuizComplete) {
    const finalScore = score;
    const isPerfect = finalScore === questions.length;
    const earnedXP = finalScore * 10 + (isPerfect ? 10 : 0);

    return (
      <ScrollView contentContainerStyle={styles.summaryContainer} showsVerticalScrollIndicator={false}>
        {finalScore > 0 && <ConfettiEffect active />}
        <DoubleBezelCard glow={isPerfect ? 'gold' : 'blue'} style={styles.summaryCardWrapper}>
          {/* Avatar Celebration */}
          <View style={styles.avatarWrapper}>
            <AstronautAvatar size={78} rank={rank} showHalo />
          </View>

          <Text style={styles.summaryTitle}>অভিনন্দন! মিশন সফল 🎉</Text>
          <Text style={styles.summarySubtitle}>
            তুমি {toBengaliNumber(questions.length)}টি প্রশ্নের মধ্যে {toBengaliNumber(finalScore)}টি সঠিক উত্তর দিয়েছো!
          </Text>

          {/* Star Rating Display */}
          <View style={styles.starsRow}>
            {[...Array(questions.length)].map((_, i) => (
              <Star
                key={i}
                size={30}
                color={i < finalScore ? Colors.gold : 'rgba(255, 255, 255, 0.15)'}
                fill={i < finalScore ? Colors.gold : 'transparent'}
              />
            ))}
          </View>

          {/* XP Reward Showcase */}
          <View style={styles.xpRewardBox}>
            <Zap size={22} color={Colors.gold} fill={Colors.gold} />
            <View>
              <Text style={styles.xpRewardTitle}>+{earnedXP} XP অর্জিত হয়েছে!</Text>
              <Text style={styles.xpRewardDesc}>তোমার মহাকাশচারী প্রোফাইলে যোগ করা হয়েছে</Text>
            </View>
          </View>

          {/* Mascot Celebrate Reaction */}
          <MascotFeedbackSlot
            state={finalScore > 0 ? 'celebrate' : 'incorrect'}
            title={isPerfect ? 'অনবদ্য নৈপুণ্য! 🌟' : 'দারুণ প্রচেষ্টা! 🚀'}
            message={
              isPerfect
                ? 'চমৎকার! মহাকাশ বিজ্ঞানের প্রতিটি জটিল প্রশ্নের সঠিক উত্তর দিয়েছো তুমি।'
                : 'খুব ভালো চেষ্টা করেছো! নিয়মিত অনুশীলনে তুমি আরও বড় বিজ্ঞানী হয়ে উঠবে।'
            }
          />

          {/* Action CTAs */}
          <View style={styles.summaryActions}>
            <TactileButton
              title="আবার চেষ্টা করো"
              onPress={handleRetry}
              variant="outline"
              size="normal"
              icon={<RotateCcw size={16} color="#FFFFFF" />}
            />
            <TactileButton
              title="পাঠশালায় ফিরে যাও ➔"
              onPress={() => router.push('/(tabs)/lessons')}
              variant="gold"
              size="normal"
            />
          </View>
        </DoubleBezelCard>
      </ScrollView>
    );
  }

  // Active Quiz Deck
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Friendly Stepper Header */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperTopRow}>
          <View style={styles.stepperBadge}>
            <Star size={13} color={Colors.gold} fill={Colors.gold} />
            <Text style={styles.stepperTag}>
              {id === 'placement' ? 'প্লেসমেন্ট চ্যালেঞ্জ' : 'মহাকাশ কুইজ'}
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

      {/* Question Prompt Card */}
      <DoubleBezelCard glow="blue" style={styles.questionCardMargin}>
        <Text style={styles.promptText}>{currentQ.prompt_bn}</Text>
      </DoubleBezelCard>

      {/* 4 Interactive Option Cards */}
      <View style={styles.optionsList}>
        {currentQ.options_bn.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrectAnswer = idx === currentQ.correct_index;

          let cardStyle = styles.optionCard;
          let badgeStyle = styles.optionBadge;
          let badgeTextStyle = styles.badgeLabel;

          if (isAnswerSubmitted) {
            if (isCorrectAnswer) {
              cardStyle = { ...cardStyle, ...styles.optionCardCorrect };
              badgeStyle = { ...badgeStyle, ...styles.optionBadgeCorrect };
              badgeTextStyle = { ...badgeTextStyle, color: '#FFFFFF' };
            } else if (isSelected) {
              cardStyle = { ...cardStyle, ...styles.optionCardIncorrect };
              badgeStyle = { ...badgeStyle, ...styles.optionBadgeIncorrect };
              badgeTextStyle = { ...badgeTextStyle, color: '#FFFFFF' };
            }
          } else if (isSelected) {
            cardStyle = { ...cardStyle, ...styles.optionCardSelected };
            badgeStyle = { ...badgeStyle, ...styles.optionBadgeSelected };
          }

          return (
            <Pressable
              key={idx}
              style={cardStyle}
              onPress={() => handleSelectOption(idx)}
              disabled={isAnswerSubmitted}
            >
              <View style={badgeStyle}>
                <Text style={badgeTextStyle}>{OPTION_PREFIXES[idx]}</Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>

              {isAnswerSubmitted && isCorrectAnswer && (
                <CheckCircle2 size={20} color={Colors.emerald} style={styles.indicatorIcon} />
              )}
              {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                <AlertCircle size={20} color={Colors.coral} style={styles.indicatorIcon} />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Immediate Pedagogical Feedback & Mascot Slot */}
      {isAnswerSubmitted && (
        <View style={styles.feedbackContainer}>
          <MascotFeedbackSlot
            state={isCorrect ? 'correct' : 'incorrect'}
            message={currentQ.explanation_bn}
            hint={currentQ.hint_bn}
          />

          <TactileButton
            title={currentIndex + 1 < questions.length ? 'পরবর্তী প্রশ্ন ➔' : 'ফলাফল দেখো ➔'}
            onPress={handleNextQuestion}
            variant={isCorrect ? 'emerald' : 'primary'}
            size="large"
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
    paddingBottom: 48,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.body,
    marginTop: 12,
  },
  emptyTitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.body,
    textAlign: 'center',
    marginBottom: 16,
  },
  stepperContainer: {
    marginBottom: 16,
  },
  stepperTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepperBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.goldBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stepperTag: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  stepperCounter: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  stepperTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  stepperFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  questionCardMargin: {
    marginBottom: 16,
  },
  promptText: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.heavy,
    lineHeight: Typography.lineHeight.h2,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  optionCardCorrect: {
    borderColor: Colors.emerald,
    backgroundColor: Colors.emeraldBg,
  },
  optionCardIncorrect: {
    borderColor: Colors.coral,
    backgroundColor: Colors.coralBg,
  },
  optionBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    fontWeight: Typography.weight.heavy,
  },
  optionText: {
    flex: 1,
    color: Colors.text,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
  },
  indicatorIcon: {
    marginLeft: 8,
  },
  feedbackContainer: {
    marginTop: 14,
  },
  summaryContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    padding: 18,
  },
  summaryCardWrapper: {
    alignItems: 'center',
  },
  avatarWrapper: {
    marginBottom: 10,
  },
  summaryTitle: {
    color: Colors.text,
    fontSize: Typography.size.hero,
    fontWeight: Typography.weight.heavy,
    marginBottom: 6,
  },
  summarySubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.body,
    textAlign: 'center',
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  xpRewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldBg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    gap: 12,
    width: '100%',
    marginBottom: 12,
  },
  xpRewardTitle: {
    color: Colors.gold,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.heavy,
  },
  xpRewardDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
  },
  summaryActions: {
    width: '100%',
    gap: 10,
    marginTop: 14,
  },
});
