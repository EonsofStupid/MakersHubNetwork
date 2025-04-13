
import { useCallback } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

// Define the layout skeleton types
export interface LayoutSkeleton {
  id: string;
  name: string;
  description?: string;
  sections: LayoutSection[];
}

export interface LayoutSection {
  id: string;
  name: string;
  type: 'header' | 'sidebar' | 'content' | 'footer';
  components: LayoutComponent[];
}

export interface LayoutComponent {
  id: string;
  type: string;
  name: string;
  props?: Record<string, any>;
  children?: LayoutComponent[];
}

// Default layout skeleton
const DEFAULT_LAYOUT: LayoutSkeleton = {
  id: 'default-layout',
  name: 'Default Layout',
  description: 'Default admin layout with header, sidebar and content',
  sections: [
    {
      id: 'header',
      name: 'Header',
      type: 'header',
      components: [
        {
          id: 'admin-top-nav',
          type: 'AdminTopNav',
          name: 'Admin Top Navigation'
        }
      ]
    },
    {
      id: 'sidebar',
      name: 'Sidebar',
      type: 'sidebar',
      components: [
        {
          id: 'admin-sidebar',
          type: 'AdminSidebar',
          name: 'Admin Sidebar Navigation'
        }
      ]
    },
    {
      id: 'content',
      name: 'Content Area',
      type: 'content',
      components: []
    },
    {
      id: 'footer',
      name: 'Footer',
      type: 'footer',
      components: [
        {
          id: 'admin-footer',
          type: 'AdminFooter',
          name: 'Admin Footer'
        }
      ]
    }
  ]
};

/**
 * Service for managing admin layout skeletons
 */
export const layoutSkeletonService = {
  /**
   * Get the default layout skeleton
   */
  getDefaultLayout: (): LayoutSkeleton => {
    return structuredClone(DEFAULT_LAYOUT);
  },
  
  /**
   * Get a layout skeleton by ID
   */
  getLayoutById: (id: string): LayoutSkeleton | null => {
    if (id === 'default-layout') {
      return structuredClone(DEFAULT_LAYOUT);
    }
    return null;
  },
  
  /**
   * Add a component to a section
   */
  addComponentToSection: (
    layout: LayoutSkeleton, 
    sectionId: string, 
    component: LayoutComponent
  ): LayoutSkeleton => {
    const newLayout = structuredClone(layout);
    const section = newLayout.sections.find(s => s.id === sectionId);
    
    if (section) {
      section.components.push(component);
    }
    
    return newLayout;
  },
  
  /**
   * Remove a component from a section
   */
  removeComponentFromSection: (
    layout: LayoutSkeleton,
    sectionId: string,
    componentId: string
  ): LayoutSkeleton => {
    const newLayout = structuredClone(layout);
    const section = newLayout.sections.find(s => s.id === sectionId);
    
    if (section) {
      section.components = section.components.filter(c => c.id !== componentId);
    }
    
    return newLayout;
  }
};

/**
 * Hook for using the layout skeleton service
 */
export const useLayoutSkeleton = () => {
  const logger = useLogger('useLayoutSkeleton', LogCategory.ADMIN);
  
  const getDefaultLayout = useCallback(() => {
    logger.debug('Getting default layout');
    return layoutSkeletonService.getDefaultLayout();
  }, [logger]);
  
  const getLayoutById = useCallback((id: string) => {
    logger.debug(`Getting layout by ID: ${id}`);
    return layoutSkeletonService.getLayoutById(id);
  }, [logger]);
  
  const addComponentToSection = useCallback((
    layout: LayoutSkeleton,
    sectionId: string,
    component: LayoutComponent
  ) => {
    logger.debug(`Adding component to section: ${sectionId}`, {
      details: { componentType: component.type }
    });
    return layoutSkeletonService.addComponentToSection(layout, sectionId, component);
  }, [logger]);
  
  const removeComponentFromSection = useCallback((
    layout: LayoutSkeleton,
    sectionId: string,
    componentId: string
  ) => {
    logger.debug(`Removing component from section: ${sectionId}`, {
      details: { componentId }
    });
    return layoutSkeletonService.removeComponentFromSection(layout, sectionId, componentId);
  }, [logger]);
  
  return {
    getDefaultLayout,
    getLayoutById,
    addComponentToSection,
    removeComponentFromSection
  };
};
