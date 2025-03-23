
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { lazy, Suspense } from "react";

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
    <div className="animate-pulse text-primary">
      Loading admin interface...
    </div>
  </div>
);

export const AdminRouter = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<AdminLoader />}>
        <Routes>
          <Route path="overview" element={<OverviewDashboard />} />
          <Route path="content/*" element={<ContentManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="chat" element={<ChatManagement />} />
          <Route path="data-maestro" element={<DataMaestroManager />} />
          <Route path="import" element={<ImportManager />} />
          <Route path="settings" element={<SettingsManager />} />
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};

export default AdminRouter;
