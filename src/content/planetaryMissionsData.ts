/**
 * planetaryMissionsData.ts
 *
 * Authentic historical & flagship NASA, ESA, and Soviet planetary missions
 * for all destinations in the Solar System.
 * Every mission stage closely replicates the real engineering and science
 * of the historic spacecraft.
 */

import { DestinationId } from './spaceDestinations';

export interface MissionTelemetry {
  altitude: string;
  altitude_en: string;
  velocity: string;
  velocity_en: string;
  temperature: string;
  temperature_en: string;
  pressure: string;
  pressure_en: string;
}

export type TaskType =
  | 'toggle_systems'
  | 'thrust_burn'
  | 'timed_release'
  | 'sample_drill'
  | 'camera_scan'
  | 'rotor_spin';

export interface InteractiveTaskDef {
  type: TaskType;
  instruction_bn: string;
  instruction_en: string;
  actionButton_bn: string;
  actionButton_en: string;
  successMessage_bn: string;
  successMessage_en: string;
  requiredToggles?: { id: string; label_bn: string; label_en: string }[];
}

export interface PlanetaryMissionStage {
  id: string;
  order: number;
  stageNumber: string;
  title_bn: string;
  title_en: string;
  subtitle_bn: string;
  subtitle_en: string;
  historicEvent_bn: string;
  historicEvent_en: string;
  nasaScienceFact_bn: string;
  nasaScienceFact_en: string;
  telemetry: MissionTelemetry;
  task: InteractiveTaskDef;
}

export interface PlanetaryMission {
  destinationId: DestinationId;
  missionName_bn: string;
  missionName_en: string;
  craftName_bn: string;
  craftName_en: string;
  agency: string;
  historicYear: string;
  landingZone_bn: string;
  landingZone_en: string;
  badgeCode: string;
  accentColor: string;
  overview_bn: string;
  overview_en: string;
  stages: PlanetaryMissionStage[];
}

