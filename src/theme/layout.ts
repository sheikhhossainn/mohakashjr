/**
 * Mohakash Jr. — Layout tokens
 * One spacing scale, one radius scale, one icon scale, one touch-target rule.
 */

export const Space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  huge: 48,
} as const;

export const Radius = {
  sm: 12,
  md: 20,
  lg: 28,
  full: 999,
} as const;

export const IconSize = {
  sm: 20,
  md: 24,
  lg: 28,
} as const;

/** Minimum touch target for children's hands (dp). */
export const Touch = {
  min: 48,
  primary: 56,
} as const;

/** Standard screen gutter. */
export const Gutter = 20;
