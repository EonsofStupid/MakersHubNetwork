import { useCallback, useEffect, useState } from 'react';
import { LayoutState, LayoutConfig, LayoutBreakpoint, LayoutHookConfig } from '../types';
import {
  getBreakpoint,
  shouldCollapseSidebar,
  getLayoutStateFromStorage,
  saveLayoutStateToStorage,
  getScrollDirection,
} from '../utils/layout-utils';

const defaultConfig: Required<LayoutConfig> = {
  sidebarWidth: 280,
  sidebarCollapsedWidth: 64,
  headerHeight: 64,
  footerHeight: 64,
  breakpoints: {
    'sm': 640,
    'md': 768,
    'lg': 1024,
    'xl': 1280,
    '2xl': 1536,
  },
  defaultCollapsed: false,
  defaultHidden: false,
  persistState: true,
};

const defaultState: LayoutState = {
  isSidebarCollapsed: false,
  isSidebarHidden: false,
  isHeaderHidden: false,
  isFooterHidden: false,
  currentBreakpoint: null,
  scrollPosition: 0,
  isScrollingUp: true,
};

export const useLayout = (config?: LayoutConfig, hookConfig?: LayoutHookConfig) => {
  const mergedConfig = { ...defaultConfig, ...config };
  const [state, setState] = useState<LayoutState>(() => {
    const stored = mergedConfig.persistState ? getLayoutStateFromStorage() : null;
    return {
      ...defaultState,
      isSidebarCollapsed: stored?.isSidebarCollapsed ?? mergedConfig.defaultCollapsed,
      isSidebarHidden: stored?.isSidebarHidden ?? mergedConfig.defaultHidden,
      isHeaderHidden: stored?.isHeaderHidden ?? false,
      isFooterHidden: stored?.isFooterHidden ?? false,
    };
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newBreakpoint = getBreakpoint(window.innerWidth, mergedConfig.breakpoints);
      if (newBreakpoint !== state.currentBreakpoint) {
        setState((prev) => ({
          ...prev,
          currentBreakpoint: newBreakpoint,
          isSidebarCollapsed: shouldCollapseSidebar(newBreakpoint, mergedConfig.defaultCollapsed),
        }));
        hookConfig?.onBreakpointChange?.(newBreakpoint);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mergedConfig.breakpoints, mergedConfig.defaultCollapsed, state.currentBreakpoint]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const newPosition = window.scrollY;
      const isScrollingUp = getScrollDirection(newPosition, state.scrollPosition);
      
      setState((prev) => ({
        ...prev,
        scrollPosition: newPosition,
        isScrollingUp,
      }));

      hookConfig?.onScroll?.(newPosition, isScrollingUp);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [state.scrollPosition]);

  // Persist state changes
  useEffect(() => {
    if (mergedConfig.persistState) {
      saveLayoutStateToStorage(state);
    }
    hookConfig?.onStateChange?.(state);
  }, [state, mergedConfig.persistState]);

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSidebarCollapsed: !prev.isSidebarCollapsed,
    }));
  }, []);

  const toggleSidebarVisibility = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSidebarHidden: !prev.isSidebarHidden,
    }));
  }, []);

  const toggleHeaderVisibility = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isHeaderHidden: !prev.isHeaderHidden,
    }));
  }, []);

  const toggleFooterVisibility = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isFooterHidden: !prev.isFooterHidden,
    }));
  }, []);

  const setBreakpoint = useCallback((breakpoint: LayoutBreakpoint | null) => {
    setState((prev) => ({
      ...prev,
      currentBreakpoint: breakpoint,
    }));
  }, []);

  const updateScrollPosition = useCallback((position: number) => {
    setState((prev) => ({
      ...prev,
      scrollPosition: position,
      isScrollingUp: getScrollDirection(position, prev.scrollPosition),
    }));
  }, []);

  return {
    ...state,
    config: mergedConfig,
    toggleSidebar,
    toggleSidebarVisibility,
    toggleHeaderVisibility,
    toggleFooterVisibility,
    setBreakpoint,
    updateScrollPosition,
  };
}; 