
import React from "react";
import { SidebarNavItem } from "./SidebarNavItem";

// Import icon types
import { LucideIcon } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  path: string;
  legacyPath: string;
  icon: React.ReactElement;
  permission: string;
}

interface SidebarNavListProps {
  items: NavItem[];
  collapsed: boolean;
  useTanStackRouter: boolean;
  currentPath: string;
  currentTab: string;
  hasPermission: (permission: string) => boolean;
  onNavigation: (item: NavItem) => void;
}

export const SidebarNavList: React.FC<SidebarNavListProps> = ({
  items,
  collapsed,
  useTanStackRouter,
  currentPath,
  currentTab,
  hasPermission,
  onNavigation
}) => {
  // Check if an item is active based on legacy tab param or new route path
  const isItemActive = (item: NavItem) => {
    if (useTanStackRouter) {
      return currentPath === item.path || 
             (currentPath === '/admin' && item.id === 'overview');
    } else {
      return currentTab === item.id;
    }
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
                legacyPath={item.legacyPath}
                icon={item.icon}
                isActive={isItemActive(item)}
                collapsed={collapsed}
                index={index}
                useTanStackRouter={useTanStackRouter}
                onNavigate={() => onNavigation(item)}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
