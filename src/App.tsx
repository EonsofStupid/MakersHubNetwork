import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RootLayout } from "@/components/layouts/RootLayout";
import { AppRoutes } from "@/routes";
import { ErrorBoundary } from "@/components/shared/error-handling/ErrorBoundary";
import { ThemeProvider } from "@/components/theme/ThemeContext";
import { AdminSidebarProvider } from "@/components/admin/dashboard/sidebar/AdminSidebarContext";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/auth/providers/QueryProvider";
import { AuthProvider } from "@/components/auth/providers/AuthProvider";

const App = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <BrowserRouter>
          <AdminSidebarProvider>
            <ThemeProvider>
              <TooltipProvider>
                <AuthProvider>
                  <RootLayout>
                    <AppRoutes />
                  </RootLayout>
                  <Toaster 
                    position="top-right" 
                    expand={false} 
                    richColors 
                    closeButton
                    theme="dark"
                    className="toaster group"
                    toastOptions={{
                      classNames: {
                        toast: "group toast group-[.toaster]:bg-black/80 group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-xl",
                        title: "group-[.toast]:text-white/90 group-[.toast]:font-semibold",
                        description: "group-[.toast]:text-white/70",
                        actionButton: "group-[.toast]:bg-[#41f0db]/20 group-[.toast]:text-white",
                        cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white",
                      },
                    }}
                  />
                </AuthProvider>
              </TooltipProvider>
            </ThemeProvider>
          </AdminSidebarProvider>
        </BrowserRouter>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;