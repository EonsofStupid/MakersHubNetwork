
import { useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme/store';

/**
 * Hook for accessing and managing Impulsivity theme
 */
export function useImpulsivityTheme() {
  const [theme, setTheme] = useState({
    name: 'Impulsivity',
    primaryColor: '#00F0FF',
    secondaryColor: '#FF2D6E',
    backgroundColor: '#080F1E',
    textColor: '#F9FAFB',
    accentColor: '#7B61FF'
  });
  
  const { isLoading } = useThemeStore();
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Apply theme function to make ImpulsivityInit.tsx happy
  const applyTheme = async () => {
    setIsSyncing(true);
    
    try {
      // Apply theme logic would go here
      const rootElement = document.documentElement;
      rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL  
      rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
      rootElement.style.setProperty('--site-effect-color', '#00F0FF');
      rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
      rootElement.style.setProperty('--site-background', '#080F1E');
      rootElement.style.setProperty('--site-foreground', '#F9FAFB');
      
      // Simulate success
      setIsSyncing(false);
      return true;
    } catch (error) {
      setIsSyncing(false);
      console.error('Failed to apply theme:', error);
      return false;
    }
  };
  
  // Apply theme on first load
  useEffect(() => {
    applyTheme();
  }, []);
  
  return {
    theme,
    setTheme,
    isLoading,
    isSyncing,
    applyTheme
  };
}
