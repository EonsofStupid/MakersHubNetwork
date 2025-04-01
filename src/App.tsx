
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminProvider } from "@/admin/context/AdminContext";
import { LoggingProvider } from "@/logging/context/LoggingContext";
import { LogConsole } from "@/logging/components/LogConsole";
import { LogToggleButton } from "@/logging/components/LogToggleButton";
import { useLoggingContext } from "@/logging/context/LoggingContext";
import { useEffect } from "react";
import { initializeLogger, getLogger } from "@/logging";
import { LogCategory } from "@/logging/types";

// Import pages
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

// Import UI components
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";

// Import styles
import "./App.css";
import "@/logging/styles/logging.css";

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

  // Log route changes
  useEffect(() => {
    const logger = getLogger();
    logger.info(`Navigated to ${location.pathname}`, {
      category: LogCategory.SYSTEM,
      details: { path: location.pathname }
    });
  }, [location.pathname]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="makers-impulse-theme">
      <LoggingProvider>
        <AuthProvider>
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
        </AuthProvider>
      </LoggingProvider>
    </ThemeProvider>
  );
}

export default App;
