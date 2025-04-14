
/**
 * Layout system types
 */
import { ReactNode } from 'react';

// Layout component props
export interface LayoutComponentProps {
  id: string;
  title: string;
  icon?: ReactNode;
  position: number;
  children?: ReactNode;
  requiresAuth?: boolean;
  requiredRole?: string;
}

// Layout component type
export type LayoutComponent = React.ComponentType<LayoutComponentProps>;

// Admin layout configuration
export interface AdminLayoutConfig {
  sidebar: {
    width: string;
    collapsed: boolean;
    collapsible: boolean;
  };
  header: {
    height: string;
    fixed: boolean;
    showLogo: boolean;
  };
  content: {
    maxWidth: string;
    padding: string;
  };
  footer: {
    height: string;
    show: boolean;
  };
}

// Component type
export interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: Component[];
}

// Layout item
export interface LayoutItem {
  id: string;
  parentId?: string;
  position: number;
  componentId: string;
}

// Layout interface
export interface Layout {
  id: string;
  name: string;
  description?: string;
  components: { [key: string]: { id: string; type: string; props: Record<string, any>; } };
  layout: Array<LayoutItem>;
  meta?: Record<string, any>;
  type?: string;
  scope?: string;
}

// Layout skeleton
export interface LayoutSkeleton {
  id: string;
  name: string;
  description?: string;
  type: string;
  scope: string;
  layout_json: any;
  is_locked: boolean;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}
