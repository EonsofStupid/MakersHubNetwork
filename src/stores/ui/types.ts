
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
  admin: {
    sidebarExpanded: boolean;
    activeSection: string;
    overlayVisible: boolean;
    inspectorEnabled: boolean;
  };
}

export type UIActions = {
  // Theme actions
  setThemeMode: (mode: UIState['theme']['mode']) => void;
  setAccentColor: (color: string) => void;
  
  // Layout actions
  toggleNav: () => void;
  setContentWidth: (width: UIState['layout']['contentWidth']) => void;
  
  // Preference actions
  setPreference: <K extends keyof UIState['preferences']>(
    key: K,
    value: UIState['preferences'][K]
  ) => void;
  
  // Feature actions
  setFeature: <K extends keyof UIState['features']>(
    key: K,
    value: UIState['features'][K]
  ) => void;
  setShowcasedBuildsCount: (count: number) => void;
  
  // Admin actions
  toggleAdminSidebar: () => void;
  setAdminSidebar: (expanded: boolean) => void;
  setAdminActiveSection: (section: string) => void;
  toggleAdminOverlay: () => void;
  setAdminInspectorEnabled: (enabled: boolean) => void;
};

export type UIStore = UIState & UIActions;
