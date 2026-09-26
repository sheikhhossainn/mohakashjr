// Mission Domain Data & Scoring Engine for Moon Landing Mission

export type LunarRegionId = 'shackleton-crater' | 'mare-tranquillitatis' | 'oceanus-procellarum';

export interface LunarRegion {
  id: LunarRegionId;
  name_bn: string;
  englishName: string;
  coordinates: string;
  badge: string;
  description_bn: string;
  scientificSignificance_bn: string;
  sunlightPower: number; // 0 - 100
  waterIce: number; // 0 - 100
  terrainRisk: number; // 0 - 100
  scienceYield: number; // 0 - 100
  optimalEquipmentHint_bn: string;
  accentColor: string;
}

export const LUNAR_REGIONS: LunarRegion[] = [
  {
    id: 'shackleton-crater',
    name_bn: 'দক্ষিণ মেরুর শ্যাকলটন গহ্বর',
    englishName: 'Shackleton Crater (Lunar South Pole)',
    coordinates: '৮৯.৯° দক্ষিণ, ০.০° পূর্ব',
    badge: '🧊',
    description_bn: 'চির-অন্ধকারে ঢাকা বিশাল বরফ উপত্যকা। আর্টেমিস অভিযানের জন্য পানির অফুরন্ত খনি, তবে অবতরণ অত্যন্ত ঝুঁকিপূর্ণ!',
    scientificSignificance_bn: 'নাসার আর্টেমিস অভিযানের প্রধান লক্ষ্য। এখানকার বরফ গলিয়ে রকেটের জ্বালানি হাইড্রোজেন ও অক্সিজেন তৈরি করা সম্ভব।',
    sunlightPower: 35, // Low sunlight inside crater
    waterIce: 95, // Tremendous water ice deposits
    terrainRisk: 75, // Steep, treacherous crater rims & permanent dark
    scienceYield: 98, // Extreme scientific payoff
    optimalEquipmentHint_bn: 'আইস ড্রিল ও নিউক্লিয়ার ব্যাটারি (RTG) সাথে নেওয়া অত্যন্ত জরুরি!',
    accentColor: '#00F0FF',
  },
  {
    id: 'mare-tranquillitatis',
    name_bn: 'শান্ত সাগর (অ্যাপোলো ১১ সাইট)',
    englishName: 'Mare Tranquillitatis (Sea of Tranquility)',
    coordinates: '০.৬৭° উত্তর, ২৩.৪৭° পূর্ব',
    badge: '🚀',
    description_bn: 'অ্যাপোলো ১১ এর ঐতিহাসিক অবতরণ ভূমি। মসৃণ সমতল ব্যাসাল্ট লাভা প্রান্তর, যেখানে অবতরণ সবচেয়ে নিরাপদ।',
    scientificSignificance_bn: 'নীল আর্মস্ট্রং ও বাজ অলড্রিনের পদধূলি মাখা অঞ্চল। সমতল ভূপ্রকৃতির কারণে সৌরশক্তি গ্রহণ ও প্রাথমিক ঘাঁটি গড়ার আদর্শ জায়গা।',
    sunlightPower: 90, // Abundant solar exposure
    waterIce: 15, // Very dry lunar regolith
    terrainRisk: 15, // Very safe, flat terrain
    scienceYield: 60, // Moderate baseline science
    optimalEquipmentHint_bn: 'উচ্চ ক্ষমতার সোলার প্যানেল ও রোভার থাকলে সর্বোচ্চ শক্তি পাওয়া যাবে!',
    accentColor: '#FFB800',
  },
  {
    id: 'oceanus-procellarum',
    name_bn: 'ঝড়ো মহাসাগর (আগ্নেয় প্রান্তর)',
    englishName: 'Oceanus Procellarum (Ocean of Storms)',
    coordinates: '১৮.৪° উত্তর, ৫৭.৪° পশ্চিম',
    badge: '🌋',
    description_bn: 'চাঁদের পশ্চিম প্রান্তের বিশাল অন্ধকার লাভা সমভূমি। তেজস্ক্রিয় থোরিয়াম, টাইটানিয়াম ও বিরল খনিজের অনন্য ভান্ডার।',
    scientificSignificance_bn: 'চাঁদের প্রাচীনতম আগ্নেয়গিরি ও লাভা টিউবের সন্ধান মেলে এখানে। চাঁদের ভূতাত্ত্বিক রহস্য উন্মোচনে এটি অত্যন্ত গুরুত্বপূর্ণ।',
    sunlightPower: 75, // High solar exposure
    waterIce: 35, // Low-mid moisture
    terrainRisk: 40, // Volcanic domes and ridges
    scienceYield: 85, // High mineral and geological payoff
    optimalEquipmentHint_bn: 'খনিজ বিশ্লেষক স্পেকট্রোমিটার ও অতিরিক্ত অক্সিজেন সিলিন্ডার কার্যকরী!',
    accentColor: '#FF6B35',
  },
];

