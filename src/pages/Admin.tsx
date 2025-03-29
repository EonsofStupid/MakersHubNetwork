
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminRoutes } from "@/admin/routes";
import { useAdminStore } from "@/admin/store/admin.store";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export default function Admin() {
  const { status } = useAuthStore();
  const { toast } = useToast();
  const { loadPermissions } = useAdminStore();
  const { hasAdminAccess, isLoading, initializeAdminAccess } = useAdminAccess();
  
  // Clear loading state check to ensure we're not getting stuck
  const isPageLoading = status === "loading" || isLoading;
  
  useEffect(() => {
    console.log("Admin component mounted, auth status:", status);
    console.log("Admin access:", hasAdminAccess);
    
    // Load admin permissions if user has access
    if (hasAdminAccess) {
      initializeAdminAccess();
    }
  }, [status, hasAdminAccess, loadPermissions, initializeAdminAccess]);

  // Show simple loading state
  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  // Verify admin access
  if (!hasAdminAccess) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access the admin section",
      variant: "destructive"
    });
    return <Navigate to="/" replace />;
  }

  return (
    <ErrorBoundary>
      <AdminRoutes />
    </ErrorBoundary>
  );
}
