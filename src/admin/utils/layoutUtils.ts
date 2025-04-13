
import { v4 as uuidv4 } from 'uuid';
import { Layout } from '@/admin/hooks/useLayoutSkeleton';

/**
 * Creates a default dashboard layout
 */
export function createDefaultDashboardLayout(id: string): Layout {
  return {
    id,
    name: 'Default Dashboard',
    type: 'dashboard',
    scope: 'admin',
    components: [
      {
        id: uuidv4(),
        type: 'AdminSection',
        props: {
          title: 'Dashboard Overview',
          className: 'mb-6'
        },
        children: [
          {
            id: uuidv4(),
            type: 'StatsCards',
            props: {}
          }
        ]
      },
      {
        id: uuidv4(),
        type: 'AdminGrid',
        props: {
          columns: 2,
          gap: 6
        },
        children: [
          {
            id: uuidv4(),
            type: 'AdminSection',
            props: {
              title: 'Recent Activity'
            },
            children: []
          },
          {
            id: uuidv4(),
            type: 'AdminSection',
            props: {
              title: 'Quick Actions'
            },
            children: []
          }
        ]
      }
    ],
    version: 1
  };
}

/**
 * Creates a default sidebar layout
 */
export function createDefaultSidebarLayout(id: string): Layout {
  return {
    id,
    name: 'Default Sidebar',
    type: 'sidebar',
    scope: 'admin',
    components: [
      {
        id: uuidv4(),
        type: 'AdminSidebar',
        props: {}
      }
    ],
    version: 1
  };
}

/**
 * Creates a default top navigation layout
 */
export function createDefaultTopNavLayout(id: string): Layout {
  return {
    id,
    name: 'Default TopNav',
    type: 'topnav',
    scope: 'admin',
    components: [
      {
        id: uuidv4(),
        type: 'AdminTopNav',
        props: {}
      }
    ],
    version: 1
  };
}
