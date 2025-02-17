import { ReactNode } from 'react';
import { To } from 'react-router-dom';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  roles?: string[];
  isExternal?: boolean;
  isHidden?: boolean;
  badge?: string | number;
}

export interface NavigationGroup {
  id: string;
  label: string;
  items: NavigationItem[];
  isCollapsible?: boolean;
  isExpanded?: boolean;
}

export interface NavigationState {
  items: NavigationItem[];
  groups: NavigationGroup[];
  currentPath: string;
  previousPath: string | null;
  breadcrumbs: NavigationItem[];
  isNavigating: boolean;
}

export interface NavigationConfig {
  items?: NavigationItem[];
  groups?: NavigationGroup[];
  defaultPath?: string;
  preserveQuery?: boolean;
  scrollBehavior?: ScrollBehavior;
}

export interface NavigationContextValue extends NavigationState {
  navigate: (to: To) => void;
  goBack: () => void;
  setItems: (items: NavigationItem[]) => void;
  setGroups: (groups: NavigationGroup[]) => void;
  toggleGroup: (groupId: string) => void;
  getBreadcrumbs: (path: string) => NavigationItem[];
}

export interface NavigationHookConfig {
  onNavigate?: (to: To) => void;
  onNavigateError?: (error: Error) => void;
  shouldConfirmNavigation?: (to: To) => boolean | Promise<boolean>;
} 