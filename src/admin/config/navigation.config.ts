
import { LayoutDashboard, Users, Settings, FileText, Package, Palette, Database, BarChart, Star, LucideIcon } from 'lucide-react';
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';

interface AdminNavigationItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  permission?: string;
  section?: string;
}

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/admin/overview',
    icon: LayoutDashboard,
    permission: ADMIN_PERMISSIONS.ADMIN_VIEW,
    section: 'Dashboard'
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
    id: 'content',
    label: 'Content',
    path: '/admin/content',
    icon: FileText,
    permission: ADMIN_PERMISSIONS.CONTENT_VIEW,
    section: 'Management'
  },
  {
    id: 'builds',
    label: 'Builds',
    path: '/admin/builds',
    icon: Package,
    permission: ADMIN_PERMISSIONS.BUILDS_VIEW,
    section: 'Management'
  },
  {
    id: 'reviews',
    label: 'Reviews',
    path: '/admin/reviews',
    icon: Star,
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
    id: 'data',
    label: 'Data',
    path: '/admin/data',
    icon: Database,
    permission: ADMIN_PERMISSIONS.DATA_VIEW,
    section: 'System'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/admin/analytics',
    icon: BarChart,
    permission: ADMIN_PERMISSIONS.ANALYTICS_VIEW,
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

export default adminNavigationItems;
