/**
 * Mohakash Jr. — Typography System v2
 * Designed for Bangladeshi children reading Bengali science text.
 *
 * Key decisions:
 * - Bengali body at 18pt with 1.88x line-height (critical for diacritics)
 * - Headings: Baloo Da 2 (rounded, Bengali + Latin). Body: Noto Sans Bengali
 * - English UI labels: Nunito (rounded, friendly, edu-app standard)
 * - Card padding increased to 24px for more breathing room
 *
 * SACRED CONSTRAINTS (do not change):
 * - NotoSansBengali-* font family names (loaded in _layout.tsx)
 * - HindSiliguri-* font family names (loaded in _layout.tsx)
 * - body lineHeight >= 32px (prevents Bengali diacritic clipping)
 * - bodySmall lineHeight >= 28px
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

  // Bengali Typographic Families (SACRED — do not rename)
  family: {
    notoRegular:  'NotoSansBengali-Regular',
    notoSemiBold: 'NotoSansBengali-SemiBold',
    notoBold:     'NotoSansBengali-Bold',
    hindRegular:  'HindSiliguri-Regular',
    hindSemiBold: 'HindSiliguri-SemiBold',
    hindBold:     'HindSiliguri-Bold',
    // Headings & UI labels — Baloo Da 2: rounded, friendly, Bengali + Latin in one family
    heading:        'BalooDa2-Bold',
    headingSemi:    'BalooDa2-SemiBold',
    headingMedium:  'BalooDa2-Medium',
    // Legacy aliases (old Hind-based names now resolve to Baloo Da 2)
    display:        'BalooDa2-Bold',
    displayRegular: 'HindSiliguri-Regular',
    displaySemiBold:'BalooDa2-SemiBold',
  },

  // Font Sizes — Generous for children's readability
  size: {
    hero:      32,  // Screen greeting / milestone
    h1:        26,  // Primary section title
    h2:        22,  // Card header / lesson title
    h3:        19,  // Subtitle / module title
    body:      18,  // Core reading text
    bodySmall: 16,  // Explanations / dialogue
    caption:   14,  // Tags / badges / secondary labels
    micro:     12,  // Smallest allowed size — metadata only
    tag:       13,  // Category badges
  },

  // Calibrated Line Heights — Extra generous for Bengali conjuncts & diacritics
  // Bengali diacritics (কার-ফলা ও যুক্তবর্ণ) need room above AND below
  lineHeight: {
    hero:      44,
    h1:        38,
    h2:        32,
    h3:        28,
    body:      32,  // SACRED: >= 32
    bodySmall: 28,  // SACRED: >= 28
    caption:   22,
    micro:     18,
  },

  // Font Weights
  weight: {
    regular:  '400' as const,
    medium:   '500' as const,
    semiBold: '600' as const,
    bold:     '700' as const,
    heavy:    '800' as const,
    black:    '900' as const,
  },

  // Spacing tokens for text containers
  textPadding: {
    card:      24,  // Minimum padding inside any card with text (up from 20)
    section:   24,  // Padding between sections
    paragraph: 20,  // Spacing between paragraphs
    inline:    16,  // Inline element spacing
  },

  // Letter spacing
  letterSpacing: {
    // Keep at 0 for Bengali — tracking breaks conjuncts (যুক্তবর্ণ)
    tight:    0,
    normal:   0,
    wide:     0,
    wider:    0,
    widest:   0,
  },
};
