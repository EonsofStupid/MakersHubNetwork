
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/ui/layout/Layout";
import { authRoutes } from "@/routes/auth-routes";
import { appRoutes } from "@/routes/app-routes";
import { adminRoutes } from "@/admin/routes/admin-routes";
import { ThemeInitializer } from "@/theme/ui/ThemeInitializer";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ThemeDebugger } from "@/admin/theme/utils/ThemeDebugger";

// Add lazy loaded routes
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

const isDevelopment = process.env.NODE_ENV === 'development';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <ThemeInitializer>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                {authRoutes}
                {appRoutes}
                <Route path="*" element={<NotFound />} />
              </Route>
              {adminRoutes}
            </Routes>
          </Suspense>
          <Toaster />
          {isDevelopment && <ThemeDebugger />}
        </ThemeInitializer>
      </ThemeProvider>
    </BrowserRouter>
  );
}
