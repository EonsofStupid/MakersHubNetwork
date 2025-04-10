
import React from 'react';
import { cn } from '@/chat/src/lib/utils';
import { SidebarSection } from './sidebar-section';
import { useMobile } from '@/hooks/use-mobile';

export const Sidebar = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const isMobile = useMobile();
  
  return (
    <aside className={cn("flex flex-col h-full", className)} {...props}>
      {children}
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';
