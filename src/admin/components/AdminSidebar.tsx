
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/admin/store/admin.store";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Database, 
  Upload, 
  Settings,
  Command,
  ChevronRight
} from "lucide-react";
import { Link as TanStackLink } from '@tanstack/react-router';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from "framer-motion";

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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const adminNavigationItems = [
    { 
      id: "overview", 
      label: "Overview", 
      path: "/admin/overview", 
      legacyPath: "/admin?tab=overview",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      permission: "admin:access" 
    },
    { 
      id: "content", 
      label: "Content", 
      path: "/admin/content", 
      legacyPath: "/admin?tab=content",
      icon: <FileText className="h-4 w-4 mr-2" />,
      permission: "admin:content:read" 
    },
    { 
      id: "users", 
      label: "Users", 
      path: "/admin/users", 
      legacyPath: "/admin?tab=users",
      icon: <Users className="h-4 w-4 mr-2" />,
      permission: "admin:users:read" 
    },
    { 
      id: "chat", 
      label: "Chat", 
      path: "/admin/chat", 
      legacyPath: "/admin?tab=chat",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
      permission: "admin:access" 
    },
    { 
      id: "data-maestro", 
      label: "Data Maestro", 
      path: "/admin/data-maestro", 
      legacyPath: "/admin?tab=data-maestro",
      icon: <Database className="h-4 w-4 mr-2" />,
      permission: "admin:access" 
    },
    { 
      id: "import", 
      label: "Import", 
      path: "/admin/import", 
      legacyPath: "/admin?tab=import",
      icon: <Upload className="h-4 w-4 mr-2" />,
      permission: "admin:data:import" 
    },
    { 
      id: "settings", 
      label: "Settings", 
      path: "/admin/settings", 
      legacyPath: "/admin?tab=settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
      permission: "admin:settings:read" 
    }
  ];

  // Parse current path from URL
  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || "overview";

  // Check if an item is active based on legacy tab param or new route path
  const isItemActive = (item: typeof adminNavigationItems[0]) => {
    if (useTanStackRouter) {
      return currentPath === item.path || 
             (currentPath === '/admin' && item.id === 'overview');
    } else {
      return currentTab === item.id;
    }
  };

  const handleNavigation = (item: typeof adminNavigationItems[0]) => {
    setCurrentSection(item.id);
  };

  // Render navigation item based on router preference
  const renderNavItem = (item: typeof adminNavigationItems[0]) => {
    const isActive = isItemActive(item);
    const isHovered = hoveredItem === item.id;
    
    const commonClasses = cn(
      "flex w-full items-center px-3 py-2 rounded-md text-sm font-normal transition-colors",
      isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/5",
      collapsed && "px-2 py-2 justify-center"
    );
    
    if (useTanStackRouter) {
      return (
        <motion.div
          whileHover={{ x: 5 }}
          onHoverStart={() => setHoveredItem(item.id)}
          onHoverEnd={() => setHoveredItem(null)}
          className="relative"
        >
          {isHovered && !collapsed && (
            <motion.div 
              className="absolute left-0 top-1/2 h-5 w-1 bg-primary rounded-r-full transform -translate-y-1/2"
              initial={{ opacity: 0, scaleY: 0.5 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          <TanStackLink
            to={item.path}
            onClick={() => handleNavigation(item)}
            className={cn(
              commonClasses,
              "relative overflow-hidden group"
            )}
            title={collapsed ? item.label : undefined}
            preload="intent"
          >
            <span className={collapsed ? "mr-0" : "mr-2"}>
              {React.cloneElement(item.icon as React.ReactElement, {
                className: `h-4 w-4 ${collapsed ? "" : "mr-2"} ${isActive ? "text-primary" : ""}`
              })}
            </span>
            {!collapsed && (
              <>
                <span className={cn(
                  "transition-all duration-300",
                  isActive && "text-primary"
                )}>
                  {item.label}
                </span>
                <ChevronRight className={cn(
                  "ml-auto h-4 w-4 opacity-0 transition-all",
                  isHovered && "opacity-100 text-primary"
                )} />
              </>
            )}
            
            {/* Hover effect */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              "-z-10"
            )} />
          </TanStackLink>
        </motion.div>
      );
    } else {
      return (
        <motion.div
          whileHover={{ x: 5 }}
          onHoverStart={() => setHoveredItem(item.id)}
          onHoverEnd={() => setHoveredItem(null)}
          className="relative"
        >
          {isHovered && !collapsed && (
            <motion.div 
              className="absolute left-0 top-1/2 h-5 w-1 bg-primary rounded-r-full transform -translate-y-1/2"
              initial={{ opacity: 0, scaleY: 0.5 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-left font-normal relative overflow-hidden group",
              isActive && "bg-primary/10 text-primary",
              collapsed && "px-2 py-2"
            )}
            asChild
            title={collapsed ? item.label : undefined}
          >
            <RouterLink to={item.legacyPath} onClick={() => handleNavigation(item)}>
              <span className={collapsed ? "mr-0" : "mr-2"}>
                {React.cloneElement(item.icon as React.ReactElement, {
                  className: `h-4 w-4 ${collapsed ? "" : "mr-2"} ${isActive ? "text-primary" : ""}`
                })}
              </span>
              {!collapsed && (
                <>
                  <span className={cn(
                    "transition-all duration-300",
                    isActive && "text-primary"
                  )}>
                    {item.label}
                  </span>
                  <ChevronRight className={cn(
                    "ml-auto h-4 w-4 opacity-0 transition-all",
                    isHovered && "opacity-100 text-primary"
                  )} />
                </>
              )}
              
              {/* Hover effect */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                "-z-10"
              )} />
            </RouterLink>
          </Button>
        </motion.div>
      );
    }
  };

  return (
    <Card className={cn(
      "cyber-card border-primary/20 overflow-hidden transition-all duration-300",
      collapsed && "border-primary/10"
    )}>
      <div className={cn(
        "p-4 border-b border-primary/10 bg-primary/5",
        collapsed && "p-2"
      )}>
        <div className="flex items-center space-x-2">
          <Command className="h-5 w-5 text-primary" />
          {!collapsed && (
            <h2 className="font-heading text-primary">Admin Control</h2>
          )}
        </div>
      </div>
      
      <nav className={cn(
        "p-2",
        collapsed && "p-1"
      )}>
        <ul className="space-y-1">
          {adminNavigationItems.map(item => {
            // Skip if user doesn't have permission
            if (!hasPermission(item.permission as any)) return null;
            
            return (
              <li key={item.id}>
                {renderNavItem(item)}
              </li>
            );
          })}
        </ul>
      </nav>
    </Card>
  );
};
