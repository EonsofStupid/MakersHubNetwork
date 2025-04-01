
import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { RequirePermission } from '@/auth/components/RequirePermission';
import { APP_PERMISSIONS } from '@/auth/constants/permissions';
import OverviewPage from './overview/OverviewPage';
import BuildsPage from './builds/BuildsPage';
import UsersPage from './users/UsersPage';
import ContentPage from './content/ContentPage';
import SettingsPage from './settings/SettingsPage';
import ThemesPage from './themes/ThemesPage';
import LayoutsPage from './layouts/LayoutsPage';
import UnauthorizedPage from './unauthorized/UnauthorizedPage';
import BuildDetailPage from './builds/BuildDetailPage';
import AnalyticsPage from './analytics/AnalyticsPage';
import ReviewsPage from './reviews/ReviewsPage';
import DataMaestroPage from './data/DataMaestroPage';
import PermissionsPage from './permissions/PermissionsPage';
import LogsPage from './logs/LogsPage';

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 border-t-2 border-primary animate-spin rounded-full"></div>
  </div>
);

export const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/overview" replace />} />
          
          <Route 
            path="/overview" 
            element={
              <RequirePermission permission={APP_PERMISSIONS.ADMIN_VIEW}>
                <OverviewPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/builds" 
            element={
              <RequirePermission permission={APP_PERMISSIONS.BUILDS_VIEW}>
                <BuildsPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/builds/:id" 
            element={
              <RequirePermission permission={APP_PERMISSIONS.BUILDS_VIEW}>
                <BuildDetailPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/users" 
            element={
              <RequirePermission permission={APP_PERMISSIONS.USERS_VIEW}>
                <UsersPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/content" 
            element={
              <RequirePermission permission={APP_PERMISSIONS.CONTENT_VIEW}>
                <ContentPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <RequirePermission permission={APP_PERMISSIONS.SETTINGS_VIEW}>
                <SettingsPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/themes" 
            element={
              <RequirePermission permission={APP_PERMISSIONS.THEMES_VIEW}>
                <ThemesPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/layouts" 
            element={
              <RequirePermission permission={APP_PERMISSIONS.LAYOUTS_VIEW}>
                <LayoutsPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/analytics" 
            element={
              <RequirePermission permission={APP_PERMISSIONS.ANALYTICS_VIEW}>
                <AnalyticsPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/reviews" 
            element={
              <RequirePermission permission={APP_PERMISSIONS.REVIEWS_VIEW}>
                <ReviewsPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/data" 
            element={
              <RequirePermission permission={APP_PERMISSIONS.DATA_VIEW}>
                <DataMaestroPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/permissions" 
            element={
              <RequirePermission permission={APP_PERMISSIONS.SUPER_ADMIN}>
                <PermissionsPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/logs" 
            element={
              <RequirePermission permission={APP_PERMISSIONS.SYSTEM_LOGS}>
                <LogsPage />
              </RequirePermission>
            } 
          />
          
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/admin/overview" replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};
