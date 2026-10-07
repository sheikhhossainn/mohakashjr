/**
 * cosmicTopics.ts
 * Pure utility functions for detecting and classifying space topics
 * from English and Bengali text. Independent of UI/React Native frameworks.
 */

export type CosmicTopic =
  | 'moon'
  | 'blackhole'
  | 'rocket'
  | 'iss'
  | 'spacesuit'
  | 'jwst'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'venus'
  | 'mercury'
  | 'earth'
  | 'sun';

/**
 * Detect cosmic topic from Bangla or English text.
 */
export function detectCosmicTopic(text?: string, fallback: CosmicTopic = 'moon'): CosmicTopic {
  if (!text) return fallback;
  const lower = text.toLowerCase();

  // 1. Black hole keywords
  if (
    lower.includes('black hole') ||
    lower.includes('blackhole') ||
    lower.includes('singularity') ||
    lower.includes('event horizon') ||
    lower.includes('ব্ল্যাক হোল') ||
    lower.includes('কৃষ্ণগহ্বর') ||
    lower.includes('কৃষ্ণ গহ্বর') ||
    lower.includes('সিংগুলারিটি') ||
    lower.includes('ইভেন্ট হরাইজন')
  ) {
    return 'blackhole';
  }

  // 2. Spacesuit keywords
  if (
    lower.includes('spacesuit') ||
    lower.includes('space suit') ||
    lower.includes('helmet') ||
    lower.includes('visor') ||
    lower.includes('স্পেসস্যুট') ||
    lower.includes('স্পেস স্যুট') ||
    lower.includes('ভাইজর') ||
    lower.includes('হেলমেট') ||
    lower.includes('পোশাক')
  ) {
    return 'spacesuit';
  }

  // 3. Rocket keywords
  if (
    lower.includes('rocket') ||
    lower.includes('propulsion') ||
    lower.includes('liftoff') ||
    lower.includes('escape velocity') ||
    lower.includes('saturn v') ||
    lower.includes('thrust') ||
    lower.includes('রকেট') ||
    lower.includes('ইঞ্জিন') ||
    lower.includes('জ্বালানি') ||
    lower.includes('মুক্তিবেগ') ||
    lower.includes('উৎক্ষেপণ') ||
    lower.includes('স্যাটার্ন') ||
    lower.includes('অগ্নিকুণ্ড')
  ) {
    return 'rocket';
  }

  // 4. ISS / Orbit / Microgravity keywords
  if (
    lower.includes('iss') ||
    lower.includes('space station') ||
    lower.includes('station') ||
    lower.includes('microgravity') ||
    lower.includes('weightless') ||
    lower.includes('orbit') ||
    lower.includes('মহাকাশ স্টেশন') ||
    lower.includes('স্পেস স্টেশন') ||
    lower.includes('ওজনহীনতা') ||
    lower.includes('ওজনহীন') ||
    lower.includes('মাইক্রোগ্র্যাভিটি') ||
    lower.includes('কক্ষপথ') ||
    lower.includes('ভেসে')
  ) {
    return 'iss';
  }

  // 5. James Webb / Telescope / Deep Cosmos keywords
  if (
    lower.includes('jwst') ||
    lower.includes('james webb') ||
    lower.includes('telescope') ||
    lower.includes('hubble') ||
    lower.includes('deep field') ||
    lower.includes('infrared') ||
    lower.includes('জেমস ওয়েব') ||
    lower.includes('টেলিস্কোপ') ||
    lower.includes('দূরবীন') ||
    lower.includes('ইনফ্রারেড') ||
    lower.includes('ছায়াপথ')
  ) {
    return 'jwst';
  }

  // 6. Mars keywords
  if (
    lower.includes('mars') ||
    lower.includes('perseverance') ||
    lower.includes('curiosity') ||
    lower.includes('rover') ||
    lower.includes('jezero') ||
    lower.includes('ingenuity') ||
    lower.includes('moxie') ||
    lower.includes('মঙ্গল') ||
    lower.includes('পারসিভিয়ারেন্স') ||
    lower.includes('কিউরিওসিটি') ||
    lower.includes('রোভার') ||
    lower.includes('মক্সি') ||
    lower.includes('ইনজেনুইটি')
  ) {
    return 'mars';
  }

  // 7. Jupiter keywords
  if (
    lower.includes('jupiter') ||
    lower.includes('juno') ||
    lower.includes('great red spot') ||
    lower.includes('বৃহস্পতি') ||
    lower.includes('জুনো')
  ) {
    return 'jupiter';
  }

  // 8. Saturn keywords
  if (
    lower.includes('saturn') ||
    lower.includes('cassini') ||
    lower.includes('titan') ||
    lower.includes('rings') ||
    lower.includes('শনি') ||
    lower.includes('ক্যাসিনি') ||
    lower.includes('টাইটান')
  ) {
    return 'saturn';
  }

  // 9. Venus keywords
  if (
    lower.includes('venus') ||
    lower.includes('venera') ||
    lower.includes('davinci') ||
    lower.includes('শুক্র') ||
    lower.includes('ভেনেরা')
  ) {
    return 'venus';
  }

  // 10. Mercury keywords
  if (
    lower.includes('mercury') ||
    lower.includes('messenger') ||
    lower.includes('bepicolombo') ||
    lower.includes('বুধ') ||
    lower.includes('মেসেঞ্জার')
  ) {
    return 'mercury';
  }

  // 11. Sun keywords
  if (
    lower.includes('sun') ||
    lower.includes('solar') ||
    lower.includes('helio') ||
    lower.includes('সূর্য') ||
    lower.includes('সৌর') ||
    lower.includes('সোলার')
  ) {
    return 'sun';
  }

  // 12. Earth keywords
  if (
    lower.includes('earth') ||
    lower.includes('atmosphere') ||
    lower.includes('blue marble') ||
    lower.includes('পৃথিবী') ||
    lower.includes('বায়ুমণ্ডল')
  ) {
    return 'earth';
  }

  // 13. Moon keywords
  if (
    lower.includes('moon') ||
    lower.includes('lunar') ||
    lower.includes('apollo') ||
    lower.includes('artemis') ||
    lower.includes('regolith') ||
    lower.includes('armstrong') ||
    lower.includes('চাঁদ') ||
    lower.includes('চন্দ্র') ||
    lower.includes('লুনার') ||
    lower.includes('অ্যাপোলো') ||
    lower.includes('আর্টেমিস') ||
    lower.includes('আর্মস্ট্রং')
  ) {
    return 'moon';
  }

  return fallback;
}
