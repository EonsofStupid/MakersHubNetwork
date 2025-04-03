
import { Json } from '@/integrations/supabase/types';

export type ThemeStatus = 'draft' | 'published' | 'archived';
export type ThemeContext = 'site' | 'admin' | 'chat';

export interface ComponentTokens {
  id: string;
  component_name: string;
  styles: Record<string, any>;
  description?: string;
  theme_id?: string;
  created_at?: string;
  updated_at?: string;
  context?: ThemeContext;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  status: ThemeStatus;
  is_default: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  version?: number;
  cache_key?: string;
  parent_theme_id?: string;
  design_tokens: Record<string, any>;
  component_tokens: ComponentTokens[];
  composition_rules: Record<string, any>;
  cached_styles: Record<string, any>;
  is_system?: boolean;
  is_active?: boolean;
}
