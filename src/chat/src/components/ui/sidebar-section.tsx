
import React from 'react';
import { cn } from '@/chat/src/lib/utils';

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  collapsible?: boolean;
}

export const SidebarSection = ({
  children,
  className,
  title,
  collapsible = false,
  ...props
}: SidebarSectionProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className={cn("py-2", className)} {...props}>
      {title && (
        <div
          className={cn(
            "flex items-center justify-between px-3 py-1.5 text-sm font-medium text-white/70",
            collapsible && "cursor-pointer hover:text-white"
          )}
          onClick={toggleCollapse}
        >
          <span>{title}</span>
          {collapsible && (
            <span className="text-xs">{isCollapsed ? "+" : "-"}</span>
          )}
        </div>
      )}
      {!isCollapsed && <div className="mt-1">{children}</div>}
    </div>
  );
};

SidebarSection.displayName = 'SidebarSection';
