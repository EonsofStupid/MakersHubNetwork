
import { PERMISSIONS, PermissionValue, ROLE_PERMISSIONS } from '@/auth/permissions';

// Re-export the permissions for backward compatibility
export const ADMIN_PERMISSIONS = PERMISSIONS;

// Re-export the role permissions
export { ROLE_PERMISSIONS };

// Export the admin permission value type
export type AdminPermissionValue = PermissionValue;
