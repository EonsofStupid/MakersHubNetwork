
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminPermissionValue } from '@/admin/constants/permissions';
import { adminNavigationItems } from '@/admin/config/navigation.config';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import { NavItem } from '@/admin/components/navigation/NavItem';
import { NavGroup } from '@/admin/components/navigation/NavGroup';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';

// Import styles directly
import '@/admin/styles/sidebar-navigation.css';

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission } = useAdminPermissions();
  const { sidebarExpanded, toggleSidebar, showLabels, setActiveSection } = useAdminStore();
  
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
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof adminNavigationItems>);
  
  // Get all sections
  const sections = Object.keys(groupedItems);
  
  return (
    <div 
      className={cn(
        "admin-sidebar h-full",
        !sidebarExpanded && "sidebar-collapsed"
      )}
      style={{ width: sidebarExpanded ? '240px' : '70px' }}
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
      
      {/* Sidebar content with navigation */}
      <div className="admin-sidebar__content">
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
      </div>
      
      {/* Sidebar footer */}
      <div className="admin-sidebar__footer">
        {/* Footer content here if needed */}
      </div>
    </div>
  );
}
