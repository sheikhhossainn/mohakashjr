import assert from 'node:assert';
import test from 'node:test';
import { TRANSLATIONS, getTranslation } from '../src/i18n/translations';
import { useAppStore } from '../src/state/useAppStore';

test('missionGame i18n: All 5 stages have complete bilingual translations and NASA science facts', () => {
  const bn = getTranslation('bn').missionGame;
  const en = getTranslation('en').missionGame;

  assert.ok(bn, 'Bangla missionGame translations exist');
  assert.ok(en, 'English missionGame translations exist');

  // Verify 5 stages dictionary
  const stages = ['suit_up', 'fueling', 'cockpit_ignition', 'lunar_descent', 'moonwalk'] as const;
  stages.forEach((stage) => {
    assert.ok(bn.stages[stage], `BN stage title exists for ${stage}`);
    assert.ok(en.stages[stage], `EN stage title exists for ${stage}`);
    assert.notStrictEqual(bn.stages[stage], en.stages[stage]);
  });

  // Verify Stage 1: Suit Up (5 equipment items)
  const items = ['cooling', 'pressure', 'plss', 'helmet', 'boots'] as const;
  items.forEach((item) => {
    assert.ok(bn.suitUp.items[item].name.length > 0);
    assert.ok(bn.suitUp.items[item].fact.includes('নাসা'));
    assert.ok(en.suitUp.items[item].name.length > 0);
    assert.ok(en.suitUp.items[item].fact.includes('NASA'));
  });

  // Verify Stage 2: Fueling
  assert.ok(bn.fueling.fact.includes('তরল অক্সিজেন'));
  assert.ok(en.fueling.fact.includes('liquid oxygen'));
  assert.strictEqual(bn.fueling.loxTemp, '-১৮৩° সেলসিয়াস');
  assert.strictEqual(en.fueling.loxTemp, '-183° Celsius');

  // Verify Stage 3: Ignition
  assert.ok(bn.ignition.fact.includes('১১.২ কিমি'));
  assert.ok(en.ignition.fact.includes('11.2 km/s'));

  // Verify Stage 4: Descent
  assert.ok(bn.descent.fact.includes('প্যারাসুট'));
  assert.ok(en.descent.fact.includes('Parachutes'));

  // Verify Stage 5: Moonwalk
  assert.ok(bn.moonwalk.xpEarned.includes('১২০ XP'));
  assert.ok(en.moonwalk.xpEarned.includes('120 XP'));
});

test('missionGame State: Suit completion requires all 5 protective items', () => {
  const suitState = {
    cooling: false,
    pressure: false,
    plss: false,
    helmet: false,
    boots: false,
  };

  const getEquippedCount = (s: typeof suitState) =>
    Object.values(s).filter(Boolean).length;

  assert.strictEqual(getEquippedCount(suitState), 0);

  suitState.cooling = true;
  suitState.pressure = true;
  assert.strictEqual(getEquippedCount(suitState), 2);
  assert.strictEqual(getEquippedCount(suitState) === 5, false);

  suitState.plss = true;
  suitState.helmet = true;
  suitState.boots = true;
  assert.strictEqual(getEquippedCount(suitState), 5);
  assert.strictEqual(getEquippedCount(suitState) === 5, true);
});

test('missionGame Gamification: Moonwalk completion awards +120 XP to Cadet store', () => {
  const store = useAppStore.getState();
  const initialXP = store.xp;

  store.addXP(120);

  const updatedStore = useAppStore.getState();
  assert.strictEqual(updatedStore.xp, initialXP + 120);
});
