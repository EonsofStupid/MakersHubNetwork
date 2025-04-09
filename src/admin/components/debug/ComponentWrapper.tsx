
import React, { forwardRef } from 'react';
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
    const { isSuperAdmin } = useAuth();
    
    // Only add debug-related attributes if user is a super admin
    const debugAttributes = isSuperAdmin 
      ? {
          'data-component': componentName,
          'data-component-id': id || `${componentName}-${Math.random().toString(36).substring(2, 9)}`
        }
      : {};
    
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
