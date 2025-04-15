
import { useThemeStore } from "@/shared/stores/theme/store";
import { Theme } from "@/shared/types";

export function useSiteTheme() {
  const { 
    activeThemeId, 
    themes, 
    isDark, 
    primaryColor, 
    backgroundColor, 
    textColor, 
    componentTokens,
    isLoading 
  } = useThemeStore();

  const currentTheme = themes.find(t => t.id === activeThemeId);

  return {
    theme: currentTheme,
    isDark,
    primaryColor,
    backgroundColor,
    textColor,
    componentTokens,
    isLoading,
    activeThemeId
  };
}
