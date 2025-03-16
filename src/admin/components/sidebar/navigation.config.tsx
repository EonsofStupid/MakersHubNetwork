
import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Database, 
  Upload, 
  Settings
} from "lucide-react";

// Use a consistent style for all icons
const iconStyle = "h-4 w-4";

export const adminNavigationItems = [
  { 
    id: "overview", 
    label: "Overview", 
    path: "/admin/overview", 
    icon: <LayoutDashboard className={iconStyle} />,
    permission: "admin:access" 
  },
  { 
    id: "content", 
    label: "Content", 
    path: "/admin/content", 
    icon: <FileText className={iconStyle} />,
    permission: "admin:content:read" 
  },
  { 
    id: "users", 
    label: "Users", 
    path: "/admin/users", 
    icon: <Users className={iconStyle} />,
    permission: "admin:users:read" 
  },
  { 
    id: "chat", 
    label: "Chat", 
    path: "/admin/chat", 
    icon: <MessageSquare className={iconStyle} />,
    permission: "admin:access" 
  },
  { 
    id: "data-maestro", 
    label: "Data Maestro", 
    path: "/admin/data-maestro", 
    icon: <Database className={iconStyle} />,
    permission: "admin:access" 
  },
  { 
    id: "import", 
    label: "Import", 
    path: "/admin/import", 
    icon: <Upload className={iconStyle} />,
    permission: "admin:data:import" 
  },
  { 
    id: "settings", 
    label: "Settings", 
    path: "/admin/settings", 
    icon: <Settings className={iconStyle} />,
    permission: "admin:settings:read" 
  }
];
