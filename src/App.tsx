import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { usePlatformStore, detectPlatform } from "@/utils/platform";
import { useEffect } from "react";

// Platform-specific routes
import DesktopIndex from "./routes/desktop";
import MobileIndex from "./routes/mobile";
import AdminPage from "./pages/Admin";
import LoginPage from "./pages/Login";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  const { platform, setPlatform } = usePlatformStore();

  useEffect(() => {
    const handleResize = () => {
      setPlatform(detectPlatform());
    };

    // Initial detection
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setPlatform]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
            <Routes>
              {/* Shared routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <AuthGuard requiredRoles={["admin"]}>
                    <AdminPage />
                  </AuthGuard>
                }
              />

              {/* Platform-specific routes */}
              <Route 
                path="/*" 
                element={
                  platform === 'desktop' ? <DesktopIndex /> : <MobileIndex />
                } 
              />
            </Routes>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;