
import React, { ReactNode } from "react";
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
import { isDraggingAtom } from "@/admin/atoms/tools.atoms";

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
  const { sidebarExpanded, isDashboardCollapsed } = useAdminStore();
  const [isDragging] = useAtom(isDraggingAtom);

  // Check for required permission
  const hasPermission = checkPermission(requiresPermission);

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
          
          <main className="flex-1 p-6 overflow-hidden flex flex-col">
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
      </ErrorBoundary>
    </div>
  );
}
