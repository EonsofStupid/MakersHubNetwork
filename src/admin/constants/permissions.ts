
import { APP_PERMISSIONS } from '@/auth/constants/permissions';
import type { AdminPermissionValue } from '@/admin/types/permissions';

// Re-export all permissions from the central auth module to maintain type safety
export const ADMIN_PERMISSIONS = APP_PERMISSIONS;

// Type for permissions check functions
export type PermissionCheckFn = (permission: AdminPermissionValue) => boolean;
