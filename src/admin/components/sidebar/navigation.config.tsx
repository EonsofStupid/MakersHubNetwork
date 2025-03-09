
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
