
import {
  Home,
  Users,
  FileText,
  Settings,
  Shell,
  Database,
  BarChart3,
  Paintbrush,
  Shield,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { AdminPermissionValue } from "../constants/permissions";
import React from "react";

export interface AdminNavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  section?: string;
  permission?: AdminPermissionValue;
  children?: AdminNavigationItem[];
}

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    id: "overview",
    label: "Overview",
    path: "/admin/overview",
    icon: Home,
    section: "General",
    permission: "admin:access",
  },
  {
    id: "users",
    label: "User Management",
    path: "/admin/users",
    icon: Users,
    section: "General",
    permission: "users:view",
  },
  {
    id: "builds",
    label: "Builds",
    path: "/admin/builds",
    icon: Shell,
    section: "Content",
    permission: "builds:view",
  },
  {
    id: "content",
    label: "Content",
    path: "/admin/content",
    icon: FileText,
    section: "Content",
    permission: "content:view",
  },
  {
    id: "data-maestro",
    label: "Data Maestro",
    path: "/admin/data-maestro",
    icon: Database,
    section: "Tools",
    permission: "data:view",
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
    section: "Tools",
    permission: "analytics:view",
  },
  {
    id: "messaging",
    label: "Messaging",
    path: "/admin/messaging",
    icon: MessageSquare,
    section: "Content",
    permission: "messaging:access",
  },
  {
    id: "themes",
    label: "Themes",
    path: "/admin/themes",
    icon: Paintbrush,
    section: "System",
    permission: "themes:view",
  },
  {
    id: "layouts",
    label: "Layouts",
    path: "/admin/layouts",
    icon: LayoutDashboard,
    section: "System",
    permission: "admin:edit",
  },
  {
    id: "permissions",
    label: "Permissions",
    path: "/admin/permissions",
    icon: Shield,
    section: "System",
    permission: "admin:manage",
  },
  {
    id: "settings",
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
    section: "System",
    permission: "settings:view",
  },
];
