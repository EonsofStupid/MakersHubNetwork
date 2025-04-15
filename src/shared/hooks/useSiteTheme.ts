
import { useThemeStore } from "@/stores/theme.store";
import { ThemeState } from "@/shared/types/features/theme.types";

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
  } = useThemeStore((state: ThemeState) => state);

  const currentTheme = themes?.find(t => t.id === activeThemeId) || null;

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
