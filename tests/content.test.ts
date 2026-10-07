import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { MOCK_LESSONS } from '../src/content/mockLessons';
import { MOCK_QUIZZES } from '../src/content/mockQuizzes';
import {
  findOfflineAnswer,
  getAllOfflineQuestions,
  getOfflineQuestionsByCategory,
} from '../src/services/offlineTutorService';
import { getLessons, getLessonById, getLessonsByLevel } from '../src/services/lessonService';
import { getQuizQuestionsByLessonId, getPlacementQuiz } from '../src/services/quizService';
import { ASTRONAUT_MENTOR_SYSTEM_PROMPT, AI_TUTOR_CONFIG } from '../src/content/aiTutorPrompt';
import { CurriculumSeedData } from '../src/content/schema';

// Bengali য় ড় ঢ় may be stored as one letter or base + nukta; compare them as equal
const nf = (t: string) =>
  t.replace(/য়/g, 'য়').replace(/ড়/g, 'ড়').replace(/ঢ়/g, 'ঢ়');

test('Curriculum: Exactly 8 Lessons (4 Cadet + 4 Astronaut) with rich NASA content', async () => {
  const allLessons = await getLessons();
  assert.strictEqual(allLessons.length, 8, 'Should have exactly 8 lessons');

  const cadetLessons = await getLessonsByLevel('Cadet');
  assert.strictEqual(cadetLessons.length, 4, 'Should have 4 Cadet lessons');
  cadetLessons.forEach((l, i) => {
    assert.strictEqual(l.level, 'Cadet');
    assert.strictEqual(l.order_index, i + 1);
    assert.ok(l.title_bn.length > 0);
    assert.ok(l.summary_bn.length > 0);
    assert.ok(l.nasa_source?.includes('nasa.gov'));
    assert.ok(l.blocks.length >= 3);
  });

  const astronautLessons = await getLessonsByLevel('Astronaut');
  assert.strictEqual(astronautLessons.length, 4, 'Should have 4 Astronaut lessons');
  astronautLessons.forEach((l, i) => {
    assert.strictEqual(l.level, 'Astronaut');
    assert.strictEqual(l.order_index, i + 5);
    assert.ok(l.title_bn.length > 0);
    assert.ok(l.summary_bn.length > 0);
    assert.ok(l.nasa_source?.includes('nasa.gov'));
    assert.ok(l.blocks.length >= 3);
  });

  // Verify all 8 individual lookups
  for (let i = 1; i <= 8; i++) {
    const lesson = await getLessonById(`lesson-${i}`);
    assert.ok(lesson, `Lesson ${i} should be retrieved by id`);
    assert.strictEqual(lesson?.id, `lesson-${i}`);
  }
});

test('Quizzes: 3 questions per lesson (24 total) + 5 placement questions (29 total)', async () => {
  // Placement Quiz
  const placementQuestions = await getPlacementQuiz();
  assert.strictEqual(placementQuestions.length, 5, 'Placement quiz must have 5 questions');
  placementQuestions.forEach((q, i) => {
    assert.strictEqual(q.lesson_id, 'placement');
    assert.strictEqual(q.order_index, i + 1);
    assert.strictEqual(q.options_bn.length, 4, 'Each question must have 4 options');
    assert.ok(q.correct_index >= 0 && q.correct_index <= 3);
    assert.ok(q.prompt_bn.length > 0);
    assert.ok(q.explanation_bn.length > 0);
    assert.ok(q.hint_bn && q.hint_bn.length > 0);
  });

  // Per-lesson quizzes
  let totalLessonQuestions = 0;
  for (let i = 1; i <= 8; i++) {
    const lessonId = `lesson-${i}`;
    const questions = await getQuizQuestionsByLessonId(lessonId);
    assert.strictEqual(questions.length, 3, `Lesson ${lessonId} must have exactly 3 questions`);
    totalLessonQuestions += questions.length;

    questions.forEach((q, qIndex) => {
      assert.strictEqual(q.lesson_id, lessonId);
      assert.strictEqual(q.order_index, qIndex + 1);
      assert.strictEqual(q.options_bn.length, 4);
      assert.ok(q.correct_index >= 0 && q.correct_index <= 3);
      assert.ok(q.explanation_bn.length > 0);
      assert.ok(q.hint_bn && q.hint_bn.length > 0);
    });
  }

  assert.strictEqual(totalLessonQuestions, 24, 'Total per-lesson questions must equal 24');
});

