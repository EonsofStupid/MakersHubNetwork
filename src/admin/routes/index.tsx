
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/admin/components/AdminLayout';

// Import all admin pages - using lazy loading for better performance
const OverviewPage = React.lazy(() => import('./overview/OverviewPage'));
const UsersPage = React.lazy(() => import('./users/UsersPage'));
const SettingsPage = React.lazy(() => import('./settings/SettingsPage'));
const UnauthorizedPage = React.lazy(() => import('./UnauthorizedPage'));

// Default loading component for lazy-loaded pages
const PageLoading = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    <p className="ml-3 text-muted-foreground">Loading...</p>
  </div>
);

export function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/admin/overview" replace />}
      />
      <Route 
        path="/overview" 
        element={
          <React.Suspense fallback={<AdminLayout><PageLoading /></AdminLayout>}>
            <OverviewPage />
          </React.Suspense>
        } 
      />
      <Route 
        path="/users" 
        element={
          <React.Suspense fallback={<AdminLayout><PageLoading /></AdminLayout>}>
            <UsersPage />
          </React.Suspense>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <React.Suspense fallback={<AdminLayout><PageLoading /></AdminLayout>}>
            <SettingsPage />
          </React.Suspense>
        } 
      />
      <Route 
        path="/unauthorized" 
        element={
          <React.Suspense fallback={<div className="h-screen"></div>}>
            <UnauthorizedPage />
          </React.Suspense>
        } 
      />
      <Route 
        path="*" 
        element={<Navigate to="/admin/overview" replace />} 
      />
    </Routes>
  );
}
