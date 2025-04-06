
/**
 * Type definitions for Impulse theme system
 */

export interface ImpulseTheme {
  // Color palette
  colors: {
    primary: string;
    secondary: string;
    tertiary?: string;
    background: string;
    foreground: string;
    card?: string;
    accent?: string;
    muted?: string;
    border?: string;
    [key: string]: string | undefined;
  };
  
  // Effect settings
  effects: {
    glowStrength?: string;
    primaryGlow?: string;
    secondaryGlow?: string;
    scanlines?: boolean;
    noise?: boolean;
    [key: string]: string | boolean | undefined;
  };
  
  // Animation settings
  animation: {
    speed?: string;
    intensity?: string;
    enableMotion?: boolean;
    [key: string]: string | boolean | undefined;
  };
  
  // UI component variants
  components?: {
    buttons?: {
      roundness?: string;
      borderWidth?: string;
      glowEffect?: boolean;
      [key: string]: string | boolean | undefined;
    };
    cards?: {
      glassEffect?: boolean;
      borderGlow?: boolean;
      backdropBlur?: string;
      [key: string]: string | boolean | undefined;
    };
    [key: string]: Record<string, unknown> | undefined;
  };
  
  // Typography settings
  typography?: {
    fontFamily?: string;
    headingFont?: string;
    monoFont?: string;
    [key: string]: string | undefined;
  };
  
  // Optional metadata
  meta?: {
    name?: string;
    description?: string;
    author?: string;
    version?: string;
    [key: string]: string | undefined;
  };
}
