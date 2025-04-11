
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useThemeStore } from "@/stores/theme/store";
import { useLogger } from "@/logging/hooks/useLogger";
import { ThemeLoadingState } from "./info/ThemeLoadingState";
import { ThemeErrorState } from "./info/ThemeErrorState";

export function ThemeInitializer() {
  const { toast } = useToast();
  const logger = useLogger("ThemeInitializer");
  const { isLoading, error, isInitialized, loadTheme, theme } = useThemeStore();

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      logger.debug("Initializing theme", { themeId: theme?.id });
      loadTheme();
    }
  }, [isInitialized, isLoading, loadTheme, theme, logger]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Theme Error",
        description: error.message,
        variant: "destructive",
      });
      
      logger.error("Theme initialization failed", {
        error: error.message,
      });
    }
  }, [error, toast, logger]);

  if (isLoading) {
    return <ThemeLoadingState />;
  }

  if (error) {
    return (
      <ThemeErrorState 
        message="Theme Error" 
        subMessage={error.message} 
        onRetry={() => loadTheme()}
      />
    );
  }

  if (!isInitialized) {
    return <ThemeLoadingState />;
  }

  return null;
}
