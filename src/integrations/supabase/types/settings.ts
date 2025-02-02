import { Database } from './database';

export type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
export type AdminSettings = Database['public']['Tables']['admin_settings']['Row'];

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
  };
}

export interface SystemConfig {
  maintenance: boolean;
  debugMode: boolean;
  cacheTimeout: number;
  maxUploadSize: number;
}