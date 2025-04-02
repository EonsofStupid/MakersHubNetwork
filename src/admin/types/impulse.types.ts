
export interface ImpulseTheme {
  colors: {
    primary: string;
    secondary: string;
    background: {
      main: string;
      card: string;
      overlay: string;
    };
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    borders: {
      normal: string;
      hover: string;
      active: string;
    };
  };
  effects: {
    glow: {
      primary: string;
      secondary: string;
      hover: string;
    };
    blur: {
      background: string;
      overlay: string;
    };
    gradients: {
      main: string;
      accent: string;
      card: string;
    };
  };
  animation: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    curves: {
      bounce: string;
      ease: string;
      spring: string;
    };
  };
  components: {
    panel: {
      borderRadius: string;
      padding: string;
    };
    button: {
      borderRadius: string;
      padding: string;
    };
    tooltip: {
      borderRadius: string;
      padding: string;
    };
  };
}

export interface ImpulseTokens {
  [key: string]: string | ImpulseTokenGroup;
}

export interface ImpulseTokenGroup {
  [key: string]: string | ImpulseTokenGroup;
}

export interface ImpulseStyleOverride {
  componentId: string;
  styles: Record<string, string | number>;
  variant?: string;
  state?: 'default' | 'hover' | 'active' | 'disabled';
}

export interface ImpulseThemeVariant {
  id: string;
  name: string;
  baseTheme: string;
  overrides: Record<string, string>;
}

export type ThemeRegistry = {
  [key: string]: {
    name: string;
    description: string;
    theme: ImpulseTheme;
  };
};
