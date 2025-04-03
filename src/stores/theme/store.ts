
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { Theme, ComponentTokens } from '@/types/theme';
import { 
  saveThemeToLocalStorage,
  getThemeFromLocalStorage
} from './localStorage';

const logger = getLogger('themeStore', { category: LogCategory.THEME });

export interface ThemeComponent extends ComponentTokens {
  theme_id: string;
  context: 'site' | 'admin' | 'print';
}

export interface ThemeStore {
  // Theme state
  currentTheme: Theme | null;
  themeComponents: ThemeComponent[];
  adminComponents: ThemeComponent[];
  isLoading: boolean;
  error: Error | null;

  // Theme actions
  loadTheme: (themeId: string) => Promise<Theme>;
  setTheme: (themeId: string) => Promise<void>;
  loadComponents: (themeId: string) => Promise<ThemeComponent[]>;
  loadAdminComponents: () => Promise<ThemeComponent[]>;
  updateComponent: (component: ThemeComponent) => Promise<ThemeComponent>;
  createComponent: (component: Omit<ThemeComponent, 'id' | 'created_at' | 'updated_at'>) => Promise<ThemeComponent>;
  deleteComponent: (componentId: string) => Promise<void>;
  hydrateTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentTheme: null,
      themeComponents: [],
      adminComponents: [],
      isLoading: false,
      error: null,

      // Hydrate theme from localStorage or use the default
      hydrateTheme: async () => {
        const storedThemeId = getThemeFromLocalStorage();
        if (storedThemeId) {
          try {
            logger.info('Hydrating theme from localStorage', { details: { themeId: storedThemeId } });
            await get().setTheme(storedThemeId);
          } catch (error) {
            logger.error('Failed to hydrate theme, using default', { details: { error } });
            // Try to set the default theme
            try {
              const { data } = await supabase
                .from('themes')
                .select('id')
                .eq('is_default', true)
                .single();
                
              if (data?.id) {
                await get().setTheme(data.id);
              }
            } catch (defaultError) {
              logger.error('Failed to load default theme as well', { details: { defaultError } });
              set({ error: new Error('Failed to load any theme'), isLoading: false });
            }
          }
        } else {
          logger.info('No theme in localStorage, attempting to load default');
          try {
            const { data } = await supabase
              .from('themes')
              .select('id')
              .eq('is_default', true)
              .single();
              
            if (data?.id) {
              await get().setTheme(data.id);
            }
          } catch (error) {
            logger.error('Failed to load default theme', { details: { error } });
            set({ error: new Error('Failed to load default theme'), isLoading: false });
          }
        }
      },

