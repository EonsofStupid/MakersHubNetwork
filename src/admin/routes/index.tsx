
import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/admin/components/AdminLayout";
import OverviewPage from "./overview/OverviewPage";
import UsersPage from "./users/UsersPage";
import BuildsPage from "./builds/BuildsPage";
import ContentPage from "./content/ContentPage";
import ReviewsPage from "./reviews/ReviewsPage";
import LayoutsPage from "./layouts/LayoutsPage";
import AnalyticsPage from "./analytics/AnalyticsPage";
import SettingsPage from "./settings/SettingsPage";
import UnauthorizedPage from "./unauthorized/UnauthorizedPage";
import DataMaestroPage from "./data/DataMaestroPage";
import ThemesPage from "./themes/ThemesPage";
import PermissionsPage from "./permissions/PermissionsPage";
import LogsPage from "./logs/LogsPage";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { PERMISSIONS, hasPermission } from "@/admin/utils/permissions";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";

// Loading fallback for suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full p-6">
    <div className="h-6 w-6 border-t-2 border-primary animate-spin rounded-full" />
  </div>
);

export const AdminRoutes: React.FC = () => {
  const { adminUser, hasAdminAccess } = useAdminAccess();
  const logger = useLogger("AdminRoutes", LogCategory.ADMIN);

  // Log route access
  useEffect(() => {
    if (hasAdminAccess) {
      logger.info("Admin routes initialized", {
        details: { permissions: adminUser?.permissions || [] }
      });
    }
  }, [hasAdminAccess, adminUser, logger]);

  if (!hasAdminAccess) {
    return <UnauthorizedPage />;
  }

  return (
    <AdminLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/dashboard" element={<OverviewPage />} />
          
          {hasPermission(adminUser?.permissions || [], PERMISSIONS.USERS_VIEW) && (
            <Route path="/users/*" element={<UsersPage />} />
          )}
          
          {hasPermission(adminUser?.permissions || [], PERMISSIONS.BUILDS_VIEW) && (
            <Route path="/builds/*" element={<BuildsPage />} />
          )}
          
          {hasPermission(adminUser?.permissions || [], PERMISSIONS.CONTENT_VIEW) && (
            <Route path="/content/*" element={<ContentPage />} />
          )}
          
          {hasPermission(adminUser?.permissions || [], PERMISSIONS.REVIEWS_VIEW) && (
            <Route path="/reviews/*" element={<ReviewsPage />} />
          )}
          
          {hasPermission(adminUser?.permissions || [], PERMISSIONS.LAYOUTS_VIEW) && (
            <Route path="/layouts/*" element={<LayoutsPage />} />
          )}
          
          {hasPermission(adminUser?.permissions || [], PERMISSIONS.ANALYTICS_VIEW) && (
            <Route path="/analytics/*" element={<AnalyticsPage />} />
          )}
          
          {hasPermission(adminUser?.permissions || [], PERMISSIONS.SYSTEM_VIEW) && (
            <Route path="/settings/*" element={<SettingsPage />} />
          )}
          
          {hasPermission(adminUser?.permissions || [], PERMISSIONS.DATA_VIEW) && (
            <Route path="/data/*" element={<DataMaestroPage />} />
          )}
          
          {hasPermission(adminUser?.permissions || [], PERMISSIONS.THEMES_VIEW) && (
            <Route path="/themes/*" element={<ThemesPage />} />
          )}
          
          {hasPermission(adminUser?.permissions || [], PERMISSIONS.SYSTEM_VIEW) && (
            <Route path="/permissions/*" element={<PermissionsPage />} />
          )}
          
          {hasPermission(adminUser?.permissions || [], PERMISSIONS.SYSTEM_VIEW) && (
            <Route path="/logs/*" element={<LogsPage />} />
          )}
          
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};
