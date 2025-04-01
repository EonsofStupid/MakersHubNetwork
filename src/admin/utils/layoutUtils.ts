
import { Layout, Component } from '@/admin/types/layout.types';
import { v4 as uuidv4 } from 'uuid';

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
        id: 'dashboard-root',
        type: 'AdminSection',
        children: [
          {
            id: 'dashboard-header',
            type: 'div',
            props: {
              className: 'flex items-center gap-2 mb-6'
            },
            children: [
              {
                id: 'dashboard-icon',
                type: 'span',
                props: {
                  className: 'text-primary'
                },
                children: [
                  {
                    id: 'dashboard-icon-inner',
                    type: 'heading',
                    props: {
                      level: 1,
                      className: 'text-2xl font-bold',
                      children: 'Admin Dashboard'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'shortcuts-section',
            type: 'DashboardShortcuts',
          },
          {
            id: 'stats-grid',
            type: 'AdminGrid',
            props: {
              cols: 2,
            },
            children: [
              {
                id: 'build-approval-section',
                type: 'BuildApprovalWidget',
                props: {
                  className: 'md:col-span-1',
                }
              },
              {
                id: 'stats-section',
                type: 'StatsCards',
                props: {
                  className: 'md:col-span-1',
                }
              }
            ]
          },
          {
            id: 'features-section',
            type: 'AdminFeatureSection',
            props: {
              className: 'mt-6',
            }
          }
        ],
      },
    ],
  };
}

/**
 * Create an empty layout with basic structure
 */
export function createEmptyLayout(type: string, scope: string, name: string): Layout {
  return {
    id: uuidv4(),
    name,
    type,
    scope,
    components: [
      {
        id: 'root',
        type: 'AdminSection',
        children: []
      }
    ],
    version: 1
  };
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
 * Add a component as a child to another component
 */
export function addComponentToParent(
  components: Component[],
  parentId: string,
  newComponent: Component
): Component[] {
  return components.map(component => {
    if (component.id === parentId) {
      return {
        ...component,
        children: [...(component.children || []), newComponent]
      };
    }
    
    if (component.children) {
      return {
        ...component,
        children: addComponentToParent(component.children, parentId, newComponent)
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

/**
 * Move a component up in the tree (swap with previous sibling)
 */
export function moveComponentUp(components: Component[], id: string): Component[] {
  // Find the component to move
  for (let i = 0; i < components.length; i++) {
    if (components[i].id === id) {
      if (i > 0) {
        // Swap with previous sibling
        const newComponents = [...components];
        [newComponents[i - 1], newComponents[i]] = [newComponents[i], newComponents[i - 1]];
        return newComponents;
      }
      return components; // Already at the top
    }
    
    // Check children
    if (components[i].children) {
      const newChildren = moveComponentUp(components[i].children, id);
      if (newChildren !== components[i].children) {
        const newComponents = [...components];
        newComponents[i] = { ...components[i], children: newChildren };
        return newComponents;
      }
    }
  }
  
  return components;
}

/**
 * Move a component down in the tree (swap with next sibling)
 */
export function moveComponentDown(components: Component[], id: string): Component[] {
  // Find the component to move
  for (let i = 0; i < components.length; i++) {
    if (components[i].id === id) {
      if (i < components.length - 1) {
        // Swap with next sibling
        const newComponents = [...components];
        [newComponents[i], newComponents[i + 1]] = [newComponents[i + 1], newComponents[i]];
        return newComponents;
      }
      return components; // Already at the bottom
    }
    
    // Check children
    if (components[i].children) {
      const newChildren = moveComponentDown(components[i].children, id);
      if (newChildren !== components[i].children) {
        const newComponents = [...components];
        newComponents[i] = { ...components[i], children: newChildren };
        return newComponents;
      }
    }
  }
  
  return components;
}
