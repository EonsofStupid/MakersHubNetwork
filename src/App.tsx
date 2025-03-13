
import { useEffect } from "react"
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

  // Initialize the router before rendering
  useEffect(() => {
    router.initialize().catch(console.error);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <RouterProvider router={router} />
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
            {isDev && (
              <>
                <ReactQueryDevtools initialIsOpen={false} position="bottom" />
                <TanStackRouterDevtools initialIsOpen={false} position="bottom-left" />
              </>
            )}
            <SystemToaster />
            <SonnerToaster />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
