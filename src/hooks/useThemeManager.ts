
import { useState } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { supabase } from '@/integrations/supabase/client';
import { Theme, ComponentTokens } from '@/types/theme';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

// ThemeToken type for the hook usage
interface ThemeToken {
  id?: string;
  token_name: string;
  token_value: string;
  category: string;
  description?: string;
  fallback_value?: string;
  theme_id?: string;
}

export function useThemeManager() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { currentTheme, setTheme } = useThemeStore();
  const { toast } = useToast();

  const createTheme = async (theme: Omit<Theme, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsUpdating(true);
      
      // Convert the complex objects to Json type for the database
      const themeToInsert = {
        name: theme.name,
        description: theme.description || '',
        status: theme.status || 'draft',
        is_default: theme.is_default || false,
        version: theme.version || 1,
        design_tokens: theme.design_tokens || {},
        component_tokens: [], // These will be handled separately
        composition_rules: theme.composition_rules || {},
        cached_styles: theme.cached_styles || {}
      };
      
      const { data, error } = await supabase
        .from('themes')
        .insert(themeToInsert)
        .select()
        .single();

      if (error) throw error;

      // If we have component tokens, insert them separately
      if (theme.component_tokens && theme.component_tokens.length > 0) {
        const componentTokensToInsert = theme.component_tokens.map(token => ({
          theme_id: data.id,
          component_name: token.component_name,
          styles: token.styles
        }));
        
        const { error: componentsError } = await supabase
          .from('theme_components')
          .insert(componentTokensToInsert);
          
        if (componentsError) throw componentsError;
      }

      toast({
        title: "Theme created",
        description: `Theme "${theme.name}" has been created successfully.`,
      });

      return data;
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error creating theme",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateTheme = async (
    themeId: string,
    updates: Partial<Omit<Theme, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    try {
      setIsUpdating(true);
      
      // Create a clean object with only the fields we want to update
      const themeUpdates: Record<string, any> = {};
      
      // Add basic fields directly
      if (updates.name) themeUpdates.name = updates.name;
      if (updates.description !== undefined) themeUpdates.description = updates.description;
      if (updates.status) themeUpdates.status = updates.status;
      if (updates.is_default !== undefined) themeUpdates.is_default = updates.is_default;
      if (updates.version) themeUpdates.version = updates.version;
      if (updates.published_at) themeUpdates.published_at = updates.published_at;
      if (updates.parent_theme_id) themeUpdates.parent_theme_id = updates.parent_theme_id;
      if (updates.cache_key) themeUpdates.cache_key = updates.cache_key;
      
      // Handle complex objects
      if (updates.design_tokens) themeUpdates.design_tokens = updates.design_tokens as Json;
      if (updates.composition_rules) themeUpdates.composition_rules = updates.composition_rules as Json;
      if (updates.cached_styles) themeUpdates.cached_styles = updates.cached_styles as Json;
      
      // Update the theme
      const { data, error } = await supabase
        .from('themes')
        .update(themeUpdates)
        .eq('id', themeId)
        .select()
        .single();

      if (error) throw error;

      // If we have component tokens, handle them separately
      if (updates.component_tokens && updates.component_tokens.length > 0) {
        for (const component of updates.component_tokens) {
          if (component.id) {
            // Update existing component
            const { error: updateError } = await supabase
              .from('theme_components')
              .update({
                component_name: component.component_name,
                styles: component.styles as Json
              })
              .eq('id', component.id);
              
            if (updateError) throw updateError;
          } else {
            // Insert new component
            const { error: insertError } = await supabase
              .from('theme_components')
              .insert({
                theme_id: themeId,
                component_name: component.component_name,
                styles: component.styles as Json
              });
              
            if (insertError) throw insertError;
          }
        }
      }

      toast({
        title: "Theme updated",
        description: `Theme has been updated successfully.`,
      });

      if (currentTheme?.id === themeId) {
        await setTheme(themeId);
      }

      return data;
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error updating theme",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateThemeTokens = async (themeId: string, tokens: Omit<ThemeToken, 'id' | 'theme_id'>[]) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('theme_tokens')
        .upsert(
          tokens.map(token => ({
            ...token,
            theme_id: themeId,
            category: token.category || 'default',
          }))
        );

      if (error) throw error;

      toast({
        title: "Theme tokens updated",
        description: "Theme tokens have been updated successfully.",
      });

      if (currentTheme?.id === themeId) {
        await setTheme(themeId);
      }
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error updating theme tokens",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateThemeComponents = async (themeId: string, components: Omit<ComponentTokens, 'id' | 'theme_id'>[]) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('theme_components')
        .upsert(
          components.map(component => ({
            ...component,
            theme_id: themeId,
            component_name: component.component_name,
            styles: component.styles as Json
          }))
        );

      if (error) throw error;

      toast({
        title: "Theme components updated",
        description: "Theme components have been updated successfully.",
      });

      if (currentTheme?.id === themeId) {
        await setTheme(themeId);
      }
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error updating theme components",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    createTheme,
    updateTheme,
    updateThemeTokens,
    updateThemeComponents,
  };
}
