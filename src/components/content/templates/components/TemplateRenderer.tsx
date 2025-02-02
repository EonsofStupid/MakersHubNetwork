import React from 'react';
import { useTemplate } from '../registry/TemplateRegistry';
import { TemplateType } from '../types/template';
import { cn } from "@/lib/utils";

interface TemplateRendererProps {
  type: TemplateType;
  content?: Record<string, any>;
  className?: string;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  type,
  content = {},
  className
}) => {
  const template = useTemplate(type);
  const Component = template.component;
  const finalProps = { ...template.defaultProps, ...content };

  return (
    <div className={cn("w-full", className)}>
      <Component {...finalProps} />
    </div>
  );
};