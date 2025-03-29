
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAdminStore } from "@/admin/store/admin.store";
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
    // Only load permissions once on component mount
    loadPermissions();
    
    // Set the active section based on the URL
    const path = window.location.pathname.split('/');
    const section = path[path.length - 1] || 'overview';
    setActiveSection(section);
    
    // Add the admin theme class
    document.body.classList.add('impulse-admin-root');
    
    // Clean up when unmounting
    return () => {
      document.body.classList.remove('impulse-admin-root');
    };
  }, [loadPermissions, setActiveSection]);

  // Simple loading state without permission check
  if (isLoadingPermissions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6"
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </motion.main>
    </div>
  );
}
