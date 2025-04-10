
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { LoggingProvider } from "@/logging/context/LoggingContext";
import { ThemeInitializer } from "@/components/theme/ThemeInitializer";
import { useEffect, useRef } from "react";
import { initializeAuthBridge } from "@/auth/bridge";
import { initializeLoggingBridge } from "@/logging/bridge";
import { initializeChatBridge } from "@/bridges";
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { AppInitializer } from "@/components/AppInitializer";
import { AuthProvider } from "@/auth/components/AuthProvider";
import { DebugOverlay } from '@/admin/components/debug/DebugOverlay';
import { ComponentInspector } from '@/admin/components/debug/ComponentInspector';

// Import app module
import App from "./app/App";

// Import admin module
import Admin from "./pages/Admin";

// Import auth pages
import Login from "./pages/Login";

// Import styles
import "./App.css";
import "@/theme/site-theme.css";
import "@/app/components/MainNav/styles/cyber-effects.css";
import "@/logging/styles/logging.css";
import "@/admin/styles/cyber-effects.css";

function RootApp() {
  const location = useLocation();
  const bridgesInitializedRef = useRef<boolean>(false);
  const logger = getLogger();

  // Initialize bridges only once on app mount
  useEffect(() => {
    // Guard against multiple initialization attempts
    if (bridgesInitializedRef.current) {
      return;
    }
    
    // Mark as initialized immediately to prevent race conditions
    bridgesInitializedRef.current = true;
    
    logger.info('Initializing app bridges', {
      category: LogCategory.SYSTEM,
      source: 'App'
    });
    
    try {
      // Initialize logging bridge first
      initializeLoggingBridge();
      
      // Initialize chat bridge
      initializeChatBridge();
      
      // Initialize auth bridge with slight delay
      // This prevents timing issues with other initializations
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
    } catch (error) {
      logger.error('Bridge initialization error', {
        category: LogCategory.SYSTEM,
        source: 'App',
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
              <Routes>
                {/* App module routes */}
                <Route path="/*" element={<App />} />
                
                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Admin module routes */}
                <Route path="/admin/*" element={<Admin />} />
              </Routes>
              
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

export default RootApp;
