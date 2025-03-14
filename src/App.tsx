
import { SystemToaster } from "./components/ui/toaster"
import { SonnerToaster } from "./components/ui/sonner"
import { TooltipProvider } from "./components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./components/auth/AuthProvider"
import { KeyboardNavigation } from './components/KeyboardNavigation'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Suspense, lazy } from "react"

// Lazily load pages to improve initial load time
const IndexPage = lazy(() => import("./pages/Index"))
const AdminWithTanstackPage = lazy(() => import("./pages/AdminWithTanstack"))
const LoginPage = lazy(() => import("./pages/Login"))

// Create a loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="p-4 text-center">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
)

// Configure QueryClient with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <KeyboardNavigation 
                options={{
                  enabled: true,
                  showToasts: true,
                  scrollConfig: {
                    scrollAmount: 120,
                    smooth: true,
                    acceleration: true,
                    maxAcceleration: 600,
                    accelerationRate: 1.15
                  }
                }}
              />
              <Routes>
                <Route path="/login" element={
                  <Suspense fallback={<PageLoader />}>
                    <LoginPage />
                  </Suspense>
                } />
                
                {/* All admin routes now handled by this component */}
                <Route
                  path="/admin/*"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminWithTanstackPage />
                    </Suspense>
                  }
                />
                
                <Route path="/" element={
                  <Suspense fallback={<PageLoader />}>
                    <IndexPage />
                  </Suspense>
                } />
                
                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <SystemToaster />
              <SonnerToaster />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
