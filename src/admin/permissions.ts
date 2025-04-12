
/**
 * Extended admin permissions based on the core ADMIN_PERMISSIONS
 */
import { ADMIN_PERMISSIONS } from './constants/permissions';

export const ADMIN_VIEW_PERMISSIONS = {
  ...ADMIN_PERMISSIONS,
  ADMIN_VIEW: 'admin_view',
  ADMIN_ACCESS: 'admin_access',
  ADMIN_EDIT: 'admin_edit',
  USERS_VIEW: 'users_view',
  USERS_EDIT: 'users_edit',
  BUILDS_VIEW: 'builds_view',
  BUILDS_EDIT: 'builds_edit',
  CONTENT_VIEW: 'content_view',
  CONTENT_EDIT: 'content_edit',
  THEMES_VIEW: 'themes_view',
  THEMES_EDIT: 'themes_edit',
  ANALYTICS_VIEW: 'analytics_view',
  SYSTEM_LOGS: 'system_logs',
  SYSTEM_SETTINGS: 'system_settings',
  SETTINGS_VIEW: 'settings_view',
  SETTINGS_EDIT: 'settings_edit',
  DATA_VIEW: 'data_view',
  DATA_EDIT: 'data_edit',
};

export type AdminPermission = keyof typeof ADMIN_VIEW_PERMISSIONS;
