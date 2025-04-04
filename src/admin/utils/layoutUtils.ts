import { Layout, LayoutComponent } from '../types/layout.types';
import { createEmptyLayout } from '@/admin/types/layout.types';

// Create a default panel layout for admin dashboards
export function createDefaultPanelLayout(): Layout {
  const now = new Date().toISOString();
  const layout = {
    id: crypto.randomUUID(),
    name: 'Default Panel Layout',
    type: 'panel',
    scope: 'admin',
    components: [
      {
        id: crypto.randomUUID(),
        type: 'Panel',
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

// Create an accordion layout with expandable sections
export function createAccordionLayout(): Layout {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: 'Accordion Layout',
    type: 'accordion',
    scope: 'admin',
    components: [
      {
        id: crypto.randomUUID(),
        type: 'Accordion',
        props: {
          expanded: true
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

// Create a settings layout with basic configuration options
export function createSettingsLayout(): Layout {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: 'Settings Layout',
    type: 'settings',
    scope: 'admin',
    components: [
      {
        id: crypto.randomUUID(),
        type: 'SettingsPanel',
        props: {
          title: 'General Settings'
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

// Create a tabbed layout with multiple tab panels
export function createTabbedLayout(): Layout {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: 'Tabbed Layout',
    type: 'tabs',
    scope: 'admin',
    components: [
      {
        id: crypto.randomUUID(),
        type: 'Tabs',
        props: {
          defaultValue: 'tab1'
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

// Function to create a copy of components tree
export function cloneComponents(components: LayoutComponent[]): LayoutComponent[] {
  if (!components) return [];
  
  return components.map(component => {
    const { children, ...rest } = component;
    return {
      ...rest,
      children: children ? cloneComponents(children) : []
    };
  });
}

// Function to make a deep copy of a layout
export function cloneLayout(layout: Layout): Layout {
  if (!layout) return createEmptyLayout();

  return {
    ...layout,
    components: cloneComponents(layout.components || [])
  };
}

// Transform a component tree by applying a transformation function
export function transformComponentTree(
  components: LayoutComponent[] | undefined, 
  transformFn: (component: LayoutComponent) => LayoutComponent
): LayoutComponent[] {
  if (!components || components.length === 0) {
    return [];
  }

  return components.map(component => {
    // Apply the transformation to the current component
    const transformedComponent = transformFn({ ...component });

    // Recursively transform children if they exist
    if (transformedComponent.children && transformedComponent.children.length > 0) {
      return {
        ...transformedComponent,
        children: transformComponentTree(transformedComponent.children, transformFn)
      };
    }

    return transformedComponent;
  });
}

// Remove a component from a component tree
export function removeComponentFromTree(
  components: LayoutComponent[] | undefined,
  componentId: string
): LayoutComponent[] {
  if (!components || components.length === 0) {
    return [];
  }

  // Filter out the component with the matching ID
  const filteredComponents = components.filter(c => c.id !== componentId);

  // Recursively process children of the remaining components
  return filteredComponents.map(component => {
    if (component.children && component.children.length > 0) {
      return {
        ...component,
        children: removeComponentFromTree(component.children, componentId)
      };
    }
    return component;
  });
}
