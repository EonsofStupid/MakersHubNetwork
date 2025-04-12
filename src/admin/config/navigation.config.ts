
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  FileText, 
  Edit, 
  Box 
} from "lucide-react";
import { NavigationItemType } from "../types/navigation.types";
import { UserRole } from "@/shared/types/shared.types";

export const adminNavigation: NavigationItemType[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    requiredRole: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: User,
    requiredRole: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
  },
  {
    name: "Content",
    href: "/admin/content",
    icon: FileText,
    requiredRole: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR]
  },
  {
    name: "Editor",
    href: "/admin/editor",
    icon: Edit,
    requiredRole: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR]
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Box,
    requiredRole: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    requiredRole: [UserRole.SUPER_ADMIN]
  }
];
