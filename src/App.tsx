import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";

// Lazy load auth-required components
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <Login />
                    </Suspense>
                  }
                />
                
                {/* Protected routes */}
                <Route
                  path="/admin"
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <AuthGuard requiredRoles={["admin"]}>
                        <Admin />
                      </AuthGuard>
                    </Suspense>
                  }
                />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;