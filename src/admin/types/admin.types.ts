
// Import the standard permission value type
import { AdminPermissionValue } from '@/admin/constants/permissions';

// Make AdminPermission a type alias to AdminPermissionValue for consistency
export type AdminPermission = AdminPermissionValue;

// Admin section for navigation
export interface AdminSection {
  id: string;
  label: string;
  path: string;
  icon: string;
  permission: AdminPermission;
}

// Admin overlay configuration
export interface AdminOverlayConfig {
  id: string;
  title: string;
  description?: string;
  position: { x: number, y: number };
  size: { width: number, height: number };
  isOpen: boolean;
}

// Admin UI theme configuration
export interface AdminThemeConfig {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  isDark: boolean;
}

// User data interface for admin views
export interface AdminUserData {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  joinedAt: string;
  lastActive?: string;
}

// Admin shortcuts for dashboard
export interface AdminShortcut {
  id: string;
  name: string;
  icon: string;
  path: string;
  permission: AdminPermission;
  color: string;
}

// Admin preferences for user-specific settings
export interface AdminPreferences {
  sidebarExpanded: boolean;
  dashboardLayout: string[];
  pinnedTools: string[];
  theme: string;
  activeSection: string;
}
