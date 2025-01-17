import { BaseService } from './base.service';
import type { Theme, ThemeToken, ThemeComponent, QueryResponse } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

export class ThemeService extends BaseService<'themes'> {
  constructor() {
    super('themes');
  }

  async getDefaultTheme(): Promise<QueryResponse<Theme>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('is_default', true)
        .maybeSingle();

      if (error) throw error;

      return {
        data,
        error: null,
        status: 200
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getThemeTokens(themeId: string): Promise<QueryResponse<ThemeToken[]>> {
    try {
      const { data, error } = await supabase
        .from('theme_tokens')
        .select('*')
        .eq('theme_id', themeId);

      if (error) throw error;

      return {
        data,
        error: null,
        status: 200
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getThemeComponents(themeId: string): Promise<QueryResponse<ThemeComponent[]>> {
    try {
      const { data, error } = await supabase
        .from('theme_components')
        .select('*')
        .eq('theme_id', themeId);

      if (error) throw error;

      return {
        data,
        error: null,
        status: 200
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const themeService = new ThemeService();