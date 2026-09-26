import offlineQAList from '../content/offline_tutor.json';
import { OfflineQAItem } from '../content/schema';

const ITEMS: OfflineQAItem[] = offlineQAList as OfflineQAItem[];

// Common Bengali stop words to avoid false positive matching
const STOP_WORDS = new Set([
  'কী',
  'কি',
  'কেন',
  'কিভাবে',
  'কীভাবে',
  'কত',
  'কোন',
  'কোনটি',
  'কোথায়',
  'কার',
  'কেমন',
  'এর',
  'এবং',
  'বা',
  'ও',
  'থেকে',
  'দিয়ে',
  'করে',
  'হয়',
  'হবে',
  'ছিল',
  'আছে',
  'না',
  'একটি',
  'এই',
  'সেই',
  'আজকে',
  'দাম',
  'বলেন',
  'বলো',
  'জানাও',
  'হলে',
  'হতে',
  'নাকি',
]);

/**
 * Normalizes query string by trimming, lowering case, and stripping Bengali & English punctuation.
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[।?!,.:;'"(){}\[\]\\\/_\-—–]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface OfflineSearchResult {
  item: OfflineQAItem | null;
  matchScore: number;
  answer_bn: string;
  matchedCategory?: string;
  suggestedQuestions_bn: string[];
}

/**
 * Offline keyword & similarity matcher for young astronauts.
 * Day 2 deliverable for Jim's offline AI Tutor chat screen.
 */
export function findOfflineAnswer(rawQuery: string): OfflineSearchResult {
  if (!rawQuery || rawQuery.trim().length === 0) {
    return {
      item: null,
      matchScore: 0,
      answer_bn:
        'হ্যালো তরুণ ক্যাডেট! মহাকাশ সম্পর্কে তোমার যেকোনো কৌতুহলী প্রশ্ন আমাকে বাংলায় জিজ্ঞেস করতে পারো। যেমন: "চাঁদে কি পানি আছে?" বা "মহাকাশে নভোচারীরা কীভাবে ঘুমান?"',
      suggestedQuestions_bn: [
        'চাঁদে কি সত্যিই পানি বা বরফ আছে?',
        'মহাকাশে নভোচারীরা কীভাবে ঘুমান?',
        'স্পেসস্যুটের কাজ কী এবং এর দাম কত?',
      ],
    };
  }

  const query = normalizeText(rawQuery);
  const queryTokens = query
    .split(' ')
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));

  let bestItem: OfflineQAItem | null = null;
  let highestScore = 0;

  for (const item of ITEMS) {
    let score = 0;
    const normalizedQuestion = normalizeText(item.question_bn);
    const questionTokens = normalizedQuestion
      .split(' ')
      .filter((t) => t.length > 1 && !STOP_WORDS.has(t));

    // Exact question match
    if (query === normalizedQuestion || normalizedQuestion.includes(query)) {
      score += 20;
    }

    // Keyword matching
    for (const kw of item.keywords) {
      const normalizedKw = normalizeText(kw);
      if (query.includes(normalizedKw)) {
        score += 8;
      } else {
        // Token level overlap against keywords
        for (const token of queryTokens) {
          if (token === normalizedKw) {
            score += 6;
          } else if (
            token.length >= 4 &&
            normalizedKw.length >= 4 &&
            (normalizedKw.includes(token) || token.includes(normalizedKw))
          ) {
            score += 3;
          }
        }
      }
    }

    // Direct token overlap with substantive question tokens
    for (const token of queryTokens) {
      if (questionTokens.includes(token)) {
        score += 4;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestItem = item;
    }
  }

  // Threshold check: need at least score >= 6 for a confident answer
  if (bestItem && highestScore >= 6) {
    return {
      item: bestItem,
      matchScore: highestScore,
      answer_bn: bestItem.answer_bn,
      matchedCategory: bestItem.category,
      suggestedQuestions_bn: bestItem.quick_replies_bn || [
        'চাঁদে কি পানি আছে?',
        'মহাকাশ স্টেশন কী?',
      ],
    };
  }

  // Friendly Fallback when query is not in offline knowledge base
  return {
    item: null,
    matchScore: highestScore,
    answer_bn: `অসাধারণ প্রশ্ন, তরুণ মহাকাশচারী! 🚀\nআমি এখন অফলাইন মোডে মহাকাশ যানে আছি, তাই ইন্টারনেটের সাহায্য ছাড়া তোমার এই প্রশ্নের উত্তর খুঁজে পেতে একটু সময় লাগছে। তুমি কি নিচের জনপ্রিয় প্রশ্নগুলোর কোনোটি জানতে চাও?`,
    suggestedQuestions_bn: [
      'চাঁদে কি সত্যিই পানি বা বরফ আছে?',
      'মহাকাশে নভোচারীরা কীভাবে বাথরুমে যান?',
      'জেমস ওয়েব স্পেস টেলিস্কোপের বিশেষত্ব কী?',
      'মানুষ কি মঙ্গল গ্রহে বাস করতে পারবে?',
    ],
  };
}

/**
 * Returns all offline Q&A items for browse/topic lists.
 */
export function getAllOfflineQuestions(): OfflineQAItem[] {
  return ITEMS;
}

/**
 * Returns questions filtered by category.
 */
export function getOfflineQuestionsByCategory(category: string): OfflineQAItem[] {
  return ITEMS.filter((item) => item.category === category);
}
