export const theme = {
  colors: {
    background: '#0A0A0A',
    surface: '#141414',
    card: '#1C1C1E',
    cardElevated: '#242426',
    border: '#2C2C2E',
    borderLight: '#3A3A3C',
    
    primary: '#F5A623',
    primaryLight: '#FFB84D',
    primaryDark: '#E09800',
    primaryTransparent: 'rgba(245, 166, 35, 0.15)',
    
    accent: '#6C63FF',
    accentLight: '#8B85FF',
    
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textMuted: '#8E8E93',
    textDisabled: '#48484A',
    
    success: '#30D158',
    warning: '#FFD60A',
    error: '#FF453A',
    info: '#0A84FF',
    
    star: '#FFD700',
    
    gradient: {
      primary: ['#F5A623', '#FF6B35'],
      dark: ['#141414', '#0A0A0A'],
      card: ['#242426', '#1C1C1E'],
      hero: ['rgba(0,0,0,0)', 'rgba(10,10,10,0.95)'],
    },
    
    overlay: 'rgba(0,0,0,0.7)',
    glass: 'rgba(255,255,255,0.05)',
    glassBorder: 'rgba(255,255,255,0.1)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 999,
  },
  
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 12,
    },
    primary: {
      shadowColor: '#F5A623',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};
