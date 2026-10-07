import test from 'node:test';
import assert from 'node:assert';
import {
  PLANETARY_MISSIONS,
  getPlanetaryMission,
  TaskType,
} from '../src/content/planetaryMissionsData';
import { detectCosmicTopic } from '../src/utils/cosmicTopics';
import { DestinationId } from '../src/content/spaceDestinations';

test('Planetary Missions: All 8 destinations have authentic NASA/ESA/Soviet 5-stage missions', () => {
  const allDestinations: DestinationId[] = [
    'moon',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
  ];

  for (const id of allDestinations) {
    const mission = getPlanetaryMission(id);
    assert.ok(mission, `Mission for ${id} should exist`);
    assert.strictEqual(mission.destinationId, id);

    // Agency & historical spacecraft metadata
    assert.ok(mission.missionName_bn.length > 0, `${id} missionName_bn must not be empty`);
    assert.ok(mission.missionName_en.length > 0, `${id} missionName_en must not be empty`);
    assert.ok(mission.craftName_bn.length > 0, `${id} craftName_bn must not be empty`);
    assert.ok(mission.craftName_en.length > 0, `${id} craftName_en must not be empty`);
    assert.ok(mission.agency.length > 0, `${id} agency must not be empty`);
    assert.ok(mission.historicYear.length > 0, `${id} historicYear must not be empty`);
    assert.ok(mission.landingZone_bn.length > 0, `${id} landingZone_bn must not be empty`);
    assert.ok(mission.overview_bn.length > 0, `${id} overview_bn must not be empty`);

    // Closest replication requirement: exactly 5 distinct engineering stages
    assert.strictEqual(mission.stages.length, 5, `${id} mission must have exactly 5 authentic stages`);

    mission.stages.forEach((stage, idx) => {
      assert.strictEqual(stage.order, idx + 1, `${id} stage order must match index + 1`);
      assert.ok(stage.title_bn.length > 0, `${id} stage ${idx} title_bn`);
      assert.ok(stage.title_en.length > 0, `${id} stage ${idx} title_en`);
      assert.ok(stage.subtitle_bn.length > 0, `${id} stage ${idx} subtitle_bn`);
      assert.ok(stage.historicEvent_bn.length > 0, `${id} stage ${idx} historicEvent_bn`);
      assert.ok(stage.historicEvent_en.length > 0, `${id} stage ${idx} historicEvent_en`);
      assert.ok(stage.nasaScienceFact_bn.length > 0, `${id} stage ${idx} nasaScienceFact_bn`);
      assert.ok(stage.nasaScienceFact_en.length > 0, `${id} stage ${idx} nasaScienceFact_en`);

      // Cockpit Telemetry
      assert.ok(stage.telemetry.altitude.length > 0, `${id} stage ${idx} altitude telemetry`);
      assert.ok(stage.telemetry.velocity.length > 0, `${id} stage ${idx} velocity telemetry`);
      assert.ok(stage.telemetry.temperature.length > 0, `${id} stage ${idx} temperature telemetry`);
      assert.ok(stage.telemetry.pressure.length > 0, `${id} stage ${idx} pressure telemetry`);

      // Interactive Task Definition
      assert.ok(stage.task, `${id} stage ${idx} must have an interactive task`);
      assert.ok(
        ['toggle_systems', 'thrust_burn', 'timed_release', 'sample_drill', 'camera_scan', 'rotor_spin'].includes(
          stage.task.type
        ),
        `${id} stage ${idx} task type '${stage.task.type}' must be valid TaskType`
      );
      assert.ok(stage.task.instruction_bn.length > 0, `${id} stage ${idx} task instruction_bn`);
      assert.ok(stage.task.actionButton_bn.length > 0, `${id} stage ${idx} task actionButton_bn`);
      assert.ok(stage.task.successMessage_bn.length > 0, `${id} stage ${idx} task successMessage_bn`);

      if (stage.task.type === 'toggle_systems') {
        assert.ok(
          Array.isArray(stage.task.requiredToggles) && stage.task.requiredToggles.length >= 2,
          `${id} toggle_systems task must specify at least 2 toggles`
        );
      }
    });
  }
});

test('CosmicTopicIllustration: Detects correct space topic from Bangla and English text', () => {
  // Moon
  assert.strictEqual(detectCosmicTopic('চাঁদের বুকে প্রথম পদক্ষেপ'), 'moon');
  assert.strictEqual(detectCosmicTopic('Lunar landing module descent'), 'moon');
  assert.strictEqual(detectCosmicTopic('চন্দ্রপৃষ্ঠে পদচিহ্ন'), 'moon');

  // Black hole
  assert.strictEqual(detectCosmicTopic('ব্ল্যাক হোল বা কৃষ্ণগহ্বর কী?'), 'blackhole');
  assert.strictEqual(detectCosmicTopic('Supermassive Blackhole event horizon'), 'blackhole');

  // Rocket
  assert.strictEqual(detectCosmicTopic('রকেটের অগ্নিকুণ্ড: মহাকাশে উড্ডয়ন'), 'rocket');
  assert.strictEqual(detectCosmicTopic('Rocket propulsion & escape velocity'), 'rocket');

  // ISS / Weightlessness
  assert.strictEqual(detectCosmicTopic('মহাকাশে ওজনহীনতা ও মহাকর্ষ'), 'iss');
  assert.strictEqual(detectCosmicTopic('International Space Station microgravity'), 'iss');

  // Spacesuit
  assert.strictEqual(detectCosmicTopic('মহাকাশচারীর জীবন্ত ঢাল: স্পেসস্যুট'), 'spacesuit');
  assert.strictEqual(detectCosmicTopic('Apollo spacesuit pressure layers'), 'spacesuit');

  // JWST / Telescope
  assert.strictEqual(detectCosmicTopic('জেমস ওয়েব মহাকাশ দূরবীন: সৃষ্টির প্রথম আলো'), 'jwst');
  assert.strictEqual(detectCosmicTopic('James Webb Space Telescope deep field'), 'jwst');

  // Mars
  assert.strictEqual(detectCosmicTopic('মঙ্গলের বুকে রোবট বিজ্ঞানী: কিউরিওসিটি ও পারসিভিয়ারেন্স'), 'mars');
  assert.strictEqual(detectCosmicTopic('Mars Perseverance Rover Jezero Crater'), 'mars');

  // Jupiter, Saturn, Venus, Mercury
  assert.strictEqual(detectCosmicTopic('বৃহস্পতি গ্রহের গ্রেট রেড স্পট'), 'jupiter');
  assert.strictEqual(detectCosmicTopic('শনি গ্রহের বরফ বলয় ও টাইটান'), 'saturn');
  assert.strictEqual(detectCosmicTopic('শুক্র গ্রহের অ্যাসিড মেঘ ও গ্রিনহাউস'), 'venus');
  assert.strictEqual(detectCosmicTopic('বুধ গ্রহের চরম তাপমাত্রা'), 'mercury');

  // Fallback
  assert.strictEqual(detectCosmicTopic('অজানা মহাজাগতিক রহস্য', 'earth'), 'earth');
  assert.strictEqual(detectCosmicTopic('', 'moon'), 'moon');
});
