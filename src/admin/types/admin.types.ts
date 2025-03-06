
import { UserRole } from "@/types/auth.types";

/**
 * Admin Module Permission Types
 */
export type AdminPermission = 
  | 'admin:access'               // Base admin access
  | 'admin:users:read'           // View user data
  | 'admin:users:write'          // Modify user data
  | 'admin:users:delete'         // Delete users
  | 'admin:users:roles'          // Manage user roles
  | 'admin:content:read'         // View content
  | 'admin:content:write'        // Create/edit content
  | 'admin:content:delete'       // Delete content
  | 'admin:content:publish'      // Publish content
  | 'admin:settings:read'        // View settings
  | 'admin:settings:write'       // Modify settings
  | 'admin:data:import'          // Import data
  | 'admin:data:export';         // Export data

/**
 * Admin Access Level Definition
 */
export interface AdminAccessLevel {
  level: number;
  name: string;
  description: string;
  roles: UserRole[];
  permissions: AdminPermission[];
}

/**
 * Admin Module State
 */
export interface AdminState {
  isLoadingPermissions: boolean;
  permissions: AdminPermission[];
  accessLevels: AdminAccessLevel[];
  currentSection: string | null;
}

/**
 * Admin Tab Configuration
 */
export interface AdminTabConfig {
  id: string;
  label: string;
  requiresPermission: AdminPermission;
  order: number;
  icon?: string;
}

/**
 * Admin Feature Configuration
 */
export interface AdminFeatureConfig {
  id: string;
  name: string;
  description: string;
  icon?: string;
  requiresPermission: AdminPermission;
  enabled: boolean;
}

/**
 * Admin Module Error State
 */
export interface AdminError {
  code: string;
  message: string;
  context?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Admin Dashboard Shortcut
 */
export interface AdminShortcut {
  id: string;
  label: string;
  icon: string;
  path: string;
  permission?: AdminPermission;
  color?: string;
}
