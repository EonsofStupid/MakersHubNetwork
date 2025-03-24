
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/hooks/use-toast";
import { AdminThemeProvider } from "@/admin/theme/AdminThemeProvider";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import "../admin/styles/cyberpunk-theme.css";

// Lazy load admin components for code splitting
const OverviewDashboard = lazy(() => import("@/admin/features/overview/OverviewDashboard"));
const ContentManagement = lazy(() => import("@/admin/features/content/ContentManagement"));
const UsersManagement = lazy(() => import("@/admin/features/users/UsersManagement"));
const ChatManagement = lazy(() => import("@/admin/features/chat/ChatManagement"));
const DataMaestroManager = lazy(() => import("@/admin/features/data-maestro/DataMaestroManager"));
const ImportManager = lazy(() => import("@/admin/features/import/ImportManager"));
const SettingsManager = lazy(() => import("@/admin/features/settings/SettingsManager"));

// Loading component with impulse theme styling
const AdminPageLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="w-8 h-8 border-4 border-[var(--impulse-primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-[var(--impulse-text-secondary)]">Loading admin section...</p>
    </div>
  </div>
);

export default function Admin() {
  const { status, user } = useAuthStore();
  const { toast } = useToast();
  
  useEffect(() => {
    // Apply the admin theme class
    document.body.classList.add('impulse-admin-theme');
    
    // Welcome toast for admin panel
    toast({
      title: "Admin Panel",
      description: "Welcome to the MakersImpulse admin dashboard",
    });
    
    // Clean up when unmounting
    return () => {
      document.body.classList.remove('impulse-admin-theme');
    };
  }, [toast]);
  
  // Show loading state
  if (status === "loading") {
    return <AdminPageLoader />;
  }
  
  // Redirect if not authenticated
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect if logged in but not admin
  if (status === "authenticated" && 
      !user?.app_metadata?.roles?.includes("admin") && 
      !user?.app_metadata?.roles?.includes("super_admin")) {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminThemeProvider>
      <AdminLayout>
        <Suspense fallback={<AdminPageLoader />}>
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
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
    </AdminThemeProvider>
  );
}
