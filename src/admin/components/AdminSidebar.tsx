
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission, setCurrentSection } = useAdminStore();
  
  const adminNavigationItems = [
    { 
      id: "overview", 
      label: "Overview", 
      path: "/admin?tab=overview", 
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      permission: "admin:access" 
    },
    { 
      id: "content", 
      label: "Content", 
      path: "/admin?tab=content", 
      icon: <FileText className="h-4 w-4 mr-2" />,
      permission: "admin:content:read" 
    },
    { 
      id: "users", 
      label: "Users", 
      path: "/admin?tab=users", 
      icon: <Users className="h-4 w-4 mr-2" />,
      permission: "admin:users:read" 
    },
    { 
      id: "chat", 
      label: "Chat", 
      path: "/admin?tab=chat", 
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
      permission: "admin:access" 
    },
    { 
      id: "data-maestro", 
      label: "Data Maestro", 
      path: "/admin?tab=data-maestro", 
      icon: <Database className="h-4 w-4 mr-2" />,
      permission: "admin:access" 
    },
    { 
      id: "import", 
      label: "Import", 
      path: "/admin?tab=import", 
      icon: <Upload className="h-4 w-4 mr-2" />,
      permission: "admin:data:import" 
    },
    { 
      id: "settings", 
      label: "Settings", 
      path: "/admin?tab=settings", 
      icon: <Settings className="h-4 w-4 mr-2" />,
      permission: "admin:settings:read" 
    }
  ];

  // Parse current tab from URL
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || "overview";

  const handleNavigation = (item: typeof adminNavigationItems[0]) => {
    navigate(item.path);
    setCurrentSection(item.id);
  };

  return (
    <Card className="cyber-card border-primary/20 overflow-hidden">
      <div className="p-4 border-b border-primary/10 bg-primary/5">
        <div className="flex items-center space-x-2">
          <Command className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-primary">Admin Navigation</h2>
        </div>
      </div>
      
      <nav className="p-2">
        <ul className="space-y-1">
          {adminNavigationItems.map(item => {
            // Skip if user doesn't have permission
            if (!hasPermission(item.permission as any)) return null;
            
            const isActive = currentTab === item.id;
            
            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    isActive && "bg-primary/10 text-primary"
                  )}
                  onClick={() => handleNavigation(item)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </Card>
  );
};
