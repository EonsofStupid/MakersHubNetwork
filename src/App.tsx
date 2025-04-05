
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/auth/components/AuthProvider";
import { AdminProvider } from "@/admin/context/AdminContext";
import { LoggingProvider } from "@/logging/context/LoggingContext";
import { LogConsole } from "@/logging/components/LogConsole";
import { LogToggleButton } from "@/logging/components/LogToggleButton";
import { useLoggingContext } from "@/logging/context/LoggingContext";
import { useEffect } from "react";
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

// Initialize logging system
initializeLogger();

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const logger = getLogger();

  // Log route changes
  useEffect(() => {
    logger.info(`Navigated to ${location.pathname}`, {
      category: LogCategory.SYSTEM,
      details: { path: location.pathname }
    });
  }, [location.pathname, logger]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="makers-impulse-theme">
      <LoggingProvider>
        <AuthProvider>
          <AdminProvider>
            <ThemeInitializer>
              <AppInitializer>
                {!isAdminRoute && <MainNav />}
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/*" element={<Admin />} />
                </Routes>
                {!isAdminRoute && <Footer />}
                <Toaster />
                <LoggingComponents />
              </AppInitializer>
            </ThemeInitializer>
          </AdminProvider>
        </AuthProvider>
      </LoggingProvider>
    </ThemeProvider>
  );
}

export default App;
