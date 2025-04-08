
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

function App() {
  const [appReady, setAppReady] = useState(false);
  
  // Set app as ready after a short timeout to ensure all providers are initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
      logger.info('App marked as ready');
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <LoggingProvider>
      <ThemeEffectProvider>
        {/* Critical: Theme initialization happens FIRST */}
        <ThemeInitializer>
          <SiteThemeProvider>
            <AuthProvider>
              <AppInitializer>
                {/* Wrap AdminProvider in error boundary */}
                <AdminProviderWithErrorBoundary>
                  <ChatProvider>
                    <AppRouter />
                    <Toaster />
                  </ChatProvider>
                </AdminProviderWithErrorBoundary>
              </AppInitializer>
            </AuthProvider>
          </SiteThemeProvider>
        </ThemeInitializer>
      </ThemeEffectProvider>
    </LoggingProvider>
  );
}

// Simple error boundary wrapper for AdminProvider
function AdminProviderWithErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  );
}

export default App;
