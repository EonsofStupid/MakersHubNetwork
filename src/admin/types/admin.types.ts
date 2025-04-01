
import { AdminPermissionValue } from '@/admin/constants/permissions';

export type AdminPermission = AdminPermissionValue;

export interface AdminSyncOptions {
  autoSave?: boolean;
  interval?: number;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  permissions: AdminPermission[];
  roles?: string[];
  lastLogin?: string;
  createdAt: string;
  isActive: boolean;
}

export interface AdminSection {
  id: string;
  name: string;
  permissions?: AdminPermission[];
  isActive: boolean;
}

export interface AdminStats {
  totalUsers: number;
  newUsers: number;
  totalBuilds: number;
  pendingBuilds: number;
  recentActivity: number;
}

export interface AdminShortcut {
  id: string;
  name: string;
  path: string;
  icon: string;
  color?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface AdminPreferences {
  sidebarExpanded: boolean;
  showLabels: boolean;
  isDarkMode: boolean;
  dashboardItems: AdminShortcut[];
  shortcuts: AdminShortcut[];
  topnavItems: AdminShortcut[];
  recentViews: AdminShortcut[];
  frozenZones: string[];
  uiPreferences: Record<string, any>;
  themePreference: string;
  layoutPreference: string;
  activeSection: string;
}
