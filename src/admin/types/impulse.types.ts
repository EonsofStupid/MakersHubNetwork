
/**
 * Standard theme token structure
 */
export interface ImpulseTheme {
  id: string;
  name: string;
  description?: string;
  colors: Record<string, any>;
  typography: Record<string, any>;
  effects: Record<string, any>;
  components: Record<string, any>;
}

/**
 * Default theme tokens
 */
export const defaultImpulseTokens: ImpulseTheme = {
  id: 'default',
  name: 'Default Impulse',
  description: 'Default theme for Impulse',
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
    animations: {
      glow: 'glow 2s ease-in-out infinite alternate',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
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
    }
  }
};

export const defaultColors = defaultImpulseTokens.colors;
export const defaultTypography = defaultImpulseTokens.typography;
export const defaultEffects = defaultImpulseTokens.effects;
export const defaultComponents = defaultImpulseTokens.components;
