
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/auth/components/AuthProvider";
import { AdminProvider } from "@/admin/context/AdminContext";
import { LoggingProvider } from "@/logging/context/LoggingContext";
import { LogConsole } from "@/logging/components/LogConsole";
import { LogToggleButton } from "@/logging/components/LogToggleButton";
import { useLoggingContext } from "@/logging/context/LoggingContext";
import { useEffect, useState } from "react";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging/types";
import { layoutSeederService } from "@/admin/services/layoutSeeder.service";
import { ThemeInitializer } from "@/components/theme/ThemeInitializer";
import { useCoreLayouts } from "@/hooks/useCoreLayouts";
import { CoreLayoutRenderer } from "@/components/layout/CoreLayoutRenderer";

// Import pages
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

// Import UI components
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
const logger = getLogger('App');

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { topNavLayout, footerLayout, isLoading: layoutsLoading, error: layoutsError } = useCoreLayouts();

  // Log route changes
  useEffect(() => {
    logger.info(`Navigated to ${location.pathname}`, {
      category: LogCategory.SYSTEM,
      details: { path: location.pathname }
    });
  }, [location.pathname]);

  // Log any layout errors
  useEffect(() => {
    if (layoutsError) {
      logger.error('Error loading layouts', {
        category: LogCategory.UI,
        details: layoutsError
      });
    }
  }, [layoutsError]);

  return (
    <>
      {!isAdminRoute && (
        <div className="main-nav-container">
          <CoreLayoutRenderer 
            layout={topNavLayout} 
            isLoading={layoutsLoading} 
            fallback={<div className="h-16 bg-background/80 flex items-center justify-center border-b">Navigation Loading...</div>}
          />
        </div>
      )}
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
      
      {!isAdminRoute && (
        <CoreLayoutRenderer 
          layout={footerLayout} 
          isLoading={layoutsLoading}
          fallback={<Footer />}
        />
      )}
      
      <Toaster />
      <LoggingComponents />
    </>
  );
}

function App() {
  const [layoutsInitialized, setLayoutsInitialized] = useState(false);
  const [initAttempted, setInitAttempted] = useState(false);

  // Initialize the layouts on app start
  useEffect(() => {
    async function initializeLayouts() {
      if (initAttempted) return;
      
      setInitAttempted(true);
      try {
        logger.info('Initializing core layouts', { category: LogCategory.SYSTEM });
        await layoutSeederService.ensureCoreLayoutsExist();
        logger.info('Core layouts initialized successfully', { category: LogCategory.SYSTEM });
        setLayoutsInitialized(true);
      } catch (err) {
        logger.error('Error initializing core layouts', { 
          category: LogCategory.SYSTEM,
          details: err
        });
        // Set initialized to true anyway to prevent blocking the app
        setLayoutsInitialized(true);
      }
    }
    
    initializeLayouts();
  }, [initAttempted]);

  if (!layoutsInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl">Initializing application...</div>
          <div className="text-sm text-muted-foreground mt-2">Loading layouts and themes</div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="makers-impulse-theme">
      <LoggingProvider>
        <ThemeInitializer>
          <AuthProvider>
            <AdminProvider>
              <AppContent />
            </AdminProvider>
          </AuthProvider>
        </ThemeInitializer>
      </LoggingProvider>
    </ThemeProvider>
  );
}

export default App;
