/**
 * Space Travel hub & Planetary Dossiers.
 * Comprehensive scientific dataset for the Moon and all 8 planets of our Solar System.
 * Authentic NASA planetary statistics with relatable Bangladeshi cultural analogies.
 */

export type DestinationId =
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export interface FamousMission {
  name: string;
  agency: string;
  year: string;
  highlight_bn: string;
  highlight_en: string;
}

export interface PlanetaryQuiz {
  question_bn: string;
  question_en: string;
  options_bn: string[];
  options_en: string[];
  correctIndex: number;
  explanation_bn: string;
  explanation_en: string;
}

export interface SpaceDestination {
  id: DestinationId;
  kind: 'moon' | 'planet';
  comingSoon: boolean;
  name_bn: string;
  name_en: string;
  summary_bn: string;
  summary_en: string;
  /** Short highlight chip, e.g. distance */
  fact_bn: string;
  fact_en: string;

  // Rich Planetary Dossier extensions:
  tagline_bn: string;
  tagline_en: string;
  planetType_bn: string;
  planetType_en: string;
  orderIndex: number;
  gravityMultiplier: number;
  gravityExplanation_bn: string;
  gravityExplanation_en: string;
  distance_bn: string;
  distance_en: string;
  dayLength_bn: string;
  dayLength_en: string;
  yearLength_bn: string;
  yearLength_en: string;
  temperatureLabel_bn: string;
  temperatureLabel_en: string;
  temperatureType: 'scorching' | 'extreme' | 'freezing' | 'mild';
  moonsCount: number;
  moonsDetail_bn: string;
  moonsDetail_en: string;
  diameterComparison_bn: string;
  diameterComparison_en: string;
  atmosphere: {
    canBreathe: boolean;
    composition_bn: string;
    composition_en: string;
    suitNeededReason_bn: string;
    suitNeededReason_en: string;
  };
  banglaAnalogy_bn: string;
  banglaAnalogy_en: string;
  famousMissions: FamousMission[];
  quickQuiz: PlanetaryQuiz;
}

