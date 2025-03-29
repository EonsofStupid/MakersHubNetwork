
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminRoutes } from "@/admin/routes";
import { useAdmin } from "@/admin/context/AdminContext";

export default function Admin() {
  const { toast } = useToast();
  const { hasAdminAccess, isLoading, initializeAdmin } = useAdmin();
  
  useEffect(() => {
    console.log("Admin component mounted, admin access:", hasAdminAccess);
    
    // Load admin permissions if user has access
    if (hasAdminAccess) {
      initializeAdmin();
    }
  }, [hasAdminAccess, initializeAdmin]);

  // Show simple loading state
  if (isLoading) {
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
