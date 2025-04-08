
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/auth/components/AuthProvider";
import { AdminProvider } from "@/admin/context/AdminContext";
import { LoggingProvider } from "@/logging/context/LoggingContext";
import { useEffect, useState } from "react";
import { initializeLogger, getLogger } from "@/logging";
import { ThemeInitializer } from "@/components/theme/ThemeInitializer";
import { AppInitializer } from "@/components/AppInitializer";
import { SiteThemeProvider } from "@/components/theme/SiteThemeProvider";
import { ThemeEffectProvider } from "@/components/theme/effects/ThemeEffectProvider";
import { AppRouter } from "@/router";
import { ChatProvider } from '@/chat/context/ChatProvider';
import { safeSSR } from "@/lib/utils/safeSSR";

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

const logger = getLogger('App');

// Default fallback theme to use if theme loading fails
const defaultFallbackTheme = {
  primary: "186 100% 50%",
  secondary: "334 100% 59%",
  background: "228 47% 8%",
  foreground: "210 40% 98%",
  card: "228 47% 11%",
  effectColor: "#00F0FF",
  effectSecondary: "#FF2D6E",
};

function App() {
  const [appReady, setAppReady] = useState(false);
  
  // Mark app as ready to allow progressive rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
      safeSSR(() => {
        document.documentElement.setAttribute('data-app-ready', 'true');
      }, undefined);
      logger.info('App marked as ready');
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <LoggingProvider>
      <ThemeEffectProvider>
        {/* Critical: Theme initialization happens FIRST with fallback theme */}
        <ThemeInitializer 
          fallbackTheme={defaultFallbackTheme}
          applyImmediately={true}
        >
          <SiteThemeProvider>
            <AuthProvider>
              <AppInitializer>
                <AdminProvider>
                  <ChatProvider>
                    <AppRouter />
                    <Toaster />
                  </ChatProvider>
                </AdminProvider>
              </AppInitializer>
            </AuthProvider>
          </SiteThemeProvider>
        </ThemeInitializer>
      </ThemeEffectProvider>
    </LoggingProvider>
  );
}

export default App;
