
import {
  Home,
  Settings,
  Users,
  FileText,
  Boxes,
  ThumbsUp,
  PaintBucket,
  Activity,
  Database,
  Bot
} from 'lucide-react';
import { UserRoleEnum } from '@/shared/types/shared.types';

// Define the admin navigation structure
export const adminNavigation = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/admin',
    icon: Home,
    section: 'main',
    requiredRole: UserRoleEnum.ADMIN
  },
  {
    id: 'builds',
    label: 'Builds',
    path: '/admin/builds',
    icon: Boxes,
    section: 'main',
    requiredRole: UserRoleEnum.ADMIN
  },
  {
    id: 'reviews',
    label: 'Reviews',
    path: '/admin/reviews',
    icon: ThumbsUp,
    section: 'main',
    requiredRole: UserRoleEnum.ADMIN
  },
  {
    id: 'content',
    label: 'Content',
    path: '/admin/content',
    icon: FileText,
    section: 'main',
    requiredRole: UserRoleEnum.ADMIN
  },
  {
    id: 'users',
    label: 'Users',
    path: '/admin/users',
    icon: Users,
    section: 'main',
    requiredRole: UserRoleEnum.ADMIN
  },
  {
    id: 'theme',
    label: 'Themes',
    path: '/admin/themes',
    icon: PaintBucket,
    section: 'system',
    requiredRole: UserRoleEnum.ADMIN
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/admin/analytics',
    icon: Activity,
    section: 'system',
    requiredRole: UserRoleEnum.ADMIN
  },
  {
    id: 'data',
    label: 'Data Maestro',
    path: '/admin/data',
    icon: Database,
    section: 'system',
    requiredRole: UserRoleEnum.ADMIN
  },
  {
    id: 'chat',
    label: 'Chat',
    path: '/admin/chat',
    icon: Bot,
    section: 'system',
    requiredRole: UserRoleEnum.ADMIN
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    icon: Settings,
    section: 'system',
    requiredRole: UserRoleEnum.ADMIN
  },
];

// Helper to get navigation items by section
export const getNavigationBySection = (section: string) => {
  return adminNavigation.filter(item => item.section === section);
};

// Helper to get a navigation item by id
export const getNavigationById = (id: string) => {
  return adminNavigation.find(item => item.id === id);
};
