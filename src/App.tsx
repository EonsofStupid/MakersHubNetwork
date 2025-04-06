
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/auth/components/AuthProvider";
import { AdminProvider } from "@/admin/context/AdminContext";
import { LoggingProvider } from "@/logging/context/LoggingContext";
import { useEffect, useRef, useState } from "react";
import { initializeLogger, getLogger } from "@/logging";
import { ThemeInitializer } from "@/components/theme/ThemeInitializer";
import { AppInitializer } from "@/components/AppInitializer";
import { ImpulsivityInit } from "@/components/theme/ImpulsivityInit";
import { ImpulsivityThemeInitializer } from "@/components/theme/ImpulsivityThemeInitializer";
import { SiteThemeProvider } from "@/components/theme/SiteThemeProvider";
import { ThemeEffectProvider } from "@/components/theme/effects/ThemeEffectProvider";
import { AppRouter } from "@/router";

// Import styles
import "./App.css";
import "@/theme/site-theme.css";
import "@/components/MainNav/styles/cyber-effects.css";
import "@/logging/styles/logging.css";
import "@/admin/styles/cyber-effects.css";

// Initialize logging system - do this only once
const loggerInitialized = { current: false };

function initLogging(): void {
  if (!loggerInitialized.current) {
    initializeLogger();
    loggerInitialized.current = true;
  }
}

// Initialize immediately
initLogging();

function App() {
  const logger = getLogger();
  const [appReady, setAppReady] = useState(false);
  
  // Set app as ready after a short timeout to ensure all providers are initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
      logger.info('App marked as ready', {
        details: { timestamp: new Date().toISOString() }
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [logger]);
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="makers-impulse-theme">
      <LoggingProvider>
        <ThemeEffectProvider>
          {/* Critical: Theme initialization happens FIRST, before any auth check */}
          <ThemeInitializer context="app" applyImmediately={true}>
            <SiteThemeProvider>
              <ImpulsivityThemeInitializer>
                <ImpulsivityInit priority={true} autoApply={true} showLoadingState={true}>
                  {/* Auth happens AFTER theme is initialized */}
                  <AuthProvider>
                    <AppInitializer>
                      <AdminProvider>
                        <AppRouter />
                        <Toaster />
                      </AdminProvider>
                    </AppInitializer>
                  </AuthProvider>
                </ImpulsivityInit>
              </ImpulsivityThemeInitializer>
            </SiteThemeProvider>
          </ThemeInitializer>
        </ThemeEffectProvider>
      </LoggingProvider>
    </ThemeProvider>
  );
}

export default App;
