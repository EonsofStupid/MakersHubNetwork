import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminRoutes } from "@/admin/routes";
import { useAdminAccess } from "@/admin/hooks/useAdminAccess";
import { useAdminStore } from "@/admin/store/admin.store";
import { useAdminSync } from "@/admin/hooks/useAdminSync";
import { SyncIndicator } from "@/admin/components/ui/SyncIndicator";
import { DragIndicator } from "@/admin/components/ui/DragIndicator";
import { useAtom } from "jotai";
import { adminEditModeAtom } from "@/admin/atoms/tools.atoms";

// Import all admin styles
import '@/admin/styles/cyber-effects.css';
import '@/admin/styles/electric-effects.css';
import '@/admin/styles/admin-topnav.css';
import '@/admin/styles/dashboard-shortcuts.css';
import '@/admin/styles/drag-drop.css';
import '@/admin/styles/navigation.css';
import '@/admin/styles/sidebar-navigation.css';
import '@/admin/theme/impulse/impulse-admin.css';
import '@/admin/theme/impulse/impulse-theme.css';

export default function Admin() {
  const { toast } = useToast();
  const location = useLocation();
  const { hasAdminAccess, isLoading, initializeAdmin } = useAdminAccess();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const { loadPermissions, initializeStore, savePreferences } = useAdminStore();
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  // Use admin sync hook to keep database and localStorage in sync
  useAdminSync();
  
  useEffect(() => {
    // Load admin permissions if user has access
    if (hasAdminAccess && !hasInitialized) {
      initializeAdmin();
      initializeStore();
      loadPermissions();
      setHasInitialized(true);
      
      // Add admin theme class to body
      document.body.classList.add('impulse-admin-root');
    }
    
    // Apply edit mode class if needed
    if (isEditMode) {
      document.body.classList.add('edit-mode');
    } else {
      document.body.classList.remove('edit-mode');
    }
    
    return () => {
      // Remove admin theme class from body
      document.body.classList.remove('impulse-admin-root');
      document.body.classList.remove('edit-mode');
    };
  }, [hasAdminAccess, hasInitialized, initializeAdmin, loadPermissions, isEditMode, initializeStore]);

  // Show a first-time user tutorial for drag and drop
  useEffect(() => {
    // Only show once based on localStorage flag
    const hasSeenTutorial = localStorage.getItem('admin-tutorial-seen');
    
    if (hasAdminAccess && hasInitialized && !hasSeenTutorial && !hasShownIntro) {
      setHasShownIntro(true);
      
      // Show tutorials with a slight delay
      const timeout = setTimeout(() => {
        toast({
          title: "Admin Customization",
          description: "You can customize your admin experience. Click the edit icon in the top bar to start customizing.",
          duration: 6000,
        });
        
        setTimeout(() => {
          toast({
            title: "Drag & Drop",
            description: "Drag items from the sidebar to the top navigation or dashboard for quick access.",
            duration: 6000,
          });
          localStorage.setItem('admin-tutorial-seen', 'true');
        }, 7000);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [hasAdminAccess, hasInitialized, toast, hasShownIntro]);

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
      <div className="fixed bottom-4 right-4 z-50 bg-background/90 border border-border/30 backdrop-blur-md py-1 px-3 rounded-full shadow-md">
        <SyncIndicator />
      </div>
      <AdminRoutes />
      <DragIndicator />
    </ErrorBoundary>
  );
}
