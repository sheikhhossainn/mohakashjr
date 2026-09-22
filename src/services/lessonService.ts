import { Lesson } from '../content/schema';
import { MOCK_LESSONS } from '../content/mockLessons';

/**
 * Lesson Service - Decoupled data access layer.
 * Day 1: Serves mock data asynchronously.
 * Day 2: Seamlessly switches to Mahi's SQLite queries (src/db/).
 */
export async function getLessons(): Promise<Lesson[]> {
  // Simulating async read (can connect to SQLite db.getLessons() seamlessly)
  return Promise.resolve(MOCK_LESSONS);
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const lesson = MOCK_LESSONS.find((l) => l.id === id) || null;
  return Promise.resolve(lesson);
}

export async function getLessonsByLevel(level: string): Promise<Lesson[]> {
  const filtered = MOCK_LESSONS.filter((l) => l.level === level);
  return Promise.resolve(filtered);
}