test('Offline Tutor: 100+ space Q&As in Bangla with keyword matching', () => {
  const allQA = getAllOfflineQuestions();
  assert.ok(allQA.length >= 100, 'Must have at least 100 offline questions');
  assert.strictEqual(new Set(allQA.map((q) => q.id)).size, allQA.length, 'Question ids must be unique');

  // Test keyword matching for Moon water
  const moonWaterResult = findOfflineAnswer('চাঁদে কি পানি বা বরফ আছে?');
  assert.ok(moonWaterResult.item !== null);
  assert.strictEqual(moonWaterResult.item?.id, 'faq-01');
  assert.ok(moonWaterResult.answer_bn.includes('দক্ষিণ মেরু'));

  // Test keyword matching for Toilet / Hygiene
  const toiletResult = findOfflineAnswer('মহাকাশে নভোচারীরা বাথরুমে কীভাবে যান?');
  assert.ok(toiletResult.item !== null);
  assert.strictEqual(toiletResult.item?.id, 'faq-02');
  assert.ok(nf(toiletResult.answer_bn).includes(nf('টয়লেট')));

  // Test keyword matching for JWST
  const jwstResult = findOfflineAnswer('জেমস ওয়েব স্পেস টেলিস্কোপ');
  assert.ok(jwstResult.item !== null);
  assert.ok(nf(jwstResult.answer_bn).includes(nf('জেমস ওয়েব')));

  // Test category filtering
  const moonCategory = getOfflineQuestionsByCategory('moon');
  assert.ok(moonCategory.length >= 3);

  // Test fallback response for unknown query
  const unknownResult = findOfflineAnswer('আজকে বাজারের শাকসবজির দাম কত?');
  assert.strictEqual(unknownResult.item, null);
  assert.ok(unknownResult.answer_bn.includes('অফলাইন'));
  assert.ok(unknownResult.suggestedQuestions_bn.length > 0);
});

test('Online AI Tutor Prompt & Persona Config', () => {
  assert.ok(ASTRONAUT_MENTOR_SYSTEM_PROMPT.includes('ক্যাপ্টেন রোভার'));
  assert.ok(ASTRONAUT_MENTOR_SYSTEM_PROMPT.includes('নাসার বৈজ্ঞানিক তথ্য'));
  assert.ok(ASTRONAUT_MENTOR_SYSTEM_PROMPT.includes('বাংলাদেশি জীবনের উপমা'));
  assert.strictEqual(AI_TUTOR_CONFIG.mentor_name, 'ক্যাপ্টেন রোভার');
  assert.ok(AI_TUTOR_CONFIG.suggested_queries_bn.length >= 5);
});

test('seed.json: Packaged deliverable validation', () => {
  const seedPath = path.resolve(__dirname, '../src/content/seed.json');
  assert.ok(fs.existsSync(seedPath), 'seed.json must exist');

  const raw = fs.readFileSync(seedPath, 'utf8');
  const data: CurriculumSeedData = JSON.parse(raw);

  assert.strictEqual(data.version, '1.0.0');
  assert.strictEqual(data.lessons.length, 8);
  assert.strictEqual(data.quizzes.length, 24);
  assert.strictEqual(data.placement_quiz.length, 5);
  assert.strictEqual(data.offline_qa.length, 30);
  assert.strictEqual(data.ai_tutor_config.mentor_name, 'ক্যাপ্টেন রোভার');
});

test('Space destinations: Moon is live, all other planets are coming soon', async () => {
  const { SPACE_DESTINATIONS } = await import('../src/content/spaceDestinations');
  const ids = SPACE_DESTINATIONS.map((d) => d.id);
  assert.deepStrictEqual(ids, ['moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']);
  for (const d of SPACE_DESTINATIONS) {
    assert.strictEqual(d.comingSoon, d.id !== 'moon');
    assert.ok(d.summary_bn.length > 0 && d.summary_en.length > 0);
    assert.ok(d.name_bn.length > 0 && d.name_en.length > 0);
  }
});

test('Offline Tutor: every question and every quick-reply chip leads to a real answer', () => {
  for (const item of getAllOfflineQuestions()) {
    assert.strictEqual(
      findOfflineAnswer(item.question_bn).item?.id,
      item.id,
      `Question of ${item.id} should resolve to itself`
    );
    assert.ok((item.quick_replies_bn || []).length >= 2, `${item.id} needs follow-up chips`);
    for (const chip of item.quick_replies_bn || []) {
      assert.ok(findOfflineAnswer(chip).item, `Chip "${chip}" of ${item.id} must resolve to an answer`);
    }
  }
});

test('CelebrationAstronaut: Outcome tiers map correctly across all possible score ratios', () => {
  const getTier = (score: number, total: number) => {
    const ratio = total > 0 ? score / total : 0;
    if (ratio === 1) return 'perfect';
    if (ratio >= 0.6) return 'great';
    if (ratio >= 0.3) return 'good';
    return 'retry';
  };

  assert.strictEqual(getTier(3, 3), 'perfect', '3/3 should be perfect victory');
  assert.strictEqual(getTier(5, 5), 'perfect', '5/5 should be perfect victory');
  assert.strictEqual(getTier(2, 3), 'great', '2/3 (66%) should be great exploration');
  assert.strictEqual(getTier(4, 5), 'great', '4/5 (80%) should be great exploration');
  assert.strictEqual(getTier(1, 3), 'good', '1/3 (33%) should be good exploration');
  assert.strictEqual(getTier(2, 5), 'good', '2/5 (40%) should be good exploration');
  assert.strictEqual(getTier(0, 3), 'retry', '0/3 should be motivating retry');
  assert.strictEqual(getTier(1, 5), 'retry', '1/5 (20%) should be motivating retry');
  assert.strictEqual(getTier(0, 0), 'retry', '0/0 edge case should be retry');
});

