
import { Layout, Component } from '@/admin/types/layout.types';

/**
 * Convert a database layout to a default Dashboard layout
 */
export function createDefaultDashboardLayout(id: string): Layout {
  return {
    id,
    name: 'Default Dashboard',
    type: 'dashboard',
    scope: 'admin',
    components: [
      {
        id: 'dashboard-header',
        type: 'AdminSection',
        children: [
          {
            id: 'dashboard-title',
            type: 'AdminGrid',
            props: {
              cols: 1,
              className: 'mb-6',
            },
            children: [
              {
                id: 'title-section',
                type: 'Card',
                children: [
                  {
                    id: 'card-header',
                    type: 'CardHeader',
                    children: [
                      {
                        id: 'card-title',
                        type: 'CardTitle',
                        props: {
                          className: 'text-2xl',
                        },
                        children: [
                          {
                            id: 'title-text',
                            type: 'span',
                            props: {
                              children: 'Admin Dashboard',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'shortcuts-section',
            type: 'DashboardShortcuts',
          },
          {
            id: 'stats-grid',
            type: 'AdminGrid',
            props: {
              cols: 4,
            },
            children: [
              {
                id: 'stats-section',
                type: 'StatsCards',
              },
            ],
          },
          {
            id: 'main-content',
            type: 'AdminGrid',
            props: {
              cols: 3,
              className: 'mt-6',
            },
            children: [
              {
                id: 'active-users',
                type: 'ActiveUsersList',
                props: {
                  className: 'md:col-span-1',
                },
              },
              {
                id: 'performance-metrics',
                type: 'PerformanceMetrics',
                props: {
                  className: 'md:col-span-2',
                },
              },
            ],
          },
          {
            id: 'trending-section',
            type: 'TrendingParts',
            props: {
              className: 'mt-6',
            },
          },
        ],
      },
    ],
  };
}

/**
 * Convert a flat component tree to a hierarchical component tree
 */
export function flatToTree(components: Component[], parent: string | null = null): Component[] {
  return components
    .filter(component => component.parentId === parent)
    .map(component => ({
      ...component,
      children: flatToTree(components, component.id),
    }));
}

/**
 * Convert a hierarchical component tree to a flat list with parentId references
 */
export function treeToFlat(components: Component[], parentId: string | null = null): Component[] {
  return components.reduce((acc: Component[], component) => {
    const { children, ...componentWithoutChildren } = component;
    const flatComponent = {
      ...componentWithoutChildren,
      parentId,
    };
    
    acc.push(flatComponent);
    
    if (children && children.length > 0) {
      acc.push(...treeToFlat(children, component.id));
    }
    
    return acc;
  }, []);
}

/**
 * Find a component in a tree by its ID
 */
export function findComponentById(components: Component[], id: string): Component | null {
  for (const component of components) {
    if (component.id === id) {
      return component;
    }
    
    if (component.children) {
      const found = findComponentById(component.children, id);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
}

/**
 * Update a component in a tree
 */
export function updateComponentInTree(
  components: Component[],
  id: string,
  updater: (component: Component) => Component
): Component[] {
  return components.map(component => {
    if (component.id === id) {
      return updater(component);
    }
    
    if (component.children) {
      return {
        ...component,
        children: updateComponentInTree(component.children, id, updater),
      };
    }
    
    return component;
  });
}

/**
 * Remove a component from a tree
 */
export function removeComponentFromTree(components: Component[], id: string): Component[] {
  return components
    .filter(component => component.id !== id)
    .map(component => {
      if (component.children) {
        return {
          ...component,
          children: removeComponentFromTree(component.children, id),
        };
      }
      
      return component;
    });
}
