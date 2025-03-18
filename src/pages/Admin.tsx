
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense, lazy, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { useToast } from "@/hooks/use-toast";

// Lazy load admin components
const OverviewPage = lazy(() => import("@/components/admin/pages/Overview"));
const ContentPage = lazy(() => import("@/components/admin/pages/Content"));
const UsersPage = lazy(() => import("@/components/admin/pages/Users"));
const ChatPage = lazy(() => import("@/components/admin/pages/Chat"));
const DataMaestroPage = lazy(() => import("@/components/admin/pages/DataMaestro"));
const ImportPage = lazy(() => import("@/components/admin/pages/Import"));
const SettingsPage = lazy(() => import("@/components/admin/pages/Settings"));

// Loading component for lazy-loaded routes
const AdminPageLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
      <p className="text-muted-foreground">Loading admin section...</p>
    </div>
  </div>
);

// Admin route wrapper with error boundary
const AdminRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary fallback={
      <div className="p-6 border border-destructive/20 rounded-md">
        <h3 className="text-lg font-medium text-destructive mb-2">Error Loading Admin Page</h3>
        <p className="text-muted-foreground">Something went wrong while loading this section.</p>
      </div>
    }>
      <Suspense fallback={<AdminPageLoader />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default function Admin() {
  const { status } = useAuthStore();
  const { hasAdminAccess, loadPermissions } = useAdminAccess();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load permissions on component mount
    loadPermissions();
    
    // Welcome toast for admin panel
    toast({
      title: "Admin Panel",
      description: "Welcome to the MakersImpulse admin dashboard",
    });
  }, [toast, loadPermissions]);
  
  console.log("Admin component rendering - Auth status:", status);
  console.log("Admin component rendering - Has admin access:", hasAdminAccess);
  
  // If not authenticated or loading, show loading
  if (status === "loading") {
    return <AdminPageLoader />;
  }
  
  // If not admin, redirect to home
  if (status === "authenticated" && !hasAdminAccess) {
    return <Navigate to="/" replace />;
  }
  
  // If not authenticated, redirect to login
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        
        <Route path="overview" element={
          <AdminRouteWrapper>
            <OverviewPage />
          </AdminRouteWrapper>
        } />
        
        <Route path="content/*" element={
          <AdminRouteWrapper>
            <ContentPage />
          </AdminRouteWrapper>
        } />
        
        <Route path="users" element={
          <AdminRouteWrapper>
            <UsersPage />
          </AdminRouteWrapper>
        } />
        
        <Route path="chat" element={
          <AdminRouteWrapper>
            <ChatPage />
          </AdminRouteWrapper>
        } />
        
        <Route path="data-maestro" element={
          <AdminRouteWrapper>
            <DataMaestroPage />
          </AdminRouteWrapper>
        } />
        
        <Route path="import" element={
          <AdminRouteWrapper>
            <ImportPage />
          </AdminRouteWrapper>
        } />
        
        <Route path="settings" element={
          <AdminRouteWrapper>
            <SettingsPage />
          </AdminRouteWrapper>
        } />
        
        {/* Fallback for unknown admin routes */}
        <Route path="*" element={<Navigate to="/admin/overview" replace />} />
      </Routes>
    </AdminLayout>
  );
}
