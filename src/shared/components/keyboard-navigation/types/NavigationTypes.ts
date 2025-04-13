// Keyboard navigation types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
  disabled?: boolean;
  hidden?: boolean;
}

export interface NavigationState {
  currentPath: string;
  previousPath: string;
  history: string[];
  isNavigating: boolean;
}

export interface NavigationContextType {
  state: NavigationState;
  navigate: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export interface NavigationProviderProps {
  children: React.ReactNode;
  initialPath?: string;
}

export interface NavigationHookResult {
  currentPath: string;
  previousPath: string;
  navigate: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isNavigating: boolean;
} 