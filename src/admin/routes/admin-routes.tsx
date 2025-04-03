
import { lazy } from "react";
import { Route } from "react-router-dom";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { AdminRoute } from "@/admin/components/auth/AdminRoute";

// Lazy load admin pages
const Dashboard = lazy(() => import("@/admin/routes/Dashboard"));
const ThemesPage = lazy(() => import("@/admin/routes/themes/ThemesPage"));
const VisualThemeEditor = lazy(() => import("@/admin/routes/themes/VisualThemeEditor"));
const Settings = lazy(() => import("@/admin/routes/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export const adminRoutes = (
  <Route
    path="/admin"
    element={
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="themes" element={<ThemesPage />} />
    <Route path="themes/editor" element={<VisualThemeEditor />} />
    <Route path="settings" element={<Settings />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);
