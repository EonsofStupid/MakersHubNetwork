
import { useThemeStore } from '@/stores/theme/store';
import { useAtom, useSetAtom } from 'jotai';
import { 
  themeLoadingAtom, 
  themeErrorAtom, 
  currentThemeAtom, 
  themeComponentsAtom,
  themeVariablesAtom,
  themeInitializedAtom
} from '../atoms/theme.atoms';
import { cssVariablesFromTheme } from './cssVariables';

/**
 * Hook that connects Zustand theme store to Jotai atoms
 * allowing components to efficiently subscribe only to the parts
 * of theme state they need
 */
export function useThemeActions() {
  // Jotai atoms
  const [, setThemeLoading] = useAtom(themeLoadingAtom);
  const [, setThemeError] = useAtom(themeErrorAtom);
  const [, setCurrentTheme] = useAtom(currentThemeAtom);
  const [, setThemeComponents] = useAtom(themeComponentsAtom);
  const [, setThemeVariables] = useAtom(themeVariablesAtom);
  const [, setThemeInitialized] = useAtom(themeInitializedAtom);
  
  // Get Zustand store actions
  const { setTheme, loadAdminComponents } = useThemeStore();
  
  /**
   * Set the active theme and sync to Jotai atoms
   */
  const applyTheme = async (themeId: string) => {
    try {
      // Update loading state
      setThemeLoading(true);
      setThemeError(null);
      
      // Apply theme using Zustand store
      await setTheme(themeId);
      
      // Get updated theme state
      const { currentTheme, themeComponents } = useThemeStore.getState();
      
      // Sync to Jotai atoms
      setCurrentTheme(currentTheme);
      setThemeComponents(themeComponents);
      
      // Generate CSS variables
      if (currentTheme) {
        const cssVars = cssVariablesFromTheme(currentTheme);
        setThemeVariables(cssVars);
      }
      
      // Load admin components if needed
      await loadAdminComponents();
      
      // Mark as initialized
      setThemeInitialized(true);
      return true;
    } catch (error) {
      // Handle error
      console.error('Error applying theme:', error);
      setThemeError(error instanceof Error ? error : new Error(String(error)));
      return false;
    } finally {
      setThemeLoading(false);
    }
  };
  
  /**
   * Apply CSS variables to document root
   */
  const applyCssVariables = (variables: Record<string, string>) => {
    Object.entries(variables).forEach(([name, value]) => {
      document.documentElement.style.setProperty(name, value);
    });
    return true;
  };
  
  return {
    applyTheme,
    applyCssVariables,
    loadAdminComponents
  };
}
