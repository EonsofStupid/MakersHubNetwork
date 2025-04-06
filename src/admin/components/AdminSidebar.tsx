
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { adminSidebarExpandedAtom } from '@/admin/atoms/tools.atoms';
import { cn } from '@/lib/utils';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';
import { NavGroup } from '@/admin/components/navigation/NavGroup';
import { 
  Home, 
  Users, 
  Layout, 
  FileText, 
  Package, 
  Settings, 
  Shield, 
  Database, 
  FileCode, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { AdminTooltip } from './ui/AdminTooltip';

export function AdminSidebar() {
  const [expanded, setExpanded] = useAtom(adminSidebarExpandedAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAdminPermissions();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  // Navigation items with permission checks
  const navItems = [
    {
      group: 'Core',
      items: [
        {
          name: 'Dashboard',
          path: '/admin/dashboard',
          icon: <Home className="h-5 w-5" />,
          permission: ADMIN_PERMISSIONS.ADMIN_VIEW
        }
      ]
    },
    {
      group: 'Content',
      items: [
        {
          name: 'Users',
          path: '/admin/users',
          icon: <Users className="h-5 w-5" />,
          permission: ADMIN_PERMISSIONS.USERS_VIEW
        },
        {
          name: 'Builds',
          path: '/admin/builds',
          icon: <Package className="h-5 w-5" />,
          permission: ADMIN_PERMISSIONS.BUILDS_VIEW
        },
        {
          name: 'Parts',
          path: '/admin/parts',
          icon: <Database className="h-5 w-5" />,
          permission: ADMIN_PERMISSIONS.CONTENT_VIEW
        },
        {
          name: 'Content',
          path: '/admin/content',
          icon: <FileText className="h-5 w-5" />,
          permission: ADMIN_PERMISSIONS.CONTENT_VIEW
        }
      ]
    },
    {
      group: 'Appearance',
      items: [
        {
          name: 'Themes',
          path: '/admin/themes',
          icon: <Layout className="h-5 w-5" />,
          permission: ADMIN_PERMISSIONS.THEMES_VIEW
        }
      ]
    },
    {
      group: 'System',
      items: [
        {
          name: 'Permissions',
          path: '/admin/permissions',
          icon: <Shield className="h-5 w-5" />,
          permission: ADMIN_PERMISSIONS.SYSTEM_SETTINGS
        },
        {
          name: 'Settings',
          path: '/admin/settings',
          icon: <Settings className="h-5 w-5" />,
          permission: ADMIN_PERMISSIONS.SETTINGS_VIEW
        },
        {
          name: 'Logs',
          path: '/admin/logs',
          icon: <FileCode className="h-5 w-5" />,
          permission: ADMIN_PERMISSIONS.SYSTEM_LOGS
        }
      ]
    }
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <motion.div
      layout
      initial={{ width: expanded ? 256 : 80 }}
      animate={{ width: expanded ? 256 : 80 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "h-screen overflow-hidden border-r border-[var(--impulse-border-normal)]",
        "bg-[var(--impulse-bg-sidebar)] flex flex-col"
      )}
    >
      {/* Sidebar header */}
      <div className="p-4 h-16 flex items-center justify-between border-b border-[var(--impulse-border-normal)]">
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <span className="font-heading text-xl bg-gradient-to-r from-[var(--impulse-primary)] to-[var(--impulse-secondary)] bg-clip-text text-transparent">
                MakersImpulse
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="mini-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <span className="font-heading text-xl bg-gradient-to-r from-[var(--impulse-primary)] to-[var(--impulse-secondary)] bg-clip-text text-transparent">
                MI
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggleSidebar}
          className="h-6 w-6 rounded-full flex items-center justify-center text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-primary)] hover:bg-[var(--impulse-bg-hover)]"
        >
          {expanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation items */}
      <div className="flex-grow overflow-y-auto py-4 px-2">
        {navItems.map((group) => {
          // Filter items by permission
          const visibleItems = group.items.filter(item => 
            hasPermission(item.permission)
          );
          
          // Skip empty groups
          if (visibleItems.length === 0) return null;
          
          return (
            <NavGroup 
              key={group.group} 
              title={group.group}
              collapsed={!expanded}
            >
              {visibleItems.map((item) => {
                const NavItem = (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md",
                        "transition-colors duration-150",
                        isActive(item.path) 
                          ? "bg-[var(--impulse-primary)]/10 text-[var(--impulse-primary)]" 
                          : "text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-primary)] hover:bg-[var(--impulse-bg-hover)]"
                      )}
                    >
                      <span>{item.icon}</span>
                      <AnimatePresence mode="wait">
                        {expanded && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="truncate"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                );

                return expanded ? NavItem : (
                  <AdminTooltip key={item.path} content={item.name} side="right">
                    {NavItem}
                  </AdminTooltip>
                );
              })}
            </NavGroup>
          );
        })}
      </div>
    </motion.div>
  );
}
