
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { RBACBridge } from '@/rbac/bridge';
import { Button } from '@/shared/ui/button';
import { LayoutDashboard, Users, Settings, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserRole, ROLES } from '@/shared/types/shared.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

/**
 * AdminSidebar component
 * Provides navigation for the admin area
 */
export const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();
  const logger = useLogger('AdminSidebar', LogCategory.ADMIN);
  
  // Navigation items with permission requirements
  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      requiredRole: [ROLES.ADMIN, ROLES.SUPER_ADMIN] as UserRole[]
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: Users,
      requiredRole: [ROLES.ADMIN, ROLES.SUPER_ADMIN] as UserRole[]
    },
    {
      label: 'Content',
      path: '/admin/content',
      icon: FileText,
      requiredRole: [ROLES.ADMIN, ROLES.SUPER_ADMIN] as UserRole[]
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      requiredRole: [ROLES.SUPER_ADMIN] as UserRole[]
    }
  ];
  
  // Get user roles for logging
  const roles = RBACBridge.getRoles();
  
  React.useEffect(() => {
    logger.debug('Admin sidebar mounted', { details: { roles } });
  }, [logger, roles]);
  
  // Filter items based on user roles
  const visibleItems = navItems.filter(item => 
    RBACBridge.hasRole(item.requiredRole)
  );
  
  return (
    <div
      className={cn(
        "min-h-screen bg-background border-r flex flex-col transition-all",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <span className="font-semibold">Admin</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={collapsed ? "mx-auto" : "ml-auto"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path} className="px-2">
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed && "justify-center"
                  )}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
