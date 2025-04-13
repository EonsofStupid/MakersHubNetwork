
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { adminNavigation, getNavigationBySection } from '../config/navigation.config';
import { UserRoleEnum } from '@/shared/types/shared.types';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { hasRole } from '@/auth/utils/hasRole';
import { useAuthStore } from '@/auth/store/auth.store';

const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { roles } = useAuthStore();
  const { hasPermission } = useAdminPermissions();
  
  // Get navigation items for each section
  const mainNavItems = getNavigationBySection('main');
  const systemNavItems = getNavigationBySection('system');
  
  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return path !== '/admin' && location.pathname.startsWith(path);
  };
  
  // Filter items based on user permissions
  const filterItemsByPermission = (items: typeof adminNavigation) => {
    return items.filter(item => {
      return hasRole(roles, item.requiredRole as UserRoleEnum);
    });
  };
  
  const mainItems = filterItemsByPermission(mainNavItems);
  const systemItems = filterItemsByPermission(systemNavItems);

  return (
    <div
      className={cn(
        "border-r flex flex-col bg-card h-screen relative transition-all duration-300", 
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo and collapse button */}
      <div className="flex items-center p-4 border-b justify-between">
        <h1 className={cn("font-bold text-xl transition-opacity", collapsed ? "opacity-0 w-0" : "opacity-100")}>
          Admin
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="py-4">
          {/* Main navigation */}
          <div className="px-4 pb-2">
            <h2 className={cn("text-xs font-semibold text-muted-foreground mb-2 transition-opacity", 
              collapsed ? "opacity-0" : "opacity-100"
            )}>
              Main
            </h2>
            <nav className="grid gap-1">
              {mainItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={cn(
                      "flex items-center py-2 px-3 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      isActive(item.path) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      collapsed ? "justify-center" : ""
                    )}
                  >
                    {ItemIcon && <ItemIcon className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />}
                    <span className={cn("transition-opacity", collapsed ? "opacity-0 w-0 h-0 overflow-hidden" : "opacity-100")}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <Separator className="my-4" />
          
          {/* System navigation */}
          <div className="px-4">
            <h2 className={cn("text-xs font-semibold text-muted-foreground mb-2 transition-opacity", 
              collapsed ? "opacity-0" : "opacity-100"
            )}>
              System
            </h2>
            <nav className="grid gap-1">
              {systemItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={cn(
                      "flex items-center py-2 px-3 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      isActive(item.path) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      collapsed ? "justify-center" : ""
                    )}
                  >
                    {ItemIcon && <ItemIcon className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />}
                    <span className={cn("transition-opacity", collapsed ? "opacity-0 w-0 h-0 overflow-hidden" : "opacity-100")}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </ScrollArea>
      
      {/* Bottom settings link */}
      <div className="border-t p-4">
        <Link
          to="/admin/settings"
          className={cn(
            "flex items-center py-2 px-3 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
            isActive('/admin/settings') ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            collapsed ? "justify-center" : ""
          )}
        >
          <Settings className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
          <span className={cn("transition-opacity", collapsed ? "opacity-0 w-0 h-0 overflow-hidden" : "opacity-100")}>
            Settings
          </span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
