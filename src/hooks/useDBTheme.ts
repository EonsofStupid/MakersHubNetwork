
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Theme } from '@/types/theme';
import { useToast } from './use-toast';

export function useDBTheme(themeId?: string) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadTheme() {
      try {
        setIsLoading(true);
        setError(null);
        
        let query = supabase.from('themes').select(`
          *,
          theme_tokens(*),
          theme_components(*)
        `);
        
        // If theme ID is provided, use it; otherwise get the default theme
        if (themeId) {
          query = query.eq('id', themeId);
        } else {
          query = query.eq('is_default', true);
        }
        
        const { data, error } = await query.limit(1).single();
        
        if (error) throw error;
        if (!data) throw new Error('No theme found');
        
        setTheme(data as unknown as Theme);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load theme');
        setError(error);
        toast({
          title: 'Error loading theme',
          description: error.message,
          variant: 'destructive',
        });
        console.error('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTheme();
  }, [themeId, toast]);
  
  return {
    theme,
    isLoading,
    error,
  };
}
