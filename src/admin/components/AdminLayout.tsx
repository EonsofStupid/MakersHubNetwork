
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AdminSidebar } from "@/admin/components/AdminSidebar";
import { AdminHeader } from "@/admin/components/AdminHeader";
import { AdminPermission } from "@/admin/types/admin.types";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardShortcuts } from "@/admin/components/dashboard/DashboardShortcuts";
import { useAdmin } from "@/admin/context/AdminContext";
import { useAdminStore } from "@/admin/store/admin.store";
import { motion, AnimatePresence } from "framer-motion";
import { DragIndicator } from "@/admin/components/ui/DragIndicator";

interface AdminLayoutProps {
  children: React.ReactNode;
  requiredPermission?: AdminPermission;
  title?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  requiredPermission = "admin:access",
  title = "Admin Dashboard"
}) => {
  const { checkPermission, isLoading } = useAdmin();
  const { 
    sidebarExpanded, 
    isDashboardCollapsed,
    setActiveSection,
    dragSource,
    isEditMode
  } = useAdminStore();

  useEffect(() => {
    // Extract the current section from location
    const path = window.location.pathname.split('/');
    const section = path[path.length - 1] || 'overview';
    setActiveSection(section);
    
    // Add the admin theme class
    document.body.classList.add('impulse-admin-root');
    
    if (isEditMode) {
      document.body.classList.add('edit-mode');
    } else {
      document.body.classList.remove('edit-mode');
    }
    
    return () => {
      // Remove the admin theme class when unmounting
      document.body.classList.remove('impulse-admin-root');
      document.body.classList.remove('edit-mode');
    };
  }, [setActiveSection, isEditMode]);

  // Check if user has required permission
  if (!isLoading && requiredPermission && !checkPermission(requiredPermission)) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive/20 p-6 text-center">
          <h2 className="text-2xl font-heading text-destructive mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this admin area.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="admin-theme min-h-screen">
      <AdminHeader title={title} />
      
      <div className={cn(
        "transition-all duration-300 ease-in-out pt-20 pb-8",
        isDashboardCollapsed ? "pt-16" : "pt-20"
      )}>
        <div className="container mx-auto px-4">
          {/* Dashboard Shortcuts - conditionally rendered based on collapse state */}
          <AnimatePresence mode="wait">
            {!isDashboardCollapsed && (
              <motion.div
                key="dashboard-shortcuts"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                <ErrorBoundary>
                  <DashboardShortcuts />
                </ErrorBoundary>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={cn(
              "transition-all duration-300 ease-in-out",
              sidebarExpanded ? "lg:col-span-3" : "lg:col-span-1"
            )}>
              <AdminSidebar />
            </div>
            
            <div className={cn(
              "transition-all duration-300 ease-in-out",
              sidebarExpanded ? "lg:col-span-9" : "lg:col-span-11"
            )}>
              {isLoading ? (
                <Card className="p-8 flex justify-center items-center min-h-[400px]">
                  <div className="space-y-4 text-center">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                    <p className="text-muted-foreground">Loading admin panel...</p>
                  </div>
                </Card>
              ) : (
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Drag indicator */}
      {dragSource && <DragIndicator />}
    </div>
  );
}
