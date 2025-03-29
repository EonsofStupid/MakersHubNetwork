
import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Package,
  Database, 
  BarChart,
  PaintBucket,
  Settings,
  Shield
} from "lucide-react";
import { AdminPermission } from "@/admin/types/admin.types";

export const adminNavigationItems = [
  { 
    id: "overview", 
    label: "Overview", 
    path: "/admin/overview", 
    icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    permission: "admin:access" as AdminPermission
  },
  { 
    id: "content", 
    label: "Content", 
    path: "/admin/content", 
    icon: <FileText className="h-4 w-4 mr-2" />,
    permission: "content:view" as AdminPermission 
  },
  { 
    id: "users", 
    label: "Users", 
    path: "/admin/users", 
    icon: <Users className="h-4 w-4 mr-2" />,
    permission: "users:view" as AdminPermission
  },
  { 
    id: "builds", 
    label: "Builds", 
    path: "/admin/builds", 
    icon: <Package className="h-4 w-4 mr-2" />,
    permission: "builds:view" as AdminPermission
  },
  { 
    id: "data-maestro", 
    label: "Data Maestro", 
    path: "/admin/data-maestro", 
    icon: <Database className="h-4 w-4 mr-2" />,
    permission: "data:view" as AdminPermission
  },
  { 
    id: "analytics", 
    label: "Analytics", 
    path: "/admin/analytics", 
    icon: <BarChart className="h-4 w-4 mr-2" />,
    permission: "admin:access" as AdminPermission
  },
  { 
    id: "themes", 
    label: "Themes", 
    path: "/admin/themes", 
    icon: <PaintBucket className="h-4 w-4 mr-2" />,
    permission: "themes:view" as AdminPermission
  },
  { 
    id: "permissions", 
    label: "Permissions", 
    path: "/admin/permissions", 
    icon: <Shield className="h-4 w-4 mr-2" />,
    permission: "super_admin:all" as AdminPermission
  },
  { 
    id: "settings", 
    label: "Settings", 
    path: "/admin/settings", 
    icon: <Settings className="h-4 w-4 mr-2" />,
    permission: "settings:view" as AdminPermission
  }
];