export type CargoCategory = 'life_support' | 'power' | 'science' | 'survival';

export interface CargoItem {
  id: string;
  name_bn: string;
  englishName: string;
  category: CargoCategory;
  category_bn: string;
  weight_kg: number;
  is_essential: boolean;
  oxygen_bonus: number;
  power_bonus: number;
  science_bonus: number;
  survival_bonus: number;
  description_bn: string;
  icon_name: string;
}

export const MAX_PAYLOAD_CAPACITY_KG = 500;

export const CARGO_ITEMS: CargoItem[] = [
  {
    id: 'primary-oxygen',
    name_bn: 'প্রাথমিক তরল অক্সিজেন সিলিন্ডার',
    englishName: 'Primary Liquid Oxygen Tanks',
    category: 'life_support',
    category_bn: 'জীবন রক্ষাকারী',
    weight_kg: 140,
    is_essential: true,
    oxygen_bonus: 50,
    power_bonus: 0,
    science_bonus: 0,
    survival_bonus: 35,
    description_bn: 'নভোচারীদের শ্বাস নেওয়ার জন্য অতি আবশ্যকীয় তরল অক্সিজেন রিজার্ভার।',
    icon_name: 'Wind',
  },
  {
    id: 'backup-oxygen',
    name_bn: 'ব্যাকআপ অক্সিজেন ও ফিল্টার প্যাক',
    englishName: 'Auxiliary Oxygen & Scrubbers',
    category: 'life_support',
    category_bn: 'জীবন রক্ষাকারী',
    weight_kg: 70,
    is_essential: false,
    oxygen_bonus: 30,
    power_bonus: 0,
    science_bonus: 0,
    survival_bonus: 20,
    description_bn: 'জরুরি পরিস্থিতিতে অতিরিক্ত ৪৫ দিন শ্বাস নেওয়ার নিশ্চয়তা দেয়।',
    icon_name: 'Activity',
  },
  {
    id: 'solar-array',
    name_bn: 'উচ্চ-ক্ষমতাসম্পন্ন সোলার প্যানেল',
    englishName: 'High-Efficiency Deployable Solar Array',
    category: 'power',
    category_bn: 'বিদ্যুৎ ও শক্তি',
    weight_kg: 90,
    is_essential: false,
    oxygen_bonus: 0,
    power_bonus: 45,
    science_bonus: 5,
    survival_bonus: 15,
    description_bn: 'সূর্যালোকিত অঞ্চলে দ্রুততম সময়ে ব্যাটারি রিচার্জ ও লাইফ সাপোর্ট সচল রাখে।',
    icon_name: 'Sun',
  },
  {
    id: 'rtg-nuclear-battery',
    name_bn: 'পারমাণবিক থার্মাল ব্যাটারি (RTG)',
    englishName: 'Radioisotope Thermoelectric Generator (RTG)',
    category: 'power',
    category_bn: 'বিদ্যুৎ ও শক্তি',
    weight_kg: 120,
    is_essential: false,
    oxygen_bonus: 0,
    power_bonus: 60,
    science_bonus: 10,
    survival_bonus: 30,
    description_bn: 'সূর্যালোকবিহীন অন্ধকার গহ্বরে দীর্ঘ ১৪ দিনের চন্দ্র রাতেও একটানা বিদ্যুৎ শক্তি দেয়।',
    icon_name: 'Zap',
  },
  {
    id: 'lunar-ice-drill',
    name_bn: 'চন্দ্র বরফ উত্তোলক ড্রিল ও বিশ্লেষক',
    englishName: 'Lunar Ice Deep Core Drill & Analyzer',
    category: 'science',
    category_bn: 'বিজ্ঞান ও গবেষণা',
    weight_kg: 80,
    is_essential: false,
    oxygen_bonus: 15, // Can melt ice to make water & oxygen!
    power_bonus: 0,
    science_bonus: 45,
    survival_bonus: 20,
    description_bn: 'মাটির গভীর থেকে বরফ তুলে পানি ও হাইড্রোজেন জ্বালানি সংশ্লেষণ করার যন্ত্র।',
    icon_name: 'Cpu',
  },
  {
    id: 'mineral-spectrometer',
    name_bn: 'খনিজ বিশ্লেষক স্পেকট্রোমিটার কিট',
    englishName: 'Mineral Alpha-Particle X-Ray Spectrometer',
    category: 'science',
    category_bn: 'বিজ্ঞান ও গবেষণা',
    weight_kg: 50,
    is_essential: false,
    oxygen_bonus: 0,
    power_bonus: 0,
    science_bonus: 40,
    survival_bonus: 5,
    description_bn: 'চাঁদের লাভা ও শিলা খন্ডের উপাদান নিখুঁতভাবে বিশ্লেষণ করে পৃথিবীতে তথ্য পাঠায়।',
    icon_name: 'Compass',
  },
  {
    id: 'water-food-rations',
    name_bn: 'পানি পরিশোধন ও পুষ্টি খাদ্য প্যাক',
    englishName: 'Water Recycler & Nutrient Rations',
    category: 'survival',
    category_bn: 'বেঁচে থাকার সামগ্রী',
    weight_kg: 80,
    is_essential: true,
    oxygen_bonus: 0,
    power_bonus: 0,
    science_bonus: 0,
    survival_bonus: 40,
    description_bn: 'নভোচারীদের প্রতিদিনের পুষ্টি ও পানীয় পানির ক্লোজড-লুপ রিসাইক্লার।',
    icon_name: 'ShieldCheck',
  },
  {
    id: 'radiation-medical-shield',
    name_bn: 'জরুরি প্রাথমিক চিকিৎসা ও রেডিয়েশন শিল্ড',
    englishName: 'Emergency Medical Kit & Radiation Shielding',
    category: 'survival',
    category_bn: 'বেঁচে থাকার সামগ্রী',
    weight_kg: 50,
    is_essential: false,
    oxygen_bonus: 0,
    power_bonus: 0,
    science_bonus: 0,
    survival_bonus: 25,
    description_bn: 'সৌর ঝড় (Solar Flare) ও মহাজাগতিক বিকিরণ থেকে নভোচারীদের রক্ষা করে।',
    icon_name: 'HeartPulse',
  },
];

