
export interface UIState {
  theme: {
    mode: 'dark' | 'light';
    accentColor: string;
  };
  layout: {
    isNavOpen: boolean;
    contentWidth: 'default' | 'wide' | 'full';
  };
  preferences: {
    reducedMotion: boolean;
    highContrast: boolean;
  };
  features: {
    showcasedBuilds: number;
    animationsEnabled: boolean;
    extendedInfo: boolean;
  };
}

export type UIActions = {
  setThemeMode: (mode: UIState['theme']['mode']) => void;
  setAccentColor: (color: string) => void;
  toggleNav: () => void;
  setContentWidth: (width: UIState['layout']['contentWidth']) => void;
  setPreference: <K extends keyof UIState['preferences']>(
    key: K,
    value: UIState['preferences'][K]
  ) => void;
  setFeature: <K extends keyof UIState['features']>(
    key: K,
    value: UIState['features'][K]
  ) => void;
  setShowcasedBuildsCount: (count: number) => void;
};

export type UIStore = UIState & UIActions;
