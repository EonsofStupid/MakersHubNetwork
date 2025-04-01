
import { AppPermissionValue } from '@/auth/constants/permissions';

// Re-export the type for backward compatibility but point to the central permission system
export type AdminPermissionValue = AppPermissionValue;

// Extend with any admin-specific permission types if needed
export interface AdminPermissionContext {
  scope: string;
  resource: string;
}

// Function to check permissions
export type AdminPermissionCheckFn = (permission: AdminPermissionValue) => boolean;
