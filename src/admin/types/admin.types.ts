
// Define admin permissions
export type AdminPermission = 
  | 'admin:access' 
  | 'admin:view' 
  | 'admin:edit' 
  | 'content:view' 
  | 'content:edit' 
  | 'content:delete' 
  | 'users:view' 
  | 'users:edit' 
  | 'users:delete' 
  | 'builds:view' 
  | 'builds:approve' 
  | 'builds:reject' 
  | 'themes:view' 
  | 'themes:edit' 
  | 'themes:delete' 
  | 'data:view'
  | 'settings:view'
  | 'super_admin:all';

// Admin section for navigation
export interface AdminSection {
  id: string;
  label: string;
  path: string;
  icon: string;
  permission: AdminPermission;
}

// Frozen zone for drag-and-drop functionality
export interface FrozenZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
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
