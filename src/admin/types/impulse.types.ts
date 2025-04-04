
/**
 * Standard theme token structure
 */
export interface ImpulseTheme {
  id: string;
  name: string;
  description?: string;
  version?: number;
  colors: Record<string, any>;
  typography: Record<string, any>;
  effects: Record<string, any>;
  components: Record<string, any>;
  animation?: {
    duration?: {
      fast?: string;
      normal?: string;
      slow?: string;
    };
    curves?: {
      bounce?: string;
      ease?: string;
      spring?: string;
      linear?: string;
    };
    keyframes?: Record<string, string>;
  };
}

/**
 * Default theme tokens
 */
export const defaultImpulseTokens: ImpulseTheme = {
  id: 'default',
  name: 'Default Impulse',
  description: 'Default theme for Impulse',
  version: 1,
  colors: {
    background: {
      main: '#12121A',
      alt: '#1A1F2C',
      elevated: '#242939'
    },
    text: {
      primary: '#F6F6F7',
      secondary: '#C8C8C9',
      muted: '#8A898C'
    },
    primary: '#00F0FF',
    secondary: '#FF2D6E',
    accent: '#9B87F5',
    border: '#403E43',
    card: '#1A1F2C'
  },
  typography: {
    fontFamily: {
      base: "'Inter', sans-serif",
      headings: "'Inter', sans-serif",
      code: "'JetBrains Mono', monospace"
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem', 
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  effects: {
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '1rem',
      full: '9999px'
    },
    boxShadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    gradients: {
      primary: 'linear-gradient(90deg, #00F0FF, #00B8D4)',
      secondary: 'linear-gradient(90deg, #FF2D6E, #FF5252)',
      accent: 'linear-gradient(90deg, #8B5CF6, #7C3AED)'
    },
    glow: {
      primary: '0 0 15px rgba(0, 240, 255, 0.7)',
      secondary: '0 0 15px rgba(255, 45, 110, 0.7)'
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
      md: '0 4px 6px rgba(0, 0, 0, 0.15)',
      lg: '0 10px 25px rgba(0, 0, 0, 0.2)'
    }
  },
  components: {
    button: {
      borderRadius: '0.375rem',
      paddingX: '1rem',
      paddingY: '0.5rem',
      variants: {
        primary: {
          bg: '#00F0FF',
          text: '#000000',
          hover: {
            bg: '#00D9E8',
            text: '#000000'
          }
        },
        secondary: {
          bg: '#FF2D6E',
          text: '#FFFFFF',
          hover: {
            bg: '#E91E63',
            text: '#FFFFFF'
          }
        }
      }
    },
    panel: {
      radius: '0.75rem',
      padding: '1.5rem',
      background: 'rgba(28, 32, 42, 0.7)'
    },
    tooltip: {
      radius: '0.25rem',
      padding: '0.5rem',
      background: 'rgba(0, 0, 0, 0.8)'
    },
    input: {
      radius: '0.375rem',
      padding: '0.5rem 0.75rem',
      background: 'rgba(0, 0, 0, 0.15)'
    }
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    curves: {
      bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
      linear: 'linear'
    },
    keyframes: {
      fade: '@keyframes fade { from { opacity: 0; } to { opacity: 1; } }',
      pulse: '@keyframes pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.4; } }',
      glow: '@keyframes glow { 0%, 100% { box-shadow: 0 0 5px rgba(0, 240, 255, 0.5); } 50% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.7); } }',
      slide: '@keyframes slide { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }'
    }
  }
};

export const defaultColors = defaultImpulseTokens.colors;
export const defaultTypography = defaultImpulseTokens.typography;
export const defaultEffects = defaultImpulseTokens.effects;
export const defaultComponents = defaultImpulseTokens.components;

/**
 * Type definitions for theme components
 */
export interface ThemeTypography {
  fonts: Record<string, string>;
  sizes: Record<string, string>;
  weights: Record<string, number>;
  lineHeights: Record<string, string>;
}

export interface ThemeEffects {
  shadows: Record<string, string>;
  glow: Record<string, string>;
  gradients?: Record<string, string>;
}

export interface ThemeComponents {
  panel: Record<string, string>;
  button: Record<string, any>;
  tooltip: Record<string, string>;
  input: Record<string, string>;
}
