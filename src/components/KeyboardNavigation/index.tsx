
import { ReactNode, createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  KeyboardNavigationContext, 
  useKeyboardNavigationProvider 
} from './hooks/useKeyboardNavigation';
import { KeyboardNavigationOptions } from './types/navigation.types';

interface KeyboardNavigationProps {
  children?: ReactNode;
  options?: Partial<KeyboardNavigationOptions>;
}

// Provider component
export const KeyboardNavigationProvider = ({ 
  children, 
  options = {} 
}: KeyboardNavigationProps) => {
  const navigationContext = useKeyboardNavigationProvider(options);
  
  return (
    <KeyboardNavigationContext.Provider value={navigationContext}>
      {children}
    </KeyboardNavigationContext.Provider>
  );
};

// Main component for global keyboard navigation
export const KeyboardNavigation = ({ options = {} }: KeyboardNavigationProps) => {
  // Initialize the provider without wrapping children
  const navigationContext = useKeyboardNavigationProvider(options);
  
  // Set up the effects and handlers needed for keyboard navigation
  useEffect(() => {
    // This component just sets up the navigation, without rendering anything
    console.log('KeyboardNavigation initialized with options:', options);
    
    return () => {
      console.log('KeyboardNavigation cleanup');
    };
  }, [options]);
  
  // Return null since this doesn't render anything
  return null;
};

// Export hooks for external use
export { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
export type { 
  KeyboardNavigationOptions,
  NavigationDirection,
  NavigationKey,
  ScrollOptions,
  ScrollConfig
} from './types/navigation.types';