export const SPACE_DESTINATIONS: SpaceDestination[] = [
  {
    id: 'moon',
    kind: 'moon',
    comingSoon: false,
    name_bn: 'চাঁদ',
    name_en: 'The Moon',
    summary_bn:
      'পৃথিবীর একমাত্র প্রাকৃতিক উপগ্রহ। এখানে মাধ্যাকর্ষণ পৃথিবীর মাত্র ছয় ভাগের এক ভাগ, তাই এক লাফেই অনেক উঁচুতে ওঠা যায়!',
    summary_en:
      "Earth's only natural satellite. Gravity here is just one sixth of Earth's, so one jump takes you very high!",
    fact_bn: 'পৃথিবী থেকে ৩,৮৪,৪০০ কিমি',
    fact_en: '384,400 km from Earth',
    tagline_bn: 'মানবজাতির প্রথম মহাকাশ পদচিহ্ন ও পৃথিবীর চিরসঙ্গী',
    tagline_en: "Humanity's first cosmic stepping stone & Earth's companion",
    planetType_bn: 'প্রাকৃতিক উপগ্রহ',
    planetType_en: 'Natural Satellite',
    orderIndex: 0,
    gravityMultiplier: 0.166,
    gravityExplanation_bn:
      'চাঁদে মাধ্যাকর্ষণ পৃথিবীর মাত্র ৬ ভাগের ১ ভাগ! পৃথিবীতে ৬০ কেজি ওজনের মানুষ চাঁদে মাত্র ১০ কেজি অনুভব করবে, অর্থাৎ এক লাফে অনায়াসে ৬ ফুট উপরে ওঠা সম্ভব!',
    gravityExplanation_en:
      "Gravity is only 1/6th of Earth! A 60 kg person feels like just 10 kg here, letting you effortlessly jump over 6 feet high!",
    distance_bn: '৩,৮৪,৪০০ কিমি (পৃথিবী হতে)',
    distance_en: '384,400 km from Earth',
    dayLength_bn: '২৯.৫ পৃথিবী দিন',
    dayLength_en: '29.5 Earth days',
    yearLength_bn: '২৭.৩ দিন (কক্ষপথ)',
    yearLength_en: '27.3 Earth days (orbit)',
    temperatureLabel_bn: '-১৩০°C থেকে +১২০°C',
    temperatureLabel_en: '-130°C to +120°C',
    temperatureType: 'extreme',
    moonsCount: 0,
    moonsDetail_bn: 'চাঁদের কোনো উপগ্রহ নেই',
    moonsDetail_en: 'No natural moons',
    diameterComparison_bn: '৩,৪৭৪ কিমি (পৃথিবীর ব্যাসের প্রায় ১/৪ অংশ)',
    diameterComparison_en: '3,474 km (~1/4 of Earth)',
    atmosphere: {
      canBreathe: false,
      composition_bn: 'সম্পূর্ণ বায়ুশূন্য মহাশূন্য (ভ্যাকুয়াম)',
      composition_en: 'Hard vacuum (no atmosphere)',
      suitNeededReason_bn:
        'চাঁদে কোনো বাতাস বা বায়ুচাপ নেই। স্পেসস্যুট ছাড়া শ্বাস নেওয়া অসম্ভব, রক্ত ফুটতে শুরু করবে এবং মারাত্মক রেডিয়েশন ক্ষতি করবে।',
      suitNeededReason_en:
        'Zero air pressure and harsh solar radiation. A pressurized spacesuit with thermal control is mandatory.',
    },
    banglaAnalogy_bn:
      'নদীর বালুচরে হাঁটার পর জোয়ারের পানি বা বাতাসে পায়ের ছাপ দ্রুত মুছে যায়। কিন্তু চাঁদে কোনো বাতাস বা বৃষ্টি নেই — তাই ৫০ বছর আগের অ্যাপোলো ১১ নভোচারীদের পায়ের ছাপ লক্ষ বছর ধরে অবিকল অক্ষত থাকবে!',
    banglaAnalogy_en:
      'Footprints on a riverbank wash away with tides, but with no wind or rain on the Moon, astronaut footprints will stay intact for millions of years!',
    famousMissions: [
      {
        name: 'Apollo 11',
        agency: 'NASA',
        year: '১৯৬৯',
        highlight_bn: 'নভোচারী নিল আর্মস্ট্রং ও বাজ অলড্রিনের চাঁদের বুকে ঐতিহাসিক প্রথম পদার্পণ।',
        highlight_en: 'Neil Armstrong and Buzz Aldrin complete humanity’s first moonwalk.',
      },
      {
        name: 'Artemis 1',
        agency: 'NASA',
        year: '২০২২',
        highlight_bn: 'পরবর্তী প্রজন্মের মানব চন্দ্রাভিযানের সফল মনুষ্যবিহীন ওরিয়ন ক্যাপসুল টেস্ট।',
        highlight_en: 'Next-generation lunar test flight verifying the Orion deep space spacecraft.',
      },
      {
        name: 'Chandrayaan-3',
        agency: 'ISRO',
        year: '২০২৩',
        highlight_bn: 'চাঁদের রহস্যময় দক্ষিণ মেরুর নিকটবর্তী অঞ্চলে প্রথম ঐতিহাসিক সফল ল্যান্ডিং।',
        highlight_en: 'Historic first soft landing near the lunar south pole region.',
      },
    ],
    quickQuiz: {
      question_bn: 'চাঁদে অ্যাপোলো ১১ নভোচারীদের পায়ের ছাপ লক্ষ বছর কেন অক্ষত থাকবে?',
      question_en: 'Why will astronaut footprints on the Moon last for millions of years?',
      options_bn: [
        'চাঁদের মাটি পাথরের মতো শক্ত',
        'চাঁদে কোনো বাতাস বা বৃষ্টি নেই',
        'নভোচারীরা সিমেন্ট ঢেলেছিলেন',
        'চাঁদের মহাকর্ষ খুব বেশি',
      ],
      options_en: [
        'The lunar soil is rock-hard',
        'There is no wind or rain to erode them',
        'Astronauts poured concrete',
        'The gravity is too heavy',
      ],
      correctIndex: 1,
      explanation_bn:
        'চাঁদে বায়ুমণ্ডল বা আবহাওয়া না থাকায় কোনো প্রাকৃতিক ক্ষয়কারী শক্তি নেই, তাই পায়ের ছাপ অক্ষত থাকে।',
      explanation_en:
        'Without atmosphere, wind, or rain, there is no natural weathering to erase surface footprints.',
    },
  },
  {
    id: 'mercury',
    kind: 'planet',
    comingSoon: true,
    name_bn: 'বুধ',
    name_en: 'Mercury',
    summary_bn:
      'সূর্যের সবচেয়ে কাছের ও সবচেয়ে ছোট গ্রহ। দিনে ভীষণ গরম, রাতে ভীষণ ঠান্ডা, আর মাত্র ৮৮ দিনেই সূর্যকে একবার ঘুরে আসে।',
    summary_en:
      'The smallest planet and the closest to the Sun. Scorching by day, freezing by night, and a full year lasts only 88 Earth days.',
    fact_bn: 'সূর্য থেকে ৫.৮ কোটি কিমি',
    fact_en: '58 million km from the Sun',
    tagline_bn: 'সূর্যের নিকটতম ও দ্রুততম ক্ষুদ্র প্রতিবেশী',
    tagline_en: 'The closest, fastest little world',
    planetType_bn: 'শিলাময় গ্রহ',
    planetType_en: 'Terrestrial Planet',
    orderIndex: 1,
    gravityMultiplier: 0.38,
    gravityExplanation_bn:
      'এখানে ওজন পৃথিবীর মাত্র ৩৮%! পৃথিবীতে ৫০ কেজি হলে বুধ গ্রহে তোমার ওজন হবে মাত্র ১৯ কেজি।',
    gravityExplanation_en:
      'Gravity is 38% of Earth. A 50 kg student weighs only 19 kg here!',
    distance_bn: 'সূর্য থেকে ৫.৮ কোটি কিমি',
    distance_en: '58 million km from Sun',
    dayLength_bn: '৫৯ পৃথিবী দিন',
    dayLength_en: '59 Earth days',
    yearLength_bn: '৮৮ দিন (সৌরজগতের দ্রুততম!)',
    yearLength_en: '88 Earth days (fastest orbit!)',
    temperatureLabel_bn: '-১৮০°C থেকে +৪৩০°C',
    temperatureLabel_en: '-180°C to +430°C',
    temperatureType: 'extreme',
    moonsCount: 0,
    moonsDetail_bn: 'কোনো চাঁদ নেই',
    moonsDetail_en: 'No moons',
    diameterComparison_bn: '৪,৮৭৯ কিমি (চাঁদের চেয়ে সামান্য বড়)',
    diameterComparison_en: '4,879 km (slightly larger than our Moon)',
    atmosphere: {
      canBreathe: false,
      composition_bn: 'অতি পাতলা এক্সোস্ফিয়ার (অক্সিজেন, সোডিয়াম, হিলিয়াম)',
      composition_en: 'Extremely tenuous exosphere (oxygen, sodium, helium)',
      suitNeededReason_bn:
        'দিনের তীব্র রোদে সীসা গলে যায় (+৪৩০°C) এবং রাতে হিমাঙ্কের নিচে (-১৮০°C) চরম ঠান্ডা!',
      suitNeededReason_en:
        'Extreme scorching days (+430°C) and cryogenic nights (-180°C) with no atmosphere to shield you.',
    },
    banglaAnalogy_bn:
      'বুধ গ্রহের আকাশ দিনের বেলাতেও ঘন কালো দেখায়! কারণ সেখানে কোনো ঘন বাতাস নেই যা সূর্যের আলোকে নীল করে ছড়িয়ে দিতে পারে। এটি সূর্যের এতো কাছে যে সেখান থেকে সূর্যকে পৃথিবীর চেয়ে ৩ গুণ বড় দেখায়!',
    banglaAnalogy_en:
      'The daytime sky on Mercury is pitch black because there is no atmosphere to scatter sunlight into blue, and the Sun appears 3 times larger than from Earth!',
    famousMissions: [
      {
        name: 'MESSENGER',
        agency: 'NASA',
        year: '২০১১',
        highlight_bn: 'বুধের কক্ষপথ প্রদক্ষিণকারী প্রথম মহাকাশযান, যা এর খাদে পানির বরফ আবিষ্কার করে!',
        highlight_en: 'First probe to orbit Mercury, discovering hidden water ice in shadowed craters.',
      },
      {
        name: 'BepiColombo',
        agency: 'ESA/JAXA',
        year: '২০১৮',
        highlight_bn: 'বুধের অভ্যন্তরীণ গঠন ও শক্তিশালী চৌম্বক ক্ষেত্র উদ্ঘাটনে যৌথ মহাকাশ অভিযান।',
        highlight_en: 'Joint European-Japanese mission to explore Mercury’s magnetic field and structure.',
      },
    ],
    quickQuiz: {
      question_bn: 'বুধ গ্রহের এক বছর পৃথিবীর কত দিনের সমান?',
      question_en: 'How long is one year on planet Mercury?',
      options_bn: ['৩৬৫ দিন', '৮৮ দিন', '২৪ দিন', '১২ দিন'],
      options_en: ['365 days', '88 Earth days', '24 days', '12 days'],
      correctIndex: 1,
      explanation_bn:
        'সূর্যের সবচেয়ে নিকটে হওয়ায় বুধ তীব্র গতিতে মাত্র ৮৮ পৃথিবী দিনে সূর্যকে একবার প্রদক্ষিণ করে!',
      explanation_en:
        'Being closest to the Sun, Mercury completes an entire solar orbit in just 88 Earth days!',
    },
  },
  {
    id: 'venus',
    kind: 'planet',
    comingSoon: true,
    name_bn: 'শুক্র',
    name_en: 'Venus',
    summary_bn:
      'সৌরজগতের সবচেয়ে গরম গ্রহ! ঘন মেঘের চাদরে মোড়া, আর এখানে একটি দিন একটি বছরের চেয়েও বড়।',
    summary_en:
      'The hottest planet in the solar system! Wrapped in thick clouds, and one day here is longer than one year.',
    fact_bn: 'সূর্য থেকে ১০.৮ কোটি কিমি',
    fact_en: '108 million km from the Sun',
    tagline_bn: 'সৌরজগতের সবচেয়ে উত্তপ্ত গ্রিনহাউস চুল্লি',
    tagline_en: 'The solar system’s hottest greenhouse furnace',
    planetType_bn: 'শিলাময় গ্রহ',
    planetType_en: 'Terrestrial Planet',
    orderIndex: 2,
    gravityMultiplier: 0.91,
    gravityExplanation_bn:
      'ওজন পৃথিবীর প্রায় সমান (৯১%)। পৃথিবীতে ৫০ কেজি হলে শুক্রে প্রায় ৪৫.৫ কেজি হবে।',
    gravityExplanation_en:
      'Gravity is 91% of Earth. A 50 kg cadet would weigh 45.5 kg here.',
    distance_bn: 'সূর্য থেকে ১০.৮ কোটি কিমি',
    distance_en: '108 million km from Sun',
    dayLength_bn: '২৪৩ দিন (বছরের চেয়েও লম্বা!)',
    dayLength_en: '243 Earth days (longer than its year!)',
    yearLength_bn: '২২৫ পৃথিবী দিন',
    yearLength_en: '225 Earth days',
    temperatureLabel_bn: '+৪৬৫°C (সৌরজগতের সবচেয়ে গরম!)',
    temperatureLabel_en: '+465°C (Hottest planet!)',
    temperatureType: 'scorching',
    moonsCount: 0,
    moonsDetail_bn: 'কোনো চাঁদ নেই',
    moonsDetail_en: 'No moons',
    diameterComparison_bn: '১২,১০৪ কিমি (পৃথিবীর প্রায় সমান জমজ)',
    diameterComparison_en: '12,104 km (almost Earth’s twin size)',
    atmosphere: {
      canBreathe: false,
      composition_bn: '৯৬% কার্বন ডাই-অক্সাইড ও ঘন সালফিউরিক অ্যাসিডের মেঘ',
      composition_en: '96% Carbon Dioxide and dense Sulfuric Acid clouds',
      suitNeededReason_bn:
        'বায়ুমণ্ডলীয় চাপ সমুদ্রের তলদেশের মতো ৯০ গুণ বেশি এবং তাপমাত্রা সীসা গলানোর মতো ৪৬৫°C!',
      suitNeededReason_en:
        'Crushing atmospheric pressure 90x greater than Earth, hot enough to melt lead!',
    },
    banglaAnalogy_bn:
      'শুক্র হলো এক দানবীয় প্রেসার কুকার! এর ঘন কার্বন ডাই-অক্সাইডের চাদর সূর্যের তাপ আটকে রাখে (তীব্র গ্রিনহাউস প্রতিক্রিয়া), ফলে এটি বুধের চেয়ে সূর্য থেকে দূরে হয়েও সৌরজগতের সবচেয়ে গরম গ্রহ!',
    banglaAnalogy_en:
      'Venus is like a cosmic pressure cooker! Its dense carbon dioxide traps solar heat in a runaway greenhouse effect, making it hotter than Mercury!',
    famousMissions: [
      {
        name: 'Magellan',
        agency: 'NASA',
        year: '১৯৯০',
        highlight_bn: 'রাডার দিয়ে শুক্রের ঘন মেঘ ভেদ করে ৯৮% পৃষ্ঠের আগ্নেয়গিরির মানচিত্র তৈরি করে।',
        highlight_en: 'Mapped 98% of the surface using radar through dense clouds.',
      },
      {
        name: 'Venera 13',
        agency: 'Soviet Union',
        year: '১৯৮২',
        highlight_bn: 'শুক্রের চরম চাপ ও উত্তাপ সহ্য করে পৃষ্ঠতল থেকে প্রথম রঙিন ছবি পাঠিয়েছিল।',
        highlight_en: 'Survived extreme heat and pressure to send back the first color surface photos.',
      },
    ],
    quickQuiz: {
      question_bn: 'বুধ সূর্যের নিকটতম হলেও শুক্র কেন সৌরজগতের সবচেয়ে গরম গ্রহ?',
      question_en: 'Why is Venus hotter than Mercury despite being farther from the Sun?',
      options_bn: [
        'শুক্রের কাছে দুটি সূর্য আছে',
        'ঘন কার্বন ডাই-অক্সাইড সূর্যের তাপ আটকে রাখে',
        'শুক্র নিজেই একটি জ্বলন্ত তারা',
        'শুক্রের কোনো পাহাড় নেই',
      ],
      options_en: [
        'Venus orbits two suns',
        'Dense CO2 traps solar heat in greenhouse effect',
        'Venus is actually a burning star',
        'It has no mountains',
      ],
      correctIndex: 1,
      explanation_bn:
        'তীব্র গ্রিনহাউস প্রতিক্রিয়ার কারণে শুক্রের ঘন বায়ুমণ্ডল সব তাপ আটকে ফেলে এবং তাপমাত্রা ৪৬৫°C এ উন্নীত করে।',
      explanation_en:
        'A runaway greenhouse effect traps immense solar heat under dense carbon dioxide clouds.',
    },
  },
  {
    id: 'mars',
    kind: 'planet',
    comingSoon: true,
    name_bn: 'মঙ্গল',
    name_en: 'Mars',
    summary_bn:
      'লাল ধুলোর গ্রহ। এখানেই আছে সৌরজগতের সবচেয়ে উঁচু আগ্নেয়গিরি অলিম্পাস মনস, আর রোভারেরা এখনো পথ চলছে।',
    summary_en:
      'The red dusty planet. It is home to Olympus Mons, the tallest volcano in the solar system, and rovers still roam its surface.',
    fact_bn: 'সূর্য থেকে ২২.৮ কোটি কিমি',
    fact_en: '228 million km from the Sun',
    tagline_bn: 'লাল ধুলোর জগত ও ভবিষ্যৎ মানুষের দ্বিতীয় ঠিকানা',
    tagline_en: 'The Red Planet & future human frontier',
    planetType_bn: 'শিলাময় গ্রহ',
    planetType_en: 'Terrestrial Planet',
    orderIndex: 4,
    gravityMultiplier: 0.38,
    gravityExplanation_bn:
      'এখানে ওজন পৃথিবীর মাত্র ৩৮%! পৃথিবীতে ৫০ কেজি হলে মঙ্গলে মাত্র ১৯ কেজি লাগবে। তুমি উঁচু পাঁচিলও এক লাফে টপকাতে পারবে!',
    gravityExplanation_en:
      'Gravity is 38% of Earth. A 50 kg cadet weighs just 19 kg here, making jumping effortless!',
    distance_bn: 'সূর্য থেকে ২২.৮ কোটি কিমি',
    distance_en: '228 million km from Sun',
    dayLength_bn: '২৪ ঘণ্টা ৩৭ মিনিট (পৃথিবীর মতো)',
    dayLength_en: '24 hours 37 mins (close to Earth)',
    yearLength_bn: '৬৮৭ পৃথিবী দিন (প্রায় ২ বছর)',
    yearLength_en: '687 Earth days (~2 Earth years)',
    temperatureLabel_bn: 'গড়ে -৬৩°C (হিমাঙ্কের নিচে)',
    temperatureLabel_en: 'Average -63°C',
    temperatureType: 'freezing',
    moonsCount: 2,
    moonsDetail_bn: 'ফোবোস ও ডিমোস (Phobos & Deimos)',
    moonsDetail_en: 'Phobos & Deimos',
    diameterComparison_bn: '৬,৭৭৯ কিমি (পৃথিবীর ব্যাসের প্রায় অর্ধেক)',
    diameterComparison_en: '6,779 km (~half the diameter of Earth)',
    atmosphere: {
      canBreathe: false,
      composition_bn: '৯৫% কার্বন ডাই-অক্সাইড (পৃথিবীর চেয়ে ১০০ গুণ পাতলা)',
      composition_en: '95% Carbon Dioxide (100x thinner than Earth’s air)',
      suitNeededReason_bn:
        'বাতাসে অক্সিজেন নেই, তীব্র হিমাঙ্ক ঠান্ডা এবং মহাজাগতিক ক্ষতিকর রেডিয়েশন সরাসরি পৃষ্ঠে আসে।',
      suitNeededReason_en:
        'No breathable oxygen, sub-zero cold, and intense cosmic radiation require full suits.',
    },
    banglaAnalogy_bn:
      'মঙ্গলের অলিম্পাস মনস (Olympus Mons) পর্বতটি মাউন্ট এভারেস্টের চেয়ে ৩ গুণ উঁচু — ২১ কিলোমিটার খাড়া! পুরো বাংলাদেশ এই একটা পর্বতের পায়ের কাছে এঁটে যেতে পারে!',
    banglaAnalogy_en:
      'Olympus Mons volcano on Mars is 3 times taller than Mount Everest (21 km high) — so massive that entire countries could sit at its base!',
    famousMissions: [
      {
        name: 'Perseverance & Ingenuity',
        agency: 'NASA',
        year: '২০২১',
        highlight_bn: 'জেজেরো খাদে প্রাচীন হ্রদের সন্ধান ও ভিনগ্রহে প্রথম হেলিকপ্টার ড্রোন উড্ডয়ন!',
        highlight_en: 'Hunting for ancient signs of life and flying the first helicopter on another planet.',
      },
      {
        name: 'Curiosity Rover',
        agency: 'NASA',
        year: '২০১২',
        highlight_bn: 'গেল খাদে প্রাচীন সুপেয় পানির হ্রদ ও প্রাণের অনুকূল পরিবেশ আবিষ্কার করে।',
        highlight_en: 'Discovered that ancient Mars had lakes capable of supporting microbial life.',
      },
    ],
    quickQuiz: {
      question_bn: 'মঙ্গল গ্রহকে রাতের আকাশে লালচে দেখায় কেন?',
      question_en: 'Why does Mars appear reddish in the night sky?',
      options_bn: [
        'মাটিতে প্রচুর মরচে ধরা আয়রন অক্সাইড আছে',
        'মঙ্গলে সবসময় আগুন জ্বলছে',
        'এখানে লাল রঙের গাছপালা আছে',
        'সূর্যের আলো সরাসরি লাল হয়ে পড়ে',
      ],
      options_en: [
        'Surface dust is rich in rusted iron oxide',
        'Fires burn constantly across the surface',
        'Red vegetation covers the soil',
        'Sunlight turns red upon entry',
      ],
      correctIndex: 0,
      explanation_bn:
        'মঙ্গলের ধূলিকণায় প্রচুর মরচে ধরা লোহার অক্সাইড (Iron Oxide / Rust) মিশে রয়েছে, যা রোদে লালচে আভা ছড়ায়!',
      explanation_en:
        'Rusted iron minerals in Martian soil reflect sunlight with a distinctive rusty-red tint.',
    },
  },
  {
    id: 'jupiter',
    kind: 'planet',
    comingSoon: true,
    name_bn: 'বৃহস্পতি',
    name_en: 'Jupiter',
    summary_bn:
      'সবচেয়ে বড় গ্রহ, গ্যাস দিয়ে তৈরি। এর মহা লাল দাগ কয়েকশো বছর ধরে চলা এক বিশাল ঝড়, আর চাঁদ আছে ৯০টিরও বেশি।',
    summary_en:
      'The biggest planet, made of gas. Its Great Red Spot is a giant storm that has raged for hundreds of years, and it has over 90 moons.',
    fact_bn: 'সূর্য থেকে ৭৭.৮ কোটি কিমি',
    fact_en: '778 million km from the Sun',
    tagline_bn: 'সৌরজগতের দানবীয় অধিপতি ও শত ঝড়ের রাজা',
    tagline_en: 'King of planets with colossal storms',
    planetType_bn: 'গ্যাস দৈত্য',
    planetType_en: 'Gas Giant',
    orderIndex: 5,
    gravityMultiplier: 2.53,
    gravityExplanation_bn:
      'এখানে ওজন আড়াই গুণেরও বেশি! ৫০ কেজি হলে তোমার ওজন লাগবে ১২৬.৫ কেজি — তুমি হাঁটু ভেঙে বসে পড়বে!',
    gravityExplanation_en:
      'Gravity is 2.53x Earth! A 50 kg person feels like 126.5 kg — walking would be exhausting!',
    distance_bn: 'সূর্য থেকে ৭৭.৮ কোটি কিমি',
    distance_en: '778 million km from Sun',
    dayLength_bn: '৯ ঘণ্টা ৫৫ মিনিট (সবচেয়ে দ্রুত দিন!)',
    dayLength_en: '9 hours 55 mins (fastest planetary spin!)',
    yearLength_bn: '১১.৮ পৃথিবী বছর',
    yearLength_en: '11.8 Earth years',
    temperatureLabel_bn: 'মেঘের শীর্ষে -১১০°C',
    temperatureLabel_en: 'Cloud tops -110°C',
    temperatureType: 'freezing',
    moonsCount: 95,
    moonsDetail_bn: '৯৫টি চাঁদ (গ্যানিমিড, ইউরোপা, আইও, ক্যালিস্টো)',
    moonsDetail_en: '95 moons (Ganymede, Europa, Io, Callisto)',
    diameterComparison_bn: '১,৩৯,৮২০ কিমি (১১টি পৃথিবী পাশাপাশি রাখলে সমান হবে!)',
    diameterComparison_en: '139,820 km (11 Earths lined up side-by-side!)',
    atmosphere: {
      canBreathe: false,
      composition_bn: '৯০% হাইড্রোজেন ও ১০% হিলিয়াম (কোনো কঠিন মাটি নেই!)',
      composition_en: '90% Hydrogen and 10% Helium (no solid surface!)',
      suitNeededReason_bn:
        'কোনো দাঁড়ানোর মাটি নেই; ভেতরে নামতে থাকলে দানবীয় চাপ ও তাপে যেকোনো মহাকাশযান পিষ্ট হয়ে যাবে।',
      suitNeededReason_en:
        'No solid ground exists; descending spacecraft are crushed by unimaginable fluid pressure.',
    },
    banglaAnalogy_bn:
      'যদি পৃথিবী একটি মার্বেল হয়, তবে বৃহস্পতি হবে একটি ফুটবলের মতো বিশাল! এর ভেতরের "মহা লাল দাগ" (Great Red Spot) এমন এক ভয়াল ঝড় যা শত শত বছর ধরে চলছে এবং তার ভেতর আস্ত একটা পৃথিবী অনায়াসে ঢুকে যাবে!',
    banglaAnalogy_en:
      'If Earth were a small marble, Jupiter would be a giant football! Its Great Red Spot is a storm so vast it could swallow our entire home planet!',
    famousMissions: [
      {
        name: 'Juno',
        agency: 'NASA',
        year: '২০১৬',
        highlight_bn: 'বৃহস্পতির রেডিয়েশন বলয় ভেদ করে এর গভীর মেঘ ও মহাজাগতিক অরোরা পর্যবেক্ষণ করছে।',
        highlight_en: 'Braving intense radiation to peer beneath Jupiter’s swirling cloud layers.',
      },
      {
        name: 'Galileo',
        agency: 'NASA',
        year: '১৯৯৫',
        highlight_bn: 'ইউরোপা চাঁদের বরফের নিচে লুকিয়ে থাকা বিশাল তরল মহাসমুদ্রের প্রমাণ আবিষ্কার করে!',
        highlight_en: 'Discovered strong evidence of a subsurface liquid ocean on the moon Europa.',
      },
    ],
    quickQuiz: {
      question_bn: 'বৃহস্পতির বিখ্যাত গ্রেট রেড স্পট (Great Red Spot) আসলে কী?',
      question_en: 'What is Jupiter’s famous Great Red Spot?',
      options_bn: [
        'একটি জ্বলন্ত আগ্নেয়গিরি',
        'শত শত বছর ধরে চলা এক দানবীয় ঝড়',
        'একটি লাল রঙের মহাসমুদ্র',
        'একটি বিশাল রক্তিম মরুভূমি',
      ],
      options_en: [
        'An active supervolcano',
        'A giant high-pressure storm raging for centuries',
        'A warm red ocean',
        'A vast desert crater',
      ],
      correctIndex: 1,
      explanation_bn:
        'এটি পৃথিবীর চেয়েও বড় একটি উচ্চচাপের ঘূর্ণিঝড়, যা অন্তত ৩৫০ বছর ধরে বৃহস্পতির আকাশে ঘুরছে!',
      explanation_en:
        'It is an anticyclonic storm larger than Earth, spinning in Jupiter’s atmosphere for centuries!',
    },
  },
  {
    id: 'saturn',
    kind: 'planet',
    comingSoon: true,
    name_bn: 'শনি',
    name_en: 'Saturn',
    summary_bn:
      'বরফ আর পাথরের সুন্দর বলয়ের গ্রহ। এটি এতই হালকা যে বিশাল এক পানির পুকুরে ফেললে ভেসে থাকত!',
    summary_en:
      'The planet with beautiful rings of ice and rock. It is so light that it would float if you could find a pool big enough!',
    fact_bn: 'সূর্য থেকে ১৪৩.৪ কোটি কিমি',
    fact_en: '1,434 million km from the Sun',
    tagline_bn: 'বরফ ও পাথরের মুগ্ধকর বলয়ের রাজপুত্র',
    tagline_en: 'The jewel of dazzling rings that floats in water',
    planetType_bn: 'গ্যাস দৈত্য',
    planetType_en: 'Gas Giant',
    orderIndex: 6,
    gravityMultiplier: 1.07,
    gravityExplanation_bn:
      'ওজন পৃথিবীর প্রায় সমান (১০৭%)। ৫০ কেজি হলে ওজন লাগবে ৫৩.৫ কেজি।',
    gravityExplanation_en:
      'Gravity is 1.07x Earth. A 50 kg cadet would weigh 53.5 kg here.',
    distance_bn: 'সূর্য থেকে ১৪৩.৪ কোটি কিমি',
    distance_en: '1.43 billion km from Sun',
    dayLength_bn: '১০ ঘণ্টা ৩৩ মিনিট',
    dayLength_en: '10 hours 33 mins',
    yearLength_bn: '২৯.৫ পৃথিবী বছর',
    yearLength_en: '29.5 Earth years',
    temperatureLabel_bn: '-১৪০°C (মাইনাস ১৪০ ডিগ্রি)',
    temperatureLabel_en: '-140°C',
    temperatureType: 'freezing',
    moonsCount: 146,
    moonsDetail_bn: '১৪৬টি চাঁদ (সৌরজগতের সর্বোচ্চ! যেমন টাইটান ও এনসেলাডাস)',
    moonsDetail_en: '146 moons (most in the solar system! e.g. Titan, Enceladus)',
    diameterComparison_bn: '১,১৬,৪৬৪ কিমি (পৃথিবীর ৯ গুণ বড়)',
    diameterComparison_en: '116,464 km (9x Earth’s width)',
    atmosphere: {
      canBreathe: false,
      composition_bn: 'হাইড্রোজেন ও হিলিয়াম; বলয়গুলো ৯৯% বরফের টুকরো',
      composition_en: 'Hydrogen & helium; rings made of 99% pure water ice',
      suitNeededReason_bn:
        'হিমশীতল ঠান্ডা (-১৪০°C), শ্বাস নেওয়ার মতো অক্সিজেন নেই এবং কোনো শক্ত মাটি নেই।',
      suitNeededReason_en:
        'Cryogenic freeze (-140°C), no oxygen, and crushing gas pressures deep down.',
    },
    banglaAnalogy_bn:
      'শনি গ্রহের গড় ঘনত্ব পানির চেয়েও কম (০.৬৮ গ্রাম/সিসি)! তুমি যদি এমন এক অলৌকিক বিশাল নদী খুঁজে পাও যাতে শনিকে রাখা যায়, তবে শনি গ্রহটি নৌকার মতো পানিতে ভেসে থাকবে!',
    banglaAnalogy_en:
      'Saturn is less dense than water! If you had a bathtub large enough to hold it, the entire ringed planet would float like a cork!',
    famousMissions: [
      {
        name: 'Cassini-Huygens',
        agency: 'NASA/ESA',
        year: '২০০৪',
        highlight_bn: 'শনির বলয়ের ভেতর রোমাঞ্চকর ডাইভ দেয় এবং টাইটান চাঁদে প্রোব অবতরণ করায়।',
        highlight_en: 'Explored Saturn for 13 years and deployed the Huygens probe onto Titan.',
      },
      {
        name: 'Voyager 1',
        agency: 'NASA',
        year: '১৯৮০',
        highlight_bn: 'শনির জটিল বলয় ও বায়ুমণ্ডলের প্রথম নিখুঁত ছবি পৃথিবীতে পাঠায়।',
        highlight_en: 'Captured high-resolution views of Saturn’s rings and atmosphere.',
      },
    ],
    quickQuiz: {
      question_bn: 'শনি গ্রহকে যদি এক বিশাল পানির দিঘিতে রাখা যেত, তবে কী হতো?',
      question_en: 'What would happen if Saturn were placed in a colossal ocean of water?',
      options_bn: [
        'তাৎক্ষণিক পাথরের মতো ডুবে যেত',
        'পানির ওপরে নৌকার মতো ভেসে থাকত',
        'বিস্ফোরণ হয়ে ধ্বংস হতো',
        'পুকুরের সব পানি শুষে নিত',
      ],
      options_en: [
        'It would sink like a stone',
        'It would float on the surface like a boat',
        'It would explode instantly',
        'It would absorb all the water',
      ],
      correctIndex: 1,
      explanation_bn:
        'শনি হালকা গ্যাস দিয়ে তৈরি এবং এর গড় ঘনত্ব পানির চেয়ে কম, তাই এটি পানিতে ভেসে থাকবে!',
      explanation_en:
        'Because Saturn’s average density is lower than water (0.69 g/cm³), it would physically float!',
    },
  },
  {
    id: 'uranus',
    kind: 'planet',
    comingSoon: true,
    name_bn: 'ইউরেনাস',
    name_en: 'Uranus',
    summary_bn:
      'হালকা নীল-সবুজ বরফের গ্রহ, যে কাত হয়ে গড়াতে গড়াতে সূর্যকে প্রদক্ষিণ করে। এর এক বছর পৃথিবীর প্রায় ৮৪ বছরের সমান।',
    summary_en:
      'A pale blue-green ice giant that orbits the Sun tipped on its side. One year here equals about 84 Earth years.',
    fact_bn: 'সূর্য থেকে ২৮৭.১ কোটি কিমি',
    fact_en: '2,871 million km from the Sun',
    tagline_bn: 'একপাশে কাত হয়ে শোয়া শীতল বরফ দৈত্য',
    tagline_en: 'The sideways tilted ice giant rolling in the dark',
    planetType_bn: 'বরফ দৈত্য',
    planetType_en: 'Ice Giant',
    orderIndex: 7,
    gravityMultiplier: 0.89,
    gravityExplanation_bn:
      'এখানে ওজন পৃথিবীর ৮৯%। ৫০ কেজি হলে ওজন লাগবে ৪৪.৫ কেজি।',
    gravityExplanation_en:
      'Gravity is 89% of Earth. A 50 kg explorer weighs 44.5 kg on Uranus.',
    distance_bn: 'সূর্য থেকে ২৮৭.১ কোটি কিমি',
    distance_en: '2.87 billion km from Sun',
    dayLength_bn: '১৭ ঘণ্টা ১৪ মিনিট',
    dayLength_en: '17 hours 14 mins',
    yearLength_bn: '৮৪ পৃথিবী বছর',
    yearLength_en: '84 Earth years',
    temperatureLabel_bn: '-২২৪°C (শীতলতম বায়ুমণ্ডল!)',
    temperatureLabel_en: '-224°C (Coldest atmosphere!)',
    temperatureType: 'freezing',
    moonsCount: 28,
    moonsDetail_bn: '২৮টি চাঁদ (মিরান্ডা, এরিয়েল, আমব্রিয়েল)',
    moonsDetail_en: '28 moons (Miranda, Ariel, Umbriel)',
    diameterComparison_bn: '৫০,৭২৪ কিমি (পৃথিবীর ৪ গুণ বড়)',
    diameterComparison_en: '50,724 km (~4x Earth’s diameter)',
    atmosphere: {
      canBreathe: false,
      composition_bn: 'হাইড্রোজেন, হিলিয়াম ও মিথেন বরফের কণা',
      composition_en: 'Hydrogen, helium, and methane ice crystals',
      suitNeededReason_bn:
        'সৌরজগতের সবচেয়ে হিমশীতল বায়ুমণ্ডল (-২২৪°C), যাতে যেকোনো পদার্থ নিমেষে শক্ত কাচ হয়ে ভেঙে যাবে।',
      suitNeededReason_en:
        'Coldest atmosphere in the solar system (-224°C); instant freezing without thermal protection.',
    },
    banglaAnalogy_bn:
      'ইউরেনাস যেন এক অলস গ্রহ! এটি লাটিমের মতো সোজা না ঘুরে প্রায় ৯৮ ডিগ্রি কাত হয়ে একপাশে শুয়ে শুয়ে গড়িয়ে চলে! এর ফলে এর উত্তর বা দক্ষিণ মেরুতে একটানা ৪২ বছর দিন এবং একটানা ৪২ বছর রাত থাকে!',
    banglaAnalogy_en:
      'Uranus spins tilted sideways at 98 degrees, rolling like a ball around the Sun! As a result, each pole experiences 42 years of continuous sunlight followed by 42 years of darkness!',
    famousMissions: [
      {
        name: 'Voyager 2',
        agency: 'NASA',
        year: '১৯৮৬',
        highlight_bn: 'ইতিহাসের একমাত্র মহাকাশযান যা ইউরেনাসের কাছ দিয়ে উড়ে গিয়ে এর বরফের রূপ ও নতুন চাঁদ আবিষ্কার করে।',
        highlight_en: 'The only spacecraft to fly past Uranus, discovering 10 new moons and dark rings.',
      },
    ],
    quickQuiz: {
      question_bn: 'ইউরেনাস গ্রহের রঙ সুন্দর সায়ান বা হালকা নীল-সবুজ দেখায় কেন?',
      question_en: 'Why does Uranus appear pale cyan/blue-green?',
      options_bn: [
        'বায়ুমণ্ডলে মিথেন গ্যাস লাল আলো শোষণ করে',
        'এখানে বিশাল সবুজ বনভূমি আছে',
        'গ্রহটিতে প্রচুর তামা আছে',
        'সূর্যের রশ্মি প্রতিফলিত হয় না',
      ],
      options_en: [
        'Methane gas absorbs red light and reflects cyan',
        'It is covered in green vegetation',
        'It is made of metallic copper',
        'Sunlight never reaches it',
      ],
      correctIndex: 0,
      explanation_bn:
        'ইউরেনাসের মিথেন গ্যাস সূর্যের আলোর লাল তরঙ্গদৈর্ঘ্য শুষে নেয় এবং নীল-সবুজ রঙ মহাকাশে প্রতিফলিত করে।',
      explanation_en:
        'Methane in the upper atmosphere absorbs red light and scatters cyan-green back into space.',
    },
  },
  {
    id: 'neptune',
    kind: 'planet',
    comingSoon: true,
    name_bn: 'নেপচুন',
    name_en: 'Neptune',
    summary_bn:
      'সূর্য থেকে সবচেয়ে দূরের গাঢ় নীল গ্রহ। এখানে বাতাস ঘণ্টায় ২,০০০ কিমিরও বেশি বেগে বয়, আর এক বছর পৃথিবীর ১৬৫ বছরের সমান!',
    summary_en:
      'The deep blue planet farthest from the Sun. Winds here top 2,000 km/h, and one year equals 165 Earth years!',
    fact_bn: 'সূর্য থেকে ৪৪৯.৫ কোটি কিমি',
    fact_en: '4,495 million km from the Sun',
    tagline_bn: 'দূরতম ঝঞ্ঝাবিক্ষুব্ধ অতিবেগী নীল বরফ সাম্রাজ্য',
    tagline_en: 'The supersonic windswept deep blue ice world',
    planetType_bn: 'বরফ দৈত্য',
    planetType_en: 'Ice Giant',
    orderIndex: 8,
    gravityMultiplier: 1.14,
    gravityExplanation_bn:
      'এখানে ওজন পৃথিবীর ১১৪%। ৫০ কেজি হলে ওজন লাগবে ৫৭ কেজি।',
    gravityExplanation_en:
      'Gravity is 1.14x Earth. A 50 kg cadet weighs 57 kg on Neptune.',
    distance_bn: 'সূর্য থেকে ৪৪৯.৫ কোটি কিমি',
    distance_en: '4.5 billion km from Sun',
    dayLength_bn: '১৬ ঘণ্টা ৬ মিনিট',
    dayLength_en: '16 hours 6 mins',
    yearLength_bn: '১৬৫ পৃথিবী বছর!',
    yearLength_en: '165 Earth years!',
    temperatureLabel_bn: '-২১৮°C (অতি শীতল হিমবাহ)',
    temperatureLabel_en: '-218°C',
    temperatureType: 'freezing',
    moonsCount: 16,
    moonsDetail_bn: '১৬টি চাঁদ (যার মধ্যে ট্রাইটন উল্টো দিকে ঘোরে!)',
    moonsDetail_en: '16 moons (including retrograde Triton!)',
    diameterComparison_bn: '৪৯,২৪৪ কিমি (পৃথিবীর প্রায় ৪ গুণ)',
    diameterComparison_en: '49,244 km (~4x Earth’s diameter)',
    atmosphere: {
      canBreathe: false,
      composition_bn: 'হাইড্রোজেন, হিলিয়াম, মিথেন ও প্রচণ্ড ঘূর্ণিবায়ু',
      composition_en: 'Hydrogen, helium, methane, and supersonic storm winds',
      suitNeededReason_bn:
        'ঘণ্টায় ২,০০০ কিমি গতির অতিবেগী ঝড় এবং চরম হিমাঙ্ক ঠান্ডা (-২১৮°C)।',
      suitNeededReason_en:
        'Supersonic winds topping 2,000 km/h and extreme deep-freeze temperatures.',
    },
    banglaAnalogy_bn:
      'নেপচুনের বাতাস সুপারসনিক — অর্থাৎ শব্দের গতির চেয়েও দ্রুত ছোটে (ঘন্টায় ২০০০ কিমি)! পৃথিবীর সবচেয়ে বিধ্বংসী ক্যাটাগরি-৫ ঘূর্ণিঝড়ের বাতাসের গতি ঘণ্টায় ২৫০ কিমি; নেপচুনের ঝড় তার চেয়েও ৮ গুণ বেশি উন্মত্ত!',
    banglaAnalogy_en:
      'Neptune has the wildest winds in the solar system, exceeding 2,000 km/h — over 8 times faster than Earth’s most violent Category 5 cyclones!',
    famousMissions: [
      {
        name: 'Voyager 2',
        agency: 'NASA',
        year: '১৯৮৯',
        highlight_bn: 'ইতিহাসের একমাত্র যান যা নেপচুনের গা ঘেঁষে উড়ে যায় এবং ট্রাইটন চাঁদে বরফ ও নাইট্রোজেন গিজার আবিষ্কার করে।',
        highlight_en: 'Only spacecraft to visit Neptune, discovering nitrogen geysers on moon Triton.',
      },
    ],
    quickQuiz: {
      question_bn: 'নেপচুন একবার সূর্যকে ঘুরে আসতে পৃথিবীর কত সময় লাগে?',
      question_en: 'How long does Neptune take to orbit the Sun once?',
      options_bn: ['১২ বছর', '৩৬৫ দিন', '১৬৫ বছর', '৫০ বছর'],
      options_en: ['12 years', '365 days', '165 Earth years', '50 years'],
      correctIndex: 2,
      explanation_bn:
        'সূর্য থেকে প্রায় ৪৫০ কোটি কিমি দূরে হওয়ায় নেপচুনের বিশাল কক্ষপথ একবার ঘুরে আসতে ১৬৫টি পৃথিবী বছর লেগে যায়!',
      explanation_en:
        'Being 4.5 billion km away, Neptune takes 165 Earth years to complete one full solar revolution!',
    },
  },
];

export function getDestinationById(id: DestinationId): SpaceDestination {
  return SPACE_DESTINATIONS.find((d) => d.id === id) || SPACE_DESTINATIONS[0];
}
