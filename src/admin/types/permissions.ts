
import { PermissionValue } from '@/auth/permissions';

// Export admin permission value type
export type AdminPermissionValue = PermissionValue;

// Permission check function type
export type PermissionCheckFn = (permission: AdminPermissionValue) => boolean;
