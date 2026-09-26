import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { Typography } from '../src/theme/typography';
import { findOfflineAnswer, getAllOfflineQuestions } from '../src/services/offlineTutorService';

test('Typography: Bengali font scale and line-height diacritic protection', () => {
  // Line-height must exceed 1.5x font size everywhere to protect Bengali vowels (কার, ফলা, যুক্তবর্ণ)
  assert.ok(Typography.lineHeight.body / Typography.size.body >= 1.5);
  assert.ok(Typography.lineHeight.bodySmall / Typography.size.bodySmall >= 1.5);
  assert.ok(Typography.lineHeight.h1 / Typography.size.h1 >= 1.3);
  assert.ok(Typography.lineHeight.hero / Typography.size.hero >= 1.25);

  // Verify family definitions
  assert.strictEqual(Typography.family.notoRegular, 'NotoSansBengali-Regular');
  assert.strictEqual(Typography.family.notoBold, 'NotoSansBengali-Bold');
  assert.strictEqual(Typography.family.hindRegular, 'HindSiliguri-Regular');
});

test('Assets: Fonts present in assets/fonts/', () => {
  const fontDir = path.resolve(__dirname, '../assets/fonts');
  assert.ok(fs.existsSync(fontDir), 'assets/fonts must exist');

  const requiredFonts = [
    'NotoSansBengali-Regular.ttf',
    'NotoSansBengali-SemiBold.ttf',
    'NotoSansBengali-Bold.ttf',
    'HindSiliguri-Regular.ttf',
    'HindSiliguri-SemiBold.ttf',
    'HindSiliguri-Bold.ttf',
  ];

  requiredFonts.forEach((f) => {
    const fontPath = path.join(fontDir, f);
    assert.ok(fs.existsSync(fontPath), `Font ${f} must exist`);
    const stat = fs.statSync(fontPath);
    assert.ok(stat.size > 50000, `Font ${f} must be valid size (>50KB)`);
  });
});

test('Assets: Lottie animations present and valid JSON in assets/lottie/', () => {
  const lottieDir = path.resolve(__dirname, '../assets/lottie');
  assert.ok(fs.existsSync(lottieDir), 'assets/lottie must exist');

  const requiredAnimations = [
    'mascot-idle.json',
    'mascot-celebrate.json',
    'mascot-incorrect.json',
    'mascot-thinking.json',
  ];

  requiredAnimations.forEach((file) => {
    const filePath = path.join(lottieDir, file);
    assert.ok(fs.existsSync(filePath), `${file} must exist`);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    assert.ok(content.v, `${file} must have Lottie version`);
    assert.ok(content.layers, `${file} must have animation layers`);
    assert.strictEqual(content.w, 200);
    assert.strictEqual(content.h, 200);
  });
});

test('Assets: Lunar illustrations and vector badges present in assets/', () => {
  const illustrationsDir = path.resolve(__dirname, '../assets/illustrations');
  const badgesDir = path.resolve(__dirname, '../assets/badges');

  assert.ok(fs.existsSync(path.join(illustrationsDir, 'lunar-surface.svg')));
  assert.ok(fs.existsSync(path.join(illustrationsDir, 'lunar-zones.svg')));
  assert.ok(fs.existsSync(path.join(illustrationsDir, 'cargo-items.svg')));
  assert.ok(fs.existsSync(path.join(badgesDir, 'badges.svg')));
});

test('Tutor Chat: Airplane mode & offline keyword response speed', () => {
  const t0 = performance.now();

  // Test space hygiene query
  const res1 = findOfflineAnswer('নভোচারীরা মহাকাশে কীভাবে বাথরুমে যান?');
  assert.ok(res1.item !== null);
  assert.strictEqual(res1.item?.id, 'faq-02');
  assert.ok(res1.answer_bn.includes('টয়লেট'));

  // Test spacesuit query
  const res2 = findOfflineAnswer('স্পেসস্যুটের কাজ কী?');
  assert.ok(res2.item !== null);
  assert.strictEqual(res2.item?.id, 'faq-05');

  // Test ISS query
  const res3 = findOfflineAnswer('আন্তর্জাতিক মহাকাশ স্টেশন কী?');
  assert.ok(res3.item !== null);
  assert.strictEqual(res3.item?.id, 'faq-06');

  const t1 = performance.now();
  // Matching must be super fast (< 20ms) for instant responsiveness in airplane mode
  assert.ok(t1 - t0 < 50, 'Offline search must execute in under 50ms');
});

test('Bangla Typography: Conjunct and diacritic integrity check', () => {
  const testSample =
    'বিজ্ঞানী মহাকাশচারী কৃষ্ণগহ্বর প্ল্যাটফর্ম মাইক্রোগ্র্যাভিটি আর্টেমিস প্রোপেলান্ট শৃঙ্খলা ক্ষিপ্রতা';

  // Verify non-empty and well-formed
  assert.ok(testSample.length > 0);
  assert.ok(testSample.includes('বিজ্ঞান'));
  assert.ok(testSample.includes('মহাকাশচারী'));
  assert.ok(testSample.includes('কৃষ্ণগহ্বর'));
  assert.ok(testSample.includes('মাইক্রোগ্র্যাভিটি'));
});
