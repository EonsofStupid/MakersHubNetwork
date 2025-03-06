
import React from "react";
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
  Command
} from "lucide-react";
import { Link } from '@tanstack/react-router';

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
      return currentPath === item.path;
    } else {
      return currentTab === item.id;
    }
  };

  const handleNavigation = (item: typeof adminNavigationItems[0]) => {
    setCurrentSection(item.id);
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
            <h2 className="font-heading text-primary">Admin Navigation</h2>
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
            
            const isActive = isItemActive(item);
            
            return (
              <li key={item.id}>
                {useTanStackRouter ? (
                  <Link
                    to={item.path}
                    onClick={() => handleNavigation(item)}
                    className={cn(
                      "flex w-full items-center px-3 py-2 rounded-md text-sm font-normal transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/5",
                      collapsed && "px-2 py-2 justify-center"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={collapsed ? "mr-0" : "mr-2"}>
                      {React.cloneElement(item.icon as React.ReactElement, {
                        className: `h-4 w-4 ${collapsed ? "" : "mr-2"}`
                      })}
                    </span>
                    {!collapsed && item.label}
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      isActive && "bg-primary/10 text-primary",
                      collapsed && "px-2 py-2"
                    )}
                    asChild
                    title={collapsed ? item.label : undefined}
                  >
                    <a href={item.legacyPath} onClick={() => handleNavigation(item)}>
                      <span className={collapsed ? "mr-0" : "mr-2"}>
                        {React.cloneElement(item.icon as React.ReactElement, {
                          className: `h-4 w-4 ${collapsed ? "" : "mr-2"}`
                        })}
                      </span>
                      {!collapsed && item.label}
                    </a>
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </Card>
  );
};
