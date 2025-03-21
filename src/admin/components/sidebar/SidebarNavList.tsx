
import React from "react";
import { SidebarNavItem } from "./SidebarNavItem";
import { useLocation } from "react-router-dom";

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
  hasPermission: (permission: string) => boolean;
  onNavigation: (item: NavItem) => void;
}

export const SidebarNavList: React.FC<SidebarNavListProps> = ({
  items,
  collapsed,
  hasPermission,
  onNavigation
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Check if an item is active based on the current path
  const isItemActive = (item: NavItem) => {
    // Remove trailing slashes for comparison
    const cleanPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
    const cleanItemPath = item.path.endsWith('/') ? item.path.slice(0, -1) : item.path;
    
    return cleanPath === cleanItemPath || 
           (cleanPath === '/admin' && item.id === 'overview');
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
