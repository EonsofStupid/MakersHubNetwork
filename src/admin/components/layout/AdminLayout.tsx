
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAdminStore } from "@/admin/store/admin.store";
import { AdminSidebar } from "@/admin/components/AdminSidebar";
import { AdminHeader } from "@/admin/components/AdminHeader";
import { AdminPermission } from "@/admin/types/admin.types";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const { loadPermissions, hasPermission, isLoadingPermissions, sidebarExpanded, setActiveSection } = useAdminStore();
  
  useEffect(() => {
    // Load permissions on component mount
    loadPermissions();
    
    // Set the active section based on the URL
    const path = window.location.pathname.split('/');
    const section = path[path.length - 1] || 'overview';
    setActiveSection(section);
    
    // Add the cyberpunk admin theme class
    document.body.classList.add('impulse-admin-root');
    
    // Clean up when unmounting
    return () => {
      document.body.classList.remove('impulse-admin-root');
    };
  }, [loadPermissions, setActiveSection]);

  // Check if user has required permission
  if (!isLoadingPermissions && requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="container mx-auto p-6 pt-24">
        <Card className="border-destructive/20 p-6 text-center bg-[var(--impulse-bg-card)] backdrop-blur-xl">
          <h2 className="text-2xl font-heading text-destructive mb-2">Access Denied</h2>
          <p className="text-[var(--impulse-text-secondary)]">
            You don't have permission to access this admin area.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen impulse-admin-root">
      <AdminHeader title={title} collapsed={!sidebarExpanded} />
      <AdminSidebar collapsed={!sidebarExpanded} />
      
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "pt-20 min-h-screen transition-all duration-300",
          sidebarExpanded ? "ml-[250px]" : "ml-[70px]",
          "px-6 py-6"
        )}
      >
        {isLoadingPermissions ? (
          <Card className="p-8 flex justify-center items-center min-h-[400px] bg-[var(--impulse-bg-card)] backdrop-blur-xl border-[var(--impulse-border-normal)]">
            <div className="space-y-4 text-center">
              <div className="w-8 h-8 border-4 border-[var(--impulse-primary)]/20 border-t-[var(--impulse-primary)] rounded-full animate-spin mx-auto"></div>
              <p className="text-[var(--impulse-text-secondary)]">Loading admin panel...</p>
            </div>
          </Card>
        ) : (
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        )}
      </motion.main>
    </div>
  );
};
