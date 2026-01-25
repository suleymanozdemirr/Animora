// Animora Color Palette - Dark Theme
export const colors = {
  // Primary colors
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#5541D7',

  // Background colors
  background: '#0D0D0D',
  backgroundLight: '#1A1A2E',
  backgroundCard: '#16213E',
  backgroundInput: '#1F1F3D',

  // Accent colors
  accent: '#00D9FF',
  accentPink: '#FF6B9D',
  accentGreen: '#00E676',
  accentOrange: '#FF9F43',
  accentYellow: '#FECA57',

  // Status colors
  watching: '#00E676',
  completed: '#6C5CE7',
  planToWatch: '#00D9FF',
  onHold: '#FF9F43',
  dropped: '#FF6B6B',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B8B8D1',
  textMuted: '#6B6B8D',
  textDark: '#0D0D0D',

  // Border & Divider
  border: '#2D2D5A',
  divider: '#252550',

  // Gradient colors
  gradientStart: '#6C5CE7',
  gradientEnd: '#00D9FF',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',

  // Shadow
  shadow: '#000000',

  // Rating stars
  starFilled: '#FECA57',
  starEmpty: '#3D3D6B',
};

// Status configurations
export const statusConfig = {
  watching: {
    label: 'İzleniyor',
    color: colors.watching,
    icon: 'play-circle',
  },
  completed: {
    label: 'Tamamlandı',
    color: colors.completed,
    icon: 'checkmark-circle',
  },
  planToWatch: {
    label: 'İzlenecek',
    color: colors.planToWatch,
    icon: 'time',
  },
  onHold: {
    label: 'Beklemede',
    color: colors.onHold,
    icon: 'pause-circle',
  },
  dropped: {
    label: 'Bırakıldı',
    color: colors.dropped,
    icon: 'close-circle',
  },
};

export default colors;
