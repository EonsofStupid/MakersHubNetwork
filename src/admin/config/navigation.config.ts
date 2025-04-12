
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
    requiredRole: ["admin", "super_admin"]
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: User,
    requiredRole: ["admin", "super_admin"]
  },
  {
    name: "Content",
    href: "/admin/content",
    icon: FileText,
    requiredRole: ["admin", "super_admin", "editor"]
  },
  {
    name: "Editor",
    href: "/admin/editor",
    icon: Edit,
    requiredRole: ["admin", "super_admin", "editor"]
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Box,
    requiredRole: ["admin", "super_admin"]
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    requiredRole: ["super_admin"]
  }
];
