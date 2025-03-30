
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ImpulseAdminLayout } from "@/admin/components/layout/ImpulseAdminLayout";
import { PlaceholderPage } from "./PlaceholderPage";

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
          <ImpulseAdminLayout title="User Management" requiresPermission="users:view">
            <UsersPage />
          </ImpulseAdminLayout>
        } 
      />
      <Route 
        path="/builds" 
        element={
          <ImpulseAdminLayout title="Build Management" requiresPermission="builds:view">
            <BuildsPage />
          </ImpulseAdminLayout>
        } 
      />
      <Route 
        path="/builds/:buildId" 
        element={
          <ImpulseAdminLayout title="Build Details" requiresPermission="builds:view">
            <BuildDetailPage />
          </ImpulseAdminLayout>
        } 
      />
      <Route 
        path="/reviews" 
        element={
          <ImpulseAdminLayout title="Reviews Management" requiresPermission="content:view">
            <ReviewsPage />
          </ImpulseAdminLayout>
        } 
      />
      <Route 
        path="/content" 
        element={
          <ImpulseAdminLayout title="Content Management" requiresPermission="content:view">
            <ContentPage />
          </ImpulseAdminLayout>
        } 
      />
      <Route 
        path="/themes" 
        element={
          <ImpulseAdminLayout title="Theme Manager" requiresPermission="themes:view">
            <ThemesPage />
          </ImpulseAdminLayout>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ImpulseAdminLayout title="Analytics Dashboard" requiresPermission="data:view">
            <AnalyticsPage />
          </ImpulseAdminLayout>
        } 
      />
      <Route 
        path="/data" 
        element={
          <ImpulseAdminLayout title="Data Maestro" requiresPermission="data:view">
            <DataMaestroPage />
          </ImpulseAdminLayout>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ImpulseAdminLayout title="Admin Settings" requiresPermission="settings:view">
            <SettingsPage />
          </ImpulseAdminLayout>
        } 
      />
      <Route 
        path="/permissions" 
        element={
          <ImpulseAdminLayout title="Permission Manager" requiresPermission="super_admin:all">
            <PermissionsPage />
          </ImpulseAdminLayout>
        } 
      />
      <Route path="*" element={<Navigate to="/admin/overview" replace />} />
    </Routes>
  );
}

export { PlaceholderPage };