export const PLANETARY_MISSIONS: Record<DestinationId, PlanetaryMission> = {
  // ─── 1. MARS: NASA Mars 2020 Perseverance & Ingenuity ────────────────
  mars: {
    destinationId: 'mars',
    missionName_bn: 'মঙ্গল পারসিভিয়ারেন্স ও ইনজেনুইটি মিশন',
    missionName_en: 'Mars 2020: Perseverance & Ingenuity',
    craftName_bn: 'পারসিভিয়ারেন্স রোভার ও ইনজেনুইটি চপার',
    craftName_en: 'Perseverance Rover & Ingenuity Helicopter',
    agency: 'NASA / JPL',
    historicYear: '২০২০–২০২১',
    landingZone_bn: 'জেজেরো ক্রেটার (Jezero Crater)',
    landingZone_en: 'Jezero Crater',
    badgeCode: 'M2020-PERSEVERANCE',
    accentColor: '#EF4444',
    overview_bn:
      'মঙ্গলে প্রাচীন জীবাণুর অস্তিত্ব অনুসন্ধান, বাতাস থেকে অক্সিজেন তৈরির MOXIE প্রযুক্তি পরীক্ষা এবং অন্য গ্রহে প্রথম চালিত হেলিকপ্টার উড্ডয়ন।',
    overview_en:
      'Searching for ancient biosignatures, generating oxygen from CO2 with MOXIE, and executing the first powered atmospheric flight on another planet.',
    stages: [
      {
        id: 'mars-stage-1',
        order: 1,
        stageNumber: '০১',
        title_bn: 'রোভার পেলোড ও পাওয়ার অন',
        title_en: 'Payload Integration & Power On',
        subtitle_bn: 'আরটিজি পারমাণবিক ব্যাটারি ও মক্সি সক্রিয়করণ',
        subtitle_en: 'RTG Nuclear Battery & MOXIE Pre-Check',
        historicEvent_bn:
          'ফ্লোরিডার কেপ ক্যানাভেরাল থেকে অ্যাটলাস ৫ রকেটে উৎক্ষেপণের পূর্বে পারসিভিয়ারেন্সের প্লুটোনিয়াম-২৩৮ আরটিজি ব্যাটারি ও সেন্সর সক্রিয় করা হয়।',
        historicEvent_en:
          'Pre-launch verification of Perseverance RTG nuclear battery, mast cameras, and MOXIE oxygen generation system on Atlas V.',
        nasaScienceFact_bn:
          'মঙ্গলে সূর্যালোক দুর্বল ও ধূলিঝড়ে সোলার প্যানেল ঢেকে যায়, তাই রোভারটি প্লুটোনিয়ামের তেজস্ক্রিয় ক্ষয় থেকে পাওয়া তাপে ১১০ ওয়াট বিদ্যুৎ তৈরি করে!',
        nasaScienceFact_en:
          'Mars dust storms frequently cover solar panels; Perseverance relies on a Multi-Mission Radioisotope Thermoelectric Generator (MMRTG).',
        telemetry: {
          altitude: 'উৎক্ষেপণ প্যাড (০ কিমি)',
          altitude_en: 'Launch Pad (0 km)',
          velocity: '০ কিমি/ঘণ্টা',
          velocity_en: '0 km/h',
          temperature: '২৪°C (পৃথিবী)',
          temperature_en: '24°C (Earth)',
          pressure: '১.০ atm',
          pressure_en: '1.0 atm',
        },
        task: {
          type: 'toggle_systems',
          instruction_bn: 'রোভারের আরটিজি বিদ্যুৎ ব্যবস্থা, মক্সি অক্সিজেন সেল ও মাস্টক্যাম সেন্সর অন করো।',
          instruction_en: 'Activate MMRTG Nuclear Power, MOXIE O2 Cell, and Mastcam-Z instruments.',
          actionButton_bn: 'সিস্টেম ভেরিফাই করো',
          actionButton_en: 'Verify Systems',
          successMessage_bn: 'সব পেলোড সক্রিয়! রোভার ইন্টারপ্ল্যানেটারি ক্রুজের জন্য প্রস্তুত।',
          successMessage_en: 'All systems online! Rover prepped for interplanetary cruise.',
          requiredToggles: [
            { id: 'm1', label_bn: 'MMRTG নিউক্লিয়ার পাওয়ার', label_en: 'MMRTG Nuclear Power' },
            { id: 'm2', label_bn: 'MOXIE কার্বন ডাইঅক্সাইড কনভার্টার', label_en: 'MOXIE O2 Generator' },
            { id: 'm3', label_bn: 'ইনজেনুইটি বেলি ল্যাচ লক', label_en: 'Ingenuity Belly Latch' },
          ],
        },
      },
      {
        id: 'mars-stage-2',
        order: 2,
        stageNumber: '০২',
        title_bn: 'আন্তঃগ্রহীয় ক্রুজ ও গতিপথ সংশোধন',
        title_en: 'Interplanetary Cruise & TCM Burn',
        subtitle_bn: '৪৮ কোটি কিলোমিটার মহাশূন্য পাড়ি',
        subtitle_en: '480 Million km Hohmann Transfer Orbit',
        historicEvent_bn:
          'পৃথিবী ও মঙ্গলের মধ্যে প্রায় ৭ মাসব্যাপী আন্তঃগ্রহ যাত্রায় ক্ষুদ্র থ্রাস্টার ফায়ার করে গতিপথ নিখুঁতভাবে সমন্বয় করা হয়।',
        historicEvent_en:
          'During the 7-month cruise, Trajectory Correction Maneuvers (TCM) guided the craft precisely toward Mars atmosphere entry.',
        nasaScienceFact_bn:
          'মঙ্গলে পৌঁছাতে সোজা পথে যাওয়া যায় না! পৃথিবী ও মঙ্গলের সূর্যকে প্রদক্ষিণ করার গতির সাথে মিলিয়ে একটি বিশাল উপবৃত্তাকার আর্কে ভ্রমণ করতে হয়।',
        nasaScienceFact_en:
          'The spacecraft travels along a Hohmann transfer ellipse spanning nearly 480 million kilometers around the Sun.',
        telemetry: {
          altitude: 'মহাশূন্য (২.২ কোটি কিমি)',
          altitude_en: 'Deep Space (22M km)',
          velocity: '৩৯,৬০০ কিমি/ঘণ্টা',
          velocity_en: '39,600 km/h',
          temperature: '-১৫০°C',
          temperature_en: '-150°C',
          pressure: '০.০০ atm (ভ্যাকুয়াম)',
          pressure_en: '0.00 atm (Vacuum)',
        },
        task: {
          type: 'thrust_burn',
          instruction_bn: 'গতিপথ সমন্বয় করতে আরসিএস থ্রাস্টার বার্ন ফায়ার করো!',
          instruction_en: 'Execute Trajectory Correction Maneuver (TCM) thruster burst.',
          actionButton_bn: 'টিসিএম থ্রাস্টার বার্ন ফায়ার করো',
          actionButton_en: 'Fire TCM Thruster Burn',
          successMessage_bn: 'গতিপথ নিখুঁত! মহাকাশযান মঙ্গলের বায়ুমণ্ডল প্রবেশের পথে লক অন।',
          successMessage_en: 'Trajectory corrected! Entry trajectory aligned with Jezero Crater.',
        },
      },
      {
        id: 'mars-stage-3',
        order: 3,
        stageNumber: '০৩',
        title_bn: 'ভীষণ সাত মিনিট (Seven Minutes of Terror)',
        title_en: 'Atmospheric Entry & Supersonic Parachute',
        subtitle_bn: 'ঘণ্টায় ২০,০০০ কিমি গতিতে বায়ুমণ্ডল ভেদ',
        subtitle_en: 'Entry at 20,000 km/h & Mach 1.7 Parachute Deploy',
        historicEvent_bn:
          'মঙ্গলের পাতলা বায়ুমণ্ডলে ঢোকার পর তাপঢাল ১,৩০০°C উত্তপ্ত হয়। এরপর পৃথিবীর সবচেয়ে বড় সুপারসনিক প্যারাশুট সফলভাবে খোলে!',
        historicEvent_en:
          'Ablative heat shield endured 1,300°C friction before deploying the 21.5-meter supersonic parachute at Mach 1.7.',
        nasaScienceFact_bn:
          'সিগন্যাল মঙ্গলে পৌঁছাতে ১১ মিনিট সময় লাগে। তাই নাসা বিজ্ঞানীরা পৃথিবীতে বসে কোনো নিয়ন্ত্রণ করতে পারেন না; সম্পূর্ণ প্রক্রিয়া কম্পিউটার নিজেই চালায়!',
        nasaScienceFact_en:
          'With an 11-minute one-way light time communication delay, the entry, descent, and landing was 100% autonomous.',
        telemetry: {
          altitude: '১১ কিমি (বায়ুমণ্ডল)',
          altitude_en: '11 km (Martian Sky)',
          velocity: 'ম্যাক ১.৭ (১,৫১২ কিমি/ঘণ্টা)',
          velocity_en: 'Mach 1.7 (1,512 km/h)',
          temperature: '১,৩০০°C (হিটশিল্ড)',
          temperature_en: '1,300°C (Heatshield)',
          pressure: '০.০০৬ atm',
          pressure_en: '0.006 atm',
        },
        task: {
          type: 'timed_release',
          instruction_bn: 'ম্যাক ১.৭ গতিতে সুপারসনিক প্যারাশুট উন্মোচন ও হিটশিল্ড ড্রপ করো!',
          instruction_en: 'Trigger supersonic parachute deployment and heat shield ejection.',
          actionButton_bn: 'সুপারসনিক প্যারাশুট খোলো',
          actionButton_en: 'Deploy Supersonic Parachute',
          successMessage_bn: 'প্যারাশুট সফলভাবে উন্মোচিত! ল্যান্ডার গতি দ্রুত হ্রাস পাচ্ছে।',
          successMessage_en: 'Supersonic parachute deployed! Descent velocity plunging safely.',
        },
      },
      {
        id: 'mars-stage-4',
        order: 4,
        stageNumber: '০৪',
        title_bn: 'স্কাই ক্রেন রকেট নামানো ও টাচডাউন',
        title_en: 'Sky Crane Descent & Touchdown',
        subtitle_bn: 'জেজেরো ক্রেটারের মাটিতে রকেটের দড়িতে অবতরণ',
        subtitle_en: 'Rocket Hover & Nylon Tether Lowering',
        historicEvent_bn:
          'স্কাই ক্রেন রকেট ২১ মিটার উপরে শূন্যে ভেসে থাকে এবং শক্তিশালী নাইলনের রশিতে পারসিভিয়ারেন্সকে জেজেরো ক্রেটারের মাটিতে আস্তে করে নামিয়ে দেয়!',
        historicEvent_en:
          'The rocket-powered Sky Crane hovered 21 meters above Jezero Crater and lowered the 1,025 kg rover via nylon bridles.',
        nasaScienceFact_bn:
          'টাচডাউন নিশ্চিত হওয়ার সাথে সাথে কাটিং চার্জ বিস্ফোরিত হয়ে রশি কেটে দেয় এবং স্কাই ক্রেন রকেট নিরাপদ দূরত্বে উড়ে গিয়ে আছড়ে পড়ে।',
        nasaScienceFact_en:
          'Pyrotechnic blades instantly severed the bridles as rover wheels touched down, and Sky Crane flew away to crash safely.',
        telemetry: {
          altitude: '২১ মিটার → ০ মিটার',
          altitude_en: '21 m → 0 m',
          velocity: '২.৭ কিমি/ঘণ্টা (মৃদু স্পর্শ)',
          velocity_en: '2.7 km/h (Gentle Touch)',
          temperature: '-৬২°C',
          temperature_en: '-62°C',
          pressure: '০.০০৬ atm',
          pressure_en: '0.006 atm',
        },
        task: {
          type: 'thrust_burn',
          instruction_bn: 'স্কাই ক্রেন রেট্রো রকেট ফায়ার করে রোভারকে লাল মাটিতে নামাও!',
          instruction_en: 'Fire Sky Crane retro-rockets to hover and gently touch down on Mars.',
          actionButton_bn: 'স্কাই ক্রেন টাচডাউন শুরু করো',
          actionButton_en: 'Execute Sky Crane Touchdown',
          successMessage_bn: 'টাচডাউন নিশ্চিত! পারসিভিয়ারেন্স নিরাপদে জেজেরো ক্রেটারের মাটিতে!',
          successMessage_en: 'Touchdown confirmed! Perseverance is safely on the surface of Mars!',
        },
      },
      {
        id: 'mars-stage-5',
        order: 5,
        stageNumber: '০৫',
        title_bn: 'ইনজেনুইটি প্রথম উড্ডয়ন ও ড্রিলিং',
        title_en: 'Ingenuity Historic Flight & Core Drill',
        subtitle_bn: 'অন্য গ্রহে প্রথম চালিত হেলিকপ্টার ফ্লাইট',
        subtitle_en: '2,400 RPM Twin Rotors & Rock Core Sample',
        historicEvent_bn:
          'মঙ্গলের পাতলা বাতাসে ইনজেনুইটির কার্বন-ফাইবার রোটর প্রতি মিনিটে ২,৪০০ বার ঘুরে প্রথম চালিত আকাশ উড্ডয়ন সম্পন্ন করে!',
        historicEvent_en:
          'Ingenuity executed humanity’s first powered, controlled aerodynamic flight on another world, spinning twin rotors at 2,400 RPM.',
        nasaScienceFact_bn:
          'মঙ্গলের বায়ুমণ্ডল পৃথিবীর তুলনায় মাত্র ১% ঘন! তাই সেখানে উড়তে হেলিকপ্টারকে পৃথিবীর চেয়ে ৫ গুণ বেশি দ্রুত পাখা ঘোরাতে হয়।',
        nasaScienceFact_en:
          'Mars air density is less than 1% of Earth; Ingenuity required ultralight carbon blades spinning at extreme speed.',
        telemetry: {
          altitude: '১০ মিটার (উড্ডয়ন)',
          altitude_en: '10 m (Hover Altitude)',
          velocity: '১৮ কিমি/ঘণ্টা (ফ্লাইট)',
          velocity_en: '18 km/h (Flight Speed)',
          temperature: '-৫৫°C',
          temperature_en: '-55°C',
          pressure: '০.০০৬ atm',
          pressure_en: '0.006 atm',
        },
        task: {
          type: 'rotor_spin',
          instruction_bn: 'ইনজেনুইটির রোটর ২,৪০০ আরপিএম গতিতে ঘোরো এবং লাল আকাশে উড্ডয়ন করো!',
          instruction_en: 'Spin Ingenuity dual rotors to 2,400 RPM and lift off into the Martian sky!',
          actionButton_bn: 'ইনজেনুইটি রোটর চালু করো',
          actionButton_en: 'Launch Ingenuity Helicopter',
          successMessage_bn: 'ঐতিহাসিক উড্ডয়ন সফল! +১২০ XP ও মঙ্গল অভিযাত্রী পদক অর্জিত!',
          successMessage_en: 'Historic flight achieved! +120 XP & Mars Pioneer Medal awarded!',
        },
      },
    ],
  },

  // ─── 2. VENUS: Soviet Venera 13 & NASA DAVINCI ────────────────────────
  venus: {
    destinationId: 'venus',
    missionName_bn: 'শুক্র ভেনেরা ও ডেভিঞ্চি অভিযান',
    missionName_en: 'Venus: Venera 13 & DAVINCI Descent',
    craftName_bn: 'ভেনেরা ল্যান্ডার ও টাইটানিয়াম প্রেসার সেল',
    craftName_en: 'Venera Lander & Titanium Descent Sphere',
    agency: 'Soviet Space Program / NASA',
    historicYear: '১৯৮২ / ২০২৯',
    landingZone_bn: 'ফোবি রেজিও আগ্নেয়গিরি সমভূমি (Phoebe Regio)',
    landingZone_en: 'Phoebe Regio Basalt Plains',
    badgeCode: 'VENUS-VENERA',
    accentColor: '#F59E0B',
    overview_bn:
      'শুক্রের ৯২ গুণ বায়ুমণ্ডলীয় চাপ, ৪৭০ ডিগ্রি উত্তপ্ত অ্যাসিড মেঘ ভেদ করে প্রথম রঙিন প্যানোরামা ছবি তোলা ও শিলা বিশ্লেষণ।',
    overview_en:
      'Penetrating 92 bar crushing pressure and sulfuric acid clouds to photograph Venusian volcanic basalt slabs before thermal cutoff.',
    stages: [
      {
        id: 'venus-stage-1',
        order: 1,
        stageNumber: '০১',
        title_bn: 'টাইটানিয়াম প্রেসার সেল সিলিং',
        title_en: 'Titanium Pressure Sphere Sealing',
        subtitle_bn: '৯২ বার চাপ ও ৪৭০°C তাপ মোকাবিলার প্রস্তুতি',
        subtitle_en: 'Double-Walled Titanium & Phase Change Cooling',
        historicEvent_bn:
          'শুক্রের পরিবেশ সীসা গলিয়ে ফেলার মতো উত্তপ্ত। ল্যান্ডারকে সুরক্ষার জন্য ডাবল টাইটানিয়াম গোলক ও বরফ-ঠান্ডা কুল্যান্টে সিল করা হয়।',
        historicEvent_en:
          'Sealing the spherical titanium descent module containing lithium nitrate phase-change heat sinks to endure Venus surface hell.',
        nasaScienceFact_bn:
          'শুক্রের মাটিতে বায়ুর চাপ পানির নিচে ১ কিলোমিটার গভীরের সমান! সেখানে কোনো সাধারণ মহাকাশযান কয়েক সেকেন্ডেই চ্যাপ্টা হয়ে যেত।',
        nasaScienceFact_en:
          'Venus surface atmospheric pressure is equivalent to 1,000 meters underwater on Earth (92 atmospheres).',
        telemetry: {
          altitude: 'কক্ষপথ (৩০০ কিমি)',
          altitude_en: 'Orbit (300 km)',
          velocity: '২৭,০০০ কিমি/ঘণ্টা',
          velocity_en: '27,000 km/h',
          temperature: '-২৫°C (মহাশূন্য)',
          temperature_en: '-25°C (Space)',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'toggle_systems',
          instruction_bn: 'টাইটানিয়াম প্রেসার ভালভ, লিকুইড ফেজ কুলার ও অ্যাকসিলরোমিটার লক করো।',
          instruction_en: 'Lock Titanium Pressure Valves, Phase Cooling, and Atmospheric Sensors.',
          actionButton_bn: 'প্রেসার সেল লক করো',
          actionButton_en: 'Lock Pressure Cell',
          successMessage_bn: 'প্রেসার সেল নিখুঁতভাবে সিলড! চরম চাপের বিরুদ্ধে সুরক্ষা প্রস্তুত।',
          successMessage_en: 'Titanium hull sealed! Ready to face Venusian extreme pressure.',
          requiredToggles: [
            { id: 'v1', label_bn: 'ডাবল টাইটানিয়াম শেল লক', label_en: 'Double Titanium Shell' },
            { id: 'v2', label_bn: 'লিথিয়াম নাইট্রেট কুল্যান্ট সার্কিট', label_en: 'Phase-Change Coolant' },
            { id: 'v3', label_bn: 'হাইড্রোলিক ক্যামেরা সিল', label_en: 'Hydraulic Camera Seal' },
          ],
        },
      },
      {
        id: 'venus-stage-2',
        order: 2,
        stageNumber: '০২',
        title_bn: 'সালফিউরিক অ্যাসিড মেঘ ভেদ',
        title_en: 'Sulfuric Acid Cloud Entry',
        subtitle_bn: 'ঘন হলুদ মেঘ ও সুপার-রোটেশন বাতাস',
        subtitle_en: 'Piercing Corrosive Acid Mist at 360 km/h',
        historicEvent_bn:
          'শুক্রের ৫০ থেকে ৭০ কিমি উচ্চতায় রয়েছে বিশুদ্ধ সালফিউরিক অ্যাসিডের মেঘ। এখানে বাতাস পুরো গ্রহকে মাত্র ৪ দিনে একবার পাক খায়!',
        historicEvent_en:
          'Descending through 20 kilometers of concentrated sulfuric acid droplet clouds propelled by 360 km/h super-rotating winds.',
        nasaScienceFact_bn:
          'শুক্রের অ্যাসিড মেঘের কারণে সূর্যের আলো মাটিতে খুব কম পৌঁছায়; কিন্তু গ্রিনহাউস গ্যাসের আটকে রাখা তাপে এটি সৌরজগতের সবচেয়ে উত্তপ্ত গ্রহ!',
        nasaScienceFact_en:
          'Runaway greenhouse effect traps heat beneath thick clouds, making Venus hotter than Mercury despite being further from the Sun.',
        telemetry: {
          altitude: '৬০ কিমি (অ্যাসিড মেঘ)',
          altitude_en: '60 km (Acid Cloud Deck)',
          velocity: '৭২০ কিমি/ঘণ্টা',
          velocity_en: '720 km/h',
          temperature: '৭৫°C',
          temperature_en: '75°C',
          pressure: '১.২ atm',
          pressure_en: '1.2 atm',
        },
        task: {
          type: 'timed_release',
          instruction_bn: 'অ্যাসিড প্রতিরোধী ড্রগ প্যারাশুট উন্মোচন করো এবং গ্যাস অ্যানালাইজার চালু করো!',
          instruction_en: 'Deploy acid-resistant drogue parachute and activate mass spectrometer.',
          actionButton_bn: 'প্যারাশুট উন্মোচন করো',
          actionButton_en: 'Deploy Drogue Parachute',
          successMessage_bn: 'অ্যাসিড মেঘস্তর সফলভাবে অতিক্রান্ত! বায়ুমণ্ডলের গ্যাস স্পেকট্রাম সংগৃহীত।',
          successMessage_en: 'Acid clouds traversed! Mass spectrometer analyzing noble gases.',
        },
      },
      {
        id: 'venus-stage-3',
        order: 3,
        stageNumber: '০৩',
        title_bn: 'অ্যারোডাইনামিক ড্র্যাগ ডিস্ক ফ্রিফল',
        title_en: 'Aerodynamic Drag Disc Gliding',
        subtitle_bn: 'প্যারাশুট ফেলে বাতাসেই ভেসে থাকা',
        subtitle_en: 'Jettisoning Chute in Superdense Air',
        historicEvent_bn:
          '৫০ কিমি নিচে শুক্রের বাতাস এতটাই ঘন যে ভেনেরা প্যারাশুট খুলে ফেলে এবং কেবল একটি চ্যাপ্টা গোলাকার মেটাল ডিস্কের সাহায্যে মসৃণভাবে ভেসে নামে!',
        historicEvent_en:
          'Jettisoning the parachute at 50 km altitude because dense carbon dioxide acted like liquid, stabilizing descent with just a metal disc.',
        nasaScienceFact_bn:
          'শুক্রের মাটির কাছাকাছি কার্বন ডাই অক্সাইড গ্যাস সাধারণ গ্যাস নয়, এটি সুপারক্রিটিক্যাল ফ্লুইড বা তরল-গ্যাসের এক অদ্ভুত রূপ ধারণ করে!',
        nasaScienceFact_en:
          'Near the surface, carbon dioxide reaches supercritical state—neither gas nor liquid, but with dense buoyant properties.',
        telemetry: {
          altitude: '২০ কিমি',
          altitude_en: '20 km',
          velocity: '৭২ কিমি/ঘণ্টা',
          velocity_en: '72 km/h',
          temperature: '৩২০°C',
          temperature_en: '320°C',
          pressure: '২২ atm',
          pressure_en: '22 atm',
        },
        task: {
          type: 'timed_release',
          instruction_bn: 'প্যারাশুট জেটিনেস করো এবং ড্র্যাগ ডিস্ক এয়ারব্রেকিং মোড সক্রিয় করো!',
          instruction_en: 'Jettison parachute and engage circular drag disc aerobraking.',
          actionButton_bn: 'প্যারাশুট বিচ্ছিন্ন করো',
          actionButton_en: 'Release Parachute',
          successMessage_bn: 'প্যারাশুট বিচ্ছিন্ন! ড্র্যাগ ডিস্কের সাহায্যে ল্যান্ডার স্থিতিশীল।',
          successMessage_en: 'Parachute jettisoned! Metal drag disc stabilizing heavy air descent.',
        },
      },
      {
        id: 'venus-stage-4',
        order: 4,
        stageNumber: '০৪',
        title_bn: 'ব্যাসল্ট সমভূমিতে ক্রাশ রিং টাচডাউন',
        title_en: 'Crush Ring Touchdown on Basalt',
        subtitle_bn: '৪৬৫ ডিগ্রি উত্তপ্ত পাথরে ল্যান্ডিং',
        subtitle_en: 'Landing Ring Impact Absorber in 465°C Heat',
        historicEvent_bn:
          'ল্যান্ডারের নিচের টরস রিংটি সজোরে মাটিতে আঘাতের ধাক্কা শোষণ করে। চারপাশের লাভা পাথর থেকে ঝাঁঝালো তাপ ও ধোঁয়া উঠতে থাকে।',
        historicEvent_en:
          'Toroidal landing ring absorbed impact on fractured volcanic basalt slabs in 465°C scorching heat.',
        nasaScienceFact_bn:
          'ভেনেরা ১৩-র মিশন ডিজাইন করা হয়েছিল মাত্র ৩২ মিনিটের জন্য, কিন্তু এই শক্তিশালী সোভিয়েত যানটি অবিশ্বাস্যভাবে ১২৭ মিনিট টিকে ছিল!',
        nasaScienceFact_en:
          'Designed to survive 32 minutes in crushing conditions, Venera 13 famously lasted 127 minutes, transmitting historic color telemetry.',
        telemetry: {
          altitude: '০ মিটার (পৃষ্ঠদেশ)',
          altitude_en: '0 m (Surface)',
          velocity: '২৭ কিমি/ঘণ্টা → ০',
          velocity_en: '27 km/h → 0',
          temperature: '৪৬৫°C (সীসা গলনাঙ্ক)',
          temperature_en: '465°C (Lead Melts)',
          pressure: '৮৯ atm',
          pressure_en: '89 atm',
        },
        task: {
          type: 'thrust_burn',
          instruction_bn: 'ক্রাশ রিং স্টেবিলাইজার লক করো এবং পৃষ্ঠদেশে অবস্থান নিশ্চিত করো!',
          instruction_en: 'Absorb touchdown shock on the crush ring and stabilize on basalt.',
          actionButton_bn: 'টাচডাউন নিশ্চিত করো',
          actionButton_en: 'Confirm Touchdown',
          successMessage_bn: 'টাচডাউন সফল! ল্যান্ডার শুক্রের নরকতুল্য মাটিতে দাঁড়িয়ে আছে।',
          successMessage_en: 'Touchdown successful! Lander firmly resting on Venusian bedrock.',
        },
      },
      {
        id: 'venus-stage-5',
        order: 5,
        stageNumber: '০৫',
        title_bn: 'রঙিন প্যানোরামা ছবি ও শিলা ড্রিল',
        title_en: 'Color Panorama & Soil Drill',
        subtitle_bn: 'ইতিহাসের প্রথম শুক্রের রঙিন ছবি প্রেরণ',
        subtitle_en: 'Transmitting First Color Views of Venus',
        historicEvent_bn:
          'ক্যামেরার লেন্স ক্যাপ ফেলে দিয়ে ভেনেরা ১৩ চারপাশের পাথুরে প্রান্তরের ১৪টি রঙিন ছবি এবং ড্রিল দিয়ে মাটির এক্স-রে বিশ্লেষণ সম্পন্ন করে।',
        historicEvent_en:
          'Spring-loaded lens cap ejected, transmitting the first 360° color panoramas and drilling volcanic soil for X-ray fluorescence analysis.',
        nasaScienceFact_bn:
          'শুক্রের আকাশে তাকালে সূর্যকে একটি ঝাপসা আলোর বিন্দুর মতো মনে হয়, আর পুরো আকাশটি দেখায় উজ্জ্বল কমলারঙা মেঘের এক জ্বলন্ত ছাউনি!',
        nasaScienceFact_en:
          'Due to atmospheric Rayleigh scattering and dense cloud cover, daylight on Venus is a dim, eerie orange glow.',
        telemetry: {
          altitude: 'পৃষ্ঠদেশ',
          altitude_en: 'Surface',
          velocity: '০',
          velocity_en: '0',
          temperature: '৪৬৭°C',
          temperature_en: '467°C',
        pressure: '৯২ atm',
          pressure_en: '92 atm',
        },
        task: {
          type: 'camera_scan',
          instruction_bn: 'লেন্স ক্যাপ মুক্ত করো এবং শুক্রের রঙিন প্যানোরামা পৃথিবীতে ট্রান্সমিট করো!',
          instruction_en: 'Eject lens cap and transmit historic 360° color panorama to Earth.',
          actionButton_bn: 'প্যানোরামা ডাটা পাঠাও',
          actionButton_en: 'Transmit Panorama Data',
          successMessage_bn: 'অবিশ্বাস্য সাফল্য! শুক্রের প্রথম রঙিন ছবি সংরক্ষিত! +১২০ XP অর্জিত!',
          successMessage_en: 'Historic milestone! First Venus color photos downlinked! +120 XP awarded!',
        },
      },
    ],
  },

  // ─── 3. MERCURY: NASA MESSENGER & ESA BepiColombo ─────────────────────
  mercury: {
    destinationId: 'mercury',
    missionName_bn: 'বুধ মেসেঞ্জার ও বেপিকলম্বো মিশন',
    missionName_en: 'Mercury: MESSENGER & BepiColombo',
    craftName_bn: 'মেসেঞ্জার অরবিটার ও সিরামিক সানশিল্ড',
    craftName_en: 'MESSENGER Orbiter & Sunshield',
    agency: 'NASA / ESA',
    historicYear: '২০০৪–২০১১',
    landingZone_bn: 'ক্যালোরিস বেসিন মেরু বরফ গহ্বর (Caloris Basin)',
    landingZone_en: 'Caloris Basin & Polar Shadowed Craters',
    badgeCode: 'MERCURY-MESSENGER',
    accentColor: '#94A3B8',
    overview_bn:
      'সূর্যের প্রচণ্ড উত্তাপ সহ্য করে ৬টি গ্র্যাভিটি স্লিং শট, ক্যালোরিস বেসিনের চির-অন্ধকার গহ্বরে লুকানো বরফ আবিষ্কার এবং পৃষ্ঠের বিশদ মানচিত্রায়ন।',
    overview_en:
      'Surviving 430°C solar radiation via 6 gravity assists to discover water ice in permanently shadowed polar craters.',
    stages: [
      {
        id: 'mercury-stage-1',
        order: 1,
        stageNumber: '০১',
        title_bn: 'সিরামিক সানশিল্ড ওরিয়েন্টেশন',
        title_en: 'Ceramic Sunshield Orientation',
        subtitle_bn: 'সূর্যের ১১ গুণ তীব্র বিকিরণ প্রতিরোধ',
        subtitle_en: 'Nextel Ceramic Sunshield vs 430°C Solar Heat',
        historicEvent_bn:
          'বুধ সূর্যের সবচেয়ে কাছে থাকায় সেখানে রোদের তেজ পৃথিবীর চেয়ে ১১ গুণ বেশি! সিরামিক কাপড়ের সানশিল্ড সবসময় সূর্যের দিকে মুখ করে রাখতে হয়।',
        historicEvent_en:
          'Aligning the Nextel ceramic fabric sunshield directly at the Sun, maintaining instruments at comfortable room temperature behind it.',
        nasaScienceFact_bn:
          'সানশিল্ডের সামনের অংশ ৪৩০°C উত্তপ্ত হলেও এর পেছনে ছায়ায় থাকা রোবটিক যন্ত্রপাতি মাত্র ২০°C তাপমাত্রায় সুরক্ষিত থাকে!',
        nasaScienceFact_en:
          'While the front ceramic sunshield reaches 450°C, scientific instruments shaded behind it stay at a gentle 20°C.',
        telemetry: {
          altitude: 'সূর্য থেকে ৪.৬ কোটি কিমি',
          altitude_en: '46M km from Sun',
          velocity: '১,৪০,০০০ কিমি/ঘণ্টা',
          velocity_en: '140,000 km/h',
          temperature: '৪৩০°C (সূর্যের দিক)',
          temperature_en: '430°C (Sun-Facing)',
          pressure: '০.০০ atm (ভ্যাকুয়াম)',
          pressure_en: '0.00 atm (Vacuum)',
        },
        task: {
          type: 'toggle_systems',
          instruction_bn: 'সিরামিক সানশিল্ড সোজা সূর্যের দিকে লক করো এবং পেছনের কুলিং রেডিয়েটর অন করো।',
          instruction_en: 'Align Ceramic Sunshield directly with Sun vector and open rear thermal radiators.',
          actionButton_bn: 'সানশিল্ড লক করো',
          actionButton_en: 'Lock Sunshield Vector',
          successMessage_bn: 'সানশিল্ড নিখুঁত! সৌরজগতের সবচেয়ে ভয়ংকর বিকিরণ থেকে মহাকাশযান সুরক্ষিত।',
          successMessage_en: 'Sunshield locked! Craft protected from blistering solar radiation.',
          requiredToggles: [
            { id: 'me1', label_bn: 'নেক্সটেল সিরামিক সানশিল্ড', label_en: 'Nextel Ceramic Sunshield' },
            { id: 'me2', label_bn: 'অপটিক্যাল সোলার রিফ্লেক্টর', label_en: 'Optical Solar Reflectors' },
            { id: 'me3', label_bn: 'রেডিয়েশন কুলিং প্যানেল', label_en: 'Radiation Cooling Panel' },
          ],
        },
      },
      {
        id: 'mercury-stage-2',
        order: 2,
        stageNumber: '০২',
        title_bn: '৬টি গ্র্যাভিটি অ্যাসিস্ট স্লিং শট',
        title_en: 'Gravity Assist Slingshot Maneuvers',
        subtitle_bn: 'পৃথিবী, শুক্র ও বুধের মহাকর্ষীয় ব্রেক',
        subtitle_en: '1 Earth, 2 Venus & 3 Mercury Flybys',
        historicEvent_bn:
          'সূর্যের শক্তিশালী টানে বুধের দিকে নামতে যে প্রচণ্ড বেগ সৃষ্টি হয়, তা কমানোর জন্য মহাকাশযানটি বিভিন্ন গ্রহকে প্রদক্ষিণ করে গতি কমায়।',
        historicEvent_en:
          'Using gravity of Earth, Venus twice, and Mercury three times to bleed off immense orbital energy without exhausting rocket propellant.',
        nasaScienceFact_bn:
          'বুধের কক্ষপথে ঢুকতে সোজা রকেটের জ্বালানি ব্যবহার করলে একটি সুবিশাল রকেট লাগত যা তৈরি করাই অসম্ভব ছিল; তাই গ্র্যাভিটি স্লিং শট ব্যবহার করা হয়!',
        nasaScienceFact_en:
          'Reaching Mercury requires more energy than reaching Pluto! Complex planetary flybys decelerated the craft efficiently.',
        telemetry: {
          altitude: 'শুক্র ও বুধ ফ্লাইবাই (২০০ কিমি)',
          altitude_en: 'Planetary Flyby (200 km)',
          velocity: 'গতি হ্রাস: ১৬ কিমি/সে → ৯ কিমি/সে',
          velocity_en: 'Deceleration: 16 km/s → 9 km/s',
          temperature: '৩২০°C',
          temperature_en: '320°C',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'thrust_burn',
          instruction_bn: 'ফ্লাইবাই আর্কে প্রবেশ করতে সঠিক মুহূর্তে বিপরীত থ্রাস্টার ফায়ার করো!',
          instruction_en: 'Execute retrograde braking burn during the Mercury gravity assist arc.',
          actionButton_bn: 'গ্র্যাভিটি স্লিং শট বার্ন ফায়ার করো',
          actionButton_en: 'Fire Gravity Assist Burn',
          successMessage_bn: 'স্লিং শট সফল! অতিরিক্ত গতি নিখুঁতভাবে অপসারিত।',
          successMessage_en: 'Gravity assist maneuver successful! Orbital velocity dampened.',
        },
      },
      {
        id: 'mercury-stage-3',
        order: 3,
        stageNumber: '০৩',
        title_bn: 'বুধের কক্ষপথ সন্নিবেশ (MOI)',
        title_en: 'Mercury Orbit Insertion (MOI)',
        subtitle_bn: 'প্রধান ইঞ্জিনের ১৫ মিনিটের সিদ্ধান্তমূলক বার্ন',
        subtitle_en: 'Main Engine 15-Minute Braking Burn',
        historicEvent_bn:
          '২০১১ সালের ১৮ মার্চ মেসেঞ্জার ইতিহাসের প্রথম মহাকাশযান হিসেবে বুধের অতি-উত্তপ্ত ডিম্বাকৃতির মেরু কক্ষপথে সফলভাবে প্রবেশ করে।',
        historicEvent_en:
          'MESSENGER’s LEROS main engine fired for nearly 15 minutes, becoming the first spacecraft ever to enter Mercury orbit.',
        nasaScienceFact_bn:
          'বুধের কোনো উল্লেখযোগ্য বায়ুমণ্ডল নেই, কেবল পরমাণু কণার এক পাতলা স্তর আছে যাকে "এক্সোস্ফিয়ার" (Exosphere) বলে।',
        nasaScienceFact_en:
          'Mercury has no atmosphere to buffer temperature; instead, an exosphere of sodium, helium, and potassium atoms drifts above the surface.',
        telemetry: {
          altitude: 'কক্ষপথ (২০০ কিমি)',
          altitude_en: 'Orbit (200 km)',
          velocity: '১২,০০০ কিমি/ঘণ্টা',
          velocity_en: '12,000 km/h',
          temperature: '২০০°C',
          temperature_en: '200°C',
          pressure: '১০⁻¹⁴ atm',
          pressure_en: '10⁻¹⁴ atm',
        },
        task: {
          type: 'thrust_burn',
          instruction_bn: 'প্রধান ইঞ্জিন ফায়ার করে বুধের স্থায়ী কক্ষপথে লক অন করো!',
          instruction_en: 'Fire LEROS main engine to achieve stable capture orbit around Mercury.',
          actionButton_bn: 'অরবিট ইনসার্শন বার্ন শুরু করো',
          actionButton_en: 'Execute MOI Burn',
          successMessage_bn: 'কক্ষপথ নিশ্চিত! মেসেঞ্জার বুধের চারদিকে ঘুরছে।',
          successMessage_en: 'Orbit confirmed! Spacecraft captured in stable Mercury polar orbit.',
        },
      },
      {
        id: 'mercury-stage-4',
        order: 4,
        stageNumber: '০৪',
        title_bn: 'মেরু গহ্বরে বরফ অনুসন্ধান ও ক্যালোরিস বেসিন',
        title_en: 'Polar Shadowed Ice Discovery',
        subtitle_bn: 'নিউক্লিয়ার নিউট্রন স্পেকট্রোমিটার স্ক্যান',
        subtitle_en: 'Neutron Spectrometer Scanning Hidden Ice',
        historicEvent_bn:
          'বুধের অক্ষ হেলে না থাকায় এর দুই মেরুর গভীর খাদে কোটি কোটি বছর ধরে সূর্যের আলো পড়েনি। সেখানে তীব্র ঠান্ডায় বরফ অক্ষত অবস্থায় পাওয়া যায়!',
        historicEvent_en:
          'Radar and neutron spectroscopy confirmed substantial water ice deposits sheltered in permanently shadowed polar craters.',
        nasaScienceFact_bn:
          'বুধ দিনের বেলা ৪৩০°C উত্তপ্ত হলেও রাতের বেলা এর তাপমাত্রা নেমে যায় মাইনাস ১৮০°C-এ! এটি সৌরজগতের সবচেয়ে চরম তাপমাত্রার বৈষম্য।',
        nasaScienceFact_en:
          'Mercury experiences the most dramatic swings in the solar system: 430°C by day, plunging to -180°C by night.',
        telemetry: {
          altitude: '১৫০ কিমি (মেরু ট্রানজিট)',
          altitude_en: '150 km (Polar Pass)',
          velocity: '১০,৫০০ কিমি/ঘণ্টা',
          velocity_en: '10,500 km/h',
          temperature: '-২০০°C (ছায়া গহ্বর)',
          temperature_en: '-200°C (Craters)',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'camera_scan',
          instruction_bn: 'নিউট্রন স্পেকট্রোমিটার ও লেজার অল্টিমিটার দিয়ে ছায়াচ্ছন্ন গহ্বরের বরফ স্ক্যান করো!',
          instruction_en: 'Activate Neutron Spectrometer & Laser Altimeter to detect water ice.',
          actionButton_bn: 'নিউট্রন স্ক্যান চালাও',
          actionButton_en: 'Execute Neutron Scan',
          successMessage_bn: 'চমকপ্রদ আবিষ্কার! সূর্যের সবচেয়ে কাছের গ্রহে কোটি টন বরফের উপস্থিতি নিশ্চিত!',
          successMessage_en: 'Groundbreaking finding! Pure water ice confirmed in Mercury craters!',
        },
      },
      {
        id: 'mercury-stage-5',
        order: 5,
        stageNumber: '০৫',
        title_bn: 'পৃষ্ঠদেশের ইমপ্যাক্ট ও চূড়ান্ত বিজ্ঞান রিপোর্ট',
        title_en: 'Surface Impact & Final Science Downlink',
        subtitle_bn: '৪,১৩৭ দিন সফল মিশনের সমাপ্তি',
        subtitle_en: 'Mission Finale & Full Global Map Downlink',
        historicEvent_bn:
          '২০১৫ সালে জ্বালানি শেষ হওয়ার পর মেসেঞ্জার বুধের মাটিতে ঘণ্টায় ১৪,০০০ কিমি গতিতে একটি নতুন খাদ তৈরি করে বীরোচিতভাবে আছড়ে পড়ে।',
        historicEvent_en:
          'After 4,137 orbits and 289,000 photos, MESSENGER impacted Mercury at 14,000 km/h, creating a new crater on the planet.',
        nasaScienceFact_bn:
          'মেসেঞ্জার বুধের পৃষ্ঠের শতভাগ রঙিন মানচিত্র তৈরি করেছে এবং দেখিয়েছে যে বুধের অভ্যন্তরে একটি বিশালাকার লোহার গলিত কোর রয়েছে!',
        nasaScienceFact_en:
          'MESSENGER revealed Mercury’s enormous iron core occupying over 85% of its planetary radius.',
        telemetry: {
          altitude: '০ কিমি (চূড়ান্ত স্পর্শ)',
          altitude_en: '0 km (Impact Zone)',
          velocity: '১৪,০৪০ কিমি/ঘণ্টা',
          velocity_en: '14,040 km/h',
          temperature: '৪৩০°C',
          temperature_en: '430°C',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'camera_scan',
          instruction_bn: 'চূড়ান্ত বৈজ্ঞানিক ডাটা ও গ্লোবাল ম্যাগনেটোমিটার মানচিত্র পৃথিবীতে পাঠিয়ে দাও!',
          instruction_en: 'Downlink complete 100% Mercury surface photographic archive to Deep Space Network.',
          actionButton_bn: 'চূড়ান্ত ডাটা প্রেরণ করো',
          actionButton_en: 'Downlink Final Archive',
          successMessage_bn: 'মিশন সম্পন্ন! বুধের রহস্য উন্মোচিত! +১২০ XP ও বুধ মেডেল অর্জিত!',
          successMessage_en: 'Mission accomplished! Mercury fully mapped! +120 XP & Mercury Medal awarded!',
        },
      },
    ],
  },

  // ─── 4. JUPITER: NASA Galileo, Juno & Europa Clipper ──────────────────
  jupiter: {
    destinationId: 'jupiter',
    missionName_bn: 'বৃহস্পতি গ্যালিলিও ও জুনো অভিযান',
    missionName_en: 'Jupiter: Galileo & Juno Exploration',
    craftName_bn: 'জুনো মহাকাশযান ও রেডিয়েশন ভল্ট',
    craftName_en: 'Juno Spacecraft & Titanium Radiation Vault',
    agency: 'NASA / JPL',
    historicYear: '১৯৯৫ / ২০১৬',
    landingZone_bn: 'গ্রেট রেড স্পট ও ইউরোপা সমুদ্র (Great Red Spot & Europa)',
    landingZone_en: 'Great Red Spot & Ocean Moon Europa',
    badgeCode: 'JUPITER-JUNO',
    accentColor: '#D97706',
    overview_bn:
      'সৌরজগতের বৃহত্তম গ্রহের প্রাণঘাতী রেডিয়েশন বেল্ট ভেদ করা, ১,৭০,০০০ কিমি/ঘণ্টা গতির চরম বায়ুমণ্ডলীয় প্রোব প্রবেশ এবং ইউরোপা বরফ চাঁদের সমুদ্র অন্বেষণ।',
    overview_en:
      'Braving deadly radiation belts with a titanium vault, releasing a 170,000 km/h atmospheric entry probe, and exploring Europa’s ocean.',
    stages: [
      {
        id: 'jup-stage-1',
        order: 1,
        stageNumber: '০১',
        title_bn: 'টাইটানিয়াম রেডিয়েশন ভল্ট সিলিং',
        title_en: 'Titanium Radiation Vault Sealing',
        subtitle_bn: 'বৃহস্পতির প্রাণঘাতী বিকিরণ বেল্ট সুরক্ষা',
        subtitle_en: '1 cm Solid Titanium Vault vs Deadly Mega-Rads',
        historicEvent_bn:
          'বৃহস্পতির চৌম্বক ক্ষেত্র পৃথিবীর চেয়ে ২০,০০০ গুণ শক্তিশালী! এর ইলেকট্রনিক্স রক্ষা করতে ১৮০ কেজি খাঁটি টাইটানিয়াম ভল্টের ভেতরে ক্যামেরা ও কম্পিউটার সিল করা হয়।',
        historicEvent_en:
          'Sealing Juno’s flight computer and sensitive electronics inside a 1-cm thick titanium vault to survive 100 million dental X-rays of radiation.',
        nasaScienceFact_bn:
          'বৃহস্পতির রেডিয়েশন এত তীব্র যে যেকোনো অরক্ষিত রোবট বা নভোচারী কয়েক মিনিটের মধ্যে নিঃশেষ হয়ে যাবে!',
        nasaScienceFact_en:
          'Jupiter’s radiation belt is the harshest in the solar system, driven by charged particles trapped in its mammoth magnetic dynamo.',
        telemetry: {
          altitude: 'অ্যাসটেরয়েড বেল্ট পার (৫.২ AU)',
          altitude_en: 'Past Asteroid Belt (5.2 AU)',
          velocity: '৭২,০০০ কিমি/ঘণ্টা',
          velocity_en: '72,000 km/h',
          temperature: '-১২০°C',
          temperature_en: '-120°C',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'toggle_systems',
          instruction_bn: 'টাইটানিয়াম রেডিয়েশন ভল্ট সিল করো এবং ম্যাগনেটোমিটার বুম উন্মোচন করো।',
          instruction_en: 'Seal Titanium Radiation Vault and deploy 4-meter magnetometer boom.',
          actionButton_bn: 'রেডিয়েশন ভল্ট সিল করো',
          actionButton_en: 'Seal Radiation Vault',
          successMessage_bn: 'ভল্ট সিল্ড! জুনো বৃহস্পতির দানবীয় চৌম্বকক্ষেত্রের ভেতর প্রবেশের জন্য প্রস্তুত।',
          successMessage_en: 'Vault secured! Craft armored against deadly radiation belts.',
          requiredToggles: [
            { id: 'j1', label_bn: 'টাইটানিয়াম শিল্ড ডোর লক', label_en: 'Titanium Shield Door' },
            { id: 'j2', label_bn: 'ম্যাগনেটোমিটার বুম ল্যাচ', label_en: 'Magnetometer Boom' },
            { id: 'j3', label_bn: 'মাইক্রোওয়েভ রেডিওমিটার কুলিং', label_en: 'Microwave Radiometer' },
          ],
        },
      },
      {
        id: 'jup-stage-2',
        order: 2,
        stageNumber: '০২',
        title_bn: 'বৃহস্পতির কক্ষপথ সন্নিবেশ (JOI Burn)',
        title_en: 'Jupiter Orbit Insertion (JOI)',
        subtitle_bn: '৩৫ মিনিটের ঐতিহাসিক রকেট ব্রেকিং',
        subtitle_en: '35-Minute Critical Engine Burn',
        historicEvent_bn:
          'বৃহস্পতির বিপুল মহাকর্ষ টানে তীব্র গতিতে ছুটে আসার পর মূল ইঞ্জিন ৩৫ মিনিট বিরতিহীনভাবে ফায়ার করে নিরাপদ মেরু কক্ষপথে ঢোকা হয়।',
        historicEvent_en:
          'Firing Leros-1b main engine for 35 minutes into the teeth of Jupiter’s gravity well to slip into stable orbit between radiation zones.',
        nasaScienceFact_bn:
          'বৃহস্পতির মহাকর্ষের কারণে জুনো মহাকাশযানটি ইতিহাসের অন্যতম দ্রুততম মানবনির্মিত যানে পরিণত হয়েছিল (ঘণ্টায় প্রায় ২,৬৫,০০০ কিমি)!',
        nasaScienceFact_en:
          'At perijove insertion, Juno reached a staggering speed of 265,000 km/h relative to the gas giant.',
        telemetry: {
          altitude: 'মেঘশীর্ষ থেকে ৪,২০০ কিমি',
          altitude_en: '4,200 km above Clouds',
          velocity: '২,০৯,০০০ কিমি/ঘণ্টা',
          velocity_en: '209,000 km/h',
          temperature: '-১১০°C',
          temperature_en: '-110°C',
          pressure: '০.১ atm',
          pressure_en: '0.1 atm',
        },
        task: {
          type: 'thrust_burn',
          instruction_bn: 'প্রধান ইঞ্জিন ৩৫ মিনিট ফায়ার করে মেরু কক্ষপথে প্রবেশ করো!',
          instruction_en: 'Execute full main engine retro-burn to capture into Jupiter polar orbit.',
          actionButton_bn: 'জেওআই মেইন ইঞ্জিন বার্ন করো',
          actionButton_en: 'Fire JOI Main Engine',
          successMessage_bn: 'অরবিট সন্নিবেশ নিখুঁত! জুনো গ্যাস দানবের কক্ষপথে প্রবেশ করেছে।',
          successMessage_en: 'Orbit insertion successful! Juno captured in Jupiter polar orbit.',
        },
      },
      {
        id: 'jup-stage-3',
        order: 3,
        stageNumber: '০৩',
        title_bn: 'বায়ুমণ্ডলীয় প্রোব প্রবেশ (১,৭০,০০০ কিমি/ঘণ্টা)',
        title_en: 'Galileo Atmospheric Entry (170,000 km/h)',
        subtitle_bn: 'ইতিহাসের চরমতম বায়ুমণ্ডলীয় প্রবেশ',
        subtitle_en: 'Carbon Phenolic Heat Shield vs 228 Gs & 15,000°C',
        historicEvent_bn:
          'নাসার গ্যালিলিও প্রোব ঘণ্টায় ১,৭০,০০০ কিমি গতিতে বৃহস্পতির বায়ুমণ্ডলে ঢোকে। তাপঢাল সূর্যের উপরিভাগের চেয়েও উত্তপ্ত (১৫,০০০°C) হয়ে উঠেছিল!',
        historicEvent_en:
          'The Galileo entry probe entered at 170,000 km/h, enduring 228 times Earth’s gravity and 15,000°C shock plasma.',
        nasaScienceFact_bn:
          'প্রোবটির ওজনের অর্ধেকই ছিল এর সুবিশাল কার্বন-ফেনোলিক তাপঢাল, যা প্রবেশের সময় পুড়ে ছাই হয়ে ল্যান্ডারকে সুরক্ষিত রাখে।',
        nasaScienceFact_en:
          'Nearly 50% of the Galileo probe’s mass was its ablative carbon-phenolic shield, which vaporized to protect the instruments.',
        telemetry: {
          altitude: 'বায়ুমণ্ডলীয় ড্রপ (১৫০ কিমি)',
          altitude_en: '150 km into Atmosphere',
          velocity: '১,৭০,০০০ কিমি/ঘণ্টা → ১,২০০ কিমি/ঘণ্টা',
          velocity_en: '170,000 → 1,200 km/h',
          temperature: '১৫,০০০°C (শক প্লাজমা)',
          temperature_en: '15,000°C (Shockwave)',
          pressure: '১.০ atm',
          pressure_en: '1.0 atm',
        },
        task: {
          type: 'timed_release',
          instruction_bn: '১৫,০০০°C তাপে ডেকিলারেশন শেষে প্যারাশুট উন্মোচন করো!',
          instruction_en: 'Deploy titanium parachute following peak deceleration burn.',
          actionButton_bn: 'প্যারাশুট উন্মোচন করো',
          actionButton_en: 'Deploy Parachute',
          successMessage_bn: 'প্যারাশুট উন্মোচিত! চরম গতি কাটিয়ে প্রোব বৃহস্পতির মেঘে ভেসে নামছে।',
          successMessage_en: 'Parachute deployed! Probe drifting through hydrogen-helium cloud layers.',
        },
      },
      {
        id: 'jup-stage-4',
        order: 4,
        stageNumber: '০৪',
        title_bn: 'গ্রেট রেড স্পট ও অ্যামোনিয়া মেঘের গভীরে',
        title_en: 'Descent into Great Red Spot & Storms',
        subtitle_bn: '৬০০ কিমি/ঘণ্টা বেগে বয়ে চলা শতাব্দীর ঝড়',
        subtitle_en: '600 km/h Winds & Giant Lightning Strikes',
        historicEvent_bn:
          'গ্রেট রেড স্পট হলো একটি দানবাকৃতির ঘূর্ণিঝড় যা অন্তত ৪০০ বছর ধরে চলছে এবং এর ভেতর পুরো পৃথিবীকে ঢুকিয়ে ফেলা যাবে!',
        historicEvent_en:
          'Sampling the Great Red Spot anticyclone, deep ammonia ice clouds, and titanic lightning bolts 1,000x stronger than on Earth.',
        nasaScienceFact_bn:
          'বৃহস্পতির গভীরে চাপ এতটাই বেড়ে যায় যে হাইড্রোজেন গ্যাস সংকুচিত হয়ে ধাতব তরল হাইড্রোজেনের (Metallic Hydrogen) সমুদ্র তৈরি করে!',
        nasaScienceFact_en:
          'Deep inside Jupiter, pressure forces hydrogen into a liquid metallic state that generates its colossal magnetic field.',
        telemetry: {
          altitude: '-১৫০ কিমি (মেঘের গভীরে)',
          altitude_en: '150 km below Clouds',
          velocity: '১৮০ কিমি/ঘণ্টা',
          velocity_en: '180 km/h',
          temperature: '১৫৩°C',
          temperature_en: '153°C',
          pressure: '২২ atm',
          pressure_en: '22 atm',
        },
        task: {
          type: 'camera_scan',
          instruction_bn: 'মাইক্রোওয়েভ রেডিওমিটার দিয়ে রেড স্পটের গভীর শিকড় ও পানির মেঘ পরিমাপ করো!',
          instruction_en: 'Use Microwave Radiometer to probe 300 km deep into the Great Red Spot roots.',
          actionButton_bn: 'ঝড়ের গভীরতা পরিমাপ করো',
          actionButton_en: 'Probe Storm Depths',
          successMessage_bn: 'অভূতপূর্ব ডেটা! রেড স্পট মেঘের ৩০০ কিলোমিটার গভীরে প্রোথিত!',
          successMessage_en: 'Data acquired! Great Red Spot roots confirmed plunging 300 km deep.',
        },
      },
      {
        id: 'jup-stage-5',
        order: 5,
        stageNumber: '০৫',
        title_bn: 'ইউরোপা বরফ চাঁদের সমুদ্র অন্বেষণ',
        title_en: 'Europa Ocean Moon Flyby & Science',
        subtitle_bn: 'বরফের নিচে লুকানো পৃথিবীর দ্বিগুণ পানি',
        subtitle_en: 'Subsurface Saline Ocean Discovery',
        historicEvent_bn:
          'বৃহস্পতির বরফে ঢাকা চাঁদ ইউরোপার পাশ দিয়ে উড়ে যাওয়ার সময় ম্যাগনেটোমিটার নিশ্চিত করে যে এর বরফের স্তরের নিচে একটি বিশালাকার লবণাক্ত সমুদ্র রয়েছে!',
        historicEvent_en:
          'Flying past ice moon Europa, magnetic sounding confirmed a global subsurface saltwater ocean containing 2x Earth’s water.',
        nasaScienceFact_bn:
          'বিজ্ঞানীরা মনে করেন ইউরোপার সমুদ্রের তলদেশে আগ্নেয়গিরির উষ্ণ পানির ভেন্ট থাকতে পারে, যেখানে জীবনের অস্তিত্ব থাকা পুরোপুরি সম্ভব!',
        nasaScienceFact_en:
          'Astrobiologists consider Europa’s warm seafloor hydrothermal vents one of the top candidates for alien microbial life.',
        telemetry: {
          altitude: 'ইউরোপা ফ্লাইবাই (৩৫ কিমি)',
          altitude_en: 'Europa Flyby (35 km)',
          velocity: '১৬,০০০ কিমি/ঘণ্টা',
          velocity_en: '16,000 km/h',
          temperature: '-১৭০°C (বরফ পৃষ্ঠ)',
          temperature_en: '-170°C (Ice Shell)',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'camera_scan',
          instruction_bn: 'আইস পেনিট্রেটিং রাডার ও ম্যাগনেটোমিটার দিয়ে ইউরোপার সমুদ্র স্তর স্ক্যান করো!',
          instruction_en: 'Fire Ice-Penetrating Radar to measure Europa’s ice crust and ocean depth.',
          actionButton_bn: 'সমুদ্র স্তর স্ক্যান করো',
          actionButton_en: 'Scan Subsurface Ocean',
          successMessage_bn: 'মহাজাগতিক সাফল্য! ইউরোপায় তরল সমুদ্র নিশ্চিত! +১২০ XP ও জুপিটার মেডেল অর্জিত!',
          successMessage_en: 'Epic discovery! Saltwater ocean confirmed on Europa! +120 XP & Jupiter Medal awarded!',
        },
      },
    ],
  },

  // ─── 5. SATURN: NASA/ESA Cassini-Huygens ──────────────────────────────
  saturn: {
    destinationId: 'saturn',
    missionName_bn: 'শনি ক্যাসিনি ও হাইগেনস অভিযান',
    missionName_en: 'Saturn: Cassini-Huygens Exploration',
    craftName_bn: 'ক্যাসিনি অরবিটার ও হাইগেনস ল্যান্ডার',
    craftName_en: 'Cassini Orbiter & Huygens Titan Probe',
    agency: 'NASA / ESA / ASI',
    historicYear: '১৯৯৭–২০০৫',
    landingZone_bn: 'টাইটান মিথেন হ্রদ ও এনসেলাডাস (Titan & Enceladus)',
    landingZone_en: 'Titan Methane Lake Shoreline & Enceladus Geysers',
    badgeCode: 'SATURN-CASSINI',
    accentColor: '#EAB308',
    overview_bn:
      'শনির বলয়ের ফাঁক দিয়ে অবিশ্বাস্য ড্রাইভ, টাইটানের ঘন কুয়াশা ভেদ করে তরল মিথেনের তীরে প্রথম অবতরণ এবং এনসেলাডাসের পানির ফোয়ারা বিশ্লেষণ।',
    overview_en:
      'Diving through ring plane gaps, descending into Titan’s orange nitrogen smog onto liquid methane shores, and tasting Enceladus ice geysers.',
    stages: [
      {
        id: 'sat-stage-1',
        order: 1,
        stageNumber: '০১',
        title_bn: 'শনির বলয় অতিক্রম ও অ্যান্টেনা ছাতা',
        title_en: 'Ring Plane Crossing & Antenna Shield',
        subtitle_bn: 'শনির এফ ও জি রিংয়ের ফাঁক দিয়ে ড্রাইভ',
        subtitle_en: '4-Meter High Gain Dish as Cosmic Umbrella',
        historicEvent_bn:
          'শনির বলয় কোটি কোটি বরফখণ্ড ও ধূলিকণায় গঠিত। বলয় পার হওয়ার সময় ক্যাসিনির ৪ মিটার চওড়া মূল অ্যান্টেনাটি সামনের দিকে ঢাল হিসেবে ব্যবহার করা হয়।',
        historicEvent_en:
          'Using Cassini’s 4-meter high-gain antenna as a physical shield while punching through gaps in Saturn’s ring plane at 100,000 km/h.',
        nasaScienceFact_bn:
          'শনির বলয় প্রায় ২,৮২,০০০ কিলোমিটার প্রশস্ত, কিন্তু অবাক করা বিষয় হলো এর পুরুত্ব মাত্র ১০ থেকে ৩০ মিটার (একটি তিনতলা বাড়ির সমান)!',
        nasaScienceFact_en:
          'Saturn’s rings span 282,000 kilometers across, yet are only 10 to 30 meters thick—paper-thin on a cosmic scale.',
        telemetry: {
          altitude: 'রিং প্লেইন (বলয় থেকে ২,০০০ কিমি)',
          altitude_en: 'Ring Gap (2,000 km)',
          velocity: '৯৮,০০০ কিমি/ঘণ্টা',
          velocity_en: '98,000 km/h',
          temperature: '-১৮০°C',
          temperature_en: '-180°C',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'toggle_systems',
          instruction_bn: 'হাই-গেইন অ্যান্টেনা সোজা ধূলিঝড়ের দিকে ঘুরিয়ে শিল্ড মোডে লক করো।',
          instruction_en: 'Orient High-Gain Antenna into velocity vector to shield against ring dust impacts.',
          actionButton_bn: 'অ্যান্টেনা শিল্ড লক করো',
          actionButton_en: 'Lock Antenna Shield',
          successMessage_bn: 'বলয় সফলভাবে অতিক্রান্ত! ক্যাসিনি নিরাপদে শনির প্রধান কক্ষপথে।',
          successMessage_en: 'Ring plane cleared safely! Antenna absorbed micro-dust impacts.',
          requiredToggles: [
            { id: 's1', label_bn: 'অ্যান্টেনা শিল্ড ভেক্টর লক', label_en: 'Antenna Shield Vector' },
            { id: 's2', label_bn: 'ডাস্ট অ্যানালাইজার কাউন্টার', label_en: 'Dust Analyzer Counter' },
            { id: 's3', label_bn: 'হাইগেনস প্রোব ইন্টারফেস রিলিজ', label_en: 'Huygens Release Latch' },
          ],
        },
      },
      {
        id: 'sat-stage-2',
        order: 2,
        stageNumber: '০২',
        title_bn: 'হাইগেনস প্রোব স্পিন রিলিজ',
        title_en: 'Huygens Probe Spin & Separation',
        subtitle_bn: 'টাইটানের উদ্দেশ্যে স্প্রিং-চালিত ঘূর্ণন বিচ্ছিন্নতা',
        subtitle_en: 'Spin-Stabilized Release toward Giant Moon Titan',
        historicEvent_bn:
          'ইউরোপীয় মহাকাশ সংস্থার (ESA) হাইগেনস প্রোবটি প্রতি মিনিটে ৭ বার ঘুরে স্প্রিংয়ের ধাক্কায় ক্যাসিনি থেকে বিচ্ছিন্ন হয়ে টাইটানের দিকে উড়ে যায়।',
        historicEvent_en:
          'Spring mechanisms separated the Huygens probe at 7 RPM, putting it on a 21-day ballistic coast toward moon Titan.',
        nasaScienceFact_bn:
          'টাইটান হলো সৌরজগতের একমাত্র উপগ্রহ যার একটি ঘন বায়ুমণ্ডল রয়েছে, যা প্রধানত নাইট্রোজেন ও মিথেন গ্যাসে তৈরি।',
        nasaScienceFact_en:
          'Titan is the only moon in the solar system with a substantial atmosphere—1.5 times denser than Earth’s atmosphere!',
        telemetry: {
          altitude: 'টাইটানের পথে (১২ লক্ষ কিমি)',
          altitude_en: 'Coast to Titan (1.2M km)',
          velocity: '২১,০০০ কিমি/ঘণ্টা',
          velocity_en: '21,000 km/h',
          temperature: '-১৮৫°C',
          temperature_en: '-185°C',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'timed_release',
          instruction_bn: 'বিচ্ছিন্নকরণ স্প্রিং ফায়ার করে হাইগেনসকে ৭ আরপিএম ঘুর্ণনে রিলিজ করো!',
          instruction_en: 'Fire pyrotechnic spring latches to spin-release Huygens probe toward Titan.',
          actionButton_bn: 'হাইগেনস প্রোব রিলিজ করো',
          actionButton_en: 'Release Huygens Probe',
          successMessage_bn: 'বিচ্ছিন্নতা নিখুঁত! হাইগেনস টাইটানের ঘন বায়ুমণ্ডলের দিকে ছুটছে।',
          successMessage_en: 'Separation complete! Huygens coasting stably on course to Titan.',
        },
      },
      {
        id: 'sat-stage-3',
        order: 3,
        stageNumber: '০৩',
        title_bn: 'টাইটানের কমলা মিথেন ধোঁয়ায় প্যারাশুট ড্রপ',
        title_en: 'Titan Methane Smog Parachute Descent',
        subtitle_bn: 'কমলা নাইট্রোজেন কুয়াশায় ২ ঘণ্টা ১৫ মিনিট অবতরণ',
        subtitle_en: 'Descending through Orange Smog and Methane Rain',
        historicEvent_bn:
          'হাইগেনস প্রোবটি টাইটানের ঘন কুয়াশা ভেদ করে নামে। সেখানে তরল মিথেনের নদী, খাঁড়ি ও সাগরের অসাধারণ ছবি ধরা পড়ে।',
        historicEvent_en:
          'Decelerating through orange hydrocarbon smog, Huygens photographed drainage networks carved by liquid methane rainfall.',
        nasaScienceFact_bn:
          'টাইটানে পানির কোনো বৃষ্টি হয় না! প্রচণ্ড ঠান্ডায় (-১৮০°C) সেখানে পানি জমে পাথরের মতো শক্ত হয়ে থাকে, আর আকাশ থেকে তরল মিথেনের বৃষ্টি ঝরে!',
        nasaScienceFact_en:
          'Titan has a hydrological cycle like Earth, but with liquid methane and ethane instead of water.',
        telemetry: {
          altitude: '৪০ কিমি (টাইটান আকাশ)',
          altitude_en: '40 km above Titan',
          velocity: '৯২ কিমি/ঘণ্টা',
          velocity_en: '92 km/h',
          temperature: '-১৭৫°C',
          temperature_en: '-175°C',
          pressure: '১.১ atm',
          pressure_en: '1.1 atm',
        },
        task: {
          type: 'camera_scan',
          instruction_bn: 'ডিসেন্ট ইমেজার দিয়ে কুয়াশার নিচে মিথেন নদী ও বালিয়াড়ির ছবি স্ক্যান করো!',
          instruction_en: 'Activate Descent Imager / Spectral Radiometer to map river valleys.',
          actionButton_bn: 'ক্যামেরা স্ক্যান শুরু করো',
          actionButton_en: 'Scan Terrain Features',
          successMessage_bn: 'অবিশ্বাস্য ছবি সংগৃহীত! টাইটানের বুকে স্পষ্ট নদীর মতো খাঁড়ি দৃশ্যমান!',
          successMessage_en: 'Stunning images downlinked! Dendritic river channels clearly visible!',
        },
      },
      {
        id: 'sat-stage-4',
        order: 4,
        stageNumber: '০৪',
        title_bn: 'হাইড্রোকার্বন বালুতীরে প্রথম অবতরণ',
        title_en: 'Touchdown on Methane Sand Shore',
        subtitle_bn: 'বাইরের সৌরজগতের প্রথম নরম অবতরণ',
        subtitle_en: 'First Landing in the Outer Solar System',
        historicEvent_bn:
          '২০০৫ সালের ১৪ জানুয়ারি হাইগেনস ইতিহাসে প্রথম যান হিসেবে বাইরের সৌরজগতের দূরবর্তী কোনো উপগ্রহের মাটিতে নিরাপদে পা রাখে!',
        historicEvent_en:
          'On Jan 14, 2005, Huygens became the first man-made probe to touch down in the outer solar system, landing on damp hydrocarbon gravel.',
        nasaScienceFact_bn:
          'হাইগেনসের সেন্সর জানায় যে টাইটানের মাটি ভেজা ভিজা বালুর মতো ছিল, আর পৃষ্ঠে ছড়িয়ে ছিল জমে যাওয়া পানির বরফের গোল গোল নুড়ি পাথর!',
        nasaScienceFact_en:
          'Acoustic sensors recorded the surface had the consistency of wet sand or clay, studded with rounded pebbles of rock-hard water ice.',
        telemetry: {
          altitude: '০ মিটার (পৃষ্ঠদেশ)',
          altitude_en: '0 m (Surface)',
          velocity: '১৫ কিমি/ঘণ্টা → ০',
          velocity_en: '15 km/h → 0',
          temperature: '-১৮০°C',
          temperature_en: '-180°C',
          pressure: '১.৫ atm (পৃথিবীর চেয়ে বেশি)',
          pressure_en: '1.5 atm (> Earth)',
        },
        task: {
          type: 'sample_drill',
          instruction_bn: 'পৃষ্ঠদেশের সারফেস সায়েন্স প্যাকেজ দিয়ে মাটির কঠোরতা ও মিথেন বাষ্প পরিমাপ করো!',
          instruction_en: 'Deploy Surface Science Package penetrometer to analyze soil hardness.',
          actionButton_bn: 'মাটি বিশ্লেষণ করো',
          actionButton_en: 'Analyze Surface Soil',
          successMessage_bn: 'ঐতিহাসিক মুহূর্ত! হাইগেনস টাইটানের বরফ নুড়িতে নিরাপদে বিশ্রাম নিচ্ছে।',
          successMessage_en: 'Historic milestone! Huygens safely resting amidst water-ice pebbles.',
        },
      },
      {
        id: 'sat-stage-5',
        order: 5,
        stageNumber: '০৫',
        title_bn: 'এনসেলাডাসের বরফ ফোয়ারার ভেতর ডাইভ',
        title_en: 'Enceladus Geyser Plume Flyby',
        subtitle_bn: 'বরফের ফাটল দিয়ে মহাশূন্যে ছোড়া লবণাক্ত জলীয় বাষ্প',
        subtitle_en: 'Sampling Cryovolcanic Plumes for Organic Molecules',
        historicEvent_bn:
          'ক্যাসিনি শনির ক্ষুদ্র চাঁদ এনসেলাডাসের মাত্র ৪৮ কিমি উপর দিয়ে ডাইভ দেয় এবং এর দক্ষিণ মেরুর ফাটল থেকে বের হওয়া পানির ফোয়ারার উপাদান চেখে দেখে!',
        historicEvent_en:
          'Cassini plunged directly through Enceladus’s cryovolcanic geyser plumes at 30,000 km/h, sampling ocean water venting into space.',
        nasaScienceFact_bn:
          'ফোয়ারার বিশ্লেষণে নাসা নিশ্চিত করে যে এনসেলাডাসের বরফের নিচে লুকিয়ে থাকা সমুদ্রে লবণ, জৈব কার্বন ও জটিল হাইড্রোকার্বন রয়েছে!',
        nasaScienceFact_en:
          'Mass spectrometers confirmed simple and complex organic macromolecules, methane, and salts originating from a global subsurface ocean.',
        telemetry: {
          altitude: 'এনসেলাডাস ফোয়ারা (৪৮ কিমি)',
          altitude_en: 'Plume Flyby (48 km)',
          velocity: '৩০,০০০ কিমি/ঘণ্টা',
          velocity_en: '30,000 km/h',
          temperature: '-১৯৮°C',
          temperature_en: '-198°C',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'camera_scan',
          instruction_bn: 'ক্যাসিনির কসমিক ডাস্ট অ্যানালাইজার দিয়ে ফোয়ারার পানির কণা সংগ্রহ ও বিশ্লেষণ করো!',
          instruction_en: 'Activate Cosmic Dust Analyzer & Ion Neutral Mass Spectrometer during plume pass.',
          actionButton_bn: 'ফোয়ারার নমুনা সংগ্রহ করো',
          actionButton_en: 'Sample Geyser Plume',
          successMessage_bn: 'যুগান্তকারী প্রমাণ! এনসেলাডাসে বাসযোগ্য সমুদ্রের অণু আবিষ্কৃত! +১২০ XP অর্জিত!',
          successMessage_en: 'Breakthrough discovery! Organics confirmed in alien ocean! +120 XP awarded!',
        },
      },
    ],
  },

  // ─── 6. URANUS: NASA Voyager 2 & Uranus Orbiter Flagship ──────────────
  uranus: {
    destinationId: 'uranus',
    missionName_bn: 'ইউরেনাস ভয়েজার ২ ও বরফ দানব মিশন',
    missionName_en: 'Uranus: Voyager 2 & Ice Giant Orbiter',
    craftName_bn: 'ভয়েজার ২ ও আরটিজি পারমাণবিক দূরপাল্লার যান',
    craftName_en: 'Voyager 2 Deep Space Explorer',
    agency: 'NASA',
    historicYear: '১৯৮৬ / ২০৩১',
    landingZone_bn: 'মিরান্ডা চাঁদের ভেরোনা রুপিজ খাদ (Miranda Verona Rupes)',
    landingZone_en: 'Miranda 20-km Cliff Verona Rupes & Tilted Magnetosphere',
    badgeCode: 'URANUS-VOYAGER',
    accentColor: '#38BDF8',
    overview_bn:
      'সূর্য থেকে ৩০০ কোটি কিমি দূরে যেখানে আলো ৪০০ গুণ ক্ষীণ, সেখানে কাত হয়ে ঘোরা ইউরেনাসের বলয়, ২০ কিমি উঁচু মিরান্ডার খাঁদ ও নীল মিথেন বায়ুমণ্ডল অন্বেষণ।',
    overview_en:
      'Voyaging 3 billion km into deep freeze to explore Uranus’s 98° sideways tilt, faint rings, and Miranda’s 20-km vertical cliff.',
    stages: [
      {
        id: 'ura-stage-1',
        order: 1,
        stageNumber: '০১',
        title_bn: 'আরটিজি পারমাণবিক পাওয়ার গ্রিড টিউনিং',
        title_en: 'RTG Nuclear Deep Space Calibration',
        subtitle_bn: 'সূর্য থেকে ৩০০ কোটি কিমি দূরে সৌরবিদ্যুৎ অকেজো',
        subtitle_en: 'Nuclear Decay Powers 3 Billion km Voyage',
        historicEvent_bn:
          'ইউরেনাসে সূর্যের আলো পৃথিবীর চেয়ে ৪০০ গুণ দুর্বল, তাই সোলার প্যানেল কাজ করে না। ভয়েজারের প্লুটোনিয়াম আরটিজি জেনারেটর চালু রাখা অপরিহার্য।',
        historicEvent_en:
          'Calibrating Voyager’s Radioisotope Thermoelectric Generators (RTG) as solar intensity drops 400x below Earth levels.',
        nasaScienceFact_bn:
          'ইউরেনাস হলো সৌরজগতের সবচেয়ে শীতলতম গ্রহ; এর বায়ুমণ্ডলের সর্বনিম্ন তাপমাত্রা মাইনাস ২২৪ ডিগ্রি সেলসিয়াসে (-২২৪°C) নেমে যায়!',
        nasaScienceFact_en:
          'Uranus holds the record for the lowest planetary temperature measured in the solar system: a frigid -224°C (49 K).',
        telemetry: {
          altitude: 'সূর্য থেকে ২৯০ কোটি কিমি',
          altitude_en: '2.9 Billion km from Sun',
          velocity: '৬২,০০০ কিমি/ঘণ্টা',
          velocity_en: '62,000 km/h',
          temperature: '-২২০°C',
          temperature_en: '-220°C',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'toggle_systems',
          instruction_bn: 'পারমাণবিক আরটিজি পাওয়ার বাস ও ডিপ স্পেস রেডিও অ্যান্টেনা টিউন করো।',
          instruction_en: 'Tune RTG Nuclear Power Bus and align 3.7-meter High Gain dish to Earth.',
          actionButton_bn: 'নিউক্লিয়ার বাস সক্রিয় করো',
          actionButton_en: 'Activate Nuclear Bus',
          successMessage_bn: 'পাওয়ার বাস স্থিতিশীল! দূর মহাকাশের হিমশীতল শূন্যতায় মহাকাশযান সম্পূর্ণ সচল।',
          successMessage_en: 'Nuclear power grid balanced! Spacecraft fully powered in deep freeze.',
          requiredToggles: [
            { id: 'u1', label_bn: 'প্লুটোনিয়াম আরটিজি বাস ১', label_en: 'Plutonium RTG Bus 1' },
            { id: 'u2', label_bn: 'আল্ট্রাভায়োলেট স্পেকট্রোমিটার হিটার', label_en: 'UV Spectrometer Heater' },
            { id: 'u3', label_bn: '৩.৭ মিটার হাই গেইন ডিশ', label_en: '3.7m Earth Communications Dish' },
          ],
        },
      },
      {
        id: 'ura-stage-2',
        order: 2,
        stageNumber: '০২',
        title_bn: '৯৮ ডিগ্রি কাত অক্ষ ও ম্যাগনেটোস্ফিয়ার ভেদ',
        title_en: '98° Sideways Tilt & Corkscrew Magnetosphere',
        subtitle_bn: 'কাত হয়ে সূর্যকে প্রদক্ষিণ করা অনন্য গ্রহ',
        subtitle_en: 'Tilted Magnetic Field Corkscrewing through Space',
        historicEvent_bn:
          'ইউরেনাস তার কক্ষপথে প্রায় ৯৮ ডিগ্রি কাত হয়ে গড়িয়ে গড়িয়ে ঘোরে। এর চৌম্বক অক্ষ ভৌগোলিক অক্ষ থেকে ৬০ ডিগ্রি কোণে হেলে আছে!',
        historicEvent_en:
          'Voyager 2 discovered Uranus spins completely on its side (98° tilt) with an offset magnetic field tilted 59° from its rotational axis.',
        nasaScienceFact_bn:
          'এই অদ্ভুত কাত হওয়ার কারণে ইউরেনাসের প্রতিটি মেরু টানা ৪২ বছর সূর্যের আলো পায় এবং পরবর্তী ৪২ বছর ঘুটঘুটে অন্ধকারে থাকে!',
        nasaScienceFact_en:
          'Because of its extreme tilt, each pole experiences 42 years of continuous sunlight followed by 42 years of total darkness.',
        telemetry: {
          altitude: 'ম্যাগনেটোস্ফিয়ার বাউন্ডারি (৫ লক্ষ কিমি)',
          altitude_en: 'Magnetopause (500,000 km)',
          velocity: '৬৪,০০০ কিমি/ঘণ্টা',
          velocity_en: '64,000 km/h',
          temperature: '-২১৬°C',
          temperature_en: '-216°C',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'camera_scan',
          instruction_bn: 'ম্যাগনেটোমিটার দিয়ে পেঁচানো চৌম্বকক্ষেত্র স্ক্যান করো!',
          instruction_en: 'Operate Magnetometer to map Uranus’s corkscrew twisted field lines.',
          actionButton_bn: 'চৌম্বকক্ষেত্র স্ক্যান করো',
          actionButton_en: 'Scan Magnetosphere',
          successMessage_bn: 'চৌম্বকীয় মানচিত্র সফল! ইউরেনাসের অদ্ভুত কাত বলরেখা নিশ্চিত।',
          successMessage_en: 'Field lines mapped! Asymmetric offset magnetic poles verified.',
        },
      },
      {
        id: 'ura-stage-3',
        order: 3,
        stageNumber: '০৩',
        title_bn: 'টারকোয়েজ মিথেন বায়ুমণ্ডলে প্রোব প্রবেশ',
        title_en: 'Turquoise Atmosphere Entry Simulation',
        subtitle_bn: 'নীল মিথেন গ্যাসের হালকা কুয়াশা স্তর',
        subtitle_en: 'Methane Absorption Creating Celestial Cyan Glow',
        historicEvent_bn:
          'ভয়েজার ২ নিশ্চিত করে যে ইউরেনাসের শান্ত নীল রঙের কারণ এর বায়ুমণ্ডলে থাকা মিথেন গ্যাস, যা সূর্যের লাল আলো শোষণ করে নীল আলো প্রতিফলিত করে।',
        historicEvent_en:
          'Atmospheric soundings revealed atmospheric methane absorbs red wavelengths, bathing Uranus in its signature pale cyan glow.',
        nasaScienceFact_bn:
          'ইউরেনাসের শান্ত চেহারার নিচে রয়েছে হাইড্রোজেন, হিলিয়াম এবং মিথেন বরফের এক বিশালাকার ঘূর্ণায়মান সমুদ্র যাকে "আইস জায়ান্ট" বলা হয়।',
        nasaScienceFact_en:
          'Unlike Jupiter and Saturn, Uranus is an Ice Giant—its mantle consists of a dense, hot slush of water, ammonia, and methane ices.',
        telemetry: {
          altitude: 'মেঘশীর্ষ (৮১,৪০০ কিমি)',
          altitude_en: '81,400 km above Clouds',
          velocity: '৬২,১০০ কিমি/ঘণ্টা',
          velocity_en: '62,100 km/h',
          temperature: '-২২৪°C',
          temperature_en: '-224°C',
          pressure: '১.০ atm',
          pressure_en: '1.0 atm',
        },
        task: {
          type: 'timed_release',
          instruction_bn: 'স্পেকট্রোমিটার দিয়ে মিথেন ও হাইড্রোজেন গ্যাসের অনুপাত বিশ্লেষণ করো!',
          instruction_en: 'Calibrate Infrared Spectrometer to analyze atmospheric composition.',
          actionButton_bn: 'গ্যাস স্পেকট্রাম বিশ্লেষণ করো',
          actionButton_en: 'Analyze Gas Spectrum',
          successMessage_bn: 'তথ্য সংগৃহীত! ৮৩% হাইড্রোজেন, ১৫% হিলিয়াম ও ২% মিথেন চিহ্নিত।',
          successMessage_en: 'Spectrometry complete! 83% Hydrogen, 15% Helium, 2.3% Methane confirmed.',
        },
      },
      {
        id: 'ura-stage-4',
        order: 4,
        stageNumber: '০৪',
        title_bn: 'মিরান্ডা চাঁদের ২০ কিমি খাঁদ ভেরোনা রুপিজ',
        title_en: 'Miranda Moon & Verona Rupes 20-km Cliff',
        subtitle_bn: 'সৌরজগতের সবচেয়ে উঁচু খাঁদের গা ঘেঁষে ফ্লাইবাই',
        subtitle_en: 'Tallest Known Vertical Cliff in the Solar System',
        historicEvent_bn:
          'ভয়েজার ২ ইউরেনাসের ভাঙা-চোরা চাঁদ মিরান্ডার মাত্র ২৯,০০০ কিমি দূর দিয়ে যায়। সেখানে ২০ কিমি উঁচু খাড়া পাহাড়ের প্রাচীর "ভেরোনা রুপিজ" ধরা পড়ে!',
        historicEvent_en:
          'Flying within 29,000 km of Miranda, revealing Verona Rupes—a vertical 20-kilometer sheer ice scarp, the tallest cliff in the solar system.',
        nasaScienceFact_bn:
          'ভেরোনা রুপিজের উপর থেকে কেউ লাফ দিলে দুর্বল মাধ্যাকর্ষণের কারণে নিচে পড়তে পুরো ১২ মিনিট সময় লাগবে!',
        nasaScienceFact_en:
          'If you jumped off Verona Rupes, with Miranda’s microgravity (0.008 g) it would take 12 minutes to reach the bottom!',
        telemetry: {
          altitude: 'মিরান্ডা ফ্লাইবাই (২৯,০০০ কিমি)',
          altitude_en: '29,000 km from Miranda',
          velocity: '৬৩,০০০ কিমি/ঘণ্টা',
          velocity_en: '63,000 km/h',
          temperature: '-২১২°C',
          temperature_en: '-212°C',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'camera_scan',
          instruction_bn: 'ক্যামেরা প্ল্যাটফর্ম মিরান্ডার খাঁদে তাক করে বিশদ ভৌগোলিক ছবি তোলো!',
          instruction_en: 'Slew scan platform toward Verona Rupes to capture high-res fracture ridges.',
          actionButton_bn: 'মিরান্ডার ছবি তোলো',
          actionButton_en: 'Photograph Miranda Cliffs',
          successMessage_bn: 'অসাধারণ রেজোলিউশন! ২০ কিমি উঁচু ভেরোনা রুপিজ বরফ প্রাচীর স্পষ্টভাবে ফ্রেমবন্দী!',
          successMessage_en: 'Breathtaking imagery! 20-km vertical ice cliff Verona Rupes captured!',
        },
      },
      {
        id: 'ura-stage-5',
        order: 5,
        stageNumber: '০৫',
        title_bn: '১১টি বলয় আবিষ্কার ও ডিপ স্পেস রেডিও লিংক',
        title_en: '11 Ring System Discovery & Radio Downlink',
        subtitle_bn: 'আলোর গতিতে সংকেত আসতে ২ ঘণ্টা ৪৫ মিনিট সময়',
        subtitle_en: 'Transmitting Historic Data at 2h 45m Light Speed Delay',
        historicEvent_bn:
          'ভয়েজার ২ ইউরেনাসের চারপাশের ১১টি গাঢ় রঙের বরফ বলয় ও ১০টি নতুন উপগ্রহ আবিষ্কার করে এই ঐতিহাসিক ডাটা পৃথিবীতে পাঠায়।',
        historicEvent_en:
          'Voyager 2 discovered 11 narrow, charcoal-dark rings and 10 new moons, downlinking telemetry across 3 billion kilometers of space.',
        nasaScienceFact_bn:
          'ইউরেনাসের বলয়গুলো শনির বলয়ের মতো চকচকে নয়, বরং কয়লার মতো কালো মহাজাগতিক বিকিরণে পোড়া জৈব যৌগে তৈরি!',
        nasaScienceFact_en:
          'Uranus’s rings are dark as charcoal, likely formed from radiation-processed organic compounds mixed with water ice.',
        telemetry: {
          altitude: 'নেপচুনের পথে ক্রুজ',
          altitude_en: 'En Route to Neptune',
          velocity: '৬১,০০০ কিমি/ঘণ্টা',
          velocity_en: '61,000 km/h',
          temperature: '-২২২°C',
          temperature_en: '-222°C',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'camera_scan',
          instruction_bn: 'নাসার ডিপ স্পেস নেটওয়ার্কে ইউরেনাস গ্যালারির পূর্ণ আর্কাইভ প্রেরণ করো!',
          instruction_en: 'Downlink full Uranus exploration archive to NASA Deep Space Network antennas.',
          actionButton_bn: 'ডিপ স্পেস ডাটা পাঠাও',
          actionButton_en: 'Transmit Full Archive',
          successMessage_bn: 'অসাধারণ কৃতিত্ব! ইউরেনাস অভিযান সম্পন্ন! +১২০ XP ও ইউরেনাস পদক অর্জিত!',
          successMessage_en: 'Mission accomplished! First close-up of Uranus complete! +120 XP awarded!',
        },
      },
    ],
  },

  // ─── 7. NEPTUNE: NASA Voyager 2 & Neptune Odyssey ─────────────────────
  neptune: {
    destinationId: 'neptune',
    missionName_bn: 'নেপচুন ভয়েজার ২ ও ট্রাইটন অভিযান',
    missionName_en: 'Neptune: Voyager 2 & Triton Odyssey',
    craftName_bn: 'ভয়েজার ২ ও সীমান্ত অভিযাত্রী প্রোব',
    craftName_en: 'Voyager 2 & Outer Frontier Probe',
    agency: 'NASA',
    historicYear: '১৯৮৯ / ২০৩৩',
    landingZone_bn: 'ট্রাইটন নাইট্রোজেন ক্রায়োভলক্যানো (Triton Cryogeysers)',
    landingZone_en: 'Great Dark Spot & Triton Active Nitrogen Cryogeysers',
    badgeCode: 'NEPTUNE-VOYAGER',
    accentColor: '#3B82F6',
    overview_bn:
      'সৌরজগতের শেষ সীমানায় ঘণ্টায় ২,১০০ কিমি বেগের সুপারসনিক বাতাস, হীরক বৃষ্টির স্তর এবং উল্টো দিকে ঘোরা ট্রাইটনের বরফ আগ্নেয়গিরির ৮ কিমি উঁচু ফোয়ারা।',
    overview_en:
      'Voyaging 4.5 billion km to witness 2,100 km/h supersonic winds, diamond rain stratums, and Triton’s active nitrogen cryogeysers.',
    stages: [
      {
        id: 'nep-stage-1',
        order: 1,
        stageNumber: '০১',
        title_bn: 'সৌরজগতের শেষ প্রান্তের দীর্ঘ যাত্রা',
        title_en: 'Voyage to the Solar System Frontier',
        subtitle_bn: '৪৫০ কোটি কিলোমিটার দূরবর্তী নীল গোলক',
        subtitle_en: '4.5 Billion km from Earth • 4-Hour Light Delay',
        historicEvent_bn:
          'ভয়েজার ২ পৃথিবী থেকে সাড়ে চারশো কোটি কিলোমিটার দূরে সৌরজগতের অষ্টম ও সবচেয়ে দূরের প্রধান গ্রহ নেপচুনে পৌঁছায়। রেডিও সিগন্যাল পৌঁছাতেই লাগে ৪ ঘণ্টার বেশি!',
        historicEvent_en:
          'Voyager 2 traveled 12 years across 4.5 billion kilometers, arriving at the outermost frontier where radio messages took over 4 hours at light speed.',
        nasaScienceFact_bn:
          'নেপচুন সূর্য থেকে এত দূরে যে এটি ১৬৫ বছরে একবার সূর্যকে প্রদক্ষিণ করে! ১৮৪৬ সালে আবিষ্কারের পর ২০১১ সালে এটি প্রথমবার একটি পূর্ণ বর্ষপূর্তি সম্পন্ন করে।',
        nasaScienceFact_en:
          'Neptune orbits the Sun once every 165 Earth years; it completed its first full orbit since discovery in 2011.',
        telemetry: {
          altitude: 'সূর্য থেকে ৪৫০ কোটি কিমি',
          altitude_en: '4.5 Billion km from Sun',
          velocity: '৬৩,০০০ কিমি/ঘণ্টা',
          velocity_en: '63,000 km/h',
          temperature: '-২১৮°C',
          temperature_en: '-218°C',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'toggle_systems',
          instruction_bn: '৪ ঘণ্টার অটোনোমাস ফ্লাইট কম্পিউটার অন করো এবং আল্ট্রাভায়োলেট সেন্সর সক্রিয় করো।',
          instruction_en: 'Engage 4-hour autonomous flight computer and calibrate UV spectrometer.',
          actionButton_bn: 'সীমান্ত কম্পিউটার প্রস্তুত করো',
          actionButton_en: 'Arm Frontier Systems',
          successMessage_bn: 'সিস্টেম সক্রিয়! স্বয়ংক্রিয় রোবটিক ফ্লাইট নেপচুনের প্রবেশদ্বারে।',
          successMessage_en: 'Frontier systems locked! Autonomous navigation engaged at Neptune.',
          requiredToggles: [
            { id: 'n1', label_bn: '৪-আওয়ার অটোনোমাস ফ্লাইট কোড', label_en: '4-Hour Autonomous Flight' },
            { id: 'n2', label_bn: 'ডিপ স্পেস নেভিগেশন স্টার ট্র্যাকার', label_en: 'Canopus Star Tracker' },
            { id: 'n3', label_bn: 'লং-এক্সপোজার ক্যামেরা স্টেবিলাইজার', label_en: 'Long-Exposure Stabilizer' },
          ],
        },
      },
      {
        id: 'nep-stage-2',
        order: 2,
        stageNumber: '০২',
        title_bn: 'গ্রেট ডার্ক স্পট ও ২,১০০ কিমি/ঘণ্টা বাতাস',
        title_en: 'Great Dark Spot & Supersonic 2,100 km/h Winds',
        subtitle_bn: 'সৌরজগতের সবচেয়ে দ্রুতগতির দানবীয় ঝড়',
        subtitle_en: 'Fastest Winds in the Solar System at Mach 1.7',
        historicEvent_bn:
          'নেপচুনের বায়ুমণ্ডলে ভয়েজার ২ একটি বিশালাকার ঝড় আবিষ্কার করে যার নাম "গ্রেট ডার্ক স্পট"। সেখানে বাতাস প্রতি ঘণ্টায় ২,১০০ কিমি (শব্দের চেয়ে দ্রুত!) গতিতে বয়!',
        historicEvent_en:
          'Discovered the Great Dark Spot—an Earth-sized storm with winds exceeding 2,100 km/h, the fastest ever clocked in the solar system.',
        nasaScienceFact_bn:
          'সূর্য থেকে সবচেয়ে দূরে থাকা সত্ত্বেও এত প্রচণ্ড বাতাসের কারণ হলো এর বায়ুমণ্ডলে ঘর্ষণের অভাব এবং এর নিজস্ব অভ্যন্তরীণ তাপ নির্গমন।',
        nasaScienceFact_en:
          'Lacking solid friction and driven by internal heat radiated from its core, Neptune generates astonishing supersonic atmospheric jets.',
        telemetry: {
          altitude: 'মেঘশীর্ষ থেকে ৪,৯৫০ কিমি',
          altitude_en: '4,950 km above North Pole',
          velocity: '৯৮,০০০ কিমি/ঘণ্টা',
          velocity_en: '98,000 km/h',
          temperature: '-২১৪°C',
          temperature_en: '-214°C',
          pressure: '১.০ atm',
          pressure_en: '1.0 atm',
        },
        task: {
          type: 'camera_scan',
          instruction_bn: 'লং-এক্সপোজার ক্যামেরা দিয়ে ঝড়ের সাদা মিথেন সিরাস মেঘগুলো স্ক্যান করো!',
          instruction_en: 'Capture narrow-angle imagery of high-altitude white methane cirrus cloud streaks.',
          actionButton_bn: 'ঝড়ের চিত্রগ্রহণ করো',
          actionButton_en: 'Photograph Supersonic Storms',
          successMessage_bn: 'ঝড়ের চিত্র ফ্রেমবন্দী! শব্দের চেয়ে দ্রুত বাতাসের মেঘের গতিবেগ পরিমাপকৃত।',
          successMessage_en: 'Imagery locked! Supersonic wind velocity confirmed at 2,100 km/h.',
        },
      },
      {
        id: 'nep-stage-3',
        order: 3,
        stageNumber: '০৩',
        title_bn: 'গভীর স্তরে হীরক বৃষ্টি (Diamond Rain)',
        title_en: 'Atmospheric Diamond Rain Sounding',
        subtitle_bn: 'চরম চাপে মিথেন ভেঙে হীরক বৃষ্টিপাত',
        subtitle_en: 'Extreme Pressure Compresses Carbon into Diamonds',
        historicEvent_bn:
          'বিজ্ঞানীরা রেডিও তথ্যে প্রকাশ করেন যে নেপচুনের গভীর স্তরে তীব্র চাপ ও তাপে মিথেন গ্যাস ভেঙে কার্বন তৈরি হয়, যা খাঁটি হীরার মতো ঝরে পড়ে!',
        historicEvent_en:
          'Radio occultation confirmed that thousands of kilometers down, extreme pressure breaks methane into carbon crystals that rain down like diamonds.',
        nasaScienceFact_bn:
          'নেপচুনের অভ্যন্তরীণ স্তরে তরল হীরার এক আস্ত সমুদ্র থাকতে পারে, যার উপর ভাসতে পারে কঠিন হীরার বিশালাকার শৈলখণ্ড!',
        nasaScienceFact_en:
          'Laboratory laser simulations indicate thousands of miles down, carbon forms solid diamond icebergs floating on liquid carbon.',
        telemetry: {
          altitude: 'রেডিও সাউন্ডিং (অভ্যন্তরীণ স্তর)',
          altitude_en: 'Interior Stratum Sounding',
          velocity: '৮৫,০০০ কিমি/ঘণ্টা',
          velocity_en: '85,000 km/h',
          temperature: '২,০০০°C (গভীর তল)',
          temperature_en: '2,000°C (Mantle)',
          pressure: '১০,০০,০০০ atm',
          pressure_en: '1,000,000 atm',
        },
        task: {
          type: 'timed_release',
          instruction_bn: 'রেডিও অক্যালটেশন সিগন্যাল দিয়ে বায়ুমণ্ডলের ঘনত্ব ও হীরক স্তরের চাপ মাপো!',
          instruction_en: 'Perform radio occultation sounding to measure atmospheric density profile.',
          actionButton_bn: 'রেডিও অক্যালটেশন চালাও',
          actionButton_en: 'Execute Radio Sounding',
          successMessage_bn: 'উচ্চ-ঘনত্বের কার্বন স্তর চিহ্নিত! গ্রহের হীরক বৃষ্টি মডেল সমর্থিত।',
          successMessage_en: 'High-density mantle stratum mapped! Diamond rain pressure regime modeled.',
        },
      },
      {
        id: 'nep-stage-4',
        order: 4,
        stageNumber: '০৪',
        title_bn: 'ট্রাইটনের বরফ আগ্নেয়গিরি ও নাইট্রোজেন ফোয়ারা',
        title_en: 'Triton Nitrogen Cryovolcanoes',
        subtitle_bn: 'মাইনাস ২৩৫ ডিগ্রি শীতে ৮ কিমি উঁচু সক্রিয় ফোয়ারা',
        subtitle_en: 'Subsurface Nitrogen Erupting 8 km into Space',
        historicEvent_bn:
          'নেপচুনের অদ্ভুত চাঁদ ট্রাইটন পুরো গ্রহের উল্টো দিকে ঘোরে! ভয়েজার এর মাইনাস ২৩৫°C শীতল পিঠে জীবন্ত নাইট্রোজেনের বরফ ফোয়ারা উদগীরণ হতে দেখে।',
        historicEvent_en:
          'Flying 39,800 km over retrograde moon Triton, discovering active cryovolcanoes shooting liquid nitrogen geysers 8 kilometers into space.',
        nasaScienceFact_bn:
          'ট্রাইটন হলো সৌরজগতের সবচেয়ে শীতলতম পৃষ্ঠের বস্তু (-২৩৫°C)। এটি সম্ভবত কুইপার বেল্ট থেকে নেপচুনের শক্তিশালী টানে ধরা পড়া এক বামন গ্রহ!',
        nasaScienceFact_en:
          'Triton is likely a captured Kuiper Belt dwarf planet like Pluto, preserving ancient volatile nitrogen ices.',
        telemetry: {
          altitude: 'ট্রাইটন ফ্লাইবাই (৩৯,৮০০ কিমি)',
          altitude_en: 'Triton Flyby (39,800 km)',
          velocity: '৬১,০০০ কিমি/ঘণ্টা',
          velocity_en: '61,000 km/h',
          temperature: '-২৩৫°C (চরমতম শৈত্য)',
          temperature_en: '-235°C (Extreme Cold)',
          pressure: '০.০০০০১ atm',
          pressure_en: '0.00001 atm',
        },
        task: {
          type: 'camera_scan',
          instruction_bn: 'ট্রাইটনের ক্যান্টালুপ স্কিন ভূমিরূপে ৮ কিমি উঁচু নাইট্রোজেন ফোয়ারা চিহ্নিত করো!',
          instruction_en: 'Map active nitrogen geyser plumes venting across Triton’s cantaloupe terrain.',
          actionButton_bn: 'ক্রায়োভলক্যানো স্ক্যান করো',
          actionButton_en: 'Scan Cryovolcanoes',
          successMessage_bn: 'সক্রিয় ফোয়ারা ফ্রেমবন্দী! মহাশূন্যে বরফ ধোঁয়ার কালো ধারা স্পষ্টভাবে ধরা পড়েছে!',
          successMessage_en: 'Cryovolcanic geysers imaged! Dark nitrogen plumes venting 8 km upward!',
        },
      },
      {
        id: 'nep-stage-5',
        order: 5,
        stageNumber: '০৫',
        title_bn: 'আন্তঃনাক্ষত্রিক মহাশূন্যে যাত্রা (Interstellar Space)',
        title_en: 'Departure to Interstellar Space',
        subtitle_bn: 'সৌরজগতের সীমানা ছাড়িয়ে গ্যালাক্সির পথে',
        subtitle_en: 'Leaving Planetary Domain toward the Stars',
        historicEvent_bn:
          'নেপচুনের মহাকর্ষীয় ধাক্কায় ভয়েজার ২ গ্রহমণ্ডলীর সমতল ছেড়ে দক্ষিণ দিকে ইন্টারস্টেলার মহাকাশের উদ্দেশ্যে অসীম যাত্রায় রওনা দেয়।',
        historicEvent_en:
          'Gravity assist at Neptune slung Voyager 2 below the ecliptic plane, embarking on an eternal voyage into interstellar space.',
        nasaScienceFact_bn:
          'ভয়েজার ২-এর সাথে রয়েছে একটি স্বর্ণের রেকর্ড (Golden Record), যেখানে পৃথিবীর অভিবাদন, বাংলা গান ও মানবজাতির গল্প মহাবিশ্বের জন্য সংরক্ষিত আছে!',
        nasaScienceFact_en:
          'Voyager 2 carries the Golden Record with greetings in 55 languages (including Bengali: "নমস্কার, বিশ্বের শান্তি হোক"), music, and sounds of Earth.',
        telemetry: {
          altitude: 'ইন্টারস্টেলার ট্র্যাজেক্টরি (৫০০ কোটি কিমি)',
          altitude_en: 'Interstellar (5 Billion km)',
          velocity: '৫৫,৩০০ কিমি/ঘণ্টা',
          velocity_en: '55,300 km/h',
          temperature: '-২৩০°C',
          temperature_en: '-230°C',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'camera_scan',
          instruction_bn: 'পৃথিবীর স্বর্ণের রেকর্ডের রেডিও লিংক লক করো এবং নেপচুনের শেষ ছবি প্রেরণ করো!',
          instruction_en: 'Lock interstellar transmitter and send the final goodbye portrait of Neptune.',
          actionButton_bn: 'চূড়ান্ত বিদায় সংকেত পাঠাও',
          actionButton_en: 'Send Final Interstellar Signal',
          successMessage_bn: 'মহাকাব্যিক যাত্রা সম্পন্ন! নেপচুন অভিযান সফল! +১২০ XP ও মহাকাশ মাস্টার পদক!',
          successMessage_en: 'Interstellar voyage begun! Neptune mission complete! +120 XP & Grand Medal!',
        },
      },
    ],
  },

  // ─── 8. MOON: Apollo 11 & Artemis ─────────────────────────────────────
  moon: {
    destinationId: 'moon',
    missionName_bn: 'চন্দ্র অভিযান: অ্যাপোলো ১১ ও আর্টেমিস',
    missionName_en: 'Lunar Landing: Apollo 11 & Artemis',
    craftName_bn: 'স্যাটার্ন ৫ রকেট ও লুনার মডিউল',
    craftName_en: 'Saturn V Rocket & Lunar Descent Module',
    agency: 'NASA',
    historicYear: '১৯৬৯ / ২০২৬',
    landingZone_bn: 'শান্ত সাগর ও দক্ষিণ মেরু (Sea of Tranquility & Pole)',
    landingZone_en: 'Mare Tranquillitatis & Shackleton Crater',
    badgeCode: 'MOON-APOLLO11',
    accentColor: '#FFC86B',
    overview_bn:
      'স্পেসস্যুট প্রস্তুতি, রকেট জ্বালানি লোডিং, বায়ুমণ্ডল ভেদ, শান্ত সাগরে ল্যান্ডারের অবতরণ এবং চাঁদের বুকে মানুষের প্রথম ঐতিহাসিক পদচিহ্ন।',
    overview_en:
      '5-layer spacesuit prep, cryogenic fueling, atmospheric crossing, retro-thruster lunar landing, and historic first footsteps on the Moon.',
    stages: [
      {
        id: 'moon-stage-1',
        order: 1,
        stageNumber: '০১',
        title_bn: 'নভোচারীর স্পেসস্যুট প্রস্তুতি',
        title_en: 'Spacesuit Suit-Up Room',
        subtitle_bn: 'সুরক্ষার ৫টি অত্যাবশ্যকীয় উপাদান পরা',
        subtitle_en: 'Cooling, Pressure, PLSS, Helmet & Boots',
        historicEvent_bn:
          'অ্যাপোলো নভোচারীরা কেনেডি স্পেস সেন্টারের প্রস্তুতি কক্ষে ১৪ স্তরের স্পেসস্যুট নিখুঁতভাবে পরেন ও বায়ুচাপ পরীক্ষা করেন।',
        historicEvent_en:
          'Apollo astronauts suit up in multi-layer A7L spacesuits, checking liquid cooling garment and primary life support.',
        nasaScienceFact_bn:
          'স্পেসস্যুটের হেলমেট ভাইজরে খাঁটি সোনার একটি অতি-পাতলা প্রলেপ থাকে যা ক্ষতিকর সূর্যের অতিবেগুনি ও ইনফ্রারেড রশ্মি প্রতিফলন করে!',
        nasaScienceFact_en:
          'Astronaut gold visors reflect 95% of harsh infrared radiation while allowing visible light through.',
        telemetry: {
          altitude: 'কেনেডি স্পেস সেন্টার (০ কিমি)',
          altitude_en: 'Kennedy Space Center (0 km)',
          velocity: '০',
          velocity_en: '0',
          temperature: '২৪°C',
          temperature_en: '24°C',
          pressure: '১.০ atm',
          pressure_en: '1.0 atm',
        },
        task: {
          type: 'toggle_systems',
          instruction_bn: 'লিকুইড কুলিং, প্রেশার লেয়ার ও গোল্ড ভাইজর হেলমেট চালু করো।',
          instruction_en: 'Verify Liquid Cooling, Pressure Garment, and Gold Visor Helmet.',
          actionButton_bn: 'স্যুট চেক সম্পন্ন করো',
          actionButton_en: 'Verify Suit',
          successMessage_bn: 'স্পেসস্যুট প্রস্তুত! নভোচারী মহাকাশের শূন্যতার জন্য সুরক্ষিত।',
          successMessage_en: 'Spacesuit sealed and ready for extreme space environment.',
          requiredToggles: [
            { id: 'mo1', label_bn: 'লিকুইড কুলিং আন্ডারগার্মেন্ট', label_en: 'Liquid Cooling Garment' },
            { id: 'mo2', label_bn: 'PLSS অক্সিজেন লাইফ সাপোর্ট', label_en: 'PLSS Oxygen Backpack' },
            { id: 'mo3', label_bn: 'খাঁটি সোনার ভাইজর হেলমেট', label_en: 'Thermal Gold Visor' },
          ],
        },
      },
      {
        id: 'moon-stage-2',
        order: 2,
        stageNumber: '০২',
        title_bn: 'ক্রায়োজেনিক রকেট জ্বালানি লোডিং',
        title_en: 'Cryogenic Rocket Fueling Station',
        subtitle_bn: 'তরল অক্সিজেন (LOX) ও তরল হাইড্রোজেন (LH2)',
        subtitle_en: '-253°C Cryogenic Propellant Tanks Filling',
        historicEvent_bn:
          'স্যাটার্ন ৫ রকেটের বিশাল ট্যাংকে মাইনাস ২৫৩ ডিগ্রি বরফ-শীতল তরল হাইড্রোজেন ও তরল অক্সিজেন প্রোপেলান্ট পাম্প করা হয়।',
        historicEvent_en:
          'Pumping 3,000 metric tons of super-chilled cryogenic LOX and liquid hydrogen into Saturn V tanks.',
        nasaScienceFact_bn:
          'স্যাটার্ন ৫ রকেটের মোট ওজনের ৮৫%-এরও বেশি ছিল কেবল তরল জ্বালানি!',
        nasaScienceFact_en:
          'Over 85% of Saturn V’s 2.9 million kg launch mass consisted entirely of liquid propellant.',
        telemetry: {
          altitude: 'লঞ্চ প্যাড ৩৯এ (০ কিমি)',
          altitude_en: 'Launch Pad 39A (0 km)',
          velocity: '০',
          velocity_en: '0',
          temperature: '-২৫৩°C (ট্যাংক)',
          temperature_en: '-253°C (Fuel Tank)',
          pressure: '১.০ atm',
          pressure_en: '1.0 atm',
        },
        task: {
          type: 'thrust_burn',
          instruction_bn: 'ক্রায়োজেনিক পাম্প ভালভ খুলে রকেটের ট্যাংক শতভাগ পূর্ণ করো!',
          instruction_en: 'Pump cryogenic propellants to 100% full capacity.',
          actionButton_bn: 'জ্বালানি ট্যাংক পূর্ণ করো',
          actionButton_en: 'Fill Propellant Tanks',
          successMessage_bn: 'ট্যাংক ১০০% পূর্ণ! স্যাটার্ন ৫ রকেট ইগনিশনের জন্য প্রস্তুত।',
          successMessage_en: 'Cryogenic tanks 100% full! Saturn V ready for liftoff.',
        },
      },
      {
        id: 'moon-stage-3',
        order: 3,
        stageNumber: '০৩',
        title_bn: 'ককপিট ইগনিশন ও লিফটঅফ',
        title_en: 'Cockpit Flight Deck & Liftoff',
        subtitle_bn: '৩, ২, ১... মেইন ইঞ্জিন ইগনিশন!',
        subtitle_en: '3,450 Tons of Thrust & Escape Velocity',
        historicEvent_bn:
          '৫টি শক্তিশালী এফ-১ ইঞ্জিন গর্জন করে ওঠে এবং সাড়ে তিন কোটি নিউটন শক্তিতে রকেটটি আকাশের বুকে তীব্র বেগে উঠে যায়।',
        historicEvent_en:
          'Five F-1 engines ignite, generating 34.5 million Newtons of thrust lifting Apollo 11 from Earth.',
        nasaScienceFact_bn:
          'পৃথিবীর মহাকর্ষ ছাড়িয়ে চাঁদে যেতে রকেটকে ঘণ্টায় প্রায় ৪০,০০০ কিমি মুক্তিবেগে ছুটতে হয়েছিল!',
        nasaScienceFact_en:
          'Trans-Lunar Injection accelerates spacecraft to nearly 40,000 km/h (escape velocity).',
        telemetry: {
          altitude: '৭০ কিমি',
          altitude_en: '70 km',
          velocity: '১০,৮০০ কিমি/ঘণ্টা',
          velocity_en: '10,800 km/h',
          temperature: '২,২০০°C (ইঞ্জিন)',
          temperature_en: '2,200°C (Exhaust)',
          pressure: '০.০০০১ atm',
          pressure_en: '0.0001 atm',
        },
        task: {
          type: 'thrust_burn',
          instruction_bn: 'ইগনিশন বাটন প্রেস করে ৫টি শক্তিশালী রকেট ইঞ্জিন গর্জন করাও!',
          instruction_en: 'Trigger ignition countdown to launch Saturn V into orbit.',
          actionButton_bn: 'রকেট ইগনিশন শুরু করো',
          actionButton_en: 'Ignite Rocket Engines',
          successMessage_bn: 'লিফটঅফ সম্পন্ন! রকেট পৃথিবীর বায়ুমণ্ডল ভেদ করে চাঁদের পথে ধাবিত।',
          successMessage_en: 'Liftoff confirmed! Spacecraft powering toward the Moon.',
        },
      },
      {
        id: 'moon-stage-4',
        order: 4,
        stageNumber: '০৪',
        title_bn: 'লুনার ডিসেন্ট ও শান্ত সাগরে অবতরণ',
        title_en: 'Lunar Descent Module Touchdown',
        subtitle_bn: 'রেট্রো থ্রাস্টার ফায়ার করে চাঁদের মাটিতে টাচডাউন',
        subtitle_en: 'Eagle Lander Descent to Mare Tranquillitatis',
        historicEvent_bn:
          'নিল আর্মস্ট্রং স্বয়ংক্রিয় কম্পিউটার এড়িয়ে ম্যানুয়ালি ল্যান্ডার চালিয়ে পাথুরে খাদ পার হয়ে সমতল শান্ত সাগরে নিরাপদে নামেন।',
        historicEvent_en:
          'Neil Armstrong manually piloted the Lunar Module Eagle over boulders to land with 25 seconds of fuel remaining.',
        nasaScienceFact_bn:
          'চাঁদের মহাকর্ষ পৃথিবীর মাত্র ৬ ভাগের ১ ভাগ, তাই সেখানে ওজন মাত্র এক-ষষ্ঠমাংশ অনুভূত হয়!',
        nasaScienceFact_en:
          'With lunar surface gravity only 1/6th of Earth’s, the lander required minimal braking thrust compared to Earth.',
        telemetry: {
          altitude: '০ মিটার (পৃষ্ঠদেশ)',
          altitude_en: '0 m (Surface)',
          velocity: '২.৫ কিমি/ঘণ্টা → ০',
          velocity_en: '2.5 km/h → 0',
          temperature: '-২০°C',
          temperature_en: '-20°C',
          pressure: '০.০০ atm (ভ্যাকুয়াম)',
          pressure_en: '0.00 atm (Vacuum)',
        },
        task: {
          type: 'thrust_burn',
          instruction_bn: 'রেট্রো থ্রাস্টার ব্রেক ব্যবহার করে ল্যান্ডারকে শান্ত সাগরে স্পর্শ করাও!',
          instruction_en: 'Fire retro-braking thruster to achieve soft touchdown.',
          actionButton_bn: 'সফট ল্যান্ডিং করো',
          actionButton_en: 'Execute Soft Touchdown',
          successMessage_bn: 'ঈগল হ্যাজ ল্যান্ডেড! লুনার মডিউল সফলভাবে চাঁদের মাটিতে!',
          successMessage_en: 'The Eagle has landed! Tranquility Base is established on the Moon!',
        },
      },
      {
        id: 'moon-stage-5',
        order: 5,
        stageNumber: '০৫',
        title_bn: 'মুনওয়াক, পতাকা স্থাপন ও রেগোলিথ সংগ্রহ',
        title_en: 'Historic Moonwalk & Regolith Core',
        subtitle_bn: 'একজন মানুষের ছোট পদক্ষেপ, সমগ্র মানবজাতির বিশাল অগ্রগতি',
        subtitle_en: 'One Giant Leap & Apollo Science Package',
        historicEvent_bn:
          'নিল আর্মস্ট্রং চাঁদের মাটিতে প্রথম পা রেখে বলেন— "That\'s one small step for a man, one giant leap for mankind."',
        historicEvent_en:
          'Astronauts planted the flag, set up the seismometer and laser reflector, and gathered 22 kg of lunar rock samples.',
        nasaScienceFact_bn:
          'চাঁদে বাতাস বা বৃষ্টি না থাকায় সেখানে অ্যাপোলো নভোচারীদের পায়ের ছাপ কোটি কোটি বছর অক্ষত থাকবে!',
        nasaScienceFact_en:
          'Without atmospheric erosion or liquid water, footprints on the Moon will remain preserved for millions of years.',
        telemetry: {
          altitude: 'লুনার পৃষ্ঠদেশ',
          altitude_en: 'Lunar Surface',
          velocity: '০',
          velocity_en: '0',
          temperature: '১০৫°C (সূর্যের আলো)',
          temperature_en: '105°C (Sunlight)',
          pressure: '০.০০ atm',
          pressure_en: '0.00 atm',
        },
        task: {
          type: 'sample_drill',
          instruction_bn: 'লুনার রেগোলিথ পাথর সংগ্রহ করো এবং বৈজ্ঞানিক স্যাম্পল বক্সে প্যাক করো!',
          instruction_en: 'Collect lunar core regolith samples and seal Apollo return container.',
          actionButton_bn: 'রেগোলিথ স্যাম্পল সংগ্রহ করো',
          actionButton_en: 'Sample Lunar Regolith',
          successMessage_bn: 'চন্দ্র অভিযান পরিপূর্ণ! +১২০ XP ও লুনার কমান্ডার পদক অর্জিত!',
          successMessage_en: 'Lunar mission completed! +120 XP & Lunar Commander Medal awarded!',
        },
      },
    ],
  },
};

/**
 * Returns authentic planetary mission data for a given destination ID
 */
export function getPlanetaryMission(id: DestinationId): PlanetaryMission {
  return PLANETARY_MISSIONS[id] || PLANETARY_MISSIONS.mars;
}
