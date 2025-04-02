
/**
 * Type definitions for the Impulse theme system
 */

export interface ImpulseTheme {
  // Core theme properties
  id?: string;
  name?: string;
  version?: string;
  
  // Theme component tokens
  colors: ImpulseColors;
  effects?: ImpulseEffects;
  animation?: ImpulseAnimation;
  components?: ImpulseComponents;
  typography?: ImpulseTypography;
}

export interface ImpulseColors {
  // Brand colors
  primary: string;
  secondary: string;
  accent?: string;
  
  // Background variants
  background?: {
    main: string;
    overlay: string;
    card: string;
    alt?: string;
  };
  
  // Text variants
  text?: {
    primary: string;
    secondary: string;
    accent?: string;
    muted?: string;
  };
  
  // Border variants
  borders?: {
    normal: string;
    hover: string;
    active: string;
    focus?: string;
  };
  
  // Status colors
  status?: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface ImpulseEffects {
  // Glow effects
  glow?: {
    primary: string;
    secondary: string;
    hover: string;
  };
  
  // Gradient effects
  gradients?: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  
  // Shadow effects
  shadows?: {
    small: string;
    medium: string;
    large: string;
    inner?: string;
  };
}

export interface ImpulseAnimation {
  // Duration values
  duration?: {
    fast: string;
    normal: string;
    slow: string;
  };
  
  // Animation curves
  curves?: {
    bounce: string;
    ease: string;
    spring: string;
    linear?: string;
  };
  
  // Key animations
  keyframes?: {
    fade: string;
    pulse: string;
    glow: string;
    slide?: string;
  };
}

export interface ImpulseComponents {
  // Panel component settings
  panel?: {
    radius: string;
    padding: string;
    background?: string;
  };
  
  // Button component settings
  button?: {
    radius: string;
    padding: string;
    transition?: string;
  };
  
  // Tooltip component settings
  tooltip?: {
    radius: string;
    padding: string;
    background?: string;
  };
  
  // Input component settings
  input?: {
    radius: string;
    padding: string;
    background?: string;
  };
}

export interface ImpulseTypography {
  // Font families
  fonts?: {
    body: string;
    heading: string;
    monospace: string;
  };
  
  // Font sizes
  sizes?: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  
  // Font weights
  weights?: {
    light: number;
    normal: number;
    medium: number;
    bold: number;
  };
  
  // Line heights
  lineHeights?: {
    tight: string;
    normal: string;
    loose: string;
  };
}
