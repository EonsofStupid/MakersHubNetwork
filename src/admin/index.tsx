
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { lazy, Suspense, useEffect } from "react";
import "./styles/cyberpunk-theme.css";

// Lazy load admin pages
const OverviewDashboard = lazy(() => import("./features/overview/OverviewDashboard"));
const ContentManagement = lazy(() => import("./features/content/ContentManagement"));
const UsersManagement = lazy(() => import("./features/users/UsersManagement"));
const ChatManagement = lazy(() => import("./features/chat/ChatManagement"));
const DataMaestroManager = lazy(() => import("./features/data-maestro/DataMaestroManager"));
const ImportManager = lazy(() => import("./features/import/ImportManager"));
const SettingsManager = lazy(() => import("./features/settings/SettingsManager"));

// Loading fallback
const AdminLoader = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="w-8 h-8 border-4 border-[var(--impulse-primary)] border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-3 text-[var(--impulse-text-primary)]">Loading admin interface...</span>
  </div>
);

const AdminRouter = () => {
  // Apply the custom admin theme when the component mounts
  useEffect(() => {
    // Add the theme class to the body when the admin section is active
    document.body.classList.add('impulse-admin-theme');
    
    // Clean up when the component unmounts
    return () => {
      document.body.classList.remove('impulse-admin-theme');
    };
  }, []);

  return (
    <AdminLayout>
      <Suspense fallback={<AdminLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<OverviewDashboard />} />
          <Route path="content/*" element={<ContentManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="chat" element={<ChatManagement />} />
          <Route path="data-maestro" element={<DataMaestroManager />} />
          <Route path="import" element={<ImportManager />} />
          <Route path="settings/*" element={<SettingsManager />} />
          <Route path="*" element={<Navigate to="/admin/overview" replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};

export default AdminRouter;
