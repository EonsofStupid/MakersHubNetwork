
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/auth/components/AuthProvider";
import { AdminProvider } from "@/admin/context/AdminContext";
import { LoggingProvider } from "@/logging/context/LoggingContext";
import { LogConsole } from "@/logging/components/LogConsole";
import { LogToggleButton } from "@/logging/components/LogToggleButton";
import { useLoggingContext } from "@/logging/context/LoggingContext";
import { useEffect, useRef } from "react";
import { initializeLogger, getLogger } from "@/logging";
import { LogCategory } from "@/logging";
import { ThemeInitializer } from "@/components/theme/ThemeInitializer";
import { AppInitializer } from "@/components/AppInitializer";

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
  const routeLoggedRef = useRef(false);

  // Log route changes - with ref guard to prevent duplicate logs
  useEffect(() => {
    if (!routeLoggedRef.current) {
      logger.info(`Navigated to ${location.pathname}`, {
        category: LogCategory.SYSTEM,
        details: { path: location.pathname }
      });
      routeLoggedRef.current = true;
    } else {
      // Reset ref for future logs
      routeLoggedRef.current = false;
    }
  }, [location.pathname, logger]);

  // Changed component order to prioritize theme loading
  // ThemeInitializer no longer waits for auth to load
  return (
    <ThemeProvider defaultTheme="dark" storageKey="makers-impulse-theme">
      <LoggingProvider>
        {/* ThemeInitializer first - independent of auth state */}
        <ThemeInitializer>
          <AuthProvider>
            <AppInitializer>
              <AdminProvider>
                {!isAdminRoute && <MainNav />}
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/*" element={<Admin />} />
                </Routes>
                {!isAdminRoute && <Footer />}
                <Toaster />
                <LoggingComponents />
              </AdminProvider>
            </AppInitializer>
          </AuthProvider>
        </ThemeInitializer>
      </LoggingProvider>
    </ThemeProvider>
  );
}

export default App;
