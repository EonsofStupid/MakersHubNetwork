import React from 'react';
import { useTemplate, TemplateType } from './TemplateRegistry';

interface TemplateRendererProps {
  type: TemplateType;
  props?: Record<string, any>;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ type, props = {} }) => {
  const template = useTemplate(type);
  const Component = template.component;
  const finalProps = { ...template.defaultProps, ...props };

  return <Component {...finalProps} />;
};