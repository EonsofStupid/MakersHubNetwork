
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/admin/store/admin.store";
import { useAtomValue } from "jotai";
import { secondaryNavExpandedAtom, quickBarVisibleAtom } from "@/admin/atoms/ui.atoms";
import { AdminTopNav } from "./AdminTopNav";
import { AdminSecondaryNav } from "./AdminSecondaryNav";
import { AdminSidebar } from "./AdminSidebar";
import { QuickActionBar } from "./QuickActionBar";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "@/admin/theme/impulse/impulse-theme.css";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title = "Admin Dashboard" }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { adminTheme, sidebarExpanded, activeSection, loadPermissions } = useAdminStore();
  const secondaryNavExpanded = useAtomValue(secondaryNavExpandedAtom);
  const quickBarVisible = useAtomValue(quickBarVisibleAtom);

  // Load permissions on mount
  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  // Apply the impulse theme
  const themeClass = `impulse-admin-root theme-${adminTheme}`;

  // Calculate top offset based on secondary nav visibility
  const topOffset = secondaryNavExpanded ? "7rem" : "4rem";
  
  // Calculate left margin based on sidebar state
  const leftMargin = sidebarExpanded ? "16rem" : "4.5rem";

  return (
    <div className={themeClass}>
      <AdminTopNav title={title} />
      
      {secondaryNavExpanded && <AdminSecondaryNav />}
      
      <div className="flex">
        <AdminSidebar />
        
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "impulse-main",
            "transition-all duration-300 pt-6",
            "min-h-screen"
          )}
          style={{ 
            marginTop: topOffset,
            marginLeft: leftMargin,
            paddingRight: quickBarVisible ? "4rem" : "1.5rem"
          }}
        >
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </motion.main>
        
        {quickBarVisible && <QuickActionBar />}
      </div>
    </div>
  );
}
