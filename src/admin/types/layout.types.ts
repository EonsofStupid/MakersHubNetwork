
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
