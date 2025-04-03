
// Fix the store.ts file to properly handle null values
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { getLogger } from '@/logging';

const logger = getLogger('themeStore');

export interface ThemeComponent {
  id: string;
  theme_id: string;
  component_name: string;
  context: 'site' | 'admin' | 'print';
  styles: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ThemeData {
  id: string;
  name: string;
  description: string;
  is_system: boolean;
  is_active: boolean;
  design_tokens: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ThemeStore {
  // Theme state
  currentTheme: ThemeData | null;
  themeComponents: ThemeComponent[];
  adminComponents: ThemeComponent[];
  isLoading: boolean;
  error: Error | null;

  // Theme actions
  loadTheme: (themeId: string) => Promise<ThemeData>;
  setTheme: (themeId: string) => Promise<void>;
  loadComponents: (themeId: string) => Promise<ThemeComponent[]>;
  loadAdminComponents: () => Promise<ThemeComponent[]>;
  updateComponent: (component: ThemeComponent) => Promise<ThemeComponent>;
  createComponent: (component: Omit<ThemeComponent, 'id' | 'created_at' | 'updated_at'>) => Promise<ThemeComponent>;
  deleteComponent: (componentId: string) => Promise<void>;
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

          set({ currentTheme: data, isLoading: false });
          return data;
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

          set({ themeComponents: data || [], isLoading: false });
          return data || [];
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

          set({ adminComponents: data || [], isLoading: false });
          return data || [];
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

          // Update components in state
          set(state => ({
            themeComponents: state.themeComponents.map(c => 
              c.id === component.id ? { ...c, ...data } : c
            ),
            adminComponents: state.adminComponents.map(c =>
              c.id === component.id ? { ...c, ...data } : c
            ),
            isLoading: false
          }));

          return data;
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

          // Add new component to state
          set(state => ({
            themeComponents: [...state.themeComponents, data],
            adminComponents: component.context === 'admin' 
              ? [...state.adminComponents, data] 
              : state.adminComponents,
            isLoading: false
          }));

          return data;
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
