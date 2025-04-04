import { Layout, LayoutComponent, createEmptyLayout, layoutToJson } from '@/admin/types/layout.types';
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
                id: 'dashboard-title',
                type: 'heading',
                props: {
                  level: 1,
                  className: 'text-2xl font-bold',
                  children: 'Admin Dashboard'
                }
              }
            ]
          },
          {
            id: 'admin-topnav',
            type: 'AdminTopNav',
            props: {
              title: 'Admin Dashboard'
            }
          },
          {
            id: 'admin-layout',
            type: 'div',
            props: {
              className: 'flex w-full'
            },
            children: [
              {
                id: 'admin-sidebar',
                type: 'AdminSidebar'
              },
              {
                id: 'admin-content',
                type: 'div',
                props: {
                  className: 'flex-1 p-6'
                },
                children: [
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
                ]
              }
            ]
          }
        ],
      },
    ],
    version: 1,
  };
}

/**
 * Create a default sidebar layout
 */
export function createDefaultSidebarLayout(id: string): Layout {
  return {
    id,
    name: 'Default Sidebar',
    type: 'sidebar',
    scope: 'admin',
    components: [
      {
        id: 'sidebar-root',
        type: 'AdminSidebar',
        props: {
          expanded: true
        }
      }
    ],
    version: 1
  };
}

/**
 * Create a default top navigation layout
 */
export function createDefaultTopNavLayout(id: string): Layout {
  return {
    id,
    name: 'Default TopNav',
    type: 'topnav',
    scope: 'admin',
    components: [
      {
        id: 'topnav-root',
        type: 'AdminTopNav',
        props: {
          title: 'Admin Dashboard'
        }
      }
    ],
    version: 1
  };
}

/**
 * Create a dashboard layout
 */
export function createDashboardLayout(): Layout {
  return createEmptyLayout({
    id: crypto.randomUUID(),
    name: 'Dashboard',
    type: 'dashboard',
    scope: 'admin',
    components: [{
      id: crypto.randomUUID(),
      type: 'AdminDashboard',
      children: [
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
                  id: 'dashboard-title',
                  type: 'heading',
                  props: {
                    level: 1,
                    className: 'text-2xl font-bold',
                    children: 'Admin Dashboard'
                  }
                }
              ]
            },
            {
              id: 'admin-topnav',
              type: 'AdminTopNav',
              props: {
                title: 'Admin Dashboard'
              }
            },
            {
              id: 'admin-layout',
              type: 'div',
              props: {
                className: 'flex w-full'
              },
              children: [
                {
                  id: 'admin-sidebar',
                  type: 'AdminSidebar'
                },
                {
                  id: 'admin-content',
                  type: 'div',
                  props: {
                    className: 'flex-1 p-6'
                  },
                  children: [
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
                  ]
                }
              ]
            }
          ],
        },
      ],
    }],
    version: 1,
  });
}

/**
 * Find a component in a tree by its ID
 */
export function findComponentById(components: LayoutComponent[], id: string): LayoutComponent | null {
  if (!components || components.length === 0) return null;
  
  for (const component of components) {
    if (component.id === id) return component;
    
    if (component.children && component.children.length > 0) {
      const found = findComponentById(component.children, id);
      if (found) return found;
    }
  }
  
  return null;
}

/**
 * Update a component in a tree
 */
export function updateComponentInTree(
  components: LayoutComponent[],
  id: string,
  updater: (component: LayoutComponent) => LayoutComponent
): LayoutComponent[] {
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
  components: LayoutComponent[],
  parentId: string,
  newComponent: LayoutComponent
): LayoutComponent[] {
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
export function removeComponentFromTree(components: LayoutComponent[], id: string): LayoutComponent[] {
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
export function moveComponentUp(components: LayoutComponent[], id: string): LayoutComponent[] {
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
export function moveComponentDown(components: LayoutComponent[], id: string): LayoutComponent[] {
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
