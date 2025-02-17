import { LayoutBreakpoint, LayoutState } from '../types';

const defaultBreakpoints: Record<LayoutBreakpoint, number> = {
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536,
};

export const getBreakpoint = (width: number, breakpoints = defaultBreakpoints): LayoutBreakpoint | null => {
  const sortedBreakpoints = Object.entries(breakpoints)
    .sort(([, a], [, b]) => b - a);

  for (const [breakpoint, minWidth] of sortedBreakpoints) {
    if (width >= minWidth) {
      return breakpoint as LayoutBreakpoint;
    }
  }

  return null;
};

export const shouldCollapseSidebar = (
  breakpoint: LayoutBreakpoint | null,
  defaultCollapsed = false
): boolean => {
  if (!breakpoint) return true;
  const breakpointOrder = ['sm', 'md', 'lg', 'xl', '2xl'];
  const breakpointIndex = breakpointOrder.indexOf(breakpoint);
  return breakpointIndex <= breakpointOrder.indexOf('md') || defaultCollapsed;
};

export const getLayoutStateFromStorage = (): Partial<LayoutState> | null => {
  try {
    const stored = localStorage.getItem('layoutState');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get layout state from storage:', error);
    return null;
  }
};

export const saveLayoutStateToStorage = (state: LayoutState): void => {
  try {
    localStorage.setItem('layoutState', JSON.stringify({
      isSidebarCollapsed: state.isSidebarCollapsed,
      isSidebarHidden: state.isSidebarHidden,
      isHeaderHidden: state.isHeaderHidden,
      isFooterHidden: state.isFooterHidden,
    }));
  } catch (error) {
    console.error('Failed to save layout state to storage:', error);
  }
};

export const getScrollDirection = (
  currentPosition: number,
  previousPosition: number
): boolean => {
  return currentPosition <= previousPosition;
};

export const calculateContentHeight = (
  windowHeight: number,
  headerHeight = 0,
  footerHeight = 0,
  isHeaderHidden = false,
  isFooterHidden = false
): number => {
  let availableHeight = windowHeight;
  if (!isHeaderHidden) availableHeight -= headerHeight;
  if (!isFooterHidden) availableHeight -= footerHeight;
  return Math.max(availableHeight, 0);
}; 