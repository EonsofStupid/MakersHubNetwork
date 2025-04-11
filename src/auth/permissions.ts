
// Central permissions definition file
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';

// Define all permissions used in the application
export const PERMISSIONS = {
  // Re-export admin permissions
  ...ADMIN_PERMISSIONS,
  
  // User permissions
  USER_PROFILE_READ: 'user:profile:read',
  USER_PROFILE_WRITE: 'user:profile:write',
  
  // Add other permission categories as needed
};

export type PermissionValue = keyof typeof PERMISSIONS | string;
