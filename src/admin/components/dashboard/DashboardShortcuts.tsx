
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AdminShortcut } from "@/admin/types/admin.types";
import { useAdminStore } from "@/admin/store/admin.store";

export function DashboardShortcuts() {
  const navigate = useNavigate();
  const { hasPermission } = useAdminStore();

  // Define admin shortcuts
  const shortcuts: AdminShortcut[] = [
    {
      id: "users",
      label: "User Management",
      icon: "👥",
      path: "/admin/users",
      permission: "admin:users:read",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    {
      id: "content",
      label: "Content",
      icon: "📝",
      path: "/admin/content",
      permission: "admin:content:read",
      color: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    {
      id: "data-maestro",
      label: "Data Maestro",
      icon: "🔍",
      path: "/admin/data-maestro",
      permission: "admin:access",
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      path: "/admin/settings",
      permission: "admin:settings:read",
      color: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    },
    {
      id: "import",
      label: "Import/Export",
      icon: "📤",
      path: "/admin/import",
      permission: "admin:data:import",
      color: "bg-pink-500/10 text-pink-500 border-pink-500/20"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "📊",
      path: "/admin/analytics",
      permission: "admin:access",
      color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {shortcuts.map((shortcut) => {
        // Skip if user doesn't have required permission
        if (!hasPermission(shortcut.permission)) return null;
        
        return (
          <Card 
            key={shortcut.id}
            className={cn(
              "p-4 cursor-pointer hover:shadow-md transition-all duration-300 border border-primary/20",
              "hover:border-primary/40 hover:scale-105",
              shortcut.color
            )}
            onClick={() => handleNavigate(shortcut.path)}
          >
            <div className="text-center space-y-2">
              <div className="text-2xl mx-auto">{shortcut.icon}</div>
              <h3 className="text-sm font-medium">{shortcut.label}</h3>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
