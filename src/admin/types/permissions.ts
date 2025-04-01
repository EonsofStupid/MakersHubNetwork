
import { AppPermissionValue } from '@/auth/constants/permissions';
import { AdminPermissionValue as AdminPermValue } from '@/admin/constants/permissions';

// Re-export the type for backward compatibility but point to the local definition
export type AdminPermissionValue = AdminPermValue;

// Extend with any admin-specific permission types if needed
export interface AdminPermissionContext {
  scope: string;
  resource: string;
}

// Function to check permissions
export type AdminPermissionCheckFn = (permission: AdminPermissionValue) => boolean;

