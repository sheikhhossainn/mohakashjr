import test from 'node:test';
import assert from 'node:assert';
import {
  SPACE_DESTINATIONS,
  DestinationId,
  getDestinationById,
} from '../src/content/spaceDestinations';
import { getTranslation } from '../src/i18n/translations';

test('Planetary Dossiers: All 8 destinations have comprehensive scientific statistics', () => {
  assert.strictEqual(SPACE_DESTINATIONS.length, 8);

  const expectedIds: DestinationId[] = [
    'moon',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
  ];

  for (const id of expectedIds) {
    const d = getDestinationById(id);
    assert.strictEqual(d.id, id);

    // Names & Summaries
    assert.ok(d.name_bn.length > 0, `${id} should have name_bn`);
    assert.ok(d.name_en.length > 0, `${id} should have name_en`);
    assert.ok(d.tagline_bn.length > 0, `${id} should have tagline_bn`);
    assert.ok(d.tagline_en.length > 0, `${id} should have tagline_en`);

    // Gravity specs
    assert.ok(d.gravityMultiplier > 0, `${id} gravityMultiplier must be positive`);
    assert.ok(d.gravityExplanation_bn.length > 0, `${id} must have gravityExplanation_bn`);
    assert.ok(d.gravityExplanation_en.length > 0, `${id} must have gravityExplanation_en`);

    // Physics sanity checks
    if (id === 'moon') {
      assert.ok(Math.abs(d.gravityMultiplier - 0.166) < 0.01, 'Moon gravity should be ~1/6th of Earth');
    } else if (id === 'jupiter') {
      assert.ok(d.gravityMultiplier > 2.0, 'Jupiter gravity should be > 2x Earth');
    } else if (id === 'mars' || id === 'mercury') {
      assert.ok(Math.abs(d.gravityMultiplier - 0.38) < 0.02, `${id} gravity should be ~38% of Earth`);
    }

    // Planetary stats
    assert.ok(d.distance_bn.length > 0);
    assert.ok(d.dayLength_bn.length > 0);
    assert.ok(d.yearLength_bn.length > 0);
    assert.ok(d.temperatureLabel_bn.length > 0);
    assert.ok(d.diameterComparison_bn.length > 0);
    assert.ok(['scorching', 'extreme', 'freezing', 'mild'].includes(d.temperatureType));

    // Atmosphere survival info
    assert.strictEqual(d.atmosphere.canBreathe, false, 'No destination has free breathable air for humans without suit');
    assert.ok(d.atmosphere.composition_bn.length > 0);
    assert.ok(d.atmosphere.suitNeededReason_bn.length > 0);

    // Bangladeshi cultural analogy
    assert.ok(d.banglaAnalogy_bn.length > 15, `${id} must have relatable Bangla analogy`);
    assert.ok(d.banglaAnalogy_en.length > 15);

    // Famous exploration missions
    assert.ok(d.famousMissions.length >= 1, `${id} should have at least 1 famous exploration mission`);
    for (const m of d.famousMissions) {
      assert.ok(m.name.length > 0);
      assert.ok(m.agency.length > 0);
      assert.ok(m.year.length > 0);
      assert.ok(m.highlight_bn.length > 0);
      assert.ok(m.highlight_en.length > 0);
    }

    // Interactive Quick Quiz
    const quiz = d.quickQuiz;
    assert.ok(quiz.question_bn.length > 0);
    assert.ok(quiz.question_en.length > 0);
    assert.strictEqual(quiz.options_bn.length, 4, `${id} quiz should have 4 Bangla options`);
    assert.strictEqual(quiz.options_en.length, 4, `${id} quiz should have 4 English options`);
    assert.ok(quiz.correctIndex >= 0 && quiz.correctIndex < 4, `${id} quiz correctIndex must be 0..3`);
    assert.ok(quiz.explanation_bn.length > 0);
    assert.ok(quiz.explanation_en.length > 0);
  }
});

test('Planetary Dossiers i18n: Localization dictionary has full keys in Bangla and English', () => {
  const bn = getTranslation('bn').spaceHub;
  const en = getTranslation('en').spaceHub;

  const requiredKeys = [
    'title',
    'subtitle',
    'liveBadge',
    'comingSoon',
    'startMission',
    'backToHub',
    'exploreDossier',
    'viewDossier',
    'playMission',
    'dossierHeader',
    'weightLabTitle',
    'weightLabSub',
    'earthWeightLabel',
    'planetWeightLabel',
    'weightUnit',
    'telemetryTitle',
    'distanceFromSun',
    'dayLength',
    'yearLength',
    'avgTemp',
    'moons',
    'diameter',
    'analogyTitle',
    'atmosphereTitle',
    'suitRequired',
    'suitNote',
    'missionsTitle',
    'quizTitle',
    'correctAnswer',
    'tryAgain',
    'xpEarned',
    'launchMoonCta',
    'allPlanetsPill',
    'prevPlanet',
    'nextPlanet',
  ] as const;

  for (const key of requiredKeys) {
    assert.ok(bn[key] && bn[key].length > 0, `Missing bn translation for ${key}`);
    assert.ok(en[key] && en[key].length > 0, `Missing en translation for ${key}`);
  }
});
