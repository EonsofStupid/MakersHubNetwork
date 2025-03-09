
import { SystemToaster } from "./components/ui/toaster"
import { SonnerToaster } from "./components/ui/sonner"
import { TooltipProvider } from "./components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { router } from "./router"
import { RouterProvider } from "@tanstack/react-router"
import { AuthProvider } from "./components/auth/AuthProvider"
import { KeyboardNavigation } from './components/KeyboardNavigation'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Button } from "./components/ui/button"
import { useNavigate } from "@tanstack/react-router"

// Create a loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="p-4 text-center">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
)

// Create a global error fallback component
const GlobalErrorFallback = ({ error }: { error: Error }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full p-6 text-center border border-destructive/20 rounded-md bg-background/40 backdrop-blur-md">
        <h2 className="text-xl font-bold text-destructive mb-2">Application Error</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {error?.message || "The application encountered an unexpected error."}
        </p>
        <div className="flex gap-2 justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
          <Button 
            variant="default"
            onClick={() => navigate({ to: "/" })}
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

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
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
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
            <ErrorBoundary>
              <RouterProvider router={router} defaultPendingComponent={PageLoader} />
              {isDev && (
                <>
                  <ReactQueryDevtools initialIsOpen={false} position="bottom" />
                  <TanStackRouterDevtools initialIsOpen={false} position="bottom-left" />
                </>
              )}
            </ErrorBoundary>
            <SystemToaster />
            <SonnerToaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
