
/**
 * Interface for the Impulse theme system
 */
export interface ImpulseTheme {
  id?: string;
  name: string;
  description?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: {
      main?: string;
      overlay?: string;
      card?: string;
      alt?: string;
    };
    text?: {
      primary?: string;
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
  };
  effects?: {
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
      small?: string;
      medium?: string;
      large?: string;
      inner?: string;
    };
  };
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
  components?: {
    panel?: {
      radius?: string;
      padding?: string;
      background?: string;
    };
    button?: {
      radius?: string;
      padding?: string;
      transition?: string;
    };
    tooltip?: {
      radius?: string;
      padding?: string;
      background?: string;
    };
    input?: {
      radius?: string;
      padding?: string;
      background?: string;
    };
  };
  typography?: {
    fonts?: {
      body?: string;
      heading?: string;
      monospace?: string;
    };
    sizes?: {
      xs?: string;
      sm?: string;
      base?: string;
      lg?: string;
      xl?: string;
      "2xl"?: string;
      "3xl"?: string;
    };
    lineHeights?: {
      tight?: string;
      normal?: string;
      loose?: string;
    };
  };
}

/**
 * Partial theme tokens for theme updates
 */
export type PartialImpulseTheme = Partial<ImpulseTheme>;

/**
 * Metadata for themes
 */
export interface ThemeMetadata {
  id: string;
  name: string;
  description?: string;
  preview_url?: string;
  created_at?: string;
  updated_at?: string;
  is_system?: boolean;
  is_active?: boolean;
}
