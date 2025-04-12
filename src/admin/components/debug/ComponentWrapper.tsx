
import React, { forwardRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface ComponentWrapperProps {
  children: React.ReactNode;
  componentName: string;
  className?: string;
  id?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const ComponentWrapper = forwardRef<HTMLDivElement, ComponentWrapperProps>(
  ({ children, componentName, className, id, onClick, ...props }, ref) => {
    const { hasRole } = useAuth();
    // Check if user is a super_admin
    const isSuperAdmin = hasRole('super_admin');
    
    // Generate a stable component ID that won't change on re-renders
    const stableId = useMemo(() => {
      return id || `${componentName}-${Math.random().toString(36).substring(2, 9)}`;
    }, [componentName, id]);
    
    // Only add debug-related attributes if user is a super admin
    const debugAttributes = useMemo(() => {
      if (!isSuperAdmin) return {};
      
      return {
        'data-component': componentName,
        'data-component-id': stableId
      };
    }, [isSuperAdmin, componentName, stableId]);
    
    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        onClick={onClick}
        {...debugAttributes}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ComponentWrapper.displayName = 'ComponentWrapper';
