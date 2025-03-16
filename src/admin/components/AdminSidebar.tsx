
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAdminStore } from "@/admin/store/admin.store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavList } from "./sidebar/SidebarNavList";
import { adminNavigationItems } from "./sidebar/navigation.config";
import { useLocation } from "react-router-dom";
import { getSectionFromPath } from "@/admin/utils/routeUtils";

interface AdminSidebarProps {
  collapsed?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  collapsed = false
}) => {
  const location = useLocation();
  const { hasPermission, setCurrentSection } = useAdminStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get current path from React Router DOM
  const currentPath = location.pathname;

  // Extract the current section from the path
  useEffect(() => {
    const section = getSectionFromPath(currentPath);
    setCurrentSection(section);
  }, [currentPath, setCurrentSection]);

  // Handle navigation callback
  const handleNavigation = (item: typeof adminNavigationItems[0]) => {
    setIsLoading(true);
    setCurrentSection(item.id);
    
    // Reset loading state after navigation completes
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
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
      className="relative"
    >
      <Card 
        className={cn(
          "cyber-card overflow-hidden transition-all duration-300 relative",
          collapsed && "border-primary/10",
          isHovered && "border-primary/30 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SidebarHeader collapsed={collapsed} />
        
        <SidebarNavList
          items={adminNavigationItems}
          collapsed={collapsed}
          currentPath={currentPath}
          hasPermission={hasPermission}
          onNavigation={handleNavigation}
        />
        
        {/* Loading indicator overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Scanlines effect overlay */}
        <div className="absolute inset-0 cyber-scanlines pointer-events-none" />
      </Card>
    </motion.div>
  );
};
