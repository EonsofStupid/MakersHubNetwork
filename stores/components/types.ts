export interface ComponentState {
  visibleModals: Set<string>;
  activeDialogs: Set<string>;
  componentStates: Record<string, {
    isVisible: boolean;
    isLoading: boolean;
    error: Error | null;
  }>;
  themeInfo: {
    isOpen: boolean;
    activeSection: 'colors' | 'components' | 'info' | null;
  };
}

export type ComponentActions = {
  showModal: (id: string) => void;
  hideModal: (id: string) => void;
  showDialog: (id: string) => void;
  hideDialog: (id: string) => void;
  setComponentState: (
    id: string,
    state: Partial<ComponentState['componentStates'][string]>
  ) => void;
  setThemeInfoState: (state: Partial<ComponentState['themeInfo']>) => void;
};

export type ComponentStore = ComponentState & ComponentActions;