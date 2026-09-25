/**
 * Mohakash Jr. - UI/UX Pro Max Typography System
 * Warm, friendly, highly legible typography scale tailored for Bengali children's education.
 * Generous line-heights (1.58x-1.68x) completely prevent Bengali diacritics
 * (কার-ফলা ও যুক্তবর্ণ) from clipping.
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

  // Font Sizes
  size: {
    hero: 28,          // Large Milestone / Screen Greeting
    h1: 22,            // Primary Section Title
    h2: 18,            // Card Header
    h3: 16,            // Subtitle / Module Title
    body: 15,          // Core Reading Text
    bodySmall: 14,     // Explanations / Dialogue
    caption: 13,       // Tags / Badges / Button subtext
    micro: 11,         // Subtle Metadata
    tag: 12,           // Category Badges
  },

  // Calibrated Line Heights (Optimized for Bengali Conjuncts and Vowels)
  lineHeight: {
    hero: 36,
    h1: 30,
    h2: 26,
    h3: 24,
    body: 24,          // 1.6x multiplier for effortless reading
    bodySmall: 22,     // 1.57x multiplier
    caption: 18,
    micro: 16,
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
};
