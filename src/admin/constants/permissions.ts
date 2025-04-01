
import { APP_PERMISSIONS } from '@/auth/constants/permissions';

// Re-export all permissions from the central auth module to maintain type safety
export const ADMIN_PERMISSIONS = APP_PERMISSIONS;

// Type for permissions check functions
export type PermissionCheckFn = (permission: AppPermissionValue) => boolean;

// Import the type to avoid issues
import { AdminPermissionValue } from '@/admin/types/permissions';
