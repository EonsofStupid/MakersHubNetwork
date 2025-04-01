
import { AdminPermissionValue } from './permissions';

// Define the type for admin permission
export type AdminPermission = AdminPermissionValue;

// Define interface for admin user
export interface AdminUser {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  roles: string[];
  permissions: AdminPermission[];
  isActive: boolean;
}

// Define interface for admin navigation item
export interface AdminNavigationItem {
  id: string;
  label: string;
  path: string;
  icon: any; // This should be a Lucide icon or similar
  permission?: AdminPermission;
  section?: string;
}

// Define interface for admin dashboard item
export interface AdminDashboardItem {
  id: string;
  title: string;
  type: 'chart' | 'stat' | 'list' | 'table' | 'custom';
  size: 'sm' | 'md' | 'lg';
  data?: any;
  component?: React.ComponentType<any>;
}

// Define interface for admin notification
export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  level: 'info' | 'warning' | 'error' | 'success';
  link?: string;
}
