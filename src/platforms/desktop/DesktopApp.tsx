import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import { DesktopLayout } from "./layouts/DesktopLayout";
import IndexPage from "./pages/Index";
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

const DesktopApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <TooltipProvider>
            <AuthProvider>
              <DesktopLayout>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<IndexPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Protected routes */}
                  <Route
                    path="/admin"
                    element={
                      <AuthGuard requiredRoles={["admin"]}>
                        <AdminPage />
                      </AuthGuard>
                    }
                  />
                </Routes>
              </DesktopLayout>
              <Toaster />
              <Sonner />
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default DesktopApp;