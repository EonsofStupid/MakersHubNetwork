
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/auth/components/AuthProvider";
import { AdminProvider } from "@/admin/context/AdminContext";
import { LoggingProvider } from "@/logging/context/LoggingContext";
import { LogConsole } from "@/logging/components/LogConsole";
import { LogToggleButton } from "@/logging/components/LogToggleButton";
import { useLoggingContext } from "@/logging/context/LoggingContext";
import { useEffect, useRef, useState } from "react";
import { initializeLogger, getLogger } from "@/logging";
import { LogCategory } from "@/logging";
import { ThemeInitializer } from "@/components/theme/ThemeInitializer";
import { AppInitializer } from "@/components/AppInitializer";
import { ImpulsivityInit } from "@/components/theme/ImpulsivityInit";
import { ImpulsivityThemeInitializer } from "@/components/theme/ImpulsivityThemeInitializer";
import { SiteThemeProvider } from "@/components/theme/SiteThemeProvider";
import { ThemeEffectProvider } from "@/components/theme/effects/ThemeEffectProvider";

// Import pages
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

// Import UI components
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";

// Import styles
import "./App.css";
import "@/theme/site-theme.css";
import "@/components/MainNav/styles/cyber-effects.css";
import "@/logging/styles/logging.css";
import "@/admin/styles/cyber-effects.css";

// LoggingComponents wrapper to avoid context issues
function LoggingComponents() {
  const { showLogConsole } = useLoggingContext();
  
  return (
    <>
      {showLogConsole && <LogConsole />}
      <LogToggleButton />
    </>
  );
}

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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const logger = getLogger();
  const routeLoggedRef = useRef<boolean>(false);
  const [appReady, setAppReady] = useState(false);

  // Log route changes - with ref guard to prevent duplicate logs
  useEffect(() => {
    if (!routeLoggedRef.current) {
      logger.info(`Navigated to ${location.pathname}`, {
        details: { path: location.pathname }
      });
      routeLoggedRef.current = true;
    } else {
      // Reset ref for future logs
      routeLoggedRef.current = false;
    }
  }, [location.pathname, logger]);

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
          <ThemeInitializer context={isAdminRoute ? "admin" : "app"} applyImmediately={true}>
            <SiteThemeProvider>
              <ImpulsivityThemeInitializer>
                <ImpulsivityInit priority={true} autoApply={true} showLoadingState={true}>
                  <AuthProvider>
                    <AppInitializer>
                      <AdminProvider>
                        <div className="app-root w-full max-w-full min-h-screen flex flex-col">
                          {!isAdminRoute && appReady && <MainNav />}
                          <main className="flex-grow w-full">
                            <Routes>
                              <Route path="/" element={<Index />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/admin/*" element={<Admin />} />
                            </Routes>
                          </main>
                          {!isAdminRoute && appReady && <Footer />}
                          <Toaster />
                          <LoggingComponents />
                        </div>
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
