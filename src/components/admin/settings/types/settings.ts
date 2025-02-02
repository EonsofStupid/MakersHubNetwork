export interface SettingsFormData {
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
  border_radius: string;
  spacing_unit: string;
  transition_duration: string;
  shadow_color: string;
  hover_scale: string;
  font_family_heading: string;
  font_family_body: string;
  font_size_base: string;
  font_weight_normal: string;
  font_weight_bold: string;
  line_height_base: string;
  letter_spacing: string;
  transition_type: 'fade' | 'slide' | 'scale';
  box_shadow?: string;
  backdrop_blur?: string;
  menu_animation_type?: 'fade' | 'slide-down' | 'scale' | 'blur';
}

// Extend SettingsFormData for the full Settings interface
export interface Settings extends SettingsFormData {
  updated_at?: string;
  updated_by?: string;
}

// Response type for settings operations
export interface SettingsResponse {
  success: boolean;
  data: Settings;
}
