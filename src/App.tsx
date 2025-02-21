import { Toaster } from "./components/ui/toaster"
import { Toaster as Sonner } from "./components/ui/sonner"
import { TooltipProvider } from "./components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthGuard } from "./components/AuthGuard"
import { AuthProvider } from "./components/auth/AuthProvider"
import { KeyboardNavigation } from './components/KeyboardNavigation'
import IndexPage from "./pages/Index"
import AdminPage from "./pages/Admin"
import LoginPage from "./pages/Login"

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <KeyboardNavigation />
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