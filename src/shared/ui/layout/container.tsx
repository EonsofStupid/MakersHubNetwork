
import React from 'react';
import { cn } from '@/lib/utils';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
  as?: React.ElementType;
};

export function Container({ 
  children, 
  className, 
  fluid = false,
  as: Component = 'div'
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full px-4',
        fluid ? 'max-w-full' : 'max-w-7xl',
        className
      )}
    >
      {children}
    </Component>
  );
}
