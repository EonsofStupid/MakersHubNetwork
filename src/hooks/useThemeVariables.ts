
import { useCallback } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { TokenMap, ComponentTokenMap } from '@/shared/types/theme.types';

/**
 * Hook to access and manipulate theme variables
 */
export const useThemeVariables = () => {
  // Access theme store
  const variables = useThemeStore(state => state.variables || {});
  const componentTokens = useThemeStore(state => state.componentTokens);
  const theme = useThemeStore(state => state.theme);
  const setVariables = useThemeStore(state => state.setVariables);
  const setComponentTokens = useThemeStore(state => state.setComponentTokens);
  
  // Get a single token value
  const getToken = useCallback((token: string): string => {
    return variables[token] || '';
  }, [variables]);
  
  // Get component specific token
  const getComponentToken = useCallback((component: string, token: string): string => {
    return componentTokens[component]?.[token] || variables[token] || '';
  }, [componentTokens, variables]);
  
  // Set a single token value
  const setToken = useCallback((token: string, value: string) => {
    setVariables({ ...variables, [token]: value });
  }, [variables, setVariables]);
  
  // Set component specific token
  const setComponentToken = useCallback((component: string, token: string, value: string) => {
    const componentToken = componentTokens[component] || {};
    const updatedTokens = {
      ...componentTokens,
      [component]: {
        ...componentToken,
        [token]: value
      }
    };
    setComponentTokens(updatedTokens);
  }, [componentTokens, setComponentTokens]);
  
  // Get all tokens as a map
  const getAllTokens = useCallback((): TokenMap => {
    return variables as TokenMap;
  }, [variables]);
  
  // Get all component tokens
  const getAllComponentTokens = useCallback((): ComponentTokenMap => {
    return componentTokens;
  }, [componentTokens]);
  
  return {
    theme,
    variables,
    componentTokens,
    getToken,
    getComponentToken,
    setToken,
    setComponentToken,
    getAllTokens,
    getAllComponentTokens
  };
};
