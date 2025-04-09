
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { LoggingProvider } from "@/logging/context/LoggingContext";
import { ThemeInitializer } from "@/components/theme/ThemeInitializer";
import { useEffect } from "react";
import { initializeAuthBridge } from "@/auth/bridge";
import { initializeLoggingBridge } from "@/logging/bridge";

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

  // Initialize bridges on app mount
  useEffect(() => {
    // Initialize authBridge first
    initializeAuthBridge();
    initializeLoggingBridge();
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
