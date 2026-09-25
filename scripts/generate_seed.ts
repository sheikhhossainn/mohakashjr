import fs from 'node:fs';
import path from 'node:path';
import { MOCK_LESSONS } from '../src/content/mockLessons';
import { MOCK_QUIZZES } from '../src/content/mockQuizzes';
import offlineQAList from '../src/content/offline_tutor.json';
import { AI_TUTOR_CONFIG } from '../src/content/aiTutorPrompt';
import { CurriculumSeedData, QuizQuestion } from '../src/content/schema';

// Flatten per-lesson quizzes (exclude placement from standard quizzes array, or list both)
const lessonQuizzes: QuizQuestion[] = [];
Object.entries(MOCK_QUIZZES).forEach(([key, questions]) => {
  if (key !== 'placement') {
    lessonQuizzes.push(...questions);
  }
});

const placementQuestions = MOCK_QUIZZES['placement'] || [];

const seedData: CurriculumSeedData = {
  version: '1.0.0',
  generated_at: new Date().toISOString(),
  curriculum_meta: {
    title: 'Mohakash Jr - NASA Space Science Junior Curriculum',
    language: 'bn',
    target_audience: 'Grade 6-10 (Rural & Semi-Urban Bangladesh)',
    total_lessons: MOCK_LESSONS.length,
    total_quizzes: lessonQuizzes.length + placementQuestions.length,
  },
  lessons: MOCK_LESSONS,
  quizzes: lessonQuizzes,
  placement_quiz: placementQuestions,
  offline_qa: offlineQAList,
  ai_tutor_config: AI_TUTOR_CONFIG,
};

const outputPath = path.resolve(__dirname, '../src/content/seed.json');
fs.writeFileSync(outputPath, JSON.stringify(seedData, null, 2), 'utf8');

console.log(`Successfully generated seed.json at ${outputPath}`);
console.log(`- Lessons: ${seedData.lessons.length}`);
console.log(`- Lesson Quizzes: ${seedData.quizzes.length}`);
console.log(`- Placement Quizzes: ${seedData.placement_quiz.length}`);
console.log(`- Offline Q&As: ${seedData.offline_qa.length}`);
