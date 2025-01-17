import { BaseService } from './base.service';
import type { Theme, ThemeToken, ThemeComponent } from '@/types/theme';
import type { ServiceResponse } from './types';

class ThemeService extends BaseService<'themes'> {
  constructor() {
    super('themes');
  }

  async getDefaultTheme(): Promise<ServiceResponse<Theme>> {
    try {
      const { data, error } = await this.createQuery()
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

  async getThemeTokens(themeId: string): Promise<ServiceResponse<ThemeToken[]>> {
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

  async getThemeComponents(themeId: string): Promise<ServiceResponse<ThemeComponent[]>> {
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