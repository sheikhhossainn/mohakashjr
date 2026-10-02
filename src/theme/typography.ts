/**
 * Mohakash Jr. — "Illustrated Book" Typography System
 * Designed for Bangladeshi children reading Bengali science text.
 *
 * Key decisions:
 * - Body text at 17pt (up from 15pt) for comfortable reading
 * - Line-height at 1.85x for Bengali diacritics breathing room
 * - 20px minimum padding around all text containers
 * - Hind Siliguri for headings, Noto Sans Bengali for body
 */

// Safe font resolution that works across React Native runtime, Web, and Node.js test runners
const fontSans = (() => {
  try {
    const { Platform } = require('react-native');
    return Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'sans-serif',
    });
  } catch {
    return 'sans-serif';
  }
})();

export const Typography = {
  fontSans,

  // Bengali Typographic Families
  family: {
    notoRegular: 'NotoSansBengali-Regular',
    notoSemiBold: 'NotoSansBengali-SemiBold',
    notoBold: 'NotoSansBengali-Bold',
    hindRegular: 'HindSiliguri-Regular',
    hindSemiBold: 'HindSiliguri-SemiBold',
    hindBold: 'HindSiliguri-Bold',
  },

  // Font Sizes — Generous for children's readability
  size: {
    hero: 28,          // Screen greeting / milestone
    h1: 24,            // Primary section title (up from 22)
    h2: 20,            // Card header / lesson title (up from 18)
    h3: 17,            // Subtitle / module title (up from 16)
    body: 17,          // Core reading text (up from 15 — critical change)
    bodySmall: 15,     // Explanations / dialogue (up from 14)
    caption: 13,       // Tags / badges
    micro: 11,         // Subtle metadata
    tag: 12,           // Category badges
  },

  // Calibrated Line Heights — Extra generous for Bengali conjuncts
  // Bengali diacritics (কার-ফলা ও যুক্তবর্ণ) need room above AND below
  lineHeight: {
    hero: 40,          // 1.43x — headings can be tighter
    h1: 34,            // 1.42x
    h2: 30,            // 1.5x
    h3: 28,            // 1.65x
    body: 32,          // 1.88x — generous reading flow for Bengali
    bodySmall: 28,     // 1.87x
    caption: 20,       // 1.54x
    micro: 16,         // 1.45x
  },

  // Font Weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
    black: '900' as const,
  },

  // Spacing tokens for text containers
  textPadding: {
    card: 20,          // Minimum padding inside any card with text
    section: 24,       // Padding between sections
    paragraph: 20,     // Spacing between paragraphs
    inline: 16,        // Inline element spacing
  },
};
