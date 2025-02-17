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
};

export type UIStore = UIState & UIActions; 