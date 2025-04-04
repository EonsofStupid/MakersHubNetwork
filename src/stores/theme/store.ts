import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ThemeState, ThemeStore } from './types';
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { 
  dbRowToTheme, 
  dbRowsToComponentTokens, 
  dbRowsToThemeTokens, 
  componentToDbFormat,
  themeToImpulseTheme,
  ensureThemeComponentContext
} from '@/admin/theme/utils/modelTransformers';
import { defaultImpulseTokens } from '@/admin/types/impulse.types';
import { applyThemeToDocument } from '@/admin/theme/utils/themeApplicator';
import { Theme, ThemeComponent, ComponentTokens, convertToThemeComponents } from '@/types/theme';
import { ThemeContextType } from '@/types/theme';

const logger = getLogger('ThemeStore', { category: LogCategory.THEME });

// Initial state
const initialState: ThemeState = {
  currentTheme: null,
  themeTokens: [],
  themeComponents: [],
  adminComponents: [],
  siteComponents: [],
  isLoading: false,
  error: null,
  lastFetchTimestamp: null
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
          const { data: themeData, error: themeError } = await supabase
            .from('themes')
            .select('*')
            .eq('id', themeId)
            .single();
          
          if (themeError) throw themeError;
          
          // Convert DB row to Theme type
          const theme = dbRowToTheme(themeData);
          if (!theme) throw new Error('Failed to transform theme data');
          
          // 2. Get theme tokens
          const { data: tokensData, error: tokensError } = await supabase
            .from('theme_tokens')
            .select('*')
            .eq('theme_id', themeId);
          
          if (tokensError) throw tokensError;
          
          // Convert DB rows to ThemeToken type
          const tokens = dbRowsToThemeTokens(tokensData || []);
          
          // 3. Get theme components for site context
          const { data: siteComponentsData, error: siteComponentsError } = await supabase
            .from('theme_components')
            .select('*')
            .eq('theme_id', themeId)
            .eq('context', 'site');
          
          if (siteComponentsError) throw siteComponentsError;
          
          // Convert DB rows to ComponentTokens type and ensure they have proper context
          const siteComponentTokens = dbRowsToComponentTokens(siteComponentsData || []);
          // First convert to ThemeComponents and then ensure the context is set
          const siteComponents = ensureThemeComponentContext(
            convertToThemeComponents(siteComponentTokens)
          );
          
          // 4. Get theme components for admin context
          const { data: adminComponentsData, error: adminComponentsError } = await supabase
            .from('theme_components')
            .select('*')
            .eq('theme_id', themeId)
            .eq('context', 'admin');
          
          if (adminComponentsError) throw adminComponentsError;
          
          // Convert DB rows to ComponentTokens type and ensure they have proper context
          const adminComponentTokens = dbRowsToComponentTokens(adminComponentsData || []);
          // First convert to ThemeComponents and then ensure the context is set
          const adminComponents = ensureThemeComponentContext(
            convertToThemeComponents(adminComponentTokens)
          );
          
          // Apply theme to document
          try {
            // Create Impulse theme from the DB theme for immediate application
            const impulseTheme = themeToImpulseTheme(theme);
            applyThemeToDocument(impulseTheme);
            logger.debug('Theme applied to document', { 
              details: { themeId: theme.id, themeName: theme.name } 
            });
          } catch (applyError) {
            logger.error('Failed to apply theme to document', { 
              details: safeDetails(applyError)
            });
            // Continue with setting state, we'll rely on emergency fallbacks
          }
          
          set({
            currentTheme: theme,
            themeTokens: tokens,
            themeComponents: [...siteComponents, ...adminComponents],
            adminComponents: adminComponents,
            siteComponents: siteComponents,
            isLoading: false,
            lastFetchTimestamp: new Date().toISOString()
          });
          
          logger.info('Theme set successfully', { details: { 
            themeId, 
            tokenCount: tokens.length,
            siteComponentCount: siteComponents.length,
            adminComponentCount: adminComponents.length
          } });
          
          return theme;
        } catch (error) {
          logger.error('Error setting theme', { details: safeDetails(error) });
          set({ error: error instanceof Error ? error : new Error('Unknown error setting theme'), isLoading: false });
          throw error;
        }
      },
      
      loadComponentsByContext: async (context: 'site' | 'admin' | 'all' = 'all') => {
        try {
          logger.info(`Loading ${context} components`);
          const themeId = get().currentTheme?.id;
          
          if (!themeId) {
            logger.warn('No current theme set, cannot load components');
            return [];
          }
          
          let query = supabase
            .from('theme_components')
            .select('*')
            .eq('theme_id', themeId);
          
          if (context !== 'all') {
            query = query.eq('context', context);
          }
          
          const { data, error } = await query;
          
          if (error) throw error;
          
          // Convert DB rows to ComponentTokens type
          const componentTokens = dbRowsToComponentTokens(data || []);
          // Convert to ThemeComponents for type safety
          const components = convertToThemeComponents(componentTokens);
          
          // Update the appropriate state
          if (context === 'admin' || context === 'all') {
            const adminComponents = context === 'all' 
              ? components.filter(c => c.context === 'admin')
              : components;
            
            set({ adminComponents });
            logger.info('Admin components loaded', { 
              details: { count: adminComponents.length } 
            });
          }
          
          if (context === 'site' || context === 'all') {
            const siteComponents = context === 'all' 
              ? components.filter(c => c.context === 'site')
              : components;
            
            set({ siteComponents });
            logger.info('Site components loaded', { 
              details: { count: siteComponents.length } 
            });
          }
          
          return components;
        } catch (error) {
          logger.error(`Error loading ${context} components`, { 
            details: safeDetails(error) 
          });
          return [];
        }
      },
      
      loadAdminComponents: async () => {
        return get().loadComponentsByContext('admin');
      },
      
      loadSiteComponents: async () => {
        return get().loadComponentsByContext('site');
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
          
          // Apply theme to document
          const updatedTheme = get().currentTheme;
          if (updatedTheme) {
            try {
              const impulseTheme = themeToImpulseTheme(updatedTheme);
              applyThemeToDocument(impulseTheme);
              logger.debug('Theme applied to document during hydration', { 
                details: { themeId: updatedTheme.id, themeName: updatedTheme.name } 
              });
            } catch (applyError) {
              logger.error('Failed to apply theme to document during hydration', { 
                details: safeDetails(applyError)
              });
              // Continue with setting state, we'll rely on emergency fallbacks
              applyThemeToDocument(defaultImpulseTokens);
            }
          } else {
            // Apply default theme if no theme was loaded
            applyThemeToDocument(defaultImpulseTokens);
          }
          
          logger.info('Theme hydrated successfully');
        } catch (error) {
          logger.error('Error hydrating theme', { details: safeDetails(error) });
          set({ error: error instanceof Error ? error : new Error('Unknown error hydrating theme') });
          
          // Apply default theme on error
          applyThemeToDocument(defaultImpulseTokens);
        }
      },
      
      updateComponent: async (component: ThemeComponent) => {
        try {
          set({ isLoading: true, error: null });
          logger.info('Updating theme component', { details: { componentId: component.id } });
          
          const dbComponent = componentToDbFormat(component);
          
          const { data, error } = await supabase
            .from('theme_components')
            .update(dbComponent)
            .eq('id', component.id)
            .select()
            .single();
          
          if (error) throw error;
          
          // Convert DB row to ThemeComponent type
          const componentTokens = data ? dbRowsToComponentTokens([data])[0] : component;
          
          // Create a properly typed ThemeComponent
          const updatedComponent: ThemeComponent = {
            id: componentTokens.id,
            theme_id: componentTokens.theme_id || component.theme_id,
            component_name: componentTokens.component_name,
            styles: componentTokens.styles,
            description: componentTokens.description,
            created_at: componentTokens.created_at,
            updated_at: componentTokens.updated_at,
            context: componentTokens.context || component.context
          };
          
          // Update the appropriate components arrays based on context
          if (component.context === 'admin') {
            set({
              adminComponents: get().adminComponents.map(c => c.id === component.id ? updatedComponent : c),
              themeComponents: get().themeComponents.map(c => c.id === component.id ? updatedComponent : c),
              isLoading: false
            });
          } else {
            set({
              siteComponents: get().siteComponents.map(c => c.id === component.id ? updatedComponent : c),
              themeComponents: get().themeComponents.map(c => c.id === component.id ? updatedComponent : c),
              isLoading: false
            });
          }
          
          logger.info('Component updated successfully', { details: { componentId: component.id } });
          return updatedComponent;
        } catch (error) {
          logger.error('Error updating component', { details: safeDetails(error) });
          set({ error: error instanceof Error ? error : new Error('Unknown error updating component'), isLoading: false });
          throw error;
        }
      },
      
      createComponent: async (component: Omit<ThemeComponent, "id" | "created_at" | "updated_at">) => {
        try {
          set({ isLoading: true, error: null });
          logger.info('Creating new theme component', { details: { context: component.context } });
          
          const dbComponent = {
            component_name: component.component_name,
            styles: component.styles,
            context: component.context,
            theme_id: component.theme_id,
            description: component.description || ''
          };
          
          const { data, error } = await supabase
            .from('theme_components')
            .insert(dbComponent)
            .select()
            .single();
          
          if (error) throw error;
          
          // Create a properly typed ThemeComponent
          const newComponent: ThemeComponent = {
            id: data.id,
            theme_id: data.theme_id,
            component_name: data.component_name,
            styles: data.styles,
            description: data.description,
            created_at: data.created_at,
            updated_at: data.updated_at,
            context: data.context as ThemeContextType
          };
          
          // Add to the appropriate components arrays based on context
          if (component.context === 'admin') {
            set({
              adminComponents: [...get().adminComponents, newComponent],
              themeComponents: [...get().themeComponents, newComponent],
              isLoading: false
            });
          } else {
            set({
              siteComponents: [...get().siteComponents, newComponent],
              themeComponents: [...get().themeComponents, newComponent],
              isLoading: false
            });
          }
          
          logger.info('Component created successfully', { details: { componentId: newComponent.id } });
          return newComponent;
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
          const siteComponent = get().siteComponents.find(c => c.id === componentId);
          
          const { error } = await supabase
            .from('theme_components')
            .delete()
            .eq('id', componentId);
          
          if (error) throw error;
          
          // Remove from all components arrays
          if (adminComponent) {
            set({
              adminComponents: get().adminComponents.filter(c => c.id !== componentId),
              themeComponents: get().themeComponents.filter(c => c.id !== componentId),
              isLoading: false
            });
          } else if (siteComponent) {
            set({
              siteComponents: get().siteComponents.filter(c => c.id !== componentId),
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
      },
      
      updateCurrentTheme: (updatedTheme: Partial<Theme>) => {
        const currentTheme = get().currentTheme;
        if (!currentTheme) {
          logger.warn('Cannot update current theme: no theme set');
          return;
        }
        
        const newTheme = { ...currentTheme, ...updatedTheme };
        set({ currentTheme: newTheme });
        
        // Apply theme to document
        try {
          const impulseTheme = themeToImpulseTheme(newTheme);
          applyThemeToDocument(impulseTheme);
        } catch (error) {
          logger.error('Failed to apply updated theme to document', { details: safeDetails(error) });
        }
        
        logger.info('Current theme updated', { details: { themeId: currentTheme.id } });
      },
      
      applyDefaultTheme: () => {
        applyThemeToDocument(defaultImpulseTokens);
        logger.info('Applied default theme to document');
      }
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export const selectCurrentTheme = (state: ThemeStore) => state.currentTheme;
export const selectThemeTokens = (state: ThemeStore) => state.themeTokens;
export const selectSiteComponents = (state: ThemeStore) => state.siteComponents;
export const selectAdminComponents = (state: ThemeStore) => state.adminComponents;
export const selectThemeComponents = (state: ThemeStore) => state.themeComponents;
export const selectIsLoading = (state: ThemeStore) => state.isLoading;
export const selectError = (state: ThemeStore) => state.error;
export const selectLastFetchTimestamp = (state: ThemeStore) => state.lastFetchTimestamp;

export function selectThemeProperty<T>(property: string, defaultValue: T) {
  return (state: ThemeStore): T => {
    if (!state.currentTheme) return defaultValue;
    
    try {
      const parts = property.split('.');
      let value: any = state.currentTheme;
      
      for (const part of parts) {
        if (value === undefined || value === null) return defaultValue;
        value = value[part];
      }
      
      return (value !== undefined && value !== null) ? value : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  };
}

/**
 * Map database theme to application theme model
 */
function mapThemeFromDatabase(dbTheme: any): ImpulseTheme {
  const logger = getLogger('themeStore:mapper', { category: LogCategory.THEME });
  
  try {
    // Handle potentially null values with safe defaults
    return {
      id: dbTheme.id || '',
      name: dbTheme.name || 'Unnamed Theme',
      slug: dbTheme.slug || 'unnamed-theme',
      description: dbTheme.description || '',
      author: dbTheme.author || 'Unknown',
      version: dbTheme.version || '1.0.0',
      colors: dbTheme.colors || defaultColors,
      typography: dbTheme.typography || defaultTypography,
      effects: dbTheme.effects || defaultEffects,
      components: dbTheme.components || defaultComponents,
      created_at: dbTheme.created_at || new Date().toISOString(),
      updated_at: dbTheme.updated_at || new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error mapping theme from database', { 
      details: { error, theme: dbTheme } 
    });
    
    // Return default theme on error
    return {
      ...defaultImpulseTokens,
      id: dbTheme?.id || '',
      name: dbTheme?.name || 'Error Theme',
      slug: 'error-theme',
      description: 'Theme created due to mapping error',
      author: 'System',
      version: '1.0.0',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

// Fix the ThemeContext reference:
// This should reference ThemeContextType instead
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

// This would be used in other parts of the code instead of ThemeContext
const themeContext: ThemeContextType = {
  theme: 'default',
  setTheme: () => {}
};
