import { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export type TemplateType = 'build' | 'guide' | 'part';

export interface TemplateConfig {
  name: string;
  description: string;
  icon?: LucideIcon;
  component: React.ComponentType<any>;
  defaultProps?: Record<string, any>;
  schema?: Record<string, any>;
}

export interface TemplateProps {
  content?: Record<string, any>;
  className?: string;
  children?: ReactNode;
}