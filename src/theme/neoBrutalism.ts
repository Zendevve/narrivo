/**
 * Narrivo Neo-Brutalism Design System
 * Mobile-first, high-contrast aesthetic for Android
 */

export const colors = {
  // Backgrounds
  bg: '#121214',
  card: '#1C1C1E',
  border: '#2A2A2D',
  borderLight: '#333',

  // Accents
  lime: '#CCFF00',
  periwinkle: '#9999FF',
  pink: '#FF3366',
  yellow: '#FFFF33',
  cyan: '#33FFFF',

  // Neutrals
  white: '#FFFFFF',
  gray: '#999999',
  grayDark: '#666666',
  black: '#000000',
};

export const typography = {
  // Headings
  h1: {
    fontSize: 48,
    fontWeight: '900',
    textTransform: 'uppercase' as const,
    letterSpacing: -2,
    lineHeight: 52,
  },
  h2: {
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase' as const,
    letterSpacing: -1,
    lineHeight: 36,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    lineHeight: 24,
  },

  // Body
  body: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },

  // Labels
  label: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const shadows = {
  // Neo-brutalism hard shadow
  neo: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  neoSmall: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  // Soft glow for accents
  glow: {
    shadowColor: colors.lime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export type Theme = typeof theme;
