
import { Layout, LayoutJsonData } from '@/admin/types/layout.types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Convert a layout to JSON format for storage
 */
export function layoutToJson(data: { components: any[], version: number }): LayoutJsonData {
  return {
    components: data.components || [],
    version: data.version || 1
  };
}

/**
 * Create a default dashboard layout
 */
export function createDefaultDashboardLayout(id: string): Layout {
  const now = new Date().toISOString();
  
  return {
    id,
    name: 'Default Dashboard Layout',
    type: 'dashboard',
    scope: 'admin',
    components: [
      {
        id: uuidv4(),
        type: 'DashboardContainer',
        props: {
          className: 'p-6 space-y-6'
        },
        children: [
          {
            id: uuidv4(),
            type: 'DashboardHeading',
            props: {
              title: 'Dashboard',
              subtitle: 'Welcome to your dashboard'
            }
          },
          {
            id: uuidv4(),
            type: 'DashboardStats',
            props: {}
          }
        ]
      }
    ],
    version: 1,
    created_at: now,
    updated_at: now,
    is_active: true,
    is_locked: false
  };
}

/**
 * Create an empty layout
 */
export function createEmptyLayout(type: string, scope: string): Layout {
  const id = uuidv4();
  const now = new Date().toISOString();
  
  return {
    id,
    name: `New ${type} Layout`,
    type,
    scope,
    components: [],
    version: 1,
    created_at: now,
    updated_at: now,
    is_active: true,
    is_locked: false
  };
}
