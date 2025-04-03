
import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { authRoutes } from "./routes/auth-routes";
import { adminRoutes } from "./routes/admin-routes";
import { mainRoutes } from "./routes/main-routes";
import { useAuth } from "@/auth/hooks/useAuth";
import { useThemeStore } from "@/stores/theme/store";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/ui/page-loader";
import { SiteThemeProvider } from "@/components/theme/SiteThemeProvider";
import { MakersBadge } from "@/components/brand/MakersBadge";

// Lazy load pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function App() {
  const { pathname } = useLocation();
  const { initialized, initialize } = useAuth();
  const { hydrateTheme } = useThemeStore();
  const logger = getLogger("App", LogCategory.SYSTEM);

  // Initialize auth and theme on app start
  useEffect(() => {
    const initApp = async () => {
      logger.info("Initializing application");
      
      try {
        // Initialize auth first
        await initialize();
        
        // Then hydrate theme
        await hydrateTheme();
        
        logger.info("Application initialized successfully");
      } catch (error) {
        logger.error("Failed to initialize application", {
          details: {
            error: error instanceof Error ? error.message : String(error),
          },
        });
      }
    };

    initApp();
  }, [initialize, hydrateTheme, logger]);

  // Determine if we're in the admin section
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <SiteThemeProvider>
      <div className="min-h-screen flex flex-col">
        {!isAdminRoute && <MainNav />}
      
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Main routes */}
              <Route path="/" element={<HomePage />} />
              
              {/* Auth routes */}
              {authRoutes}
              
              {/* Admin routes */}
              {adminRoutes}
              
              {/* Additional main routes */}
              {mainRoutes}
              
              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        
        {!isAdminRoute && <Footer />}
        
        <Toaster />
        <MakersBadge />
      </div>
    </SiteThemeProvider>
  );
}

export default App;
