
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { LoggingProvider } from "@/logging/context/LoggingContext";
import { ThemeInitializer } from "@/components/theme/ThemeInitializer";
import { useEffect, useRef } from "react";
import { initializeAuthBridge } from "@/auth/bridge";
import { initializeLoggingBridge } from "@/logging/bridge";
import { getLogger } from '@/logging';
import { LogCategory } from '@/shared/types/shared.types';
import { AppInitializer } from "@/app/components/AppInitializer";
import { AuthProvider } from "@/auth/components/AuthProvider";
import { DebugOverlay } from '@/admin/components/debug/DebugOverlay';
import { ComponentInspector } from '@/admin/components/debug/ComponentInspector';

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
  const bridgesInitializedRef = useRef<boolean>(false);
  const logger = getLogger('App', LogCategory.SYSTEM);

  // Initialize bridges only once on app mount
  useEffect(() => {
    // Guard against multiple initialization attempts
    if (bridgesInitializedRef.current) {
      return;
    }
    
    // Mark as initialized immediately to prevent race conditions
    bridgesInitializedRef.current = true;
    
    logger.info('Initializing app bridges');
    
    try {
      // Initialize logging bridge first
      initializeLoggingBridge();
      
      // Initialize auth bridge with slight delay
      // This prevents timing issues with other initializations
      setTimeout(() => {
        try {
          initializeAuthBridge();
        } catch (error) {
          logger.error('Auth bridge initialization error', {
            details: { error }
          });
        }
      }, 100);
    } catch (error) {
      logger.error('Bridge initialization error', {
        details: { error }
      });
    }
  }, []); // Empty dependency array to run only once

  return (
    <ThemeProvider defaultTheme="dark" storageKey="makers-impulse-theme">
      <LoggingProvider>
        <ThemeInitializer defaultTheme="Impulsivity">
          <AuthProvider>
            <AppInitializer>
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
              
              {/* Add debug overlay and component inspector */}
              <DebugOverlay />
              <ComponentInspector />
            </AppInitializer>
          </AuthProvider>
        </ThemeInitializer>
      </LoggingProvider>
    </ThemeProvider>
  );
}

export default App;
