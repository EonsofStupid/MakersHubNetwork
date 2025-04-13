
import React, { useEffect } from "react";
import Routes from "./router/Routes";
import { useLogger } from "./hooks/use-logger";
import { LOG_CATEGORY } from "./shared/types/shared.types";
import { AppInitializer } from "./app/initializer/AppInitializer";
import { SiteThemeProvider } from "./app/theme/SiteThemeProvider";
import { useAuthStore } from "./auth/store/auth.store";

export default function App() {
  const logger = useLogger("App", LOG_CATEGORY.SYSTEM);
  const initialize = useAuthStore(state => state.initialize);
  const initialized = useAuthStore(state => state.initialized);

  // Initialize auth when the app loads
  useEffect(() => {
    if (!initialized) {
      logger.info("Initializing App");
      initialize();
    }
  }, [initialize, initialized, logger]);

  logger.info("App rendering");
  
  return (
    <SiteThemeProvider>
      <AppInitializer>
        <Routes />
      </AppInitializer>
    </SiteThemeProvider>
  );
}
