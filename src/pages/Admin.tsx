import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminRoutes } from "@/admin/routes";
import { useAdmin } from "@/admin/context/AdminContext";
import { useAdminStore } from "@/admin/store/admin.store";
import { useAdminSync } from "@/admin/hooks/useAdminSync";
import { SyncIndicator } from "@/components/admin/SyncIndicator";
import { DragIndicator } from "@/admin/components/ui/DragIndicator";

// Import admin theme styles
import "@/admin/styles/admin-core.css";
import "@/admin/styles/impulse-admin.css";
import "@/admin/styles/admin-topnav.css";
import "@/admin/theme/impulse/impulse-theme.css";

export default function Admin() {
  const { toast } = useToast();
  const { hasAdminAccess, isLoading, initializeAdmin } = useAdmin();
  const [hasInitialized, setHasInitialized] = useState(false);
  const { loadPermissions, dragSource } = useAdminStore();
  
  // Use admin sync hook to keep database and localStorage in sync
  useAdminSync();
  
  useEffect(() => {
    console.log("Admin component mounted, admin access:", hasAdminAccess);
    
    // Load admin permissions if user has access
    if (hasAdminAccess && !hasInitialized) {
      initializeAdmin();
      loadPermissions();
      setHasInitialized(true);
      
      // Add admin theme class to body
      document.body.classList.add('impulse-admin-root');
    }
    
    return () => {
      // Remove admin theme class from body
      document.body.classList.remove('impulse-admin-root');
    };
  }, [hasAdminAccess, hasInitialized, initializeAdmin, loadPermissions]);

  // Show a first-time user tutorial for drag and drop
  useEffect(() => {
    // Only show once based on localStorage flag
    const hasSeenTutorial = localStorage.getItem('admin-tutorial-seen');
    
    if (hasAdminAccess && hasInitialized && !hasSeenTutorial) {
      const timeout = setTimeout(() => {
        toast({
          title: "Admin Customization",
          description: "You can drag menu items to the top bar or dashboard for quick access.",
          duration: 6000,
        });
        localStorage.setItem('admin-tutorial-seen', 'true');
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [hasAdminAccess, hasInitialized, toast]);

  // Show simple loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background admin-theme">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
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
      {dragSource && <DragIndicator />}
      <div className="fixed bottom-4 right-4 z-50 bg-background/90 border border-border/30 backdrop-blur-md py-1 px-3 rounded-full shadow-md">
        <SyncIndicator />
      </div>
      <AdminRoutes />
    </ErrorBoundary>
  );
}