// ==========================================
// Scientific Debrief Evaluation Model
// ==========================================

export interface MissionTelemetryResult {
  selectedSite: LunarRegion;
  selectedCargoIds: string[];
  totalWeight_kg: number;
  weightCapacity_kg: number;
  isOverweight: boolean;
  hasEssentialOxygen: boolean;
  hasEssentialWaterFood: boolean;
  oxygenLevel: number; // 0 - 100
  powerLevel: number; // 0 - 100
  survivalScore: number; // 0 - 100
  scienceScore: number; // 0 - 100
  totalScore: number; // 0 - 100
  starRating: 1 | 2 | 3;
  earnedXP: number;
  status: 'perfect' | 'success' | 'warning' | 'critical_failure';
  verdictTitle_bn: string;
  verdictDescription_bn: string;
  feedbackPoints_bn: string[];
  nasaArtemisInsight_bn: string;
}

export function evaluateMoonLandingMission(
  siteId: LunarRegionId,
  selectedCargoIds: string[]
): MissionTelemetryResult {
  const site = LUNAR_REGIONS.find((s) => s.id === siteId) || LUNAR_REGIONS[0];
  const items = CARGO_ITEMS.filter((c) => selectedCargoIds.includes(c.id));

  const totalWeight_kg = items.reduce((acc, it) => acc + it.weight_kg, 0);
  const isOverweight = totalWeight_kg > MAX_PAYLOAD_CAPACITY_KG;

  const hasEssentialOxygen = selectedCargoIds.includes('primary-oxygen');
  const hasEssentialWaterFood = selectedCargoIds.includes('water-food-rations');
  const hasBackupOxygen = selectedCargoIds.includes('backup-oxygen');
  const hasSolar = selectedCargoIds.includes('solar-array');
  const hasRTG = selectedCargoIds.includes('rtg-nuclear-battery');
  const hasIceDrill = selectedCargoIds.includes('lunar-ice-drill');
  const hasSpectrometer = selectedCargoIds.includes('mineral-spectrometer');

  // 1. Oxygen Calculation
  let oxygenLevel = 0;
  if (hasEssentialOxygen) oxygenLevel += 60;
  if (hasBackupOxygen) oxygenLevel += 30;
  if (hasIceDrill && site.id === 'shackleton-crater') oxygenLevel += 15; // In-Situ Resource Utilization (ISRU)
  oxygenLevel = Math.min(100, oxygenLevel);

  // 2. Power Calculation (Affected dynamically by site sunlight!)
  let rawPower = 0;
  if (hasSolar) {
    // If Shackleton (low light: 35%), solar is less effective
    const solarFactor = site.sunlightPower / 100;
    rawPower += Math.round(50 * solarFactor);
  }
  if (hasRTG) {
    // RTG works anywhere, perfect for dark crater!
    rawPower += 80;
  }
  const powerLevel = Math.min(100, rawPower);

  // 3. Science Calculation (Synergies with chosen region)
  let rawScience = 0;
  if (hasIceDrill) {
    rawScience += 40;
    if (site.id === 'shackleton-crater') {
      rawScience += 35; // Bonus ice extraction in Shackleton!
    }
  }
  if (hasSpectrometer) {
    rawScience += 35;
    if (site.id === 'oceanus-procellarum') {
      rawScience += 25; // High thorium and volcanic basalt bonus!
    }
  }
  const scienceScore = Math.min(100, rawScience);

  // 4. Survival Score Calculation
  let baseSurvival = 0;
  if (hasEssentialOxygen) baseSurvival += 35;
  if (hasEssentialWaterFood) baseSurvival += 35;
  if (selectedCargoIds.includes('radiation-medical-shield')) baseSurvival += 20;
  if (powerLevel >= 40) baseSurvival += 10;

  // Penalties
  if (isOverweight) {
    const excess = totalWeight_kg - MAX_PAYLOAD_CAPACITY_KG;
    baseSurvival -= Math.min(45, Math.round(excess * 0.5));
  }
  if (!hasEssentialOxygen) baseSurvival = Math.min(15, baseSurvival);
  if (powerLevel < 20) baseSurvival -= 20;

  const survivalScore = Math.max(0, Math.min(100, baseSurvival));

  // 5. Total Score
  let totalScore = Math.round(survivalScore * 0.50 + scienceScore * 0.30 + powerLevel * 0.20);
  if (isOverweight) totalScore = Math.min(65, totalScore);
  if (!hasEssentialOxygen) totalScore = Math.min(30, totalScore);

  // Feedback points accumulation
  const feedbackPoints_bn: string[] = [];

  // Overweight telemetry feedback
  if (isOverweight) {
    feedbackPoints_bn.push(
      `⚠️ অতিরিক্ত ওজন (${totalWeight_kg} কেজি): ল্যান্ডারের থ্রাস্টার অতিরিক্ত ওজনের কারণে অবতরণে ভারসাম্য হারিয়েছিল।`
    );
  } else {
    feedbackPoints_bn.push(
      `✅ সর্বোত্তম ওজন ব্যালেন্স (${totalWeight_kg}/${MAX_PAYLOAD_CAPACITY_KG} কেজি): ল্যান্ডার নিরাপদভাবে নরম অবতরণ সম্পন্ন করেছে।`
    );
  }

  // Oxygen feedback
  if (!hasEssentialOxygen) {
    feedbackPoints_bn.push(
      '❌ জরুরি অক্সিজেন সিলিন্ডার নেওয়া হয়নি! কেবিনে শ্বাস নেওয়ার বায়ু শূন্যের কোটায় নেমে গিয়েছিল।'
    );
  } else {
    feedbackPoints_bn.push(
      `✅ অক্সিজেন স্তর সন্তোষজনক (${oxygenLevel}%): নভোচারীরা সম্পূর্ণ নিরাপদ ছিলেন।`
    );
  }

  // Site-specific Synergy Feedback
  if (site.id === 'shackleton-crater') {
    if (hasRTG) {
      feedbackPoints_bn.push(
        '🌟 দুর্দান্ত পরিকল্পনা! শ্যাকলটন গহ্বরের গভীর অন্ধকারে পারমাণবিক RTG ব্যাটারি একটানা বিদ্যুৎ সরবরাহ করেছে।'
      );
    } else {
      feedbackPoints_bn.push(
        '⚡ শক্তি সংকট: শ্যাকলটন গহ্বরে সূর্যালোক না থাকায় সোলার প্যানেল কাজ করেনি, RTG ব্যাটারির অভাব অনুভূত হয়েছে।'
      );
    }

    if (hasIceDrill) {
      feedbackPoints_bn.push(
        '🏆 বৈজ্ঞানিক বিস্ময়: ড্রিল দিয়ে শ্যাকলটনের বরফ স্তর থেকে আর্টেমিসের প্রথম লুনার ওয়াটার উত্তোলিত হয়েছে!'
      );
    }
  } else if (site.id === 'mare-tranquillitatis') {
    if (hasSolar) {
      feedbackPoints_bn.push(
        '☀️ শান্ত সাগরের প্রচুর সূর্যালোক সোলার প্যানেলকে ১০০% কর্মক্ষম রেখেছে!'
      );
    }
  } else if (site.id === 'oceanus-procellarum') {
    if (hasSpectrometer) {
      feedbackPoints_bn.push(
        '🔬 বিরল খনিজ আবিষ্কার: স্পেকট্রোমিটার দিয়ে আগ্নেয় লাভা পাথরে টাইটানিয়াম ও থোরিয়াম শনাক্ত করা গেছে!'
      );
    }
  }

  // Determine status & Star Rating
  let starRating: 1 | 2 | 3 = 1;
  let status: MissionTelemetryResult['status'] = 'warning';
  let verdictTitle_bn = 'মিশন ফলাফল ডিব্রিফিং';
  let verdictDescription_bn = '';
  let earnedXP = 40;

  if (!hasEssentialOxygen || survivalScore < 30) {
    starRating = 1;
    status = 'critical_failure';
    verdictTitle_bn = 'মিশন বিঘ্নিত! জীবন সংকটাপন্ন 🚨';
    verdictDescription_bn =
      'পর্যাপ্ত অক্সিজেন বা সুরক্ষার অভাবে নভোচারীদের জরুরি ভিত্তিতে মিশন বাতিল করতে হয়েছে। পরিকল্পনা সংশোধন করে আবার চেষ্টা করো!';
    earnedXP = 30;
  } else if (isOverweight || totalScore < 60) {
    starRating = 1;
    status = 'warning';
    verdictTitle_bn = 'অবতরণ সম্পন্ন, তবে ঝুঁকি ছিল 🛰️';
    verdictDescription_bn =
      'ল্যান্ডার চাঁদে অবতরণ করেছে, তবে অতিরিক্ত ওজন বা সীমিত শক্তির কারণে বৈজ্ঞানিক গবেষণার লক্ষ্যমাত্রা আংশিক পূরণ হয়েছে।';
    earnedXP = 50;
  } else if (totalScore >= 80) {
    starRating = 3;
    status = 'perfect';
    verdictTitle_bn = 'নিখুঁত চন্দ্রাভিযান! পূর্ণ সাফল্য 🌟';
    verdictDescription_bn =
      'তোমার প্রকৌশল ও বৈজ্ঞানিক দূরদর্শিতা অতুলনীয়! ল্যান্ডার নরম অবতরণ করেছে এবং বৈজ্ঞানিক গবেষণায় অভাবনীয় রেকর্ড গড়েছে!';
    earnedXP = 110;
  } else {
    starRating = 2;
    status = 'success';
    verdictTitle_bn = 'সফল চন্দ্র অবতরণ 🌕';
    verdictDescription_bn =
      'অভিযান সফলভাবে সমাপ্ত হয়েছে। ল্যান্ডার নিরাপদে ঘাঁটি স্থাপন করেছে এবং গুরুত্বপূর্ণ গবেষণা তথ্য পৃথিবীতে প্রেরণ করেছে।';
    earnedXP = 85;
  }

  const nasaArtemisInsight_bn =
    site.id === 'shackleton-crater'
      ? 'নাসার আর্টেমিস ৩ মিশন ২০২৬ সালের পর চাঁদের দক্ষিণ মেরুতে নভোচারী পাঠাবে। পানির বরফ অনুসন্ধানই এর প্রধান লক্ষ্য।'
      : site.id === 'mare-tranquillitatis'
      ? '১৯৬৯ সালে অ্যাপোলো ১১ শান্ত সাগরে ল্যান্ড করেছিল। নীল আর্মস্ট্রং বলেছিলেন—"The Eagle has landed!"'
      : 'ওশেনাস প্রসেলারাম চাঁদের সবচেয়ে বড় সমতল সাগর। এটি প্রাচীন লাভা জমে গঠিত হয়েছিল।';

  return {
    selectedSite: site,
    selectedCargoIds,
    totalWeight_kg,
    weightCapacity_kg: MAX_PAYLOAD_CAPACITY_KG,
    isOverweight,
    hasEssentialOxygen,
    hasEssentialWaterFood,
    oxygenLevel,
    powerLevel,
    survivalScore,
    scienceScore,
    totalScore,
    starRating,
    earnedXP,
    status,
    verdictTitle_bn,
    verdictDescription_bn,
    feedbackPoints_bn,
    nasaArtemisInsight_bn,
  };
}
