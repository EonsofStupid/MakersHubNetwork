
/**
 * Core types for the Impulse theme system
 */

export interface ImpulseTheme {
  id?: string;
  name?: string;
  description?: string;
  version?: number;
  author?: string;
  colors: ImpulseColors;
  effects?: ImpulseEffects;
  typography?: ImpulseTypography;
  components?: ImpulseComponents;
  animation?: ImpulseAnimation;
}

export interface ImpulseColors {
  primary: string;
  secondary: string;
  accent?: string;
  background: {
    main: string;
    card?: string;
    alt?: string;
    overlay?: string;
  };
  text: {
    primary: string;
    secondary?: string;
    accent?: string;
    muted?: string;
  };
  borders?: {
    normal?: string;
    hover?: string;
    active?: string;
    focus?: string;
  };
  status?: {
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
  };
}

export interface ImpulseEffects {
  glow?: {
    primary?: string;
    secondary?: string;
    hover?: string;
  };
  shadow?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  blur?: {
    background?: string;
    foreground?: string;
  };
  glass?: {
    opacity?: string;
    blur?: string;
    background?: string;
  };
}

export interface ImpulseTypography {
  fonts?: {
    body?: string;
    heading?: string;
    code?: string;
  };
  sizes?: {
    xs?: string;
    sm?: string;
    base?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    '3xl'?: string;
    '4xl'?: string;
  };
  weights?: {
    light?: number;
    normal?: number;
    medium?: number;
    semibold?: number;
    bold?: number;
  };
}

export interface ImpulseComponents {
  panel?: {
    radius?: string;
    shadow?: string;
    border?: string;
  };
  button?: {
    radius?: string;
    shadow?: string;
    border?: string;
    padding?: string;
  };
  input?: {
    radius?: string;
    shadow?: string;
    border?: string;
    padding?: string;
  };
}

export interface ImpulseAnimation {
  duration?: {
    fast?: string;
    normal?: string;
    slow?: string;
  };
  easing?: {
    default?: string;
    in?: string;
    out?: string;
    inOut?: string;
  };
  keyframes?: Record<string, string>;
}

// Default theme tokens to use as fallback
export const defaultImpulseTokens: ImpulseTheme = {
  id: 'default',
  name: 'Default Impulse Theme',
  description: 'The default cyberpunk theme for MakersImpulse',
  version: 1,
  colors: {
    primary: '#00F0FF',
    secondary: '#FF2D6E',
    accent: '#8B5CF6',
    background: {
      main: '#12121A',
      card: '#1C202A',
      alt: '#1A1A25',
      overlay: 'rgba(18, 18, 26, 0.8)'
    },
    text: {
      primary: '#F6F6F7',
      secondary: 'rgba(255, 255, 255, 0.7)',
      accent: '#00F0FF',
      muted: 'rgba(255, 255, 255, 0.5)'
    },
    borders: {
      normal: 'rgba(0, 240, 255, 0.2)',
      hover: 'rgba(0, 240, 255, 0.4)',
      active: 'rgba(0, 240, 255, 0.6)',
      focus: 'rgba(0, 240, 255, 0.7)'
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#60A5FA'
    }
  },
  effects: {
    glow: {
      primary: '0 0 15px rgba(0, 240, 255, 0.7)',
      secondary: '0 0 15px rgba(255, 45, 110, 0.7)',
      hover: '0 0 20px rgba(0, 240, 255, 0.9)'
    },
    shadow: {
      small: '0 2px 4px rgba(0, 0, 0, 0.3)',
      medium: '0 4px 8px rgba(0, 0, 0, 0.5)',
      large: '0 8px 16px rgba(0, 0, 0, 0.7)'
    },
    glass: {
      opacity: '0.1',
      blur: '10px',
      background: 'rgba(28, 32, 42, 0.7)'
    }
  },
  typography: {
    fonts: {
      body: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
      code: 'JetBrains Mono, monospace'
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  components: {
    panel: {
      radius: '0.75rem',
      shadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
      border: '1px solid rgba(0, 240, 255, 0.1)'
    },
    button: {
      radius: '0.5rem',
      shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      padding: '0.5rem 1rem'
    },
    input: {
      radius: '0.5rem',
      border: '1px solid rgba(0, 240, 255, 0.3)',
      padding: '0.5rem 1rem'
    }
  },
  animation: {
    duration: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s'
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
};
