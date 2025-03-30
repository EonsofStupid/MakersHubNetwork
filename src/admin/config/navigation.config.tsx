
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
    icon: LayoutDashboard,
    permission: "admin:access" as AdminPermission,
    description: "Dashboard overview of the platform"
  },
  { 
    id: "content", 
    label: "Content", 
    path: "/admin/content", 
    icon: FileText,
    permission: "content:view" as AdminPermission,
    description: "Manage website content and pages" 
  },
  { 
    id: "users", 
    label: "Users", 
    path: "/admin/users", 
    icon: Users,
    permission: "users:view" as AdminPermission,
    description: "Manage user accounts and permissions"
  },
  { 
    id: "builds", 
    label: "Builds", 
    path: "/admin/builds", 
    icon: Package,
    permission: "builds:view" as AdminPermission,
    description: "View and manage user builds"
  },
  { 
    id: "reviews", 
    label: "Reviews", 
    path: "/admin/reviews", 
    icon: MessageSquare,
    permission: "builds:view" as AdminPermission,
    description: "Manage build reviews and feedback"
  },
  { 
    id: "data-maestro", 
    label: "Data Maestro", 
    path: "/admin/data-maestro", 
    icon: Database,
    permission: "data:view" as AdminPermission,
    description: "Advanced data management tools"
  },
  { 
    id: "analytics", 
    label: "Analytics", 
    path: "/admin/analytics", 
    icon: BarChart,
    permission: "admin:access" as AdminPermission,
    description: "Platform usage statistics and trends"
  },
  { 
    id: "themes", 
    label: "Themes", 
    path: "/admin/themes", 
    icon: PaintBucket,
    permission: "themes:view" as AdminPermission,
    description: "Customize platform appearance"
  },
  { 
    id: "permissions", 
    label: "Permissions", 
    path: "/admin/permissions", 
    icon: Shield,
    permission: "super_admin:all" as AdminPermission,
    description: "Manage admin access levels and permissions"
  },
  { 
    id: "settings", 
    label: "Settings", 
    path: "/admin/settings", 
    icon: Settings,
    permission: "settings:view" as AdminPermission,
    description: "Configure platform settings"
  },
  { 
    id: "featured", 
    label: "Featured", 
    path: "/admin/featured", 
    icon: Star,
    permission: "content:view" as AdminPermission,
    description: "Manage featured content and promotions"
  }
];

// Define draggable navigation shortcuts for the top bar
export const defaultTopNavShortcuts = ["users", "builds", "reviews"]; 

// Define default dashboard shortcuts (larger icons)
export const defaultDashboardShortcuts = ["content", "data-maestro", "themes", "settings"];
