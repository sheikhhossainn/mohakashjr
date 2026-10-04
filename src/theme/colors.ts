/**
 * Mohakash Jr. — "Deep Space" palette
 *
 * One calm dark canvas for the whole app. Bright accents; filled surfaces use
 * dark text (Colors.textDark). Every text/background pair is >= 4.5:1.
 *
 *  - surface ladder: #0B1026 -> #151C42 -> #1F2858
 *  - primary (nebula blue) = actions, gold = XP & rewards,
 *    emerald / coral = right / wrong answers only
 *  - other hues are reserved for archetype badges and lesson moods
 */

export const Colors = {
  // ─── Light Surfaces (Daily Learning Screens) ────────────────────────
  background: '#0B1026',           // Warm cream — primary canvas
  backgroundSecondary: '#10173A',  // Slightly warmer variant
  backgroundTertiary: '#1F2858',   // Soft indigo tint (selected states)

  // ─── Card Surfaces (Light Mode) ─────────────────────────────────────
  surface: '#151C42',              // Pure white card
  surfaceWarm: '#1A2250',          // Warm-tinted card (lesson, story cards)
  surfaceCard: '#151C42',          // Alias for compat
  surfaceElevated: '#1F2858',      // Soft blue-tint elevated card
  surfaceGlass: 'rgba(21,28,66,0.88)', // Translucent glass (modals)
  surfaceHighlight: 'rgba(140,155,255,0.08)', // Very subtle primary tint
  surfaceShell: '#151C42',         // Kept for _layout.tsx compat

  // ─── Borders (Light Mode) ───────────────────────────────────────────
  border: 'rgba(255,255,255,0.10)',
  borderSubtle: 'rgba(255,255,255,0.06)',
  borderLight: 'rgba(255,255,255,0.14)',
  borderMedium: 'rgba(255,255,255,0.20)',
  // Legacy compat keys — kept so mission components don't break
  borderGlowBlue: '#8C9BFF',
  borderGlowGold: '#FFC94D',
  borderGlowEmerald: '#5DD39E',
  borderGlowPink: '#FF7A90',

  // ─── Space Dark (Immersive Moments Only) ────────────────────────────
  // Used by: mission game, atmospheric journey, splash, lesson mood headers
  spaceDark: '#0D1035',
  spaceDeep: '#161B3D',
  spaceMid: '#1E2450',
  spaceCard: '#1A2045',
  void: '#0D1035',                 // Legacy alias used in _layout and mission files

  // ─── Constellation Blue — Primary Actions ───────────────────────────
  primary: '#8C9BFF',
  primaryLight: '#B4BEFF',
  primaryDark: '#5F6FE0',
  primaryBg: 'rgba(140,155,255,0.16)',

  // ─── Solar Flare Gold — XP, Achievement, Rewards ────────────────────
  gold: '#FFC94D',
  goldLight: '#FFE08A',
  goldDark: '#D99A1E',
  goldBg: 'rgba(255,201,77,0.14)',
  thermalGold: '#FFC94D',          // Legacy alias
  thermalGoldBg: 'rgba(255,201,77,0.14)',

  // ─── Aurora Emerald — Correct Answers, Success ──────────────────────
  emerald: '#5DD39E',
  emeraldLight: '#8AE8BF',
  emeraldDark: '#2FA173',
  emeraldBg: 'rgba(93,211,158,0.14)',
  telemetryGreen: '#5DD39E',       // Legacy alias
  telemetryGreenBg: 'rgba(93,211,158,0.14)',

  // ─── Sunrise Coral — Gentle Errors, Retries ─────────────────────────
  coral: '#FF7A90',
  coralLight: '#FFA3B3',
  coralDark: '#D9546C',
  coralBg: 'rgba(255,122,144,0.14)',
  hazardRed: '#FF7A90',            // Legacy alias
  hazardRedBg: 'rgba(255,122,144,0.14)',

  // ─── Soft Violet — Delight, Alien Explorer Archetype ────────────────
  pink: '#E08BFF',
  pinkLight: '#EDB0FF',
  pinkDark: '#B85FD9',
  pinkBg: 'rgba(224,139,255,0.14)',

  // ─── Deep Purple — Special, Stargazer Archetype ─────────────────────
  purple: '#A78BFA',
  purpleLight: '#C4B0FF',
  purpleDark: '#7C5FD6',
  purpleBg: 'rgba(167,139,250,0.16)',
  plasmaViolet: '#A78BFA',         // Legacy alias
  plasmaVioletBg: 'rgba(167,139,250,0.16)',

  // ─── Ocean Cyan — Space Engineer Archetype, Info ────────────────────
  cyan: '#4CC9E0',
  cyanLight: '#8BE0F0',
  cyanDark: '#2A9DB5',
  cyanBg: 'rgba(76,201,224,0.14)',
  hudCyan: '#4CC9E0',              // Legacy alias
  hudCyanBg: 'rgba(76,201,224,0.14)',

  // ─── Warm Amber — Warnings, Rocket Pilot Archetype ──────────────────
  reentryAmber: '#FF9A4D',
  reentryAmberBg: 'rgba(255,154,77,0.14)',

  // ─── Typography — Light & Dark Variants ─────────────────────────────
  // On light backgrounds (most screens)
  text: '#F2F4FF',                 // Warm dark navy — primary text
  textSecondary: '#B8BEDD',        // Secondary text
  textMuted: '#8F97BF',            // Muted hints, labels
  textDark: '#0B1026',             // On light button faces (dark text)

  // On space-dark backgrounds (mission, splash)
  textOnDark: '#F2F4FF',           // Warm snow white
  textOnDarkMuted: '#B8BEDD',      // Warm silver

  // ─── Status & Feedback ──────────────────────────────────────────────
  correct: '#5DD39E',
  correctBg: 'rgba(93,211,158,0.16)',
  incorrect: '#FF7A90',
  incorrectBg: 'rgba(255,122,144,0.16)',
  info: '#4CC9E0',
  infoBg: 'rgba(76,201,224,0.16)',

  // ─── Space Ranks ────────────────────────────────────────────────────
  rankCadet: '#8C9BFF',
  rankAstronaut: '#5DD39E',
  rankSpecialist: '#A78BFA',
  rankCommander: '#FFC94D',
};

