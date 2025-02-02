import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { uploadMedia } from "@/utils/media";
import { Settings, SettingsResponse } from "../../types";

export const useSettingsUpdateHandlers = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  const handleLogoUpload = async (file: File) => {
    console.log("Handling logo upload with file:", file);
    setLogoFile(file);
  };

  const handleFaviconUpload = async (file: File) => {
    console.log("Handling favicon upload with file:", file);
    setFaviconFile(file);
  };

  const handleSettingsUpdate = async (formData: Settings) => {
    console.log("Starting settings update with formData:", formData);
    setIsSaving(true);
    try {
      let logo_url = formData.logo_url;
      let favicon_url = formData.favicon_url;

      if (logoFile) {
        console.log("Uploading new logo file...");
        logo_url = await uploadMedia(logoFile);
        console.log("Logo uploaded successfully:", logo_url);
      }

      if (faviconFile) {
        console.log("Uploading new favicon file...");
        favicon_url = await uploadMedia(faviconFile);
        console.log("Favicon uploaded successfully:", favicon_url);
      }

      const { data, error } = await supabase.rpc('update_site_settings', {
        p_site_title: formData.site_title,
        p_tagline: formData.tagline,
        p_primary_color: formData.primary_color,
        p_secondary_color: formData.secondary_color,
        p_accent_color: formData.accent_color,
        p_logo_url: logo_url,
        p_favicon_url: favicon_url,
        p_text_primary_color: formData.text_primary_color,
        p_text_secondary_color: formData.text_secondary_color,
        p_text_link_color: formData.text_link_color,
        p_text_heading_color: formData.text_heading_color,
        p_neon_cyan: formData.neon_cyan,
        p_neon_pink: formData.neon_pink,
        p_neon_purple: formData.neon_purple,
        p_border_radius: formData.border_radius,
        p_spacing_unit: formData.spacing_unit,
        p_transition_duration: formData.transition_duration,
        p_shadow_color: formData.shadow_color,
        p_hover_scale: formData.hover_scale,
        p_font_family_heading: formData.font_family_heading,
        p_font_family_body: formData.font_family_body,
        p_font_size_base: formData.font_size_base,
        p_font_weight_normal: formData.font_weight_normal,
        p_font_weight_bold: formData.font_weight_bold,
        p_line_height_base: formData.line_height_base,
        p_letter_spacing: formData.letter_spacing,
      });

      if (error) throw error;

      const response = data as unknown as SettingsResponse;
      console.log("Settings updated successfully:", response);
      toast.success("Settings updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error in handleSettingsUpdate:", error);
      toast.error("Failed to update settings");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    logoFile,
    faviconFile,
    handleLogoUpload,
    handleFaviconUpload,
    handleSettingsUpdate,
  };
};