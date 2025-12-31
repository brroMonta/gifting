// Luxury Theme - Inspired by Cartier, Rolex, and Tiffany's
export const theme = {
  colors: {
    // Primary palette - Deep sophisticated navy/charcoal
    primary: {
      50: '#f8f9fa',
      100: '#e8eaed',
      200: '#d1d5db',
      300: '#9ca3af',
      400: '#6b7280',
      500: '#4b5563',
      600: '#1a1f2e',
      700: '#15192a',
      800: '#0f1219',
      900: '#0a0d14',
    },
    // Accent palette - Champagne gold
    accent: {
      50: '#fdfcf8',
      100: '#faf6ed',
      200: '#f5ebd4',
      300: '#e8d4a8',
      400: '#d4b87c',
      500: '#c9a961',
      600: '#b8954d',
      700: '#9a7940',
      800: '#7d6236',
      900: '#66512d',
    },
    // Rose gold palette
    rose: {
      50: '#fdf8f7',
      100: '#fceee9',
      200: '#f8d5cc',
      300: '#f2b3a0',
      400: '#e9886b',
      500: '#d97755',
      600: '#c15e3f',
    },
    // Success palette - Emerald
    success: {
      50: '#f0fdf5',
      100: '#dcfce8',
      500: '#10b981',
      600: '#059669',
    },
    // Error palette - Burgundy
    error: {
      50: '#fdf2f2',
      100: '#fce8e8',
      200: '#f9d5d5',
      500: '#991b1b',
      600: '#7f1d1d',
    },
    // Neutral palette - Warm grays
    neutral: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
    },
    // Backgrounds - Cream/Ivory with subtle warmth
    background: '#fafaf9',
    surface: '#ffffff',
    surfaceElevated: '#fdfcf8',
    border: '#e7e5e4',
    borderAccent: '#c9a961',
    divider: '#e7e5e4',
    overlay: 'rgba(28, 25, 23, 0.5)',
    // Text colors
    text: {
      primary: '#1c1917',
      secondary: '#57534e',
      tertiary: '#a8a29e',
      inverse: '#ffffff',
      accent: '#c9a961',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
  },
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '300',
      lineHeight: 40,
      letterSpacing: 1.5,
    },
    h2: {
      fontSize: 28,
      fontWeight: '300',
      lineHeight: 36,
      letterSpacing: 1.2,
    },
    h3: {
      fontSize: 24,
      fontWeight: '400',
      lineHeight: 32,
      letterSpacing: 1,
    },
    h4: {
      fontSize: 20,
      fontWeight: '400',
      lineHeight: 28,
      letterSpacing: 0.5,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      letterSpacing: 0.3,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      letterSpacing: 0.4,
    },
    button: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      letterSpacing: 1.25,
      textTransform: 'uppercase',
    },
    label: {
      fontSize: 11,
      fontWeight: '600',
      lineHeight: 14,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
  },
  shadows: {
    sm: {
      shadowColor: '#1c1917',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#1c1917',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    lg: {
      shadowColor: '#1c1917',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 3,
    },
    accent: {
      shadowColor: '#c9a961',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 2,
    },
  },
  borders: {
    thin: {
      borderWidth: 0.5,
      borderColor: '#e7e5e4',
    },
    standard: {
      borderWidth: 1,
      borderColor: '#e7e5e4',
    },
    accent: {
      borderWidth: 1,
      borderColor: '#c9a961',
    },
  },
};

export type Theme = typeof theme;