// ─── Per-Lesson Gradient Moods ──────────────────────────────────────
// Used for illustration headers, mission backgrounds, contextual tints
// These stay space-dark — they're immersive illustration backgrounds
export const LessonMoods = {
  moon:   { from: '#1a1f4e', via: '#2d3580', to: '#4a5aaf' },
  mars:   { from: '#2a1520', via: '#5c2530', to: '#a04050' },
  iss:    { from: '#0f1a30', via: '#1a3050', to: '#2a5080' },
  jwst:   { from: '#1a0f30', via: '#30184e', to: '#5a28a0' },
  earth:  { from: '#0f2018', via: '#1a4030', to: '#2a6050' },
  sun:    { from: '#2a1a0f', via: '#4e3018', to: '#805028' },
  stars:  { from: '#0f0f28', via: '#1a1a48', to: '#2828a0' },
  rocket: { from: '#1a1028', via: '#30184e', to: '#5a2080' },
} as const;

// ─── Atmospheric Layer Colors (for Mission Atmospheric Journey) ──────
export const AtmosphereColors = {
  ground:       '#87CEEB',   // Sky blue — ground / launch pad
  troposphere:  '#4A90D9',   // Mid blue — 0–12 km
  stratosphere: '#1A3A6E',   // Deep blue — 12–50 km
  mesosphere:   '#0D1B3E',   // Dark navy-blue — 50–80 km
  thermosphere: '#060B1A',   // Near-black with aurora — 80–700 km
  exosphere:    '#020408',   // Near pure black — 700–10,000 km
  deepSpace:    '#000000',   // Black — beyond exosphere
} as const;
