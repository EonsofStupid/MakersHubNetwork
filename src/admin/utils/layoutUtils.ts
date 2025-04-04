
import { Layout, LayoutComponent } from '../types/layout.types';
import { createEmptyLayout } from '@/admin/types/layout.types';

// Create a default panel layout for admin dashboards
export function createDefaultPanelLayout(): Layout {
  const now = new Date().toISOString();
  const layout: Layout = {
    id: crypto.randomUUID(),
    name: 'Default Panel Layout',
    type: 'panel',
    scope: 'admin',
    components: [
      {
        id: crypto.randomUUID(),
        type: 'Panel',
        props: {
          className: 'w-full'
        },
        children: [
          {
            id: crypto.randomUUID(),
            type: 'PanelHeader',
            props: {
              className: 'flex justify-between items-center'
            },
            children: [
              {
                id: crypto.randomUUID(),
                type: 'PanelTitle',
                props: {
                  className: 'text-xl font-semibold'
                }
              }
            ]
          },
          {
            id: crypto.randomUUID(),
            type: 'PanelBody',
            props: {
              className: 'p-4'
            }
          },
          {
            id: crypto.randomUUID(),
            type: 'PanelFooter',
            props: {
              className: 'flex justify-end gap-2 p-4 border-t'
            }
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
  
  return layout;
}

// Create a default page layout with a header and a content area
export function createDefaultPageLayout(): Layout {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: 'Default Page Layout',
    type: 'page',
    scope: 'global',
    components: [
      {
        id: crypto.randomUUID(),
        type: 'PageHeader',
        props: {
          title: 'Page Title',
          description: 'Page Description'
        }
      },
      {
        id: crypto.randomUUID(),
        type: 'PageContent',
        props: {
          className: 'p-4'
        }
      }
    ],
    version: 1,
    created_at: now,
    updated_at: now,
    is_active: true,
    is_locked: false
  };
}

// Create a default dashboard layout for admin
export function createDefaultDashboardLayout(): Layout {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: 'Default Dashboard Layout',
    type: 'dashboard',
    scope: 'admin',
    components: [
      {
        id: crypto.randomUUID(),
        type: 'div',
        props: {
          className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'
        },
        children: [
          {
            id: crypto.randomUUID(),
            type: 'StatsCards'
          },
          {
            id: crypto.randomUUID(),
            type: 'BuildApprovalWidget'
          },
          {
            id: crypto.randomUUID(),
            type: 'AdminFeatureSection'
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

// Find a component by ID in a layout
export function findComponentById(layout: Layout | null, componentId: string): LayoutComponent | null {
  if (!layout || !layout.components || layout.components.length === 0) {
    return null;
  }

  return findComponentInTree(layout.components, componentId);
}

// Find a component in a nested tree of components
export function findComponentInTree(components: LayoutComponent[], componentId: string): LayoutComponent | null {
  for (const component of components) {
    if (component.id === componentId) {
      return component;
    }

    if (component.children && component.children.length > 0) {
      const found = findComponentInTree(component.children, componentId);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
}

// Add a component to a parent component in the layout
export function addComponentToParent(
  layout: Layout, 
  parentId: string, 
  newComponent: LayoutComponent
): Layout {
  const updatedLayout = { ...layout };
  const parentComponent = findComponentById(updatedLayout, parentId);
  
  if (parentComponent) {
    if (!parentComponent.children) {
      parentComponent.children = [];
    }
    
    parentComponent.children.push(newComponent);
  }
  
  return updatedLayout;
}
