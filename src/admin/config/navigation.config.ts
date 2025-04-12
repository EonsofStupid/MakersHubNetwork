
import { LayoutDashboard, Users, FileText, Settings, Palette, Bell } from "lucide-react";
import { ADMIN_PERMISSIONS } from "../constants/permissions";
import { NavigationItemType } from "@/shared/types/shared.types";

export const adminNavigation: NavigationItemType[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    requiredRole: ["admin", "super_admin"],
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    requiredRole: ["admin", "super_admin"],
  },
  {
    name: "Content",
    href: "/admin/content",
    icon: FileText,
    requiredRole: ["admin", "super_admin", "moderator"],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    requiredRole: ["admin", "super_admin"],
  },
  {
    name: "Themes",
    href: "/admin/themes",
    icon: Palette,
    requiredRole: ["admin", "super_admin"],
  },
  {
    name: "Logs",
    href: "/admin/logs",
    icon: Bell,
    requiredRole: ["admin", "super_admin"],
  },
];

export const adminActions = [
  {
    id: "view-dashboard",
    title: "View Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    permission: ADMIN_PERMISSIONS.ADMIN_VIEW,
  },
  {
    id: "manage-users",
    title: "Manage Users",
    icon: Users,
    href: "/admin/users",
    permission: ADMIN_PERMISSIONS.MANAGE_USERS,
  },
  {
    id: "manage-content",
    title: "Manage Content",
    icon: FileText,
    href: "/admin/content",
    permission: ADMIN_PERMISSIONS.MANAGE_CONTENT,
  },
];