      // Actions
      loadTheme: async (themeId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('themes')
            .select('*')
            .eq('id', themeId)
            .single();

          if (error) throw error;
          if (!data) throw new Error(`Theme not found: ${themeId}`);

          // Transform the raw data to match the Theme interface
          const theme: Theme = {
            id: data.id,
            name: data.name,
            description: data.description || '',
            status: data.status || 'published',
            is_default: data.is_default || false,
            created_by: data.created_by || '',
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at || new Date().toISOString(),
            published_at: data.published_at,
            version: data.version || 1,
            cache_key: data.cache_key,
            parent_theme_id: data.parent_theme_id,
            design_tokens: data.design_tokens || {},
            component_tokens: [],
            composition_rules: data.composition_rules || {},
            cached_styles: data.cached_styles || {},
            is_system: data.is_system || false,
            is_active: data.is_active || true,
          };

          set({ currentTheme: theme, isLoading: false });
          
          // Save successful theme to localStorage
          saveThemeToLocalStorage(themeId);
          
          return theme;
        } catch (error: any) {
          set({ error, isLoading: false });
          throw error;
        }
      },

      setTheme: async (themeId: string) => {
        const { loadTheme, loadComponents } = get();
        
        try {
          const theme = await loadTheme(themeId);
          const components = await loadComponents(themeId);
          
          set({ 
            currentTheme: theme,
            themeComponents: components,
            isLoading: false,
            error: null
          });
          
          // Save to localStorage
          saveThemeToLocalStorage(themeId);
        } catch (error: any) {
          set({ error, isLoading: false });
          throw error;
        }
      },

      loadComponents: async (themeId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('theme_components')
            .select('*')
            .eq('theme_id', themeId);

          if (error) throw error;

          // Transform data to match the ThemeComponent interface
          const components: ThemeComponent[] = (data || []).map(item => ({
            id: item.id,
            component_name: item.component_name || '',
            styles: item.styles || {},
            theme_id: item.theme_id || themeId,
            context: (item.context as 'site' | 'admin' | 'print') || 'site',
            created_at: item.created_at,
            updated_at: item.updated_at,
            description: item.description,
          }));

          set({ themeComponents: components, isLoading: false });
          return components;
        } catch (error: any) {
          set({ error, isLoading: false });
          throw error;
        }
      },

      loadAdminComponents: async () => {
        const { currentTheme } = get();
        if (!currentTheme) {
          return [];
        }

        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('theme_components')
            .select('*')
            .eq('theme_id', currentTheme.id)
            .eq('context', 'admin');

          if (error) throw error;

          // Transform data to match the ThemeComponent interface
          const components: ThemeComponent[] = (data || []).map(item => ({
            id: item.id,
            component_name: item.component_name || '',
            styles: item.styles || {},
            theme_id: item.theme_id || currentTheme.id,
            context: 'admin',
            created_at: item.created_at,
            updated_at: item.updated_at,
            description: item.description,
          }));

          set({ adminComponents: components, isLoading: false });
          return components;
        } catch (error: any) {
          set({ error, isLoading: false });
          throw error;
        }
      },

      updateComponent: async (component) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('theme_components')
            .update({
              component_name: component.component_name || '',
              context: component.context || 'site',
              styles: component.styles || {},
              updated_at: new Date().toISOString()
            })
            .eq('id', component.id)
            .select()
            .single();

          if (error) throw error;

          // Transform the returned data into a ThemeComponent
          const updatedComponent: ThemeComponent = {
            id: data.id,
            component_name: data.component_name || '',
            styles: data.styles || {},
            theme_id: data.theme_id || component.theme_id,
            context: (data.context as 'site' | 'admin' | 'print') || 'site',
            created_at: data.created_at,
            updated_at: data.updated_at,
            description: data.description,
          };

          // Update components in state
          set(state => ({
            themeComponents: state.themeComponents.map(c => 
              c.id === component.id ? updatedComponent : c
            ),
            adminComponents: state.adminComponents.map(c =>
              c.id === component.id ? updatedComponent : c
            ),
            isLoading: false
          }));

          return updatedComponent;
        } catch (error: any) {
          set({ error, isLoading: false });
          throw error;
        }
      },

      createComponent: async (component) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('theme_components')
            .insert({
              theme_id: component.theme_id,
              component_name: component.component_name || '',
              context: component.context || 'site',
              styles: component.styles || {}
            })
            .select()
            .single();

          if (error) throw error;

          // Transform the returned data into a ThemeComponent
          const newComponent: ThemeComponent = {
            id: data.id,
            component_name: data.component_name || '',
            styles: data.styles || {},
            theme_id: data.theme_id || component.theme_id,
            context: (data.context as 'site' | 'admin' | 'print') || 'site',
            created_at: data.created_at,
            updated_at: data.updated_at,
            description: data.description,
          };

          // Add new component to state
          set(state => ({
            themeComponents: [...state.themeComponents, newComponent],
            adminComponents: component.context === 'admin' 
              ? [...state.adminComponents, newComponent] 
              : state.adminComponents,
            isLoading: false
          }));

          return newComponent;
        } catch (error: any) {
          set({ error, isLoading: false });
          throw error;
        }
      },

      deleteComponent: async (componentId) => {
        set({ isLoading: true, error: null });
        
        try {
          const { error } = await supabase
            .from('theme_components')
            .delete()
            .eq('id', componentId);

          if (error) throw error;

          // Remove component from state
          set(state => ({
            themeComponents: state.themeComponents.filter(c => c.id !== componentId),
            adminComponents: state.adminComponents.filter(c => c.id !== componentId),
            isLoading: false
          }));
        } catch (error: any) {
          set({ error, isLoading: false });
          throw error;
        }
      }
    }),
    { name: 'theme-store' }
  )
);
