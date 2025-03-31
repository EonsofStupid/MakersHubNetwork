
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminPermissionValue } from '@/admin/constants/permissions';
import { adminNavigationItems, AdminNavigationItem } from '@/admin/config/navigation.config';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import { NavItem } from '@/admin/components/navigation/NavItem';
import { NavGroup } from '@/admin/components/navigation/NavGroup';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import styles directly
import '@/admin/styles/sidebar-navigation.css';

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission } = useAdminPermissions();
  const { sidebarExpanded, toggleSidebar, showLabels, setActiveSection } = useAdminStore();
  const [hasMounted, setHasMounted] = useState(false);
  
  // Set mounted state for animations
  useEffect(() => {
    setHasMounted(true);
    // Auto-expand after a short delay
    const timer = setTimeout(() => {
      if (!sidebarExpanded) {
        toggleSidebar();
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Set active section based on path
  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'overview';
    setActiveSection(path);
  }, [location.pathname, setActiveSection]);
  
  // Filter navigation items based on permissions
  const filteredItems = adminNavigationItems.filter(item => {
    // If no permission required, show the item
    if (!item.permission) return true;
    
    // Check if user has the required permission
    return hasPermission(item.permission as AdminPermissionValue);
  });
  
  // Group items by section
  const groupedItems = filteredItems.reduce((acc, item) => {
    const section = item.section || 'General';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, AdminNavigationItem[]>);
  
  // Get all sections
  const sections = Object.keys(groupedItems);
  
  // Animation variants - more aggressive trapezoid
  const sidebarVariants = {
    expanded: {
      width: 240,
      clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    collapsed: {
      width: 70,
      clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0% 100%)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  return (
    <motion.div 
      className="admin-sidebar fixed left-0 top-14 h-[calc(100vh-3.5rem)] z-30"
      initial={false}
      animate={sidebarExpanded ? 'expanded' : 'collapsed'}
      variants={sidebarVariants}
    >
      {/* Sidebar header with toggle button */}
      <div className="admin-sidebar__header justify-end">
        <AdminTooltip 
          content={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          side="right"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]"
          >
            {sidebarExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </motion.button>
        </AdminTooltip>
      </div>
      
      {/* Animated scan lines for cyber effect */}
      <div className="admin-sidebar-scan" />
      
      {/* Sidebar content with navigation - now with ScrollArea */}
      <ScrollArea className="admin-sidebar__content h-[calc(100vh-8rem)]">
        <AnimatePresence mode="wait">
          {sections.map(section => (
            <NavGroup
              key={section}
              title={section}
              collapsed={!sidebarExpanded}
            >
              {groupedItems[section].map(item => (
                <NavItem
                  key={item.id}
                  id={item.id}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  showLabel={sidebarExpanded && showLabels}
                  isActive={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  draggable={true}
                />
              ))}
            </NavGroup>
          ))}
        </AnimatePresence>
      </ScrollArea>
      
      {/* Sidebar footer */}
      <div className="admin-sidebar__footer">
        {/* Footer content here if needed */}
      </div>
    </motion.div>
  );
}
