
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Package, 
  FileText, 
  BarChart, 
  ShieldAlert,
  Bell,
  Heart,
  Database,
  Code,
  Briefcase,
  MessageSquare,
  Star,
  Map,
  Palette,
  LucideIcon
} from 'lucide-react';
import { ADMIN_PERMISSIONS } from '../constants/permissions';

export interface AdminNavigationItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  section?: string;
  permission?: string;
}

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/admin/overview',
    icon: LayoutDashboard,
    section: 'General'
  },
  {
    id: 'users',
    label: 'Users',
    path: '/admin/users',
    icon: Users,
    section: 'General',
    permission: ADMIN_PERMISSIONS.USERS_VIEW
  },
  {
    id: 'builds',
    label: 'Builds',
    path: '/admin/builds',
    icon: Package,
    section: 'Content',
    permission: ADMIN_PERMISSIONS.BUILDS_VIEW
  },
  {
    id: 'reviews',
    label: 'Reviews',
    path: '/admin/reviews',
    icon: Star,
    section: 'Content',
    permission: ADMIN_PERMISSIONS.REVIEWS_VIEW
  },
  {
    id: 'content',
    label: 'Content',
    path: '/admin/content',
    icon: FileText,
    section: 'Content',
    permission: ADMIN_PERMISSIONS.CONTENT_VIEW
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/admin/analytics',
    icon: BarChart,
    section: 'Reports'
  },
  {
    id: 'security',
    label: 'Security',
    path: '/admin/security',
    icon: ShieldAlert,
    section: 'Settings',
    permission: ADMIN_PERMISSIONS.ADMIN_VIEW
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    icon: Settings,
    section: 'Settings',
    permission: ADMIN_PERMISSIONS.SYSTEM_SETTINGS
  },
  {
    id: 'themes',
    label: 'Themes',
    path: '/admin/themes',
    icon: Palette,
    section: 'Settings',
    permission: ADMIN_PERMISSIONS.THEMES_VIEW
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/admin/notifications',
    icon: Bell,
    section: 'Communication'
  },
  {
    id: 'community',
    label: 'Community',
    path: '/admin/community',
    icon: Heart,
    section: 'Communication'
  },
  {
    id: 'database',
    label: 'Database',
    path: '/admin/database',
    icon: Database,
    section: 'Developer',
    permission: ADMIN_PERMISSIONS.DATA_VIEW
  },
  {
    id: 'code',
    label: 'Code',
    path: '/admin/code',
    icon: Code,
    section: 'Developer',
    permission: ADMIN_PERMISSIONS.DATA_VIEW
  },
  {
    id: 'messages',
    label: 'Messages',
    path: '/admin/messages',
    icon: MessageSquare,
    section: 'Communication'
  }
];
