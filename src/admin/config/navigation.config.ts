
import { 
  Users, Settings, LayoutDashboard, Package, 
  FileText, Database, Paintbrush, Shield, BarChart, 
  LucideIcon
} from "lucide-react";
import { AdminPermissionValue } from "@/admin/constants/permissions";

export interface AdminNavigationItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  section?: string;
  permission?: AdminPermissionValue;
  description?: string;
}

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    id: "overview",
    label: "Dashboard",
    path: "/admin/overview",
    icon: LayoutDashboard,
    section: "Main",
    description: "Dashboard overview and stats"
  },
  {
    id: "users",
    label: "Users",
    path: "/admin/users",
    icon: Users,
    section: "Main",
    permission: "users:view",
    description: "Manage user accounts"
  },
  {
    id: "builds",
    label: "Builds",
    path: "/admin/builds",
    icon: Package,
    section: "Main",
    permission: "builds:view",
    description: "Review printer builds"
  },
  {
    id: "content",
    label: "Content",
    path: "/admin/content",
    icon: FileText,
    section: "Management",
    permission: "content:view",
    description: "Manage site content"
  },
  {
    id: "data-maestro",
    label: "Data Maestro",
    path: "/admin/data-maestro",
    icon: Database,
    section: "Management",
    permission: "admin:view",
    description: "Database management tools"
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/admin/analytics",
    icon: BarChart,
    section: "Insights",
    description: "View site analytics"
  },
  {
    id: "themes",
    label: "Themes",
    path: "/admin/themes",
    icon: Paintbrush,
    section: "Settings",
    permission: "themes:view",
    description: "Customize site appearance"
  },
  {
    id: "permissions",
    label: "Permissions",
    path: "/admin/permissions",
    icon: Shield,
    section: "Settings",
    permission: "admin:edit",
    description: "Manage user permissions"
  },
  {
    id: "settings",
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
    section: "Settings",
    description: "Configure system settings"
  }
];
