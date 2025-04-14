
import { useThemeStore } from "@/shared/store/theme/store";

export function useSiteTheme() {
  const { 
    activeThemeId, 
    themes, 
    isDark, 
    primaryColor, 
    backgroundColor, 
    textColor, 
    componentTokens, // Use componentTokens instead of componentStyles
    isLoading 
  } = useThemeStore();

  const currentTheme = themes.find(t => t.id === activeThemeId);

  return {
    theme: currentTheme,
    isDark,
    primaryColor,
    backgroundColor,
    textColor,
    componentTokens, // Return componentTokens
    isLoading,
    activeThemeId
  };
}
