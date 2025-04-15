
import { useCallback } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { Theme, ComponentTokens } from '@/shared/types/theme.types';

export const useThemeVariables = () => {
  const variables = useThemeStore((state) => state.variables);
  const componentTokens = useThemeStore((state) => state.componentTokens);
  const theme = useThemeStore((state) => state.theme);
  const setVariables = useThemeStore((state) => state.setVariables);
  const setComponentTokens = useThemeStore((state) => state.setComponentTokens);

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
  
  const getAllComponentTokens = useCallback((): ComponentTokens => {
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
