import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Theme, ComponentTokens } from '@/types/theme';
import { transformThemeModel, transformComponentTokens } from '@/utils/transformUtils';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

interface ThemeState {
  currentTheme: Theme | null;
  siteComponents: ComponentTokens[] | null;
  adminComponents: ComponentTokens[] | null;
  isLoading: boolean;
  error: Error | null;
  fetchTheme: (themeId: string) => Promise<void>;
  loadSiteComponents: () => Promise<void>;
  loadAdminComponents: () => Promise<void>;
  updateTheme: (themeUpdates: Partial<Theme>) => void;
  hydrateTheme: () => Promise<void>;
}

const logger = getLogger('ThemeStore', { category: LogCategory.THEME });

const transformRawTheme = (rawTheme: any): Theme => {
  if (!rawTheme) return null as unknown as Theme; // This is not ideal, but would need more refactoring

  return {
    id: String(rawTheme.id || ''),
    name: String(rawTheme.name || ''),
    description: rawTheme.description || '',
    status: rawTheme.status || 'draft',
    is_default: Boolean(rawTheme.is_default),
    created_at: rawTheme.created_at || new Date().toISOString(),
    updated_at: rawTheme.updated_at || new Date().toISOString(),
    published_at: rawTheme.published_at || undefined,
    version: Number(rawTheme.version || 1),
    cache_key: rawTheme.cache_key || '',
    parent_theme_id: rawTheme.parent_theme_id || undefined,
    design_tokens: rawTheme.design_tokens ? rawTheme.design_tokens : {},
    component_tokens: rawTheme.component_tokens ? rawTheme.component_tokens : [],
    composition_rules: rawTheme.composition_rules || {},
    cached_styles: rawTheme.cached_styles || {}
  };
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentTheme: null,
  siteComponents: null,
  adminComponents: null,
  isLoading: true,
  error: null,
  
  fetchTheme: async (themeId: string) => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Fetching theme data', { details: { themeId } });
      
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('id', themeId)
        .single();
      
      if (error) {
        logger.error('Failed to fetch theme', { details: safeDetails(error) });
        throw error;
      }
      
      const theme = transformThemeModel(data);
      set({ currentTheme: theme || null, isLoading: false });
      logger.info('Theme data loaded successfully', { details: { themeId } });
    } catch (error) {
      logger.error('Error fetching theme', { details: safeDetails(error) });
      set({ 
        error: error instanceof Error ? error : new Error('Failed to load theme'), 
        isLoading: false 
      });
    }
  },
  
  loadSiteComponents: async () => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Loading site components');
      
      const { data, error } = await supabase
        .from('component_tokens')
        .select('*')
        .eq('context', 'site');
      
      if (error) {
        logger.error('Failed to load site components', { details: safeDetails(error) });
        throw error;
      }
      
      const components = transformComponentTokens(data);
      set({ siteComponents: components, isLoading: false });
      logger.info('Site components loaded successfully', { details: { count: components?.length } });
    } catch (error) {
      logger.error('Error loading site components', { details: safeDetails(error) });
      set({ 
        error: error instanceof Error ? error : new Error('Failed to load site components'), 
        isLoading: false 
      });
    }
  },
  
  loadAdminComponents: async () => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Loading admin components');
      
      const { data, error } = await supabase
        .from('component_tokens')
        .select('*')
        .eq('context', 'admin');
      
      if (error) {
        logger.error('Failed to load admin components', { details: safeDetails(error) });
        throw error;
      }
      
     const components = transformComponentTokens(data);
      set({ adminComponents: components, isLoading: false });
      logger.info('Admin components loaded successfully', { details: { count: components?.length } });
    } catch (error) {
      logger.error('Error loading admin components', { details: safeDetails(error) });
      set({ 
        error: error instanceof Error ? error : new Error('Failed to load admin components'), 
        isLoading: false 
      });
    }
  },
  
  updateTheme: (themeUpdates) => {
    set(state => ({
      currentTheme: state.currentTheme ? { ...state.currentTheme, ...themeUpdates } : null
    }));
  },
  
  hydrateTheme: async () => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Hydrating theme from database');
      
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('is_default', true)
        .single();
      
      if (error) {
        logger.error('Failed to hydrate theme', { details: safeDetails(error) });
        throw error;
      }
      
      const theme = transformThemeModel(data);
      set({ currentTheme: theme || null, isLoading: false });
      logger.info('Theme hydrated successfully');
    } catch (error) {
      logger.error('Error hydrating theme', { details: safeDetails(error) });
      set({ 
        error: error instanceof Error ? error : new Error('Failed to hydrate theme'), 
        isLoading: false 
      });
    }
  }
}));
