
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { LoggingProvider } from "@/logging/context/LoggingContext";
import { ThemeInitializer } from "@/components/theme/ThemeInitializer";
import { useEffect, useRef } from "react";
import { initializeAuthBridge } from "@/auth/bridge";
import { initializeLoggingBridge } from "@/logging/bridge";
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

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

function App() {
  const location = useLocation();
  const initAttemptedRef = useRef<boolean>(false);
  const authInitializedRef = useRef<boolean>(false);
  const logger = getLogger();

  // Initialize bridges on app mount with guard against infinite loops
  useEffect(() => {
    // Guard against multiple initialization attempts
    if (initAttemptedRef.current) {
      return;
    }
    
    // Mark as attempted immediately
    initAttemptedRef.current = true;
    
    logger.info('Initializing app bridges', {
      category: LogCategory.SYSTEM,
      source: 'App'
    });
    
    try {
      // Initialize bridges with error handling
      initializeLoggingBridge();
      
      // Initialize auth bridge with slight delay to avoid timing issues
      // and only if not already initialized
      if (!authInitializedRef.current) {
        authInitializedRef.current = true;
        setTimeout(() => {
          try {
            initializeAuthBridge();
          } catch (error) {
            logger.error('Auth bridge initialization error', {
              category: LogCategory.SYSTEM,
              source: 'App',
              details: { error }
            });
          }
        }, 100);
      }
    } catch (error) {
      logger.error('Bridge initialization error', {
        category: LogCategory.SYSTEM,
        source: 'App',
        details: { error }
      });
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="makers-impulse-theme">
      <LoggingProvider>
        <ThemeInitializer defaultTheme="Impulsivity">
          {/* MainNav is now always visible with all animations restored */}
          <MainNav />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </div>
          <Footer />
          <Toaster />
        </ThemeInitializer>
      </LoggingProvider>
    </ThemeProvider>
  );
}

export default App;
