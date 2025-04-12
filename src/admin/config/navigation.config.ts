
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileStack, 
  PaintBucket,
  BarChart3,
  MessageSquare,
  FileJson,
  AlertCircle,
  Database
} from 'lucide-react';
import { UserRole } from '@/shared/types/shared.types';
import { NavigationItemType } from '../types/navigation.types';

export const navigationItems: NavigationItemType[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    requiredRole: UserRole.ADMIN,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    requiredRole: UserRole.ADMIN,
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: FileStack,
    requiredRole: UserRole.ADMIN,
  },
  {
    name: 'Builds',
    href: '/admin/builds',
    icon: FileJson,
    requiredRole: UserRole.ADMIN,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    requiredRole: UserRole.ADMIN,
  },
  {
    name: 'Themes',
    href: '/admin/themes',
    icon: PaintBucket,
    requiredRole: UserRole.SUPERADMIN,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    requiredRole: UserRole.ADMIN,
  },
  {
    name: 'Chat Management',
    href: '/admin/chat',
    icon: MessageSquare,
    requiredRole: UserRole.ADMIN,
  },
  {
    name: 'Logs',
    href: '/admin/logs',
    icon: AlertCircle,
    requiredRole: UserRole.SUPERADMIN,
  },
  {
    name: 'Data Management',
    href: '/admin/data',
    icon: Database,
    requiredRole: UserRole.SUPERADMIN,
  },
];
