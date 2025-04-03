
/**
 * Core Impulse Theme type definitions
 */

export interface ImpulseTheme {
  colors?: ImpulseColors;
  typography?: ImpulseTypography;
  effects?: ImpulseEffects;
  animation?: ImpulseAnimation;
  components?: ImpulseComponents;
}

export interface ImpulseColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: {
    main?: string;
    overlay?: string;
    card?: string;
  };
  text?: {
    primary?: string;
    secondary?: string;
    muted?: string;
  };
  borders?: {
    normal?: string;
    hover?: string;
    active?: string;
  };
  status?: {
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
  };
}

export interface ImpulseTypography {
  fonts?: {
    body?: string;
    heading?: string;
    mono?: string;
  };
  sizes?: {
    xs?: string;
    sm?: string;
    base?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    '3xl'?: string;
  };
  lineHeights?: {
    tight?: string;
    normal?: string;
    relaxed?: string;
  };
}

export interface ImpulseEffects {
  glow?: {
    primary?: string;
    secondary?: string;
    hover?: string;
  };
  gradients?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  shadows?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
}

export interface ImpulseAnimation {
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
}

export interface ImpulseComponents {
  button?: ImpulseComponentStyles;
  panel?: ImpulseComponentStyles;
  tooltip?: ImpulseComponentStyles;
  input?: ImpulseComponentStyles;
}

export interface ImpulseComponentStyles {
  radius?: string;
  background?: string;
  padding?: string;
  border?: string;
  color?: string;
  duration?: string;
  [key: string]: string | undefined;
}

/**
 * Default theme tokens - consistent with the site theme
 */
export const defaultImpulseTokens: ImpulseTheme = {
  colors: {
    primary: '#00F0FF',
    secondary: '#FF2D6E',
    accent: '#8B5CF6',
    background: {
      main: '#12121A',
      overlay: 'rgba(22, 24, 32, 0.85)',
      card: 'rgba(28, 32, 42, 0.7)'
    },
    text: {
      primary: '#F6F6F7',
      secondary: 'rgba(255, 255, 255, 0.7)',
      muted: 'rgba(255, 255, 255, 0.5)'
    },
    borders: {
      normal: 'rgba(0, 240, 255, 0.2)',
      hover: 'rgba(0, 240, 255, 0.4)',
      active: 'rgba(0, 240, 255, 0.6)'
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
      body: 'system-ui, sans-serif',
      heading: 'system-ui, sans-serif',
      mono: 'monospace'
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  effects: {
    glow: {
      primary: '0 0 15px rgba(0, 240, 255, 0.7)',
      secondary: '0 0 15px rgba(255, 45, 110, 0.7)',
      hover: '0 0 20px rgba(0, 240, 255, 0.9)'
    },
    gradients: {
      primary: 'linear-gradient(90deg, #00F0FF, #0EA5E9)',
      secondary: 'linear-gradient(90deg, #FF2D6E, #FB7185)',
      accent: 'linear-gradient(90deg, #8B5CF6, #A78BFA)'
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1)'
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
    }
  },
  components: {
    button: {
      radius: '0.5rem',
      padding: '0.5rem 1rem'
    },
    panel: {
      radius: '0.75rem',
      padding: '1rem'
    },
    tooltip: {
      radius: '0.25rem',
      padding: '0.5rem'
    },
    input: {
      radius: '0.5rem',
      padding: '0.5rem'
    }
  }
};
