import React, { createContext, useContext, useEffect, useState } from "react";
import { Settings } from "@/components/admin/settings/types";
import { useThemeSetup } from "./hooks/useThemeSetup";
import { useThemeSubscription } from "./hooks/useThemeSubscription";
import { applyThemeToDocument } from "./utils/themeUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthStore } from '@/lib/store/auth-store';

interface ThemeContextType {
  theme: Settings | null;
  updateTheme: (newTheme: Settings) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useThemeSetup();
  const { session } = useAuthStore();
  
  useThemeSubscription(setTheme);

  useEffect(() => {
    console.log('ThemeProvider mounted, current theme:', theme?.site_title);
  }, [theme]);

  const updateTheme = async (newTheme: Settings) => {
    console.log('Updating theme with new settings:', newTheme.site_title);
    
    try {
      if (!session?.user) {
        console.log('No active session, applying theme without persistence');
        applyThemeToDocument(newTheme);
        setTheme(newTheme);
        return;
      }

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
        p_border_radius: newTheme.border_radius,
        p_spacing_unit: newTheme.spacing_unit,
        p_transition_duration: newTheme.transition_duration,
        p_shadow_color: newTheme.shadow_color,
        p_hover_scale: newTheme.hover_scale,
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
      applyThemeToDocument(newTheme);
      toast.success("Theme updated successfully", {
        description: "Your changes have been saved and applied"
      });
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error("Failed to update theme", {
        description: "Please try again or contact support if the issue persists"
      });
    }
  };

  if (!theme) {
    console.log("ThemeProvider: Theme not loaded yet");
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};