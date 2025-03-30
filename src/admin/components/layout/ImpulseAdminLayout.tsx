
import React, { ReactNode, useEffect } from "react";
import { AdminSidebar } from "@/admin/components/AdminSidebar";
import { AdminTopNav } from "@/admin/components/layout/AdminTopNav";
import { useAdmin } from "@/admin/context/AdminContext";
import { AdminPermission } from "@/admin/types/admin.types";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardShortcuts } from "@/admin/components/dashboard/DashboardShortcuts";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/admin/store/admin.store";
import { DragIndicator } from "@/admin/components/ui/DragIndicator";
import { useAtom } from "jotai";
import { isDraggingAtom, adminEditModeAtom } from "@/admin/atoms/tools.atoms";
import { useToast } from "@/hooks/use-toast";
import { scrollbarStyle } from "@/admin/utils/styles";

interface ImpulseAdminLayoutProps {
  children: ReactNode;
  title?: string;
  requiresPermission?: AdminPermission;
}

export function ImpulseAdminLayout({
  children,
  title = "Admin Dashboard",
  requiresPermission = "admin:access"
}: ImpulseAdminLayoutProps) {
  const { checkPermission, isLoading } = useAdmin();
  const { sidebarExpanded, isDashboardCollapsed, setDashboardCollapsed } = useAdminStore();
  const [isDragging] = useAtom(isDraggingAtom);
  const [isEditMode] = useAtom(adminEditModeAtom);
  const { toast } = useToast();

  // Check for required permission
  const hasPermission = checkPermission(requiresPermission);
  
  // Show a tutorial for new admin users
  useEffect(() => {
    // Check if this is the first time viewing the admin dashboard
    const hasSeenDashboardIntro = localStorage.getItem('dashboard-intro-seen');
    
    if (!hasSeenDashboardIntro && !isLoading && hasPermission) {
      // Show the dashboard tutorial after a brief delay
      const timer = setTimeout(() => {
        toast({
          title: "Welcome to Admin Dashboard",
          description: "This is your customizable admin center. Try clicking the edit button in the top bar to customize it.",
          duration: 6000,
        });
        
        localStorage.setItem('dashboard-intro-seen', 'true');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, hasPermission, toast]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="border-destructive/20 p-6 rounded-lg bg-card/30">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-destructive">Access Denied</h3>
          <p className="text-muted-foreground">
            You don't have permission to access this section.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-impulse-layout min-h-screen">
      <ErrorBoundary>
        <AdminTopNav title={title} />
        
        <div className="flex pt-14 min-h-screen">
          <div className={cn(
            "sidebar-container flex-shrink-0 p-4 pt-6",
            sidebarExpanded ? "w-64" : "w-24",
            "transition-all duration-300"
          )}>
            <AdminSidebar />
          </div>
          
          <main className={cn(
            "flex-1 p-6 overflow-hidden flex flex-col",
            scrollbarStyle
          )}>
            <AnimatePresence mode="wait">
              {!isDashboardCollapsed && (
                <motion.div
                  key="dashboard-shortcuts"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <DashboardShortcuts />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex-1">
              {children}
            </div>
          </main>
        </div>
        
        {/* Show drag indicator when dragging */}
        {isDragging && <DragIndicator />}
        
        {/* First-time user tutorial tooltips */}
        {isEditMode && (
          <div className="fixed bottom-4 left-4 z-50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--impulse-bg-card)] backdrop-blur-md border border-[var(--impulse-primary)] rounded-lg p-4 max-w-xs shadow-lg"
            >
              <h3 className="text-[var(--impulse-primary)] text-sm font-semibold mb-2">Edit Mode Active</h3>
              <p className="text-xs text-[var(--impulse-text-secondary)]">
                You can now drag items from the sidebar to the top navigation bar or dashboard shortcuts.
                Click the X icon to exit edit mode when done.
              </p>
            </motion.div>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
}
