
import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/layouts/AdminLayout";
import { AdminThemeWrapper } from "@/admin/theme/AdminThemeWrapper";

// Placeholder component for missing pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-muted-foreground mb-6">This page is under construction.</p>
    <div className="flex items-center gap-2 p-4 bg-card rounded-lg border">
      <div className="h-4 w-4 rounded-full bg-primary animate-pulse"></div>
      <span className="text-sm">Coming soon...</span>
    </div>
  </div>
);

// Define placeholders for missing pages
const AdminDashboard = () => <PlaceholderPage title="Dashboard" />;
const AdminUsers = () => <PlaceholderPage title="Users" />;
const AdminContent = () => <PlaceholderPage title="Content" />;
const AdminSettings = () => <PlaceholderPage title="Settings" />;
const AdminThemes = () => <PlaceholderPage title="Themes" />;
const AdminAssets = () => <PlaceholderPage title="Assets" />;
const AdminAPI = () => <PlaceholderPage title="API" />;
const AdminCategories = () => <PlaceholderPage title="Categories" />;
const AdminManufacturers = () => <PlaceholderPage title="Manufacturers" />;
const AdminProfiles = () => <PlaceholderPage title="Profiles" />;
const AdminRoles = () => <PlaceholderPage title="Roles" />;

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export function AdminRoutes() {
  return (
    <Routes>
      <Route 
        path="/*" 
        element={
          <AdminThemeWrapper>
            <AdminLayout />
          </AdminThemeWrapper>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        } />
        <Route path="users" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminUsers />
          </Suspense>
        } />
        <Route path="content" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminContent />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminSettings />
          </Suspense>
        } />
        <Route path="themes" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminThemes />
          </Suspense>
        } />
        <Route path="assets" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminAssets />
          </Suspense>
        } />
        <Route path="api" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminAPI />
          </Suspense>
        } />
        <Route path="categories" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminCategories />
          </Suspense>
        } />
        <Route path="manufacturers" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminManufacturers />
          </Suspense>
        } />
        <Route path="profiles" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminProfiles />
          </Suspense>
        } />
        <Route path="roles" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminRoles />
          </Suspense>
        } />
      </Route>
    </Routes>
  );
}
