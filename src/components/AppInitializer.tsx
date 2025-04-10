
import { ReactNode, useEffect } from "react";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";
import { useSiteTheme } from "@/components/theme/SiteThemeProvider";
import { useAuthStore } from "@/auth/store/auth.store";
import { AppBootstrap } from "./AppBootstrap";

interface AppInitializerProps {
  children: ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const logger = useLogger("AppInitializer", LogCategory.SYSTEM);
  const { isLoaded: themeLoaded } = useSiteTheme();
  
  // Use selectors from auth store for better performance
  const status = useAuthStore(state => state.status);
  const initialized = useAuthStore(state => state.initialized);
  
  // Log app initialization status
  useEffect(() => {
    logger.info("App initializing, auth status:", {
      details: {
        status,
        themeLoaded,
        authInitialized: initialized
      },
    });
    
    if (initialized && themeLoaded) {
      logger.info("All systems initialized, rendering application");
    }
  }, [status, themeLoaded, initialized, logger]);

  return (
    <>
      {/* Add the AppBootstrap component to handle initialization */}
      <AppBootstrap />
      
      {/* Render children regardless of initialization status */}
      {children}
    </>
  );
}
