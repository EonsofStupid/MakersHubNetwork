
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { AdminLayout } from "./components/layout/AdminLayout";
import { useAdminStore } from "./store/admin.store";
import { useToast } from "@/hooks/use-toast";
import "./theme/impulse/impulse-theme.css";

// Lazy load admin components for code splitting
const OverviewDashboard = lazy(() => import("./features/overview/OverviewDashboard"));
const ContentManagement = lazy(() => import("./features/content/ContentManagement"));
const UsersManagement = lazy(() => import("./features/users/UsersManagement"));
const ChatManagement = lazy(() => import("./features/chat/ChatManagement"));
const DataMaestroManager = lazy(() => import("./features/data-maestro/DataMaestroManager"));
const ImportManager = lazy(() => import("./features/import/ImportManager"));
const SettingsManager = lazy(() => import("./features/settings/SettingsManager"));

// Loading component with custom admin styling
const AdminPageLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="w-8 h-8 border-4 border-[var(--impulse-primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-[var(--impulse-text-secondary)]">Loading admin section...</p>
    </div>
  </div>
);

const AdminRouter = () => {
  const { toast } = useToast();
  
  // Apply the custom admin theme when the component mounts
  useEffect(() => {
    // Welcome toast for admin panel
    toast({
      title: "Admin Panel",
      description: "Welcome to the MakersImpulse admin dashboard",
    });
  }, [toast]);

  return (
    <AdminLayout>
      <Suspense fallback={<AdminPageLoader />}>
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
