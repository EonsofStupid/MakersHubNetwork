
/**
 * Basic Impulse theme type definitions
 */

export interface ImpulseThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: {
    main: string;
    overlay: string;
    card: string;
    alt: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
  };
  borders: {
    normal: string;
    hover: string;
    active: string;
    focus: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface ImpulseThemeTypography {
  fonts: {
    body: string;
    heading: string;
    mono: string;
  };
  sizes: {
    xs: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  weights: {
    light: number;
    normal: number;
    medium: number;
    bold: number;
  };
  lineHeights: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  letterSpacing?: Record<string, string>;
}

export interface ImpulseThemeEffects {
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  blurs?: Record<string, string>;
  gradients?: Record<string, string>;
  glow: {
    primary: string;
    secondary: string;
    hover: string;
  };
}

export interface ImpulseThemeAnimation {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  curves: {
    bounce: string;
    ease: string;
    spring: string;
    linear: string;
  };
  transitions?: Record<string, string>;
  keyframes?: Record<string, string>;
}

export interface ImpulseThemeComponents {
  panel: {
    radius: string;
    padding: string;
    background: string;
  };
  button: {
    radius: string;
    padding: string;
    transition: string;
  };
  tooltip: {
    radius: string;
    padding: string;
    background: string;
  };
  input: {
    radius: string;
    padding: string;
    background: string;
  };
}

export interface ImpulseTheme {
  id: string;
  name: string;
  colors: ImpulseThemeColors;
  typography: ImpulseThemeTypography;
  effects: ImpulseThemeEffects;
  animation: ImpulseThemeAnimation;
  components: ImpulseThemeComponents;
  version: number;
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Default/fallback theme tokens - bare minimum defaults
 */
export const defaultImpulseTokens: ImpulseTheme = {
  id: 'default',
  name: 'Default',
  version: 1,
  colors: {
    primary: '#00F0FF',
    secondary: '#FF2D6E',
    accent: '#8B5CF6',
    background: {
      main: '#12121A',
      overlay: 'rgba(22, 24, 29, 0.85)',
      card: 'rgba(28, 32, 42, 0.7)',
      alt: '#1A1E24'
    },
    text: {
      primary: '#F6F6F7',
      secondary: 'rgba(255, 255, 255, 0.7)',
      muted: 'rgba(255, 255, 255, 0.5)',
      accent: '#00F0FF'
    },
    borders: {
      normal: 'rgba(0, 240, 255, 0.2)',
      hover: 'rgba(0, 240, 255, 0.4)',
      active: 'rgba(0, 240, 255, 0.6)',
      focus: 'rgba(0, 240, 255, 0.5)'
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    }
  },
  typography: {
    fonts: {
      body: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
      mono: 'Consolas, monospace'
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      md: '1.125rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '2rem',
      '3xl': '2.5rem'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700
    },
    lineHeights: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  effects: {
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    glow: {
      primary: '0 0 15px rgba(0, 240, 255, 0.7)',
      secondary: '0 0 15px rgba(255, 45, 110, 0.7)',
      hover: '0 0 25px rgba(0, 240, 255, 0.9)'
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
      spring: 'cubic-bezier(0.155, 1.105, 0.295, 1.12)',
      linear: 'linear'
    }
  },
  components: {
    panel: {
      radius: '0.75rem',
      padding: '1.5rem',
      background: 'rgba(28, 32, 42, 0.7)'
    },
    button: {
      radius: '0.375rem',
      padding: '0.5rem 1rem',
      transition: '150ms ease-in-out'
    },
    tooltip: {
      radius: '0.375rem',
      padding: '0.5rem',
      background: 'rgba(0, 0, 0, 0.8)'
    },
    input: {
      radius: '0.375rem',
      padding: '0.5rem',
      background: 'rgba(255, 255, 255, 0.05)'
    }
  }
};
