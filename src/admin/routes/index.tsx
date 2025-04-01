
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
import { useAdminPermissions } from "@/admin/hooks/useAdminPermissions";
import { ADMIN_PERMISSIONS } from "@/admin/constants/permissions";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";
import { useAuth } from "@/hooks/useAuth";
import { RequirePermission } from "@/admin/components/auth/RequirePermission";

// Loading fallback for suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full p-6">
    <div className="h-6 w-6 border-t-2 border-primary animate-spin rounded-full" />
  </div>
);

export const AdminRoutes: React.FC = () => {
  const { user, roles } = useAuth();
  const { hasPermission } = useAdminPermissions();
  const logger = useLogger("AdminRoutes", LogCategory.ADMIN);

  // Log route access
  useEffect(() => {
    logger.info("Admin routes initialized", {
      details: { 
        userId: user?.id,
        roles: roles || [] 
      }
    });
  }, [user, roles, logger]);

  return (
    <AdminLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          
          <Route path="/dashboard" element={
            <RequirePermission permission={ADMIN_PERMISSIONS.ADMIN_ACCESS}>
              <OverviewPage />
            </RequirePermission>
          } />
          
          <Route path="/users/*" element={
            <RequirePermission permission={ADMIN_PERMISSIONS.USERS_VIEW}>
              <UsersPage />
            </RequirePermission>
          } />
          
          <Route path="/builds/*" element={
            <RequirePermission permission={ADMIN_PERMISSIONS.BUILDS_VIEW}>
              <BuildsPage />
            </RequirePermission>
          } />
          
          <Route path="/content/*" element={
            <RequirePermission permission={ADMIN_PERMISSIONS.CONTENT_VIEW}>
              <ContentPage />
            </RequirePermission>
          } />
          
          <Route path="/reviews/*" element={
            <RequirePermission permission={ADMIN_PERMISSIONS.REVIEWS_VIEW}>
              <ReviewsPage />
            </RequirePermission>
          } />
          
          <Route path="/layouts/*" element={
            <RequirePermission permission={ADMIN_PERMISSIONS.LAYOUTS_VIEW}>
              <LayoutsPage />
            </RequirePermission>
          } />
          
          <Route path="/analytics/*" element={
            <RequirePermission permission={ADMIN_PERMISSIONS.ANALYTICS_VIEW}>
              <AnalyticsPage />
            </RequirePermission>
          } />
          
          <Route path="/settings/*" element={
            <RequirePermission permission={ADMIN_PERMISSIONS.SYSTEM_VIEW}>
              <SettingsPage />
            </RequirePermission>
          } />
          
          <Route path="/data/*" element={
            <RequirePermission permission={ADMIN_PERMISSIONS.DATA_VIEW}>
              <DataMaestroPage />
            </RequirePermission>
          } />
          
          <Route path="/themes/*" element={
            <RequirePermission permission={ADMIN_PERMISSIONS.THEMES_VIEW}>
              <ThemesPage />
            </RequirePermission>
          } />
          
          <Route path="/permissions/*" element={
            <RequirePermission permission={ADMIN_PERMISSIONS.SYSTEM_VIEW}>
              <PermissionsPage />
            </RequirePermission>
          } />
          
          <Route path="/logs/*" element={
            <RequirePermission permission={ADMIN_PERMISSIONS.SYSTEM_VIEW}>
              <LogsPage />
            </RequirePermission>
          } />
          
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};
