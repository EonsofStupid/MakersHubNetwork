
import { PermissionValue } from "@/auth/permissions";

// Re-export the core permission type
export type AdminPermissionValue = PermissionValue;

// Optional: Define admin-specific permission interfaces if needed
export interface AdminPermission {
  value: AdminPermissionValue;
  displayName: string;
  description?: string;
}
