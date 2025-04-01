
// Re-export from central permissions file
import { PERMISSIONS, PermissionValue } from '@/auth/permissions';

// Re-export for backward compatibility
export const APP_PERMISSIONS = PERMISSIONS;
export type AppPermissionValue = PermissionValue;
