
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: string | LucideIcon;
  actions?: React.ReactNode;
}

export function AdminPageHeader({ title, description, icon: Icon, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        {Icon && typeof Icon === 'function' && (
          <Icon className="h-6 w-6 text-muted-foreground" />
        )}
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex gap-2 items-center justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
