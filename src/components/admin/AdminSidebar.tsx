
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAdminStore } from "@/stores/admin/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SidebarHeader } from "@/components/admin/SidebarHeader";
import { SidebarNavList } from "@/components/admin/SidebarNavList";
import { adminNavigationItems } from "@/components/admin/navigation";

interface AdminSidebarProps {
  collapsed?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  collapsed = false 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission, setCurrentSection } = useAdminStore();
  
  // Parse current path from URL
  const currentPath = location.pathname;
  const currentSection = currentPath.split('/').pop() || 'overview';

  const handleNavigation = (item: typeof adminNavigationItems[0]) => {
    setCurrentSection(item.id);
    navigate(item.path);
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
          currentPath={currentPath}
          currentSection={currentSection}
          hasPermission={hasPermission}
          onNavigation={handleNavigation}
        />
      </Card>
    </motion.div>
  );
};
