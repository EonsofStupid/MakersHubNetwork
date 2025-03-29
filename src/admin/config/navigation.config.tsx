
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
  Shield,
  MessageSquare,
  Star
} from "lucide-react";
import { AdminPermission } from "../types/admin.types";

export const adminNavigationItems = [
  { 
    id: "overview", 
    label: "Overview", 
    path: "/admin/overview", 
    icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    permission: "admin:access" as AdminPermission,
    description: "Dashboard overview of the platform"
  },
  { 
    id: "content", 
    label: "Content", 
    path: "/admin/content", 
    icon: <FileText className="h-4 w-4 mr-2" />,
    permission: "content:view" as AdminPermission,
    description: "Manage website content and pages" 
  },
  { 
    id: "users", 
    label: "Users", 
    path: "/admin/users", 
    icon: <Users className="h-4 w-4 mr-2" />,
    permission: "users:view" as AdminPermission,
    description: "Manage user accounts and permissions"
  },
  { 
    id: "builds", 
    label: "Builds", 
    path: "/admin/builds", 
    icon: <Package className="h-4 w-4 mr-2" />,
    permission: "builds:view" as AdminPermission,
    description: "View and manage user builds"
  },
  { 
    id: "reviews", 
    label: "Reviews", 
    path: "/admin/reviews", 
    icon: <MessageSquare className="h-4 w-4 mr-2" />,
    permission: "builds:view" as AdminPermission,
    description: "Manage build reviews and feedback"
  },
  { 
    id: "data-maestro", 
    label: "Data Maestro", 
    path: "/admin/data-maestro", 
    icon: <Database className="h-4 w-4 mr-2" />,
    permission: "data:view" as AdminPermission,
    description: "Advanced data management tools"
  },
  { 
    id: "analytics", 
    label: "Analytics", 
    path: "/admin/analytics", 
    icon: <BarChart className="h-4 w-4 mr-2" />,
    permission: "admin:access" as AdminPermission,
    description: "Platform usage statistics and trends"
  },
  { 
    id: "themes", 
    label: "Themes", 
    path: "/admin/themes", 
    icon: <PaintBucket className="h-4 w-4 mr-2" />,
    permission: "themes:view" as AdminPermission,
    description: "Customize platform appearance"
  },
  { 
    id: "permissions", 
    label: "Permissions", 
    path: "/admin/permissions", 
    icon: <Shield className="h-4 w-4 mr-2" />,
    permission: "super_admin:all" as AdminPermission,
    description: "Manage admin access levels and permissions"
  },
  { 
    id: "settings", 
    label: "Settings", 
    path: "/admin/settings", 
    icon: <Settings className="h-4 w-4 mr-2" />,
    permission: "settings:view" as AdminPermission,
    description: "Configure platform settings"
  },
  { 
    id: "featured", 
    label: "Featured", 
    path: "/admin/featured", 
    icon: <Star className="h-4 w-4 mr-2" />,
    permission: "content:view" as AdminPermission,
    description: "Manage featured content and promotions"
  }
];

// Define draggable navigation shortcuts for the top bar
export const defaultTopNavShortcuts = ["users", "builds", "reviews"]; 

// Define default dashboard shortcuts (larger icons)
export const defaultDashboardShortcuts = ["users", "content", "data-maestro", "settings"];
