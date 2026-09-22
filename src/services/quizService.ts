import { QuizQuestion, QuizAttemptRecord } from '../content/schema';
import { MOCK_QUIZZES } from '../content/mockQuizzes';

/**
 * Quiz Service - Decoupled data access layer.
 * Day 1: Serves mock quiz questions & saves attempts in memory/store.
 * Day 2: Connects to Mahi's src/db/ saveQuizAttempt() and getQuestions().
 */
export async function getQuizQuestionsByLessonId(lessonId: string): Promise<QuizQuestion[]> {
  const questions = MOCK_QUIZZES[lessonId] || [];
  return Promise.resolve(questions);
}

export async function saveQuizAttempt(attempt: QuizAttemptRecord): Promise<boolean> {
  // Stubbed for Mahi's SQLite saveAttempt(attempt)
  // Currently verified via useAppStore.recordQuizAttempt()
  return Promise.resolve(true);
}
