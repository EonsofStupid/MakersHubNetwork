
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/ui/layout/Layout";
import { AuthRoutes } from "@/routes/auth-routes";
import { AppRoutes } from "@/routes/app-routes";
import { AdminRoutes } from "@/admin/routes";
import { ThemeInitializer } from "@/components/theme/ThemeInitializer";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ThemeDebugger } from "@/admin/theme/utils/ThemeDebugger";

const isDevelopment = process.env.NODE_ENV === 'development';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <ThemeInitializer>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/*" element={<AppRoutes />} />
                <Route path="/auth/*" element={<AuthRoutes />} />
              </Route>
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </Suspense>
          <Toaster />
          {isDevelopment && <ThemeDebugger />}
        </ThemeInitializer>
      </ThemeProvider>
    </BrowserRouter>
  );
}
