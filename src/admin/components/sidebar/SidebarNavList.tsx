
import React from "react";
import { SidebarNavItem } from "./SidebarNavItem";

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactElement;
  permission: string;
}

interface SidebarNavListProps {
  items: NavItem[];
  collapsed: boolean;
  currentPath: string;
  hasPermission: (permission: string) => boolean;
  onNavigation: (item: NavItem) => void;
}

export const SidebarNavList: React.FC<SidebarNavListProps> = ({
  items,
  collapsed,
  currentPath,
  hasPermission,
  onNavigation
}) => {
  // Check if an item is active based on route path
  const isItemActive = (item: NavItem) => {
    return currentPath === item.path || 
           (currentPath.startsWith('/admin') && item.path === '/admin/overview' && currentPath === '/admin');
  };

  return (
    <nav className={collapsed ? "p-1" : "p-2"}>
      <ul className="space-y-1">
        {items.map((item, index) => {
          // Skip if user doesn't have permission
          if (!hasPermission(item.permission)) return null;
          
          return (
            <li key={item.id}>
              <SidebarNavItem
                id={item.id}
                label={item.label}
                path={item.path}
                icon={item.icon}
                isActive={isItemActive(item)}
                collapsed={collapsed}
                index={index}
                onNavigate={() => onNavigation(item)}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
