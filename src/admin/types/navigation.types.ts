
import { LucideIcon } from "lucide-react";
import { UserRole } from "@/shared/types/shared.types";

export interface NavigationItemType {
  name: string;
  href: string;
  icon: LucideIcon;
  requiredRole?: UserRole | UserRole[];
}
