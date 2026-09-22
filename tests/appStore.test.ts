import assert from 'node:assert';
import test from 'node:test';
import {
  calculateRank,
  calculateArchetype,
  useAppStore,
  RANK_THRESHOLDS,
  ARCHETYPES,
} from '../src/state/useAppStore';
import { getLessons, getLessonById, getLessonsByLevel } from '../src/services/lessonService';
import { getQuizQuestionsByLessonId } from '../src/services/quizService';

test('Rank Calculation Thresholds', () => {
  assert.strictEqual(calculateRank(0), 'Cadet');
  assert.strictEqual(calculateRank(100), 'Cadet');
  assert.strictEqual(calculateRank(200), 'Cadet');
  assert.strictEqual(calculateRank(201), 'Astronaut');
  assert.strictEqual(calculateRank(600), 'Astronaut');
  assert.strictEqual(calculateRank(601), 'Mission Specialist');
  assert.strictEqual(calculateRank(1200), 'Mission Specialist');
  assert.strictEqual(calculateRank(1201), 'Commander');
  assert.strictEqual(calculateRank(2500), 'Commander');
});

test('useAppStore: Initial state and progress calculation', () => {
  useAppStore.getState().resetProgress();
  const state = useAppStore.getState();

  assert.strictEqual(state.rank, 'Cadet');
  assert.strictEqual(state.xp, 0);
  assert.strictEqual(state.completedLessonIds.length, 0);

  const progress = state.getRankProgress();
  assert.strictEqual(progress.current, 0);
  assert.strictEqual(progress.max, 200);
  assert.strictEqual(progress.percentage, 0);
});

test('useAppStore: XP Gain and Level Up promotion (Cadet -> Astronaut)', () => {
  useAppStore.getState().resetProgress();

  // Add 150 XP (still Cadet)
  useAppStore.getState().addXP(150);
  let state = useAppStore.getState();
  assert.strictEqual(state.xp, 150);
  assert.strictEqual(state.rank, 'Cadet');
  assert.strictEqual(state.activeLevelUp, null);

  // Add 60 XP (total 210 XP -> promotes to Astronaut!)
  useAppStore.getState().addXP(60);
  state = useAppStore.getState();
  assert.strictEqual(state.xp, 210);
  assert.strictEqual(state.rank, 'Astronaut');
  assert.notStrictEqual(state.activeLevelUp, null);
  assert.strictEqual(state.activeLevelUp?.previousRank, 'Cadet');
  assert.strictEqual(state.activeLevelUp?.newRank, 'Astronaut');
  assert.strictEqual(state.activeLevelUp?.unlockedTitle_bn, 'মহাকাশচারী');

  // Dismiss level up modal
  useAppStore.getState().dismissLevelUp();
  state = useAppStore.getState();
  assert.strictEqual(state.activeLevelUp, null);
});

test('useAppStore: Lesson completion awards +20 XP once', () => {
  useAppStore.getState().resetProgress();

  useAppStore.getState().completeLesson('lesson-1');
  let state = useAppStore.getState();
  assert.strictEqual(state.xp, 20);
  assert.ok(state.completedLessonIds.includes('lesson-1'));

  // Duplicate completion should not award XP again
  useAppStore.getState().completeLesson('lesson-1');
  state = useAppStore.getState();
  assert.strictEqual(state.xp, 20);
});

test('useAppStore: Quiz attempt recording updates state and awards XP', () => {
  useAppStore.getState().resetProgress();

  useAppStore.getState().recordQuizAttempt({
    lesson_id: 'lesson-1',
    score: 3,
    total_questions: 3,
    xp_earned: 40,
    answers: [
      { question_id: 'q1-1', chosen_index: 1, is_correct: true },
      { question_id: 'q1-2', chosen_index: 2, is_correct: true },
      { question_id: 'q1-3', chosen_index: 1, is_correct: true },
    ],
    completed_at: new Date().toISOString(),
  });

  const state = useAppStore.getState();
  assert.strictEqual(state.xp, 40);
  assert.strictEqual(state.quizAttempts['lesson-1'].length, 1);
  assert.strictEqual(state.quizAttempts['lesson-1'][0].score, 3);
});

test('lessonService: Loads mock lessons and filters correctly', async () => {
  const allLessons = await getLessons();
  assert.ok(allLessons.length >= 6);

  const lesson1 = await getLessonById('lesson-1');
  assert.strictEqual(lesson1?.id, 'lesson-1');
  assert.strictEqual(lesson1?.title_bn, 'চাঁদের বুকে প্রথম পদক্ষেপ');

  const cadetLessons = await getLessonsByLevel('Cadet');
  assert.ok(cadetLessons.length >= 4);
  cadetLessons.forEach((l) => assert.strictEqual(l.level, 'Cadet'));
});

test('quizService: Returns questions for lesson-1', async () => {
  const questions = await getQuizQuestionsByLessonId('lesson-1');
  assert.ok(questions.length > 0);
  assert.strictEqual(questions[0].lesson_id, 'lesson-1');
  assert.strictEqual(questions[0].options_bn.length, 4);
});

test('calculateArchetype: Correctly maps kid interest choices to Cadet Archetypes (single & multi-select)', () => {
  // Single selection
  assert.strictEqual(calculateArchetype({ 0: 0, 1: 0, 2: 2 }), 'pilot');
  assert.strictEqual(calculateArchetype({ 0: 1, 1: 1, 2: 3 }), 'astronomer');
  assert.strictEqual(calculateArchetype({ 0: 2, 1: 2, 2: 1 }), 'engineer');
  assert.strictEqual(calculateArchetype({ 0: 3, 1: 3, 2: 0 }), 'explorer');

  // Multi-selection: engineer selected in Q1, Q2, Q3 -> engineer wins with 3 points
  assert.strictEqual(
    calculateArchetype({
      0: [0, 2],
      1: [1, 2],
      2: [2],
    }),
    'engineer'
  );

  // Multi-selection: astronomer selected across questions
  assert.strictEqual(
    calculateArchetype({
      0: [1, 3],
      1: [0, 1],
      2: [1],
    }),
    'astronomer'
  );
});

test('useAppStore: Cadet Psychometric Orientation and Dossier Assignment', () => {
  useAppStore.getState().resetProgress();
  let state = useAppStore.getState();
  assert.strictEqual(state.hasCompletedOnboarding, false);
  assert.strictEqual(state.cadetArchetype, 'pilot');

  // Complete orientation with astronomer multi-select choices
  useAppStore.getState().completeCadetOrientation('তানিশা', { 0: [1, 3], 1: [1], 2: [1, 2] });
  state = useAppStore.getState();
  assert.strictEqual(state.hasCompletedOnboarding, true);
  assert.strictEqual(state.displayName, 'তানিশা');
  assert.strictEqual(state.cadetArchetype, 'astronomer');
  assert.deepStrictEqual(state.psychometricAnswers, { 0: [1, 3], 1: [1], 2: [1, 2] });

  // Verify archetype details exist
  const info = ARCHETYPES[state.cadetArchetype];
  assert.strictEqual(info.title_bn, 'তারা সন্ধানী ক্যাডেট');
  assert.strictEqual(info.badge, '🔭');
  assert.strictEqual(info.accentColor, '#00F0FF');

  // Reset onboarding
  useAppStore.getState().resetOnboarding();
  state = useAppStore.getState();
  assert.strictEqual(state.hasCompletedOnboarding, false);
});
