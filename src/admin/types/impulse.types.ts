
export interface ImpulseTheme {
  id?: string;
  name?: string;
  version?: number;
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
      muted?: string;
      accent?: string;
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
  typography?: {
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
    weights?: {
      light?: number;
      normal?: number;
      medium?: number;
      bold?: number;
    };
    lineHeights?: {
      tight?: string;
      normal?: string;
      relaxed?: string;
    };
    letterSpacing?: Record<string, string>;
  };
  effects?: {
    shadows?: {
      sm?: string;
      md?: string;
      lg?: string;
      xl?: string;
    };
    blurs?: Record<string, string>;
    gradients?: Record<string, string>;
    glow?: {
      primary?: string;
      secondary?: string;
      hover?: string;
    };
    primary?: string;
    secondary?: string;
    tertiary?: string;
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
    transitions?: Record<string, string>;
    durations?: Record<string, string>;
  };
  components?: Record<string, any>;
}
