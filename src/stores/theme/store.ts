
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ThemeState, ThemeStore } from './types';
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeStore', { category: LogCategory.THEME });

// Initial state
const initialState: ThemeState = {
  currentTheme: null,
  themeTokens: [],
  themeComponents: [],
  adminComponents: [],
  isLoading: false,
  error: null
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setTheme: async (themeId: string) => {
        try {
          set({ isLoading: true, error: null });
          logger.info('Setting theme', { details: { themeId } });
          
          // 1. Get theme details
          const { data: theme, error: themeError } = await supabase
            .from('themes')
            .select('*')
            .eq('id', themeId)
            .single();
          
          if (themeError) throw themeError;
          
          // 2. Get theme tokens
          const { data: tokens, error: tokensError } = await supabase
            .from('theme_tokens')
            .select('*')
            .eq('theme_id', themeId);
          
          if (tokensError) throw tokensError;
          
          // 3. Get theme components for site context
          const { data: siteComponents, error: siteComponentsError } = await supabase
            .from('theme_components')
            .select('*')
            .eq('theme_id', themeId)
            .eq('context', 'site');
          
          if (siteComponentsError) throw siteComponentsError;
          
          // 4. Get theme components for admin context
          const { data: adminComponents, error: adminComponentsError } = await supabase
            .from('theme_components')
            .select('*')
            .eq('theme_id', themeId)
            .eq('context', 'admin');
          
          if (adminComponentsError) throw adminComponentsError;
          
          set({
            currentTheme: theme,
            themeTokens: tokens || [],
            themeComponents: siteComponents || [],
            adminComponents: adminComponents || [],
            isLoading: false
          });
          
          logger.info('Theme set successfully', { details: { 
            themeId, 
            tokenCount: tokens?.length || 0,
            siteComponentCount: siteComponents?.length || 0,
            adminComponentCount: adminComponents?.length || 0
          } });
          
          return;
        } catch (error) {
          logger.error('Error setting theme', { details: safeDetails(error) });
          set({ error: error instanceof Error ? error : new Error('Unknown error setting theme'), isLoading: false });
          throw error;
        }
      },
      
      loadAdminComponents: async () => {
        try {
          logger.info('Loading admin components');
          const themeId = get().currentTheme?.id;
          
          if (!themeId) {
            logger.warn('No current theme set, cannot load admin components');
            return [];
          }
          
          const { data: adminComponents, error } = await supabase
            .from('theme_components')
            .select('*')
            .eq('theme_id', themeId)
            .eq('context', 'admin');
          
          if (error) throw error;
          
          set({ adminComponents: adminComponents || [] });
          logger.info('Admin components loaded', { details: { count: adminComponents?.length || 0 } });
          
          return adminComponents || [];
        } catch (error) {
          logger.error('Error loading admin components', { details: safeDetails(error) });
          return [];
        }
      },
      
      hydrateTheme: async () => {
        try {
          logger.info('Hydrating theme from storage');
          const currentTheme = get().currentTheme;
          
          if (!currentTheme?.id) {
            // Get default theme
            const { data: defaultTheme, error: defaultThemeError } = await supabase
              .from('themes')
              .select('*')
              .eq('is_default', true)
              .single();
            
            if (defaultThemeError) {
              logger.warn('No default theme found, using first available');
              const { data: anyTheme, error: anyThemeError } = await supabase
                .from('themes')
                .select('*')
                .limit(1)
                .single();
              
              if (anyThemeError) throw anyThemeError;
              
              if (anyTheme) {
                await get().setTheme(anyTheme.id);
              }
            } else if (defaultTheme) {
              await get().setTheme(defaultTheme.id);
            }
          } else {
            // Refresh theme data
            await get().setTheme(currentTheme.id);
          }
          
          logger.info('Theme hydrated successfully');
        } catch (error) {
          logger.error('Error hydrating theme', { details: safeDetails(error) });
          set({ error: error instanceof Error ? error : new Error('Unknown error hydrating theme') });
        }
      },
      
      updateComponent: async (component) => {
        try {
          set({ isLoading: true, error: null });
          logger.info('Updating theme component', { details: { componentId: component.id } });
          
          const { data, error } = await supabase
            .from('theme_components')
            .update(component)
            .eq('id', component.id)
            .select()
            .single();
          
          if (error) throw error;
          
          // Update the appropriate components array based on context
          if (component.context === 'admin') {
            set({
              adminComponents: get().adminComponents.map(c => c.id === component.id ? data : c),
              isLoading: false
            });
          } else {
            set({
              themeComponents: get().themeComponents.map(c => c.id === component.id ? data : c),
              isLoading: false
            });
          }
          
          logger.info('Component updated successfully', { details: { componentId: component.id } });
          return data;
        } catch (error) {
          logger.error('Error updating component', { details: safeDetails(error) });
          set({ error: error instanceof Error ? error : new Error('Unknown error updating component'), isLoading: false });
          throw error;
        }
      },
      
      createComponent: async (component) => {
        try {
          set({ isLoading: true, error: null });
          logger.info('Creating new theme component', { details: { context: component.context } });
          
          const { data, error } = await supabase
            .from('theme_components')
            .insert(component)
            .select()
            .single();
          
          if (error) throw error;
          
          // Add to the appropriate components array based on context
          if (component.context === 'admin') {
            set({
              adminComponents: [...get().adminComponents, data],
              isLoading: false
            });
          } else {
            set({
              themeComponents: [...get().themeComponents, data],
              isLoading: false
            });
          }
          
          logger.info('Component created successfully', { details: { componentId: data.id } });
          return data;
        } catch (error) {
          logger.error('Error creating component', { details: safeDetails(error) });
          set({ error: error instanceof Error ? error : new Error('Unknown error creating component'), isLoading: false });
          throw error;
        }
      },
      
      deleteComponent: async (componentId: string) => {
        try {
          set({ isLoading: true, error: null });
          logger.info('Deleting theme component', { details: { componentId } });
          
          // First determine if it's an admin or site component
          const adminComponent = get().adminComponents.find(c => c.id === componentId);
          const siteComponent = get().themeComponents.find(c => c.id === componentId);
          
          const { error } = await supabase
            .from('theme_components')
            .delete()
            .eq('id', componentId);
          
          if (error) throw error;
          
          // Remove from the appropriate components array
          if (adminComponent) {
            set({
              adminComponents: get().adminComponents.filter(c => c.id !== componentId),
              isLoading: false
            });
          } else if (siteComponent) {
            set({
              themeComponents: get().themeComponents.filter(c => c.id !== componentId),
              isLoading: false
            });
          }
          
          logger.info('Component deleted successfully', { details: { componentId } });
        } catch (error) {
          logger.error('Error deleting component', { details: safeDetails(error) });
          set({ error: error instanceof Error ? error : new Error('Unknown error deleting component'), isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentTheme: state.currentTheme,
      }),
    }
  )
);
