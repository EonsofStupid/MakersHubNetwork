import { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeToken, ThemeComponent } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ThemeContextType {
  currentTheme: Theme | null;
  themeTokens: ThemeToken[];
  themeComponents: ThemeComponent[];
  isLoading: boolean;
  error: Error | null;
  setTheme: (themeId: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [themeTokens, setThemeTokens] = useState<ThemeToken[]>([]);
  const [themeComponents, setThemeComponents] = useState<ThemeComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const loadTheme = async (themeId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch theme
      const { data: theme, error: themeError } = await supabase
        .from('themes')
        .select('*')
        .eq('id', themeId)
        .single();
      if (themeError) throw themeError;
      if (!theme) throw new Error(`Theme with id ${themeId} not found`);

      // Fetch theme tokens
      const { data: tokens, error: tokensError } = await supabase
        .from('theme_tokens')
        .select('*')
        .eq('theme_id', themeId);
      if (tokensError) throw tokensError;

      // Fetch theme components
      const { data: components, error: componentsError } = await supabase
        .from('theme_components')
        .select('*')
        .eq('theme_id', themeId);
      if (componentsError) throw componentsError;

      setCurrentTheme(theme);
      setThemeTokens(tokens || []);
      setThemeComponents(components || []);

      // Apply theme tokens to document
      tokens?.forEach((token) => {
        document.documentElement.style.setProperty(
          `--${token.token_name}`,
          token.token_value
        );
      });

    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Error loading theme",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load default theme on mount
  useEffect(() => {
    const loadDefaultTheme = async () => {
      const { data: defaultTheme, error } = await supabase
        .from('themes')
        .select('*')
        .eq('is_default', true)
        .single();

      if (error) {
        setError(error);
        toast({
          title: "Error loading default theme",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (!defaultTheme) {
        toast({
          title: "No default theme found",
          description: "Please contact an administrator to set up a default theme.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      await loadTheme(defaultTheme.id);
    };

    loadDefaultTheme();
  }, []);

  const value = {
    currentTheme,
    themeTokens,
    themeComponents,
    isLoading,
    error,
    setTheme: loadTheme,
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
