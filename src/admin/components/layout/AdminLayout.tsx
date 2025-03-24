
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useAdminStore } from "@/admin/store/admin.store";
import { useLocation } from "react-router-dom";
import { AdminSidebar } from "../AdminSidebar";
import { AdminTopNav } from "../AdminTopNav";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useThemeStore } from "@/stores/theme/store";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title = "Admin Dashboard" }: AdminLayoutProps) {
  const location = useLocation();
  const { sidebarExpanded, setActiveSection } = useAdminStore();
  const { loadAdminComponents } = useThemeStore();
  
  // Extract current section from path
  useEffect(() => {
    const path = location.pathname.split('/');
    const section = path.length > 2 ? path[2] : 'overview';
    setActiveSection(section);
  }, [location, setActiveSection]);
  
  // Load admin theme components
  useEffect(() => {
    loadAdminComponents();
  }, [loadAdminComponents]);

  return (
    <div className="impulse-admin-root min-h-screen w-full overflow-x-hidden">
      <AdminTopNav title={title} />
      
      <div className="impulse-admin-content flex">
        <AdminSidebar />
        
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "impulse-admin-main flex-1 p-6 transition-all duration-300",
            "min-h-[calc(100vh-4rem)] mt-16",
            sidebarExpanded ? "ml-48" : "ml-[60px]"
          )}
        >
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </motion.main>
      </div>
    </div>
  );
}
