import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationItem, NavigationGroup, NavigationState, NavigationHookConfig } from '../types';
import { findItemByPath, getBreadcrumbsFromPath } from '../utils/navigation-utils';

const defaultState: NavigationState = {
  items: [],
  groups: [],
  currentPath: '/',
  previousPath: null,
  breadcrumbs: [],
  isNavigating: false,
};

export const useNavigation = (config?: NavigationHookConfig) => {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const [state, setState] = useState<NavigationState>(defaultState);

  // Update current path and breadcrumbs when location changes
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      previousPath: prev.currentPath,
      currentPath: location.pathname,
      breadcrumbs: getBreadcrumbsFromPath(location.pathname, [...prev.items, ...prev.groups.flatMap(g => g.items)]),
      isNavigating: false,
    }));
  }, [location]);

  const navigate = useCallback(async (to: string) => {
    try {
      setState((prev) => ({ ...prev, isNavigating: true }));

      if (config?.shouldConfirmNavigation) {
        const shouldProceed = await config.shouldConfirmNavigation(to);
        if (!shouldProceed) {
          setState((prev) => ({ ...prev, isNavigating: false }));
          return;
        }
      }

      routerNavigate(to);
      config?.onNavigate?.(to);
    } catch (error) {
      setState((prev) => ({ ...prev, isNavigating: false }));
      config?.onNavigateError?.(error instanceof Error ? error : new Error('Navigation failed'));
    }
  }, [routerNavigate, config]);

  const goBack = useCallback(() => {
    if (state.previousPath) {
      navigate(state.previousPath);
    } else {
      routerNavigate(-1);
    }
  }, [navigate, routerNavigate, state.previousPath]);

  const setItems = useCallback((items: NavigationItem[]) => {
    setState((prev) => ({
      ...prev,
      items,
      breadcrumbs: getBreadcrumbsFromPath(prev.currentPath, [...items, ...prev.groups.flatMap(g => g.items)]),
    }));
  }, []);

  const setGroups = useCallback((groups: NavigationGroup[]) => {
    setState((prev) => ({
      ...prev,
      groups,
      breadcrumbs: getBreadcrumbsFromPath(prev.currentPath, [...prev.items, ...groups.flatMap(g => g.items)]),
    }));
  }, []);

  const toggleGroup = useCallback((groupId: string) => {
    setState((prev) => ({
      ...prev,
      groups: prev.groups.map((group) =>
        group.id === groupId
          ? { ...group, isExpanded: !group.isExpanded }
          : group
      ),
    }));
  }, []);

  const getBreadcrumbs = useCallback((path: string) => {
    return getBreadcrumbsFromPath(path, [...state.items, ...state.groups.flatMap(g => g.items)]);
  }, [state.items, state.groups]);

  const getCurrentItem = useCallback(() => {
    return findItemByPath(state.currentPath, [...state.items, ...state.groups.flatMap(g => g.items)]);
  }, [state.currentPath, state.items, state.groups]);

  return {
    ...state,
    navigate,
    goBack,
    setItems,
    setGroups,
    toggleGroup,
    getBreadcrumbs,
    getCurrentItem,
  };
}; 