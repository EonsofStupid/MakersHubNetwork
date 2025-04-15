
import { ReactNode } from 'react';

export interface LayoutComponentProps {
  id: string;
  title: string;
  icon?: ReactNode;
  position: number;
  children?: ReactNode;
  requiresAuth?: boolean;
  requiredRole?: string;
}

export type LayoutComponent = React.ComponentType<LayoutComponentProps>;

export interface Layout {
  id: string;
  name: string;
  description?: string;
  components: {
    [key: string]: {
      id: string;
      type: 'page' | 'section' | 'widget';
      props: Record<string, any>;
    }
  };
  layout: Array<{
    id: string;
    parentId?: string;
    position: number;
    componentId: string;
  }>;
  meta?: Record<string, any>;
  type: 'page' | 'section' | 'widget';
  scope: 'site' | 'admin' | 'feature';
}

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
