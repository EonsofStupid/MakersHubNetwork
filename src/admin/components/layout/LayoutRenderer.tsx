
import React, { useMemo } from 'react';
import { Component, Layout } from '@/admin/types/layout.types';
import componentRegistry from '@/admin/services/componentRegistry';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import { Skeleton } from '@/components/ui/skeleton';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';

interface LayoutRendererProps {
  layout: Layout | null;
  isLoading?: boolean;
  fallback?: React.ReactNode;
  error?: Error | null;
}

export function LayoutRenderer({ layout, isLoading, fallback, error }: LayoutRendererProps) {
  const { hasPermission } = useAdminPermissions();
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full max-w-sm" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="p-6 border border-destructive/30 bg-destructive/10 rounded-lg">
        <h3 className="text-lg font-medium text-destructive mb-2">Layout Error</h3>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }
  
  // Show fallback if no layout
  if (!layout || !layout.components || layout.components.length === 0) {
    return fallback ? <>{fallback}</> : null;
  }
  
  // Root-level component renderer
  return (
    <div className="layout-root" data-layout-id={layout.id}>
      {layout.components.map((component, index) => (
        <ComponentRenderer 
          key={component.id || index} 
          component={component} 
          hasPermission={hasPermission} 
          isEditMode={isEditMode}
        />
      ))}
    </div>
  );
}

interface ComponentRendererProps {
  component: Component;
  hasPermission: (permission: string) => boolean;
  isEditMode: boolean;
}

function ComponentRenderer({ component, hasPermission, isEditMode }: ComponentRendererProps) {
  // Check permissions if required
  const hasRequiredPermissions = useMemo(() => {
    if (!component.permissions || component.permissions.length === 0) {
      return true;
    }
    
    return component.permissions.some(permission => hasPermission(permission));
  }, [component.permissions, hasPermission]);
  
  // Skip rendering if no permissions
  if (!hasRequiredPermissions && !isEditMode) {
    return null;
  }
  
  // Get the component from registry
  const ComponentType = componentRegistry.getComponent(component.type);
  
  // If component not found, show a placeholder in edit mode or nothing
  if (!ComponentType) {
    if (isEditMode) {
      return (
        <div className="p-4 border border-dashed border-yellow-500 rounded-md bg-yellow-50 dark:bg-yellow-950/30">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Component not found: {component.type}
          </p>
        </div>
      );
    }
    return null;
  }
  
  // Create a wrapper with edit mode indicators if needed
  const wrapperClassName = isEditMode 
    ? "relative border border-dashed border-primary/30 rounded-md p-1 hover:border-primary transition-colors duration-200"
    : "";
  
  // Render missing permissions warning in edit mode
  const missingPermissions = isEditMode && !hasRequiredPermissions;
    
  return (
    <div className={wrapperClassName} data-component-id={component.id} data-component-type={component.type}>
      {isEditMode && (
        <div className="absolute -top-3 -right-1 bg-background border border-border px-2 py-0.5 rounded-full text-xs">
          {component.type}
        </div>
      )}
      
      {missingPermissions && (
        <div className="absolute -top-3 left-2 bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full text-xs">
          Missing permissions
        </div>
      )}
      
      <ComponentType {...(component.props || {})}>
        {component.children && component.children.map((child, index) => (
          <ComponentRenderer 
            key={child.id || index} 
            component={child} 
            hasPermission={hasPermission}
            isEditMode={isEditMode}
          />
        ))}
      </ComponentType>
    </div>
  );
}
