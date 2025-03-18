
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

export const adminNavigationItems = [
  { 
    id: "overview", 
    label: "Overview", 
    path: "/admin/overview", 
    icon: <LayoutDashboard className="h-4 w-4" />,
    permission: "admin:access" 
  },
  { 
    id: "content", 
    label: "Content", 
    path: "/admin/content", 
    icon: <FileText className="h-4 w-4" />,
    permission: "admin:content:read" 
  },
  { 
    id: "users", 
    label: "Users", 
    path: "/admin/users", 
    icon: <Users className="h-4 w-4" />,
    permission: "admin:users:read" 
  },
  { 
    id: "chat", 
    label: "Chat", 
    path: "/admin/chat", 
    icon: <MessageSquare className="h-4 w-4" />,
    permission: "admin:access" 
  },
  { 
    id: "data-maestro", 
    label: "Data Maestro", 
    path: "/admin/data-maestro", 
    icon: <Database className="h-4 w-4" />,
    permission: "admin:access" 
  },
  { 
    id: "import", 
    label: "Import", 
    path: "/admin/import", 
    icon: <Upload className="h-4 w-4" />,
    permission: "admin:data:import" 
  },
  { 
    id: "settings", 
    label: "Settings", 
    path: "/admin/settings", 
    icon: <Settings className="h-4 w-4" />,
    permission: "admin:settings:read" 
  }
];
