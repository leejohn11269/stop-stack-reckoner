/**
 * STOP STACK — DARK_PREMIUM preset.
 * The `name` field is the preset value and must stay exactly 'dark-premium'.
 * Accent colours are overridden with the brief hexes (steel blue + amber).
 */

export const theme = {
  name: 'dark-premium',

  colors: {
    bg: {
      primary: '#0E1116',
      secondary: '#171C24',
      tertiary: '#232A35',
      accent: '#2C3542',
    },
    accent: {
      primary: '#8AA4C8',
      primaryDeep: '#5E7BA3',
      amber: '#F2C14E',
      amberDeep: '#C9962F',
      danger: '#E0533B',
      success: '#7FA46B',
    },
    text: {
      primary: '#E9EEF5',
      secondary: '#9AA7B8',
      muted: '#63707F',
      faint: '#3C4654',
      onAccent: '#0E1116',
    },
    ui: {
      glass: 'rgba(255,255,255,0.05)',
      glassStrong: 'rgba(255,255,255,0.08)',
      border: 'rgba(255,255,255,0.10)',
      borderSoft: 'rgba(255,255,255,0.09)',
      highlight: 'rgba(255,255,255,0.07)',
      divider: 'rgba(255,255,255,0.07)',
      overlay: 'rgba(0,0,0,0.55)',
      header: 'rgba(0,0,0,0.32)',
      controls: 'rgba(18,23,31,0.92)',
    },
  },

  gradients: {
    primary: ['#8AA4C8', '#5E7BA3'],
    amber: ['#F2C14E', '#C9962F'],
    tile: ['rgba(138,164,200,0.24)', 'rgba(14,17,22,0.08)'],
    strip: ['#8AA4C8', '#0E1116'],
    progress: ['#8AA4C8', '#F2C14E'],
  },

  typography: {
    hero: { fontSize: 40, fontWeight: '800' as const, letterSpacing: 6 },
    display: { fontSize: 64, fontWeight: '800' as const, letterSpacing: -1 },
    title: { fontSize: 24, fontWeight: '700' as const, letterSpacing: 1 },
    subtitle: { fontSize: 17, fontWeight: '700' as const, letterSpacing: 1 },
    body: { fontSize: 15, fontWeight: '500' as const, letterSpacing: 0 },
    label: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 2 },
    caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.5 },
  },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  radius: { sm: 10, md: 14, lg: 18, xl: 24, pill: 100 },

  shadows: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 5,
    },
    primary: {
      shadowColor: '#8AA4C8',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 18,
      elevation: 10,
    },
    amber: {
      shadowColor: '#F2C14E',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.28,
      shadowRadius: 20,
      elevation: 10,
    },
  },

  animation: {
    enter: { tension: 48, friction: 9 },
    press: { tension: 300, friction: 12 },
    fast: { duration: 200 },
    smooth: { duration: 240 },
    slow: { duration: 320 },
  },

  /** Night-vision palette — preserves dark adaptation in the field. */
  night: {
    bg: '#0A0607',
    surface: '#140A0A',
    primary: '#C4463A',
    accent: '#FF6B4A',
    text: '#F0C9C2',
    muted: '#7A4B45',
    veil: 'rgba(196,70,58,0.24)',
    scrim: 'rgba(10,6,7,0.34)',
  },
};

export type Theme = typeof theme;

export default theme;
