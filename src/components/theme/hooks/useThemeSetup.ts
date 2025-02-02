import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Settings } from "@/components/admin/settings/types";
import { toast } from "sonner";
import { DatabaseSettingsRow } from "../types/theme";
import { convertDbSettingsToTheme, DEFAULT_THEME_SETTINGS, applyThemeToDocument } from "../utils/themeUtils";

export const useThemeSetup = () => {
  const [theme, setTheme] = useState<Settings>(DEFAULT_THEME_SETTINGS);

  useEffect(() => {
    const fetchInitialTheme = async () => {
      try {
        console.log("Fetching initial theme settings...");
        
        const { data: rawData, error } = await supabase
          .from("site_settings")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching theme:", error);
          setTheme(DEFAULT_THEME_SETTINGS);
          applyThemeToDocument(DEFAULT_THEME_SETTINGS);
          return;
        }

        if (!rawData) {
          console.log("No settings found, using defaults");
          setTheme(DEFAULT_THEME_SETTINGS);
          applyThemeToDocument(DEFAULT_THEME_SETTINGS);
          return;
        }

        const dbSettings = rawData as DatabaseSettingsRow;
        const themeData = convertDbSettingsToTheme(dbSettings);
        
        console.log("Initial theme settings fetched:", themeData);
        setTheme(themeData);
        applyThemeToDocument(themeData);
        toast.success("Theme settings loaded");
      } catch (error) {
        console.error("Error in theme setup:", error);
        setTheme(DEFAULT_THEME_SETTINGS);
        applyThemeToDocument(DEFAULT_THEME_SETTINGS);
      }
    };

    fetchInitialTheme();
  }, []);

  return { theme, setTheme };
};