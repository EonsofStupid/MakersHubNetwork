
import React, { lazy, Suspense } from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import AdminLayout from '@/admin/components/layouts/AdminLayout';
import { Spinner } from '@/shared/ui/spinner';

// Lazy-loaded routes
const DashboardPage = lazy(() => import('./dashboard/DashboardPage'));
const UsersPage = lazy(() => import('./users/UsersPage'));
const SettingsPage = lazy(() => import('./settings/SettingsPage'));
const NotFoundPage = lazy(() => import('./NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./UnauthorizedPage'));
const ThemesPage = lazy(() => import('./themes/ThemesPage'));
const LayoutsPage = lazy(() => import('./layouts/LayoutsPage'));
const AnalyticsPage = lazy(() => import('./analytics/AnalyticsPage'));
const BuildsPage = lazy(() => import('./builds/BuildsPage'));
const ContentPage = lazy(() => import('./content/ContentPage'));
const LogsPage = lazy(() => import('./LogsPage'));

export function AdminRoutes() {
  const { hasRole, status } = useAuth();
  const isAdmin = hasRole(['admin', 'superadmin']);

  if (status === 'LOADING') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Protected routes */}
      {isAdmin ? (
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <UsersPage />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <SettingsPage />
              </Suspense>
            }
          />
          <Route
            path="themes"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ThemesPage />
              </Suspense>
            }
          />
          <Route
            path="layouts"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LayoutsPage />
              </Suspense>
            }
          />
          <Route
            path="analytics"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AnalyticsPage />
              </Suspense>
            }
          />
          <Route
            path="builds"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <BuildsPage />
              </Suspense>
            }
          />
          <Route
            path="content"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ContentPage />
              </Suspense>
            }
          />
          <Route
            path="logs"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LogsPage />
              </Suspense>
            }
          />
          {/* 404 route */}
          <Route
            path="*"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      ) : (
        <Route
          path="*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <UnauthorizedPage />
            </Suspense>
          }
        />
      )}
    </Routes>
  );
}
