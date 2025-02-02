import { Settings } from "@/components/admin/settings/types";

export interface Theme extends Settings {}

export interface ThemeContextType {
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
  updateTheme: (newTheme: Theme) => void;
}

export interface DatabaseSettingsRow {
  id: string;
  site_title: string;
  tagline?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url?: string;
  favicon_url?: string;
  theme_mode?: 'light' | 'dark' | 'system';
  text_primary_color: string;
  text_secondary_color: string;
  text_link_color: string;
  text_heading_color: string;
  neon_cyan: string;
  neon_pink: string;
  neon_purple: string;
  font_family_heading: string;
  font_family_body: string;
  font_size_base: string;
  font_weight_normal: string;
  font_weight_bold: string;
  line_height_base: string;
  letter_spacing: string;
  updated_at?: string;
  updated_by?: string;
}