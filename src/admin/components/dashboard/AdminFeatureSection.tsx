
import React from 'react';

export interface AdminFeatureSectionProps {
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function AdminFeatureSection({ title, description, className = '', children }: AdminFeatureSectionProps) {
  return (
    <div className={`rounded-lg border border-border p-4 ${className}`}>
      {title && <h3 className="text-lg font-medium mb-1">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      {children}
    </div>
  );
}

export default AdminFeatureSection;
