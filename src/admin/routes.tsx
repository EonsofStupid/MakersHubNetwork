
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthGuard } from './components/AdminAuthGuard';

// Import admin pages (Lazy load them for better performance)
const Dashboard = React.lazy(() => import('./routes/dashboard/DashboardPage'));
const Overview = React.lazy(() => import('./routes/overview/OverviewPage'));
const BuildsPage = React.lazy(() => import('./routes/builds/BuildsPage'));
const UsersPage = React.lazy(() => import('./routes/users/UsersPage'));
const PartsPage = React.lazy(() => import('./routes/parts/PartsPage'));
const ThemesPage = React.lazy(() => import('./routes/themes/ThemesPage'));
const ContentPage = React.lazy(() => import('./routes/content/ContentPage'));
const SettingsPage = React.lazy(() => import('./routes/settings/SettingsPage'));
const PermissionsPage = React.lazy(() => import('./routes/permissions/PermissionsPage'));
const LogsPage = React.lazy(() => import('./routes/logs/LogsPage'));
const UnauthorizedPage = React.lazy(() => import('./routes/UnauthorizedPage'));
const NotFoundPage = React.lazy(() => import('./routes/NotFoundPage'));

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
        {/* Redirect to dashboard by default */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Admin pages */}
        <Route
          path="/dashboard/*"
          element={
            <React.Suspense fallback={<PageLoader />}>
              <Dashboard />
            </React.Suspense>
          }
        />
        
        <Route
          path="/overview/*"
          element={
            <React.Suspense fallback={<PageLoader />}>
              <Overview />
            </React.Suspense>
          }
        />
        
        <Route
          path="/builds/*"
          element={
            <React.Suspense fallback={<PageLoader />}>
              <BuildsPage />
            </React.Suspense>
          }
        />
        
        <Route
          path="/users/*"
          element={
            <React.Suspense fallback={<PageLoader />}>
              <UsersPage />
            </React.Suspense>
          }
        />
        
        <Route
          path="/parts/*"
          element={
            <React.Suspense fallback={<PageLoader />}>
              <PartsPage />
            </React.Suspense>
          }
        />
        
        <Route
          path="/themes/*"
          element={
            <React.Suspense fallback={<PageLoader />}>
              <ThemesPage />
            </React.Suspense>
          }
        />
        
        <Route
          path="/content/*"
          element={
            <React.Suspense fallback={<PageLoader />}>
              <ContentPage />
            </React.Suspense>
          }
        />
        
        <Route
          path="/settings/*"
          element={
            <React.Suspense fallback={<PageLoader />}>
              <SettingsPage />
            </React.Suspense>
          }
        />
        
        <Route
          path="/permissions/*"
          element={
            <React.Suspense fallback={<PageLoader />}>
              <PermissionsPage />
            </React.Suspense>
          }
        />
        
        <Route
          path="/logs/*"
          element={
            <React.Suspense fallback={<PageLoader />}>
              <LogsPage />
            </React.Suspense>
          }
        />
        
        {/* Error pages */}
        <Route
          path="/unauthorized"
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
      </Routes>
    </AdminAuthGuard>
  );
}
