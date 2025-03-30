
import React from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Palette,
  Settings,
  BarChart,
  Database,
  Star,
  ShieldCheck
} from 'lucide-react';

export interface AdminNavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  permission?: string;
  children?: AdminNavigationItem[];
}

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/admin/overview',
    permission: 'admin:access'
  },
  {
    id: 'users',
    label: 'Users',
    icon: <Users className="w-5 h-5" />,
    path: '/admin/users',
    permission: 'users:view'
  },
  {
    id: 'builds',
    label: 'Builds',
    icon: <Package className="w-5 h-5" />,
    path: '/admin/builds',
    permission: 'builds:view'
  },
  {
    id: 'reviews',
    label: 'Reviews',
    icon: <Star className="w-5 h-5" />,
    path: '/admin/reviews',
    permission: 'content:view'
  },
  {
    id: 'content',
    label: 'Content',
    icon: <FileText className="w-5 h-5" />,
    path: '/admin/content',
    permission: 'content:view'
  },
  {
    id: 'themes',
    label: 'Themes',
    icon: <Palette className="w-5 h-5" />,
    path: '/admin/themes',
    permission: 'themes:view'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart className="w-5 h-5" />,
    path: '/admin/analytics',
    permission: 'data:view'
  },
  {
    id: 'data',
    label: 'Data Maestro',
    icon: <Database className="w-5 h-5" />,
    path: '/admin/data',
    permission: 'data:view'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    path: '/admin/settings',
    permission: 'settings:view'
  },
  {
    id: 'permissions',
    label: 'Permissions',
    icon: <ShieldCheck className="w-5 h-5" />,
    path: '/admin/permissions',
    permission: 'super_admin:all'
  }
];

export function getNavigationItemById(id: string): AdminNavigationItem | undefined {
  return adminNavigationItems.find(item => item.id === id);
}

export function getNavigationItemByPath(path: string): AdminNavigationItem | undefined {
  return adminNavigationItems.find(item => item.path === path);
}
