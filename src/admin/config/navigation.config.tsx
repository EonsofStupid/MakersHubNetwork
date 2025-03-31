
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
import { AdminPermissions } from "../constants/permissions";

export const adminNavigationItems = [
  { 
    id: "overview", 
    label: "Overview", 
    path: "/admin/overview", 
    icon: LayoutDashboard,
    permission: AdminPermissions.ADMIN_ACCESS,
    description: "Dashboard overview of the platform"
  },
  { 
    id: "content", 
    label: "Content", 
    path: "/admin/content", 
    icon: FileText,
    permission: AdminPermissions.CONTENT_VIEW,
    description: "Manage website content and pages" 
  },
  { 
    id: "users", 
    label: "Users", 
    path: "/admin/users", 
    icon: Users,
    permission: AdminPermissions.USERS_VIEW,
    description: "Manage user accounts and permissions"
  },
  { 
    id: "builds", 
    label: "Builds", 
    path: "/admin/builds", 
    icon: Package,
    permission: AdminPermissions.BUILDS_VIEW,
    description: "View and manage user builds"
  },
  { 
    id: "reviews", 
    label: "Reviews", 
    path: "/admin/reviews", 
    icon: MessageSquare,
    permission: AdminPermissions.BUILDS_VIEW,
    description: "Manage build reviews and feedback"
  },
  { 
    id: "data-maestro", 
    label: "Data Maestro", 
    path: "/admin/data-maestro", 
    icon: Database,
    permission: AdminPermissions.DATA_VIEW,
    description: "Advanced data management tools"
  },
  { 
    id: "analytics", 
    label: "Analytics", 
    path: "/admin/analytics", 
    icon: BarChart,
    permission: AdminPermissions.ADMIN_ACCESS,
    description: "Platform usage statistics and trends"
  },
  { 
    id: "themes", 
    label: "Themes", 
    path: "/admin/themes", 
    icon: PaintBucket,
    permission: AdminPermissions.THEMES_VIEW,
    description: "Customize platform appearance"
  },
  { 
    id: "permissions", 
    label: "Permissions", 
    path: "/admin/permissions", 
    icon: Shield,
    permission: AdminPermissions.SUPER_ADMIN,
    description: "Manage admin access levels and permissions"
  },
  { 
    id: "settings", 
    label: "Settings", 
    path: "/admin/settings", 
    icon: Settings,
    permission: AdminPermissions.SETTINGS_VIEW,
    description: "Configure platform settings"
  },
  { 
    id: "featured", 
    label: "Featured", 
    path: "/admin/featured", 
    icon: Star,
    permission: AdminPermissions.CONTENT_VIEW,
    description: "Manage featured content and promotions"
  }
];

// Define draggable navigation shortcuts for the top bar
export const defaultTopNavShortcuts = ["users", "builds", "reviews"]; 

// Define default dashboard shortcuts (larger icons)
export const defaultDashboardShortcuts = ["content", "data-maestro", "themes", "settings"];
