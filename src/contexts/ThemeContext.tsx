import { createContext, useContext, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { Theme, ThemeContextType } from '@/types/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { 
    currentTheme, 
    themeTokens, 
    themeComponents, 
    isLoading, 
    error, 
    setTheme,
    loadAdminComponents 
  } = useThemeStore();

  useEffect(() => {
    const loadDefaultTheme = async () => {
      const { data: defaultTheme } = await supabase
        .from('themes')
        .select('id')
        .eq('is_default', true)
        .single();

      if (defaultTheme) {
        await setTheme(defaultTheme.id);
        await loadAdminComponents();
      }
    };

    loadDefaultTheme();
  }, []);

  const value = {
    currentTheme,
    themeTokens,
    themeComponents,
    isLoading,
    error,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}