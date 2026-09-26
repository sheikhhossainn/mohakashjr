import assert from 'node:assert';
import test from 'node:test';
import {
  LUNAR_REGIONS,
  CARGO_ITEMS,
  MAX_PAYLOAD_CAPACITY_KG,
  evaluateMoonLandingMission,
} from '../src/content/missionData';
import { useAppStore } from '../src/state/useAppStore';

test('Lunar Regions: All 3 regions exist with valid risk/reward stats', () => {
  assert.strictEqual(LUNAR_REGIONS.length, 3);

  const regionIds = LUNAR_REGIONS.map((r) => r.id);
  assert.ok(regionIds.includes('shackleton-crater'));
  assert.ok(regionIds.includes('mare-tranquillitatis'));
  assert.ok(regionIds.includes('oceanus-procellarum'));

  LUNAR_REGIONS.forEach((region) => {
    assert.ok(region.sunlightPower >= 0 && region.sunlightPower <= 100);
    assert.ok(region.waterIce >= 0 && region.waterIce <= 100);
    assert.ok(region.terrainRisk >= 0 && region.terrainRisk <= 100);
    assert.ok(region.scienceYield >= 0 && region.scienceYield <= 100);
    assert.ok(region.name_bn.length > 0);
    assert.ok(region.coordinates.length > 0);
  });
});

test('Cargo Items: Essential items and weight capacities are properly configured', () => {
  assert.strictEqual(MAX_PAYLOAD_CAPACITY_KG, 500);
  assert.ok(CARGO_ITEMS.length >= 8);

  const primaryOxygen = CARGO_ITEMS.find((c) => c.id === 'primary-oxygen');
  const foodWater = CARGO_ITEMS.find((c) => c.id === 'water-food-rations');

  assert.ok(primaryOxygen);
  assert.strictEqual(primaryOxygen?.is_essential, true);
  assert.strictEqual(primaryOxygen?.weight_kg, 140);

  assert.ok(foodWater);
  assert.strictEqual(foodWater?.is_essential, true);
  assert.strictEqual(foodWater?.weight_kg, 80);
});

test('evaluateMoonLandingMission: Overweight payload causes penalty and warning', () => {
  // Select items exceeding 500 kg:
  // 140 (primary-oxygen) + 70 (backup-oxygen) + 90 (solar) + 120 (rtg) + 80 (drill) + 50 (spectrometer) = 550 kg
  const heavyItems = [
    'primary-oxygen',
    'backup-oxygen',
    'solar-array',
    'rtg-nuclear-battery',
    'lunar-ice-drill',
    'mineral-spectrometer',
  ];

  const result = evaluateMoonLandingMission('mare-tranquillitatis', heavyItems);

  assert.strictEqual(result.isOverweight, true);
  assert.ok(result.totalWeight_kg > 500);
  assert.ok(result.totalScore <= 65);
  assert.ok(result.feedbackPoints_bn.some((p) => p.includes('অতিরিক্ত ওজন')));
});

test('evaluateMoonLandingMission: Missing primary oxygen causes critical failure', () => {
  // Only pack solar and drill, no oxygen
  const result = evaluateMoonLandingMission('mare-tranquillitatis', ['solar-array', 'lunar-ice-drill']);

  assert.strictEqual(result.hasEssentialOxygen, false);
  assert.strictEqual(result.status, 'critical_failure');
  assert.strictEqual(result.starRating, 1);
  assert.ok(result.verdictTitle_bn.includes('মিশন বিঘ্নিত'));
  assert.ok(result.feedbackPoints_bn.some((p) => p.includes('অক্সিজেন')));
});

test('evaluateMoonLandingMission: Shackleton Crater + RTG + Ice Drill yields optimal high score & 3 stars', () => {
  // Optimal balanced payload for dark crater:
  // Primary oxygen (140) + Food/Water (80) + RTG Nuclear Battery (120) + Ice Drill (80) + Medical Shield (50) = 470 kg (< 500 kg)
  const optimalShackletonGear = [
    'primary-oxygen',
    'water-food-rations',
    'rtg-nuclear-battery',
    'lunar-ice-drill',
    'radiation-medical-shield',
  ];

  const result = evaluateMoonLandingMission('shackleton-crater', optimalShackletonGear);

  assert.strictEqual(result.isOverweight, false);
  assert.strictEqual(result.totalWeight_kg, 470);
  assert.strictEqual(result.hasEssentialOxygen, true);
  assert.strictEqual(result.hasEssentialWaterFood, true);
  assert.ok(result.scienceScore >= 60); // Drill bonus in Shackleton
  assert.ok(result.powerLevel >= 60); // RTG in dark crater
  assert.ok(result.totalScore >= 85);
  assert.strictEqual(result.starRating, 3);
  assert.strictEqual(result.status, 'perfect');
  assert.strictEqual(result.earnedXP, 110);
  assert.ok(result.feedbackPoints_bn.some((p) => p.includes('শ্যাকলটনের বরফ')));
});

test('evaluateMoonLandingMission: Mare Tranquillitatis + Solar array synergy', () => {
  // Primary oxygen (140) + Food/Water (80) + Solar Array (90) + Mineral Spectrometer (50) = 360 kg
  const tranquilGear = [
    'primary-oxygen',
    'water-food-rations',
    'solar-array',
    'mineral-spectrometer',
  ];

  const result = evaluateMoonLandingMission('mare-tranquillitatis', tranquilGear);

  assert.strictEqual(result.isOverweight, false);
  assert.ok(result.totalWeight_kg <= 500);
  assert.ok(result.powerLevel >= 40);
  assert.ok(result.starRating >= 2);
  assert.ok(result.feedbackPoints_bn.some((p) => p.includes('শান্ত সাগরের')));
});

test('Mission XP crediting into useAppStore', () => {
  useAppStore.getState().resetProgress();
  const initialXP = useAppStore.getState().xp;
  assert.strictEqual(initialXP, 0);

  // Simulate mission success
  const missionResult = evaluateMoonLandingMission('shackleton-crater', [
    'primary-oxygen',
    'water-food-rations',
    'rtg-nuclear-battery',
    'lunar-ice-drill',
    'radiation-medical-shield',
  ]);

  useAppStore.getState().addXP(missionResult.earnedXP);

  const state = useAppStore.getState();
  assert.strictEqual(state.xp, 110);
  assert.strictEqual(state.rank, 'Cadet'); // Threshold for Astronaut is 201
});
