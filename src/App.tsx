import { Toaster } from "@/site/components/ui/toaster"
import { Toaster as Sonner } from "@/site/components/ui/sonner"
import { TooltipProvider } from "@/site/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthGuard } from "@/features/auth/components/AuthGuard"
import { AuthProvider } from "@/features/auth/components/AuthProvider"
import IndexPage from "@/site/pages/Index"
import { AdminPage } from "@/admin/pages/Admin"
import LoginPage from "@/features/auth/pages/Login"

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <AuthGuard requiredRoles={["admin", "super_admin"]}>
                    <AdminPage />
                  </AuthGuard>
                }
              />
              <Route path="/" element={<IndexPage />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App