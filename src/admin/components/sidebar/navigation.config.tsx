
import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Database, 
  Upload, 
  Settings,
  ChevronsRight
} from "lucide-react";
import { AdminPermission } from "@/admin/types/admin.types";

// Use a consistent style for all icons
const iconStyle = "h-4 w-4";

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactElement;
  permission: AdminPermission;
  description?: string;
  shortcutKey?: string;
}

export const adminNavigationItems: NavItem[] = [
  { 
    id: "overview", 
    label: "Overview", 
    path: "/admin/overview", 
    icon: <LayoutDashboard className={iconStyle} />,
    permission: "admin:access",
    description: "Dashboard overview and key metrics"
  },
  { 
    id: "content", 
    label: "Content", 
    path: "/admin/content", 
    icon: <FileText className={iconStyle} />,
    permission: "admin:content:read",
    description: "Manage website content and media"
  },
  { 
    id: "users", 
    label: "Users", 
    path: "/admin/users", 
    icon: <Users className={iconStyle} />,
    permission: "admin:users:read",
    description: "Manage user accounts and permissions"
  },
  { 
    id: "chat", 
    label: "Chat", 
    path: "/admin/chat", 
    icon: <MessageSquare className={iconStyle} />,
    permission: "admin:access",
    description: "View and manage chat interactions"
  },
  { 
    id: "data-maestro", 
    label: "Data Maestro", 
    path: "/admin/data-maestro", 
    icon: <Database className={iconStyle} />,
    permission: "admin:access",
    description: "Advanced data manipulation tools"
  },
  { 
    id: "import", 
    label: "Import", 
    path: "/admin/import", 
    icon: <Upload className={iconStyle} />,
    permission: "admin:data:import",
    description: "Import data from external sources"
  },
  { 
    id: "settings", 
    label: "Settings", 
    path: "/admin/settings", 
    icon: <Settings className={iconStyle} />,
    permission: "admin:settings:read",
    description: "Configure admin dashboard settings" 
  }
];
