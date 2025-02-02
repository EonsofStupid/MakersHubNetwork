export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

export const mainNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard'
  },
  {
    id: 'data-maestro',
    label: 'Data Maestro',
    path: '/admin/data-maestro'
  },
  {
    id: 'content',
    label: 'Content',
    path: '/admin/content-management'
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings'
  }
];

export const adminRoutes = {
  dashboard: '/admin/dashboard',
  dataMaestro: '/admin/data-maestro',
  content: '/admin/content-management',
  settings: '/admin/settings',
  users: '/admin/users',
  posts: '/admin/posts',
  categories: '/admin/content-management/categories',
  templates: '/admin/content-management/templates',
  workflows: '/admin/content-management/workflows',
  media: '/admin/media',
  activityLogs: '/admin/activity-logs',
  analytics: '/admin/analytics'
};