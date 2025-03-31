
import React, { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { PlaceholderPage } from "./PlaceholderPage";
import { Shell, Users, Database, Settings, FileText, BarChart, Paintbrush, Shield } from "lucide-react";
import { AdminPermissions } from "@/admin/constants/permissions";

// Import dashboard as named export
import { AdminDashboard } from "@/admin/index";

// Lazy load other admin pages
const UsersPage = lazy(() => import("./users/UsersPage"));
const ContentPage = lazy(() => import("./content/ContentPage"));
const DataMaestroPage = lazy(() => import("./data/DataMaestroPage"));
const AnalyticsPage = lazy(() => import("./analytics/AnalyticsPage"));
const ThemesPage = lazy(() => import("./themes/ThemesPage"));
const SettingsPage = lazy(() => import("./settings/SettingsPage"));
const PermissionsPage = lazy(() => import("./permissions/PermissionsPage"));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="h-10 w-10 border-4 border-t-primary border-primary/20 rounded-full animate-spin"></div>
  </div>
);

export function AdminRoutes() {
  return (
    <Routes>
      {/* Redirect /admin to /admin/overview */}
      <Route path="/" element={<Navigate to="overview" replace />} />
      
      {/* Dashboard Overview */}
      <Route path="overview" element={<AdminDashboard />} />
      
      {/* Main admin routes */}
      <Route
        path="users/*"
        element={
          <Suspense fallback={<PageLoader />}>
            <UsersPage />
          </Suspense>
        }
      />
      
      <Route
        path="content/*"
        element={
          <Suspense fallback={<PageLoader />}>
            <ContentPage />
          </Suspense>
        }
      />
      
      <Route
        path="data-maestro/*"
        element={
          <Suspense fallback={<PageLoader />}>
            <DataMaestroPage />
          </Suspense>
        }
      />
      
      <Route
        path="analytics/*"
        element={
          <Suspense fallback={<PageLoader />}>
            <AnalyticsPage />
          </Suspense>
        }
      />
      
      <Route
        path="themes/*"
        element={
          <Suspense fallback={<PageLoader />}>
            <ThemesPage />
          </Suspense>
        }
      />
      
      <Route
        path="settings/*"
        element={
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        }
      />
      
      <Route
        path="permissions/*"
        element={
          <Suspense fallback={<PageLoader />}>
            <PermissionsPage />
          </Suspense>
        }
      />
      
      {/* Placeholder pages */}
      <Route
        path="builds/*"
        element={
          <PlaceholderPage 
            title="Builds Manager" 
            description="Review and manage 3D printer builds from the community" 
            icon={<Shell className="h-8 w-8 text-primary" />}
            requiredPermission={AdminPermissions.BUILDS_VIEW}
          />
        }
      />
      
      <Route
        path="messaging/*"
        element={
          <PlaceholderPage 
            title="Messaging" 
            description="Community messaging system management" 
            icon={<FileText className="h-8 w-8 text-primary" />}
            requiredPermission={AdminPermissions.MESSAGING_ACCESS}
          />
        }
      />
      
      {/* Unauthorized page */}
      <Route
        path="unauthorized"
        element={
          <PlaceholderPage 
            title="Access Denied" 
            description="You don't have permission to access this area" 
            icon={<Shield className="h-8 w-8 text-destructive" />}
          />
        }
      />
      
      {/* Catch-all route - redirect to overview */}
      <Route path="*" element={<Navigate to="overview" replace />} />
    </Routes>
  );
}

// Re-export PlaceholderPage for use in other routes
export { PlaceholderPage };
