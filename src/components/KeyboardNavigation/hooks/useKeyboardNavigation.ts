
import { useState, useCallback, useMemo, useEffect, createContext, useContext } from 'react';
import { 
  KeyboardNavigationOptions, 
  KeyboardNavigationState,
  KeyboardNavigationContextType,
  ScrollOptions
} from '../types/navigation.types';
import { useKeyboardScroll } from './useKeyboardScroll';

// Default options
const DEFAULT_OPTIONS: KeyboardNavigationOptions = {
  enabled: true,
  scrollConfig: {
    scrollAmount: 100,
    smooth: true,
    acceleration: true,
    maxAcceleration: 500,
    accelerationRate: 1.1
  },
  showToasts: false,
  scrollTarget: null,
  enableInInputs: false
};

// Create context
export const KeyboardNavigationContext = createContext<KeyboardNavigationContextType | null>(null);

// Provider hook
export const useKeyboardNavigationProvider = (initialOptions: Partial<KeyboardNavigationOptions> = {}) => {
  // Merge with default options
  const [options, setOptions] = useState<KeyboardNavigationOptions>({
    ...DEFAULT_OPTIONS,
    ...initialOptions
  });
  
  // Get the keyboard scroll functionality
  const { 
    scrollToElement: baseScrollToElement, 
    isScrolling,
    pressedKeys,
    _state
  } = useKeyboardScroll(options);
  
  // Update options
  const updateOptions = useCallback((newOptions: Partial<KeyboardNavigationOptions>) => {
    setOptions(prev => ({
      ...prev,
      ...newOptions,
      scrollConfig: {
        ...prev.scrollConfig,
        ...(newOptions.scrollConfig || {})
      }
    }));
  }, []);
  
  // Scroll to element with optional options
  const scrollToElement = useCallback((element: HTMLElement, scrollOptions?: ScrollOptions) => {
    baseScrollToElement(element, scrollOptions);
  }, [baseScrollToElement]);
  
  // Construct the full state
  const state: KeyboardNavigationState = useMemo(() => ({
    ...options,
    pressedKeys,
    currentAcceleration: _state.currentAcceleration,
    isAccelerating: isScrolling,
    animationFrameId: _state.animationFrameId
  }), [options, pressedKeys, _state.currentAcceleration, isScrolling, _state.animationFrameId]);
  
  // The context value
  const contextValue = useMemo(() => ({
    state,
    setOptions: updateOptions,
    scrollToElement
  }), [state, updateOptions, scrollToElement]);
  
  return contextValue;
};

// Consumer hook
export const useKeyboardNavigation = () => {
  const context = useContext(KeyboardNavigationContext);
  
  if (!context) {
    throw new Error('useKeyboardNavigation must be used within a KeyboardNavigationProvider');
  }
  
  return context;
};

// Create a hook for accessing just the scroll functionality without the provider
export const useStandaloneKeyboardNavigation = (options: Partial<KeyboardNavigationOptions> = {}) => {
  const { scrollToElement, isScrolling, pressedKeys, setOptions } = useKeyboardScroll(options);
  
  return {
    scrollToElement,
    isScrolling,
    pressedKeys,
    setOptions
  };
};
