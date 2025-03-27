
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/admin/store/admin.store";
import { 
  Home, 
  Users, 
  Settings, 
  FileText,
  Database,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  const navigate = useNavigate();
  const { activeSection } = useAdminStore();
  
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, path: "/admin/overview" },
    { id: "content", label: "Content", icon: FileText, path: "/admin/content" },
    { id: "users", label: "Users", icon: Users, path: "/admin/users" },
    { id: "data-maestro", label: "Data Maestro", icon: Database, path: "/admin/data-maestro" },
    { id: "import", label: "Import", icon: Package, path: "/admin/import" },
    { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
  ];
  
  return (
    <aside className={cn(
      "bg-card/40 backdrop-blur-md",
      "border border-border/30 rounded-lg",
      "p-4"
    )}>
      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left h-10",
                isActive && "bg-primary/10 text-primary"
              )}
              onClick={() => navigate(item.path)}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
