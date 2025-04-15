import { useCallback } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { Theme, ThemeState } from '@/shared/types/features/theme.types';

export const useThemeVariables = () => {
  const variables = useThemeStore((state: ThemeState) => state.variables);
  const componentTokens = useThemeStore((state: ThemeState) => state.componentTokens);
  const theme = useThemeStore((state: ThemeState) => state.theme);
  const setVariables = useThemeStore((state: ThemeState) => state.setVariables);
  const setComponentTokens = useThemeStore((state: ThemeState) => state.setComponentTokens);

  const getToken = useCallback((token: string): string => {
    return variables[token] || '';
  }, [variables]);
  
  const getComponentToken = useCallback((component: string, token: string): string => {
    return componentTokens[component]?.[token] || variables[token] || '';
  }, [componentTokens, variables]);
  
  const setToken = useCallback((token: string, value: string) => {
    setVariables({ ...variables, [token]: value });
  }, [variables, setVariables]);
  
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
  
  const getAllTokens = useCallback((): Record<string, string> => {
    return variables;
  }, [variables]);
  
  const getAllComponentTokens = useCallback((): Record<string, Record<string, string>> => {
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
