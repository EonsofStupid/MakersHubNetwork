
import React from "react";
import Routes from "./router/Routes";
import { useLogger } from "./hooks/use-logger";
import { LOG_CATEGORY } from "./shared/types/shared.types";
import { AppInitializer } from "./app/initializer/AppInitializer";
import { SiteThemeProvider } from "./app/theme/SiteThemeProvider";

export default function App() {
  const logger = useLogger("App", LOG_CATEGORY.SYSTEM);

  logger.info("App rendering");
  
  return (
    <SiteThemeProvider>
      <AppInitializer>
        <Routes />
      </AppInitializer>
    </SiteThemeProvider>
  );
}
