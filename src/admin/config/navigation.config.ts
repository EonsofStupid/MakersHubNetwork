
import { AdminSection } from '@/admin/types/admin.types';

/**
 * Admin navigation configuration
 * Defines the sidebar navigation structure and required permissions
 */
export const adminNavigation: AdminSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/admin/overview',
    icon: 'LayoutDashboard',
    permission: 'admin:access'
  },
  {
    id: 'users',
    label: 'User Management',
    path: '/admin/users',
    icon: 'Users',
    permission: 'users:view'
  },
  {
    id: 'content',
    label: 'Content',
    path: '/admin/content',
    icon: 'FileText',
    permission: 'content:view'
  },
  {
    id: 'builds',
    label: 'Build Approvals',
    path: '/admin/builds',
    icon: 'Package',
    permission: 'builds:view'
  },
  {
    id: 'themes',
    label: 'Theme Settings',
    path: '/admin/themes',
    icon: 'PaintBucket',
    permission: 'themes:view'
  },
  {
    id: 'data-maestro',
    label: 'Data Maestro',
    path: '/admin/data-maestro',
    icon: 'Database',
    permission: 'admin:access'
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    icon: 'Settings',
    permission: 'admin:access'
  }
];
