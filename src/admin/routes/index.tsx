
import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/admin/components/AdminLayout';
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

// Import any other admin pages

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
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/builds" element={<BuildsPage />} />
          <Route path="/builds/:id" element={<BuildDetailPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/themes" element={<ThemesPage />} />
          <Route path="/layouts" element={<LayoutsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/data" element={<DataMaestroPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/admin/overview" replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};
