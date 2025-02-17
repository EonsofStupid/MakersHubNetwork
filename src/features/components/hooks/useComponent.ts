import { useState, useCallback } from 'react';
import { ComponentState, ComponentMetadata, ComponentHookConfig } from '../types';

const defaultState: ComponentState = {
  isVisible: true,
  isLoading: false,
  isDisabled: false,
  error: null,
};

const defaultMetadata: ComponentMetadata = {
  id: crypto.randomUUID(),
  name: 'Unnamed Component',
};

export const useComponent = (config?: ComponentHookConfig) => {
  const [state, setState] = useState<ComponentState>({
    ...defaultState,
    ...config?.initialState,
  });

  const [metadata] = useState<ComponentMetadata>({
    ...defaultMetadata,
    ...config?.metadata,
  });

  const setVisible = useCallback((visible: boolean) => {
    setState((prev) => ({ ...prev, isVisible: visible }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  }, []);

  const setDisabled = useCallback((disabled: boolean) => {
    setState((prev) => ({ ...prev, isDisabled: disabled }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const updateState = useCallback((updates: Partial<ComponentState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultState);
  }, []);

  return {
    state,
    metadata,
    setVisible,
    setLoading,
    setDisabled,
    setError,
    updateState,
    reset,
  };
}; 