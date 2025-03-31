
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ImpulseAdminLayout } from "@/admin/components/layout/ImpulseAdminLayout";
import { PlaceholderPage } from "./PlaceholderPage";
import { RequirePermission } from "@/admin/components/auth/RequirePermission";
import { AdminPermissions } from "@/admin/constants/permissions";

// Import all the page components
import OverviewPage from "./overview/OverviewPage";
import UsersPage from "./users/UsersPage";
import BuildsPage from "./builds/BuildsPage";
import ContentPage from "./content/ContentPage";
import ThemesPage from "./themes/ThemesPage";
import SettingsPage from "./settings/SettingsPage";
import AnalyticsPage from "./analytics/AnalyticsPage";
import DataMaestroPage from "./data/DataMaestroPage";
import BuildDetailPage from "./builds/BuildDetailPage";
import PermissionsPage from "./permissions/PermissionsPage";
import ReviewsPage from "./reviews/ReviewsPage";
import UnauthorizedPage from "./unauthorized/UnauthorizedPage";

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
          <ImpulseAdminLayout title="Admin Overview">
            <OverviewPage />
          </ImpulseAdminLayout>
        } 
      />
      <Route 
        path="/users" 
        element={
          <RequirePermission permission={AdminPermissions.USERS_VIEW}>
            <ImpulseAdminLayout title="User Management">
              <UsersPage />
            </ImpulseAdminLayout>
          </RequirePermission>
        } 
      />
      <Route 
        path="/builds" 
        element={
          <RequirePermission permission={AdminPermissions.BUILDS_VIEW}>
            <ImpulseAdminLayout title="Build Management">
              <BuildsPage />
            </ImpulseAdminLayout>
          </RequirePermission>
        } 
      />
      <Route 
        path="/builds/:buildId" 
        element={
          <RequirePermission permission={AdminPermissions.BUILDS_VIEW}>
            <BuildDetailPage />
          </RequirePermission>
        } 
      />
      <Route 
        path="/reviews" 
        element={
          <RequirePermission permission={AdminPermissions.CONTENT_VIEW}>
            <ReviewsPage />
          </RequirePermission>
        } 
      />
      <Route 
        path="/content" 
        element={
          <RequirePermission permission={AdminPermissions.CONTENT_VIEW}>
            <ImpulseAdminLayout title="Content Management">
              <ContentPage />
            </ImpulseAdminLayout>
          </RequirePermission>
        } 
      />
      <Route 
        path="/themes" 
        element={
          <RequirePermission permission={AdminPermissions.THEMES_VIEW}>
            <ImpulseAdminLayout title="Theme Manager">
              <ThemesPage />
            </ImpulseAdminLayout>
          </RequirePermission>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <RequirePermission permission={AdminPermissions.DATA_VIEW}>
            <ImpulseAdminLayout title="Analytics Dashboard">
              <AnalyticsPage />
            </ImpulseAdminLayout>
          </RequirePermission>
        } 
      />
      <Route 
        path="/data" 
        element={
          <RequirePermission permission={AdminPermissions.DATA_VIEW}>
            <ImpulseAdminLayout title="Data Maestro">
              <DataMaestroPage />
            </ImpulseAdminLayout>
          </RequirePermission>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <RequirePermission permission={AdminPermissions.SETTINGS_VIEW}>
            <ImpulseAdminLayout title="Admin Settings">
              <SettingsPage />
            </ImpulseAdminLayout>
          </RequirePermission>
        } 
      />
      <Route 
        path="/permissions" 
        element={
          <RequirePermission permission={AdminPermissions.SUPER_ADMIN}>
            <ImpulseAdminLayout title="Permission Manager">
              <PermissionsPage />
            </ImpulseAdminLayout>
          </RequirePermission>
        } 
      />
      <Route 
        path="/unauthorized" 
        element={
          <UnauthorizedPage />
        } 
      />
      <Route path="*" element={<Navigate to="/admin/overview" replace />} />
    </Routes>
  );
}

export { PlaceholderPage };
