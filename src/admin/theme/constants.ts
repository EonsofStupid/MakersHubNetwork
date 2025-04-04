
/**
 * Critical theme constants that won't change
 * Used for emergency fallbacks and default values
 */

export const EMERGENCY_COLORS = {
  background: '#12121A',
  foreground: '#F6F6F7',
  primary: '#00F0FF',
  secondary: '#FF2D6E',
  accent: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

/**
 * Default fallback values for various theme components
 */
export const FALLBACKS = {
  // Color fallbacks
  colors: EMERGENCY_COLORS,
  
  // Typography fallbacks
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    monoFamily: 'Consolas, monospace',
    baseSize: '1rem',
    lineHeight: '1.5',
    fontWeight: '400'
  },
  
  // Animation fallbacks
  animation: {
    duration: '300ms',
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // Component fallbacks
  components: {
    borderRadius: '0.5rem',
    padding: '1rem',
    shadowColor: 'rgba(0, 0, 0, 0.2)'
  }
};

/**
 * CSS variable names for core theme properties
 */
export const CSS_VARIABLES = {
  primary: '--color-primary',
  secondary: '--color-secondary',
  background: '--color-background',
  foreground: '--color-foreground',
  primaryRgb: '--color-primary-rgb',
  secondaryRgb: '--color-secondary-rgb',
  fontFamily: '--font-family',
  borderRadius: '--border-radius'
};
