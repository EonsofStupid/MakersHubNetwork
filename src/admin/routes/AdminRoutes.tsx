
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useThemeStore } from '@/stores/theme/themeStore';

// Lazy-loaded admin components
const Dashboard = React.lazy(() => import('@/admin/routes/dashboard/DashboardPage'));
const BuildsPage = React.lazy(() => import('@/admin/routes/builds/BuildsPage'));
const UsersPage = React.lazy(() => import('@/admin/routes/users/UsersPage'));
const PartsPage = React.lazy(() => import('@/admin/routes/parts/PartsPage'));
const ThemesPage = React.lazy(() => import('@/admin/routes/themes/ThemesPage'));
const ContentPage = React.lazy(() => import('@/admin/routes/content/ContentPage'));
const SettingsPage = React.lazy(() => import('@/admin/routes/settings/SettingsPage'));
const PermissionsPage = React.lazy(() => import('@/admin/routes/permissions/PermissionsPage'));
const LogsPage = React.lazy(() => import('@/admin/pages/LogsPage'));
const UnauthorizedPage = React.lazy(() => import('@/admin/routes/UnauthorizedPage'));
const NotFoundPage = React.lazy(() => import('@/admin/routes/NotFoundPage'));

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export function AdminRoutes() {
  const logger = useLogger('AdminRoutes', LogCategory.ADMIN);
  const navigate = useNavigate();
  const location = useLocation();
  const { hasAdminAccess, isAuthenticated, isLoading: authLoading } = useAdminAccess();
  const { loadStatus } = useThemeStore();
  const themeLoading = loadStatus === 'loading';
  
  useEffect(() => {
    logger.info('Admin routes initialized', {
      details: {
        hasAdminAccess,
        isAuthenticated,
        authLoading,
        themeLoading,
        themeStatus: loadStatus,
        path: location.pathname
      }
    });
    
    // Automatically redirect to dashboard if on /admin root
    if (location.pathname === '/admin') {
      navigate('/admin/dashboard');
    }
    
    // Redirect unauthorized users
    if (!authLoading && isAuthenticated && !hasAdminAccess) {
      logger.warn('Unauthorized access attempt to admin routes', {
        details: { path: location.pathname }
      });
      navigate('/admin/unauthorized');
    }
    
    // Redirect unauthenticated users
    if (!authLoading && !isAuthenticated) {
      logger.warn('Unauthenticated access attempt to admin routes', {
        details: { path: location.pathname }
      });
      
      const searchParams = new URLSearchParams();
      searchParams.set('returnTo', location.pathname);
      navigate(`/login?${searchParams.toString()}`);
    }
  }, [logger, isAuthenticated, hasAdminAccess, authLoading, navigate, location.pathname, loadStatus]);
  
  // Show a loading state while checking permissions
  if (authLoading) {
    return <PageLoader />;
  }
  
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="parts" element={<PartsPage />} />
        <Route path="builds" element={<BuildsPage />} />
        <Route path="themes" element={<ThemesPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default AdminRoutes;
