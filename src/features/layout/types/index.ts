import { ReactNode } from 'react';

export type LayoutBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface LayoutConfig {
  sidebarWidth?: number;
  sidebarCollapsedWidth?: number;
  headerHeight?: number;
  footerHeight?: number;
  breakpoints?: Record<LayoutBreakpoint, number>;
  defaultCollapsed?: boolean;
  defaultHidden?: boolean;
  persistState?: boolean;
}

export interface LayoutState {
  isSidebarCollapsed: boolean;
  isSidebarHidden: boolean;
  isHeaderHidden: boolean;
  isFooterHidden: boolean;
  currentBreakpoint: LayoutBreakpoint | null;
  scrollPosition: number;
  isScrollingUp: boolean;
}

export interface LayoutContextValue extends LayoutState {
  toggleSidebar: () => void;
  toggleSidebarVisibility: () => void;
  toggleHeaderVisibility: () => void;
  toggleFooterVisibility: () => void;
  setBreakpoint: (breakpoint: LayoutBreakpoint | null) => void;
  updateScrollPosition: (position: number) => void;
}

export interface LayoutProps {
  config?: LayoutConfig;
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export interface LayoutSectionProps {
  children: ReactNode;
  className?: string;
  hidden?: boolean;
}

export interface LayoutHookConfig {
  onBreakpointChange?: (breakpoint: LayoutBreakpoint | null) => void;
  onStateChange?: (state: LayoutState) => void;
  onScroll?: (position: number, isScrollingUp: boolean) => void;
} 