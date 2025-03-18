
import React from "react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAdminStore } from "@/admin/store/admin.store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavList } from "./sidebar/SidebarNavList";
import { adminNavigationItems } from "./sidebar/navigation.config";

interface AdminSidebarProps {
  collapsed?: boolean;
  useTanStackRouter?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  collapsed = false,
  useTanStackRouter = false
}) => {
  const location = useLocation();
  const { hasPermission, setCurrentSection } = useAdminStore();
  
  // Parse current path from URL
  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || "overview";

  const handleNavigation = (item: typeof adminNavigationItems[0]) => {
    setCurrentSection(item.id);
  };

  // Animation variants
  const sidebarVariants = {
    expanded: { width: "100%" },
    collapsed: { width: "100%" }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "cyber-card border-primary/20 overflow-hidden transition-all duration-300",
        collapsed && "border-primary/10"
      )}>
        <SidebarHeader collapsed={collapsed} />
        
        <SidebarNavList
          items={adminNavigationItems}
          collapsed={collapsed}
          useTanStackRouter={useTanStackRouter}
          currentPath={currentPath}
          currentTab={currentTab}
          hasPermission={hasPermission}
          onNavigation={handleNavigation}
        />
      </Card>
    </motion.div>
  );
};
