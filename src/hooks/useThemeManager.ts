
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Theme, ComponentTokens } from '@/types/theme';
import { Json } from '@/integrations/supabase/types';

export function useThemeManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create a new theme
  const createTheme = async (name: string, description: string = ''): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, check if a theme with this name already exists
      const { data: existingThemes, error: checkError } = await supabase
        .from('themes')
        .select('id')
        .eq('name', name);
        
      if (checkError) throw checkError;
      
      if (existingThemes && existingThemes.length > 0) {
        throw new Error(`A theme with the name "${name}" already exists.`);
      }
      
      // Create a new theme
      const themeData = {
        name,
        description,
        status: 'draft' as const,
        is_default: false,
        version: 1,
        design_tokens: {
          colors: {
            background: '#080F1E',
            foreground: '#F9FAFB',
            card: '#0E172A',
            cardForeground: '#F9FAFB',
            primary: '#00F0FF',
            primaryForeground: '#F9FAFB',
            secondary: '#FF2D6E',
            secondaryForeground: '#F9FAFB',
            muted: '#131D35',
            mutedForeground: '#94A3B8',
            accent: '#131D35',
            accentForeground: '#F9FAFB',
            destructive: '#EF4444',
            destructiveForeground: '#F9FAFB',
            border: '#131D35',
            input: '#131D35',
            ring: '#1E293B',
          },
          effects: {
            primary: '#00F0FF',
            secondary: '#FF2D6E',
            tertiary: '#8B5CF6',
          },
          animation: {
            durations: {
              fast: '150ms',
              normal: '300ms',
              slow: '500ms',
              animationFast: '1s',
              animationNormal: '2s',
              animationSlow: '3s',
            }
          },
          spacing: {
            radius: {
              sm: '0.25rem',
              md: '0.5rem',
              lg: '0.75rem',
              full: '9999px',
            }
          }
        },
        component_tokens: [],
        composition_rules: {},
        cached_styles: {}
      };
      
      // Insert the theme into the database
      const { data, error: insertError } = await supabase
        .from('themes')
        .insert(themeData as any)
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      return data?.id || null;
    } catch (err) {
      console.error('Error creating theme:', err);
      setError(err as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get a theme by ID
  const getTheme = async (id: string): Promise<Theme | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (!data) return null;
      
      // Convert the raw data to the Theme type
      const themeData: Theme = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        status: data.status || 'draft',
        is_default: data.is_default || false,
        created_by: data.created_by || undefined,
        created_at: data.created_at || '',
        updated_at: data.updated_at || '',
        published_at: data.published_at || undefined,
        version: data.version || 1,
        cache_key: data.cache_key || undefined,
        parent_theme_id: data.parent_theme_id || undefined,
        design_tokens: data.design_tokens as any || {},
        component_tokens: Array.isArray(data.component_tokens) 
          ? (data.component_tokens as any[]).map(token => ({
              id: token.id || `token-${Date.now()}`,
              component_name: token.component_name || '',
              styles: token.styles || {},
              description: token.description || '',
              theme_id: token.theme_id,
              context: token.context,
              created_at: token.created_at || '',
              updated_at: token.updated_at || ''
            }))
          : [],
        composition_rules: data.composition_rules as any || {},
        cached_styles: data.cached_styles as any || {},
      };
      
      return themeData;
    } catch (err) {
      console.error('Error getting theme:', err);
      setError(err as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update a theme
  const updateTheme = async (id: string, updates: Partial<Theme>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('themes')
        .update(updates as any)
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error updating theme:', err);
      setError(err as Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a theme
  const deleteTheme = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if this is the default theme
      const { data: themeData, error: themeError } = await supabase
        .from('themes')
        .select('is_default')
        .eq('id', id)
        .single();
        
      if (themeError) throw themeError;
      
      if (themeData && themeData.is_default) {
        throw new Error('Cannot delete the default theme.');
      }
      
      // Delete the theme
      const { error } = await supabase
        .from('themes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error deleting theme:', err);
      setError(err as Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get all themes
  const getAllThemes = async (): Promise<Theme[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (!data) return [];
      
      // Convert the raw data to Theme array
      const themes: Theme[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        status: item.status || 'draft',
        is_default: item.is_default || false,
        created_by: item.created_by || undefined,
        created_at: item.created_at || '',
        updated_at: item.updated_at || '',
        published_at: item.published_at || undefined,
        version: item.version || 1,
        cache_key: item.cache_key || undefined,
        parent_theme_id: item.parent_theme_id || undefined,
        design_tokens: item.design_tokens as any || {},
        component_tokens: Array.isArray(item.component_tokens) 
          ? (item.component_tokens as any[]).map(token => ({
              id: token.id || `token-${Date.now()}`,
              component_name: token.component_name || '',
              styles: token.styles || {},
              description: token.description || '',
              theme_id: token.theme_id,
              context: token.context,
              created_at: token.created_at || '',
              updated_at: token.updated_at || ''
            }))
          : [],
        composition_rules: item.composition_rules as any || {},
        cached_styles: item.cached_styles as any || {},
      }));
      
      return themes;
    } catch (err) {
      console.error('Error getting themes:', err);
      setError(err as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    createTheme,
    getTheme,
    updateTheme,
    deleteTheme,
    getAllThemes,
    isLoading,
    error
  };
}
