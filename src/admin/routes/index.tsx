
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/admin/components/AdminLayout";
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
          <AdminLayout title="Admin Overview">
            <OverviewPage />
          </AdminLayout>
        } 
      />
      <Route 
        path="/users" 
        element={
          <AdminLayout title="User Management" requiredPermission="users:view">
            <UsersPage />
          </AdminLayout>
        } 
      />
      <Route 
        path="/builds" 
        element={
          <AdminLayout title="Build Management" requiredPermission="builds:view">
            <BuildsPage />
          </AdminLayout>
        } 
      />
      <Route 
        path="/builds/:buildId" 
        element={
          <AdminLayout title="Build Details" requiredPermission="builds:view">
            <BuildDetailPage />
          </AdminLayout>
        } 
      />
      <Route 
        path="/reviews" 
        element={
          <AdminLayout title="Reviews Management" requiredPermission="content:view">
            <ReviewsPage />
          </AdminLayout>
        } 
      />
      <Route 
        path="/content" 
        element={
          <AdminLayout title="Content Management" requiredPermission="content:view">
            <ContentPage />
          </AdminLayout>
        } 
      />
      <Route 
        path="/themes" 
        element={
          <AdminLayout title="Theme Manager" requiredPermission="themes:view">
            <ThemesPage />
          </AdminLayout>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <AdminLayout title="Analytics Dashboard" requiredPermission="data:view">
            <AnalyticsPage />
          </AdminLayout>
        } 
      />
      <Route 
        path="/data" 
        element={
          <AdminLayout title="Data Maestro" requiredPermission="data:view">
            <DataMaestroPage />
          </AdminLayout>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <AdminLayout title="Admin Settings" requiredPermission="settings:view">
            <SettingsPage />
          </AdminLayout>
        } 
      />
      <Route 
        path="/permissions" 
        element={
          <AdminLayout title="Permission Manager" requiredPermission="super_admin:all">
            <PermissionsPage />
          </AdminLayout>
        } 
      />
      <Route path="*" element={<Navigate to="/admin/overview" replace />} />
    </Routes>
  );
}

export { PlaceholderPage };
