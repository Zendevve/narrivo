/**
 * Narrivo Neo-Brutalism Theme - React Native
 */

export const colors = {
  // Backgrounds
  bg: '#121214',
  card: '#1C1C1E',
  border: '#2A2A2D',

  // Accents
  lime: '#CCFF00',
  periwinkle: '#9999FF',
  pink: '#FF3366',

  // Neutrals
  white: '#FFFFFF',
  gray: '#999999',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '900' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: -1,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
  },
  body: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  label: {
    fontSize: 10,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
  },
};
