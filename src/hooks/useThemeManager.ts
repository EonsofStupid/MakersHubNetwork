import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { Theme, ThemeToken, ThemeComponent } from '@/types/theme';
import { useToast } from '@/components/ui/use-toast';

export function useThemeManager() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { currentTheme, setTheme } = useTheme();
  const { toast } = useToast();

  const createTheme = async (theme: Omit<Theme, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsUpdating(true);
      const { data, error } = await supabase
        .from('themes')
        .insert(theme)
        .select()
        .single();

      if (error) throw error;

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
      const { data, error } = await supabase
        .from('themes')
        .update(updates)
        .eq('id', themeId)
        .select()
        .single();

      if (error) throw error;

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

  const updateThemeComponents = async (themeId: string, components: Omit<ThemeComponent, 'id' | 'theme_id'>[]) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('theme_components')
        .upsert(
          components.map(component => ({
            ...component,
            theme_id: themeId,
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