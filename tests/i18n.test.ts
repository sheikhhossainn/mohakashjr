import { test } from 'node:test';
import assert from 'node:assert';
import { getTranslation, TRANSLATIONS, AppLanguage } from '../src/i18n/translations';
import { useAppStore, ARCHETYPES, RANK_THRESHOLDS } from '../src/state/useAppStore';
import { getStoredLanguage, setStoredLanguage } from '../src/services/authDatabase';

test('i18n: getTranslation returns accurate dictionary for Bangla and English', () => {
  const bn = getTranslation('bn');
  const en = getTranslation('en');

  // Navigation tabs
  assert.strictEqual(bn.tabs.dashboard, 'ড্যাশবোর্ড');
  assert.strictEqual(en.tabs.dashboard, 'Dashboard');
  assert.strictEqual(bn.tabs.lessons, 'পাঠশালা');
  assert.strictEqual(en.tabs.lessons, 'Academy');
  assert.strictEqual(bn.tabs.mission, 'চন্দ্রাভিযান');
  assert.strictEqual(en.tabs.mission, 'Moon Mission');
  assert.strictEqual(bn.tabs.profile, 'প্রোফাইল');
  assert.strictEqual(en.tabs.profile, 'Profile');

  // Common microcopy
  assert.strictEqual(bn.common.xp, 'XP');
  assert.strictEqual(en.common.xp, 'XP');
  assert.strictEqual(bn.common.guestBadge, 'অতিথি ক্যাডেট');
  assert.strictEqual(en.common.guestBadge, 'Guest Cadet');

  // Rotating facts
  assert.ok(bn.cosmicFacts.length >= 7);
  assert.ok(en.cosmicFacts.length >= 7);
  assert.notStrictEqual(bn.cosmicFacts[0], en.cosmicFacts[0]);

  // Lesson data mapping
  assert.strictEqual(bn.lessonsData['lesson-1'].title, 'চাঁদের বুকে প্রথম পদক্ষেপ');
  assert.strictEqual(en.lessonsData['lesson-1'].title, 'First Steps on the Moon');
});

test('i18n: Archetype & Rank definitions support both Bangla and English', () => {
  const pilot = ARCHETYPES.pilot;
  assert.strictEqual(pilot.title_bn, 'রকেট পাইলট ক্যাডেট');
  assert.strictEqual(pilot.title_en, 'Rocket Pilot Cadet');
  assert.ok(pilot.motto_bn.length > 0);
  assert.ok(pilot.motto_en.length > 0);

  const cadetRank = RANK_THRESHOLDS.Cadet;
  assert.strictEqual(cadetRank.label_bn, 'স্পেস ক্যাডেট');
  assert.strictEqual(cadetRank.label_en, 'Space Cadet');
});

test('i18n: useAppStore language toggle & database persistence', async () => {
  const store = useAppStore.getState();

  // Switch to English
  await store.setLanguage('en');
  assert.strictEqual(useAppStore.getState().language, 'en');

  // Verify persistence
  const persistedLang1 = await getStoredLanguage();
  assert.strictEqual(persistedLang1, 'en');

  // Switch back to Bangla
  await store.setLanguage('bn');
  assert.strictEqual(useAppStore.getState().language, 'bn');

  // Verify persistence
  const persistedLang2 = await getStoredLanguage();
  assert.strictEqual(persistedLang2, 'bn');
});
