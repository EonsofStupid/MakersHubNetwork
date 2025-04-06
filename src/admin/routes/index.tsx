import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/admin/components/layouts/AdminLayout';
import { AdminAuthGuard } from '@/admin/components/AdminAuthGuard';

// Import admin pages (Lazy load them for better performance)
const Dashboard = React.lazy(() => import('./dashboard/DashboardPage'));
const BuildsPage = React.lazy(() => import('./builds/BuildsPage'));
const UsersPage = React.lazy(() => import('./users/UsersPage'));
const PartsPage = React.lazy(() => import('./parts/PartsPage'));
const ThemesPage = React.lazy(() => import('./themes/ThemesPage'));
const ContentPage = React.lazy(() => import('./content/ContentPage'));
const SettingsPage = React.lazy(() => import('./settings/SettingsPage'));
const PermissionsPage = React.lazy(() => import('./permissions/PermissionsPage'));
const LogsPage = React.lazy(() => import('@/admin/pages/LogsPage'));
const UnauthorizedPage = React.lazy(() => import('./UnauthorizedPage'));
const NotFoundPage = React.lazy(() => import('./NotFoundPage'));

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export function AdminRoutes() {
  return (
    <AdminAuthGuard>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          {/* Redirect to dashboard by default */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Admin pages */}
          <Route
            path="dashboard/*"
            element={
              <React.Suspense fallback={<PageLoader />}>
                <Dashboard />
              </React.Suspense>
            }
          />
          
          <Route
            path="builds/*"
            element={
              <React.Suspense fallback={<PageLoader />}>
                <BuildsPage />
              </React.Suspense>
            }
          />
          
          <Route
            path="users/*"
            element={
              <React.Suspense fallback={<PageLoader />}>
                <UsersPage />
              </React.Suspense>
            }
          />
          
          <Route
            path="parts/*"
            element={
              <React.Suspense fallback={<PageLoader />}>
                <PartsPage />
              </React.Suspense>
            }
          />
          
          <Route
            path="themes/*"
            element={
              <React.Suspense fallback={<PageLoader />}>
                <ThemesPage />
              </React.Suspense>
            }
          />
          
          <Route
            path="content/*"
            element={
              <React.Suspense fallback={<PageLoader />}>
                <ContentPage />
              </React.Suspense>
            }
          />
          
          <Route
            path="settings/*"
            element={
              <React.Suspense fallback={<PageLoader />}>
                <SettingsPage />
              </React.Suspense>
            }
          />
          
          <Route
            path="permissions/*"
            element={
              <React.Suspense fallback={<PageLoader />}>
                <PermissionsPage />
              </React.Suspense>
            }
          />
          
          <Route
            path="logs/*"
            element={
              <React.Suspense fallback={<PageLoader />}>
                <LogsPage />
              </React.Suspense>
            }
          />
          
          {/* Error pages */}
          <Route
            path="unauthorized"
            element={
              <React.Suspense fallback={<PageLoader />}>
                <UnauthorizedPage />
              </React.Suspense>
            }
          />
          
          <Route
            path="*"
            element={
              <React.Suspense fallback={<PageLoader />}>
                <NotFoundPage />
              </React.Suspense>
            }
          />
        </Route>
      </Routes>
    </AdminAuthGuard>
  );
}
