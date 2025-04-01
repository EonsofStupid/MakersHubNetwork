
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Wrench,
  Palette,
  Server,
  Shield,
  LineChart,
  FileCode,
} from 'lucide-react';
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';

export const adminNavigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    permission: ADMIN_PERMISSIONS.ADMIN_ACCESS,
    section: 'General'
  },
  {
    id: 'users',
    label: 'Users',
    path: '/admin/users',
    icon: Users,
    permission: ADMIN_PERMISSIONS.USERS_VIEW,
    section: 'Management'
  },
  {
    id: 'builds',
    label: 'Builds',
    path: '/admin/builds',
    icon: Wrench,
    permission: ADMIN_PERMISSIONS.BUILDS_VIEW,
    section: 'Management'
  },
  {
    id: 'parts',
    label: 'Parts',
    path: '/admin/parts',
    icon: Wrench,
    permission: ADMIN_PERMISSIONS.CONTENT_VIEW,
    section: 'Management'
  },
  {
    id: 'content',
    label: 'Content',
    path: '/admin/content',
    icon: FileText,
    permission: ADMIN_PERMISSIONS.CONTENT_VIEW,
    section: 'Management'
  },
  {
    id: 'themes',
    label: 'Themes',
    path: '/admin/themes',
    icon: Palette,
    permission: ADMIN_PERMISSIONS.THEMES_VIEW,
    section: 'Customization'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/admin/analytics',
    icon: LineChart,
    permission: ADMIN_PERMISSIONS.ANALYTICS_VIEW,
    section: 'Insights'
  },
  {
    id: 'logs',
    label: 'System Logs',
    path: '/admin/logs',
    icon: FileCode,
    permission: ADMIN_PERMISSIONS.SYSTEM_LOGS,
    section: 'System'
  },
  {
    id: 'permissions',
    label: 'Permissions',
    path: '/admin/permissions',
    icon: Shield,
    permission: ADMIN_PERMISSIONS.SYSTEM_SETTINGS,
    section: 'System'
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    icon: Settings,
    permission: ADMIN_PERMISSIONS.SETTINGS_VIEW,
    section: 'System'
  }
];
