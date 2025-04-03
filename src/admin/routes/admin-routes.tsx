
import { lazy } from "react";
import { Route } from "react-router-dom";
import { AdminLayout } from "@/admin/components/AdminLayout";
import { AdminThemeWrapper } from "@/admin/theme/AdminThemeWrapper";

// Lazily load admin pages
const AdminDashboard = lazy(() => import('@/admin/pages/Dashboard'));
const AdminUsers = lazy(() => import('@/admin/pages/Users'));
const AdminContent = lazy(() => import('@/admin/pages/Content'));
const AdminSettings = lazy(() => import('@/admin/pages/Settings'));
const AdminThemes = lazy(() => import('@/admin/pages/Themes'));
const AdminAssets = lazy(() => import('@/admin/pages/Assets'));
const AdminAPI = lazy(() => import('@/admin/pages/API'));
const AdminCategories = lazy(() => import('@/admin/pages/Categories'));
const AdminManufacturers = lazy(() => import('@/admin/pages/Manufacturers'));
const AdminProfiles = lazy(() => import('@/admin/pages/Profiles'));
const AdminRoles = lazy(() => import('@/admin/pages/Roles'));

export const adminRoutes = (
  <Route 
    path="/admin/*" 
    element={
      <AdminThemeWrapper>
        <AdminLayout />
      </AdminThemeWrapper>
    }
  >
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="content" element={<AdminContent />} />
    <Route path="settings" element={<AdminSettings />} />
    <Route path="themes" element={<AdminThemes />} />
    <Route path="assets" element={<AdminAssets />} />
    <Route path="api" element={<AdminAPI />} />
    <Route path="categories" element={<AdminCategories />} />
    <Route path="manufacturers" element={<AdminManufacturers />} />
    <Route path="profiles" element={<AdminProfiles />} />
    <Route path="roles" element={<AdminRoles />} />
  </Route>
);
