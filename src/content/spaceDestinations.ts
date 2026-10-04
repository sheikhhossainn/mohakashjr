/**
 * Space Travel hub — every place a cadet can fly to.
 * Only the Moon mission is playable today; the rest are marked comingSoon.
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
  },
];
