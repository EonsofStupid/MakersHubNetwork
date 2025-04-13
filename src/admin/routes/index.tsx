
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthStatus } from '@/shared/types/shared.types';
import { useAuthStore } from '@/auth/store/auth.store';
import AdminLayout from '../components/AdminLayout';
import { Spinner } from '@/shared/ui/spinner';

// Lazy-loaded pages
const DashboardPage = lazy(() => import('./dashboard/DashboardPage'));
const BuildsPage = lazy(() => import('./builds/BuildsPage'));
const BuildDetailPage = lazy(() => import('./builds/BuildDetailPage'));
const ContentPage = lazy(() => import('./content/ContentPage'));
const UsersPage = lazy(() => import('./users/UsersPage'));
const AnalyticsPage = lazy(() => import('./analytics/AnalyticsPage'));
const ThemesPage = lazy(() => import('./themes/ThemesPage'));
const SettingsPage = lazy(() => import('./settings/SettingsPage'));
const NotFoundPage = lazy(() => import('./NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./UnauthorizedPage'));
const LogsPage = lazy(() => import('./logs/LogsPage'));

export default function AdminRoutes() {
  const { status, isAuthenticated } = useAuthStore();
  
  // Show loading while checking auth
  if (status === AuthStatus.LOADING) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={
          <Suspense fallback={<div>Loading...</div>}>
            <DashboardPage />
          </Suspense>
        } />
        <Route path="builds" element={
          <Suspense fallback={<div>Loading...</div>}>
            <BuildsPage />
          </Suspense>
        } />
        <Route path="builds/:buildId" element={
          <Suspense fallback={<div>Loading...</div>}>
            <BuildDetailPage />
          </Suspense>
        } />
        <Route path="content" element={
          <Suspense fallback={<div>Loading...</div>}>
            <ContentPage />
          </Suspense>
        } />
        <Route path="users" element={
          <Suspense fallback={<div>Loading...</div>}>
            <UsersPage />
          </Suspense>
        } />
        <Route path="themes" element={
          <Suspense fallback={<div>Loading...</div>}>
            <ThemesPage />
          </Suspense>
        } />
        <Route path="analytics" element={
          <Suspense fallback={<div>Loading...</div>}>
            <AnalyticsPage />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<div>Loading...</div>}>
            <SettingsPage />
          </Suspense>
        } />
        <Route path="logs" element={
          <Suspense fallback={<div>Loading...</div>}>
            <LogsPage />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<div>Loading...</div>}>
            <NotFoundPage />
          </Suspense>
        } />
      </Route>
      <Route path="unauthorized" element={
        <Suspense fallback={<div>Loading...</div>}>
          <UnauthorizedPage />
        </Suspense>
      } />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
