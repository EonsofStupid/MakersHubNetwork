
import { Routes, Route, BrowserRouter } from "react-router-dom";
import IndexPage from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { SiteThemeProvider } from "./components/theme/SiteThemeProvider";
import { ThemeInitializer } from "./components/theme/ThemeInitializer";
import { DynamicKeyframes } from "./components/theme/DynamicKeyframes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SiteThemeProvider>
          <ThemeInitializer>
            <DynamicKeyframes />
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<IndexPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/*" element={<Admin />} />
                </Routes>
                <Toaster />
                <Sonner />
              </BrowserRouter>
            </AuthProvider>
          </ThemeInitializer>
        </SiteThemeProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
