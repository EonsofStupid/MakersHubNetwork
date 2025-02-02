import { createContext, useContext } from "react";
import { Theme, ThemeContextType } from "../types/theme";
import { useThemeSettings } from "../hooks/useThemeSettings";
import { useThemeSubscription } from "../hooks/useThemeSubscription";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme, fetchSettings } = useThemeSettings();

  useThemeSubscription(setTheme);

  const updateTheme = async (newTheme: Theme) => {
    try {
      const { error } = await supabase.rpc('update_site_settings', {
        p_site_title: newTheme.site_title,
        p_tagline: newTheme.tagline,
        p_primary_color: newTheme.primary_color,
        p_secondary_color: newTheme.secondary_color,
        p_accent_color: newTheme.accent_color,
        p_text_primary_color: newTheme.text_primary_color,
        p_text_secondary_color: newTheme.text_secondary_color,
        p_text_link_color: newTheme.text_link_color,
        p_text_heading_color: newTheme.text_heading_color,
        p_neon_cyan: newTheme.neon_cyan,
        p_neon_pink: newTheme.neon_pink,
        p_neon_purple: newTheme.neon_purple,
        p_font_family_heading: newTheme.font_family_heading,
        p_font_family_body: newTheme.font_family_body,
        p_font_size_base: newTheme.font_size_base,
        p_font_weight_normal: newTheme.font_weight_normal,
        p_font_weight_bold: newTheme.font_weight_bold,
        p_line_height_base: newTheme.line_height_base,
        p_letter_spacing: newTheme.letter_spacing
      });

      if (error) throw error;
      setTheme(newTheme);
      toast.success("Theme updated successfully");
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error("Failed to update theme");
    }
  };

  if (!theme) {
    console.log("ThemeProvider: Theme not loaded yet");
    return null; // Or a loading spinner
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};