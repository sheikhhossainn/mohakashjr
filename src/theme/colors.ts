/**
 * Mohakash Jr. — "Soft Space" Illustrated Cosmos Palette
 * Warm dark backgrounds that feel like reading an astronomy book at night.
 * Strategic accent colors only on action targets — never ambient decoration.
 * Per-lesson gradient moods for contextual illustration backgrounds.
 *
 * Design philosophy: cozy wonder, not clinical cockpit.
 */

export const Colors = {
  // ─── Warm Cosmic Backgrounds ───────────────────────────────────────
  // Slightly warm indigos — not cold voids
  void: '#0F1128',                 // Deep illustrated-book indigo
  background: '#0F1128',           // Primary screen canvas
  backgroundSecondary: '#161B3D',  // Card / elevated surface
  backgroundTertiary: '#1E2450',   // Highlighted surface

  // ─── Single-Surface Card System ────────────────────────────────────
  // One clean surface per card — no nested bezels, no specular rims
  surface: '#161B3D',              // Primary card background
  surfaceShell: '#161B3D',         // Kept for compat — same as surface
  surfaceCard: '#1A2045',          // Slightly lighter card interior
  surfaceElevated: '#222A55',      // Interactive / highlighted card
  surfaceGlass: 'rgba(22, 27, 61, 0.90)',
  surfaceHighlight: 'rgba(255, 255, 255, 0.06)', // Very subtle highlight

  // ─── Borders — Minimal, Warm ───────────────────────────────────────
  // No glow borders. Subtle dividers only where needed.
  border: 'rgba(255, 255, 255, 0.08)',
  borderSubtle: 'rgba(255, 255, 255, 0.05)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  borderGlowBlue: '#6B8AFF',      // Kept for compat — now used only on focus
  borderGlowGold: '#FFC86B',
  borderGlowEmerald: '#5ED6C0',
  borderGlowPink: '#E8A0BF',

  // ─── Stardust Blue — Primary Actions ───────────────────────────────
  primary: '#6B8AFF',
  primaryLight: '#8DA6FF',
  primaryDark: '#4A6AE0',
  primaryBg: 'rgba(107, 138, 255, 0.15)',

  // ─── Moonbeam Gold — Achievement, XP, Rewards ─────────────────────
  gold: '#FFC86B',
  goldLight: '#FFD98A',
  goldDark: '#E0A840',
  goldBg: 'rgba(255, 200, 107, 0.15)',
  thermalGold: '#FFC86B',
  thermalGoldBg: 'rgba(255, 200, 107, 0.15)',

  // ─── Aurora Teal — Success, Correct Answers ────────────────────────
  emerald: '#5ED6C0',
  emeraldLight: '#7EE8D4',
  emeraldDark: '#3EB8A0',
  emeraldBg: 'rgba(94, 214, 192, 0.15)',
  telemetryGreen: '#5ED6C0',
  telemetryGreenBg: 'rgba(94, 214, 192, 0.15)',

  // ─── Coral Nebula — Gentle Errors, Retries ────────────────────────
  coral: '#FF8A80',
  coralLight: '#FFA498',
  coralDark: '#E06860',
  coralBg: 'rgba(255, 138, 128, 0.15)',
  hazardRed: '#FF8A80',
  hazardRedBg: 'rgba(255, 138, 128, 0.15)',

  // ─── Soft Pink — Delight, Mascot ──────────────────────────────────
  pink: '#E8A0BF',
  pinkLight: '#F0B8D0',
  pinkDark: '#C080A0',
  pinkBg: 'rgba(232, 160, 191, 0.15)',

  // ─── Lilac Orbit — Special, Archetypes ────────────────────────────
  purple: '#B48EFF',
  purpleLight: '#C8A8FF',
  purpleDark: '#9070E0',
  purpleBg: 'rgba(180, 142, 255, 0.15)',
  plasmaViolet: '#B48EFF',
  plasmaVioletBg: 'rgba(180, 142, 255, 0.15)',

  // ─── Soft Cyan — Info, Links ──────────────────────────────────────
  cyan: '#7EC8E3',
  cyanLight: '#98D8F0',
  cyanDark: '#5AA8C8',
  cyanBg: 'rgba(126, 200, 227, 0.12)',
  hudCyan: '#7EC8E3',
  hudCyanBg: 'rgba(126, 200, 227, 0.12)',

  // ─── Warm Amber — Warnings ────────────────────────────────────────
  reentryAmber: '#F0B060',
  reentryAmberBg: 'rgba(240, 176, 96, 0.15)',

  // ─── Typography — Warm Whites ─────────────────────────────────────
  text: '#F5F3F0',                 // Warm snow white
  textSecondary: '#C4BFB8',        // Warm silver
  textMuted: '#9B95A8',            // Lavender mist
  textDark: '#0F1128',             // For light button faces

  // ─── Status & Feedback ────────────────────────────────────────────
  correct: '#5ED6C0',
  correctBg: 'rgba(94, 214, 192, 0.18)',
  incorrect: '#FF8A80',
  incorrectBg: 'rgba(255, 138, 128, 0.18)',
  info: '#7EC8E3',
  infoBg: 'rgba(126, 200, 227, 0.15)',

  // ─── Space Ranks ──────────────────────────────────────────────────
  rankCadet: '#6B8AFF',
  rankAstronaut: '#5ED6C0',
  rankSpecialist: '#B48EFF',
  rankCommander: '#FFC86B',
};

// ─── Per-Lesson Gradient Moods ──────────────────────────────────────
// Used for illustration headers and contextual background tints
export const LessonMoods = {
  moon:  { from: '#1a1f4e', via: '#2d3580', to: '#4a5aaf' },
  mars:  { from: '#2a1520', via: '#5c2530', to: '#a04050' },
  iss:   { from: '#0f1a30', via: '#1a3050', to: '#2a5080' },
  jwst:  { from: '#1a0f30', via: '#30184e', to: '#5a28a0' },
  earth: { from: '#0f2018', via: '#1a4030', to: '#2a6050' },
  sun:   { from: '#2a1a0f', via: '#4e3018', to: '#805028' },
  stars: { from: '#0f0f28', via: '#1a1a48', to: '#2828a0' },
  rocket:{ from: '#1a1028', via: '#30184e', to: '#5a2080' },
} as const;
