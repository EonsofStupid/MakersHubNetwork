
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { adminNavigationItems } from '@/admin/config/navigation.config';
import { NavigationItem } from '@/admin/components/navigation/NavigationItem';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { scrollbarStyle } from '@/admin/utils/styles';
import { EditModeToggle } from '@/admin/components/ui/EditModeToggle';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import '@/admin/styles/sidebar-navigation.css';

// Framer Motion variants
const sidebarVariants = {
  expanded: { width: '240px', transition: { type: "spring", stiffness: 300, damping: 30 } },
  collapsed: { width: '70px', transition: { type: "spring", stiffness: 300, damping: 30 } }
};

const titleVariants = {
  expanded: { opacity: 1, x: 0, transition: { delay: 0.1 } },
  collapsed: { opacity: 0, x: -10 }
};

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode] = useAtom(adminEditModeAtom);
  const { 
    sidebarExpanded, 
    setSidebarExpanded, 
    activeSection,
    setActiveSection,
    permissions,
    hasPermission
  } = useAdminStore();

  // Set active section based on URL
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentSection = pathSegments[pathSegments.length - 1] || 'overview';
    setActiveSection(currentSection);
  }, [location.pathname, setActiveSection]);

  // Filter items based on permissions
  const visibleItems = adminNavigationItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  // Handle navigation item click
  const handleNavClick = (path: string, id: string) => {
    navigate(path);
    setActiveSection(id);
  };

  return (
    <motion.div 
      variants={sidebarVariants}
      initial="expanded"
      animate={sidebarExpanded ? "expanded" : "collapsed"}
      className={cn(
        "admin-sidebar rounded-xl border border-[var(--impulse-border-normal)] bg-[var(--impulse-bg-card)] backdrop-blur-md overflow-hidden",
        isEditMode && "border-[var(--impulse-primary)]/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
      )}
    >
      {/* Header with title and collapse button */}
      <div className="admin-sidebar__header py-4 px-3 flex justify-between items-center border-b border-[var(--impulse-border-normal)]">
        <AnimatePresence mode="wait">
          {sidebarExpanded && (
            <motion.div
              key="sidebar-title"
              variants={titleVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="flex items-center gap-2"
            >
              <span className="text-sm font-medium text-[var(--impulse-text-primary)] px-2">Admin Navigation</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-2">
          {sidebarExpanded && (
            <EditModeToggle className="mr-1" />
          )}
          
          <AdminTooltip content={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-2 rounded-full bg-[var(--impulse-bg-main)] text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-primary)] transition-colors"
            >
              {sidebarExpanded ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </motion.button>
          </AdminTooltip>
        </div>
      </div>
      
      {/* Main navigation items */}
      <div 
        className={cn(
          "admin-sidebar__content py-4",
          scrollbarStyle
        )}
      >
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item) => (
            <NavigationItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              description={item.description}
              isActive={activeSection === item.id}
              onClick={() => handleNavClick(item.path, item.id)}
              tooltipContent={!sidebarExpanded ? item.label : undefined}
              showTooltip={!sidebarExpanded}
              className={sidebarExpanded ? "mx-2" : "justify-center mx-2 px-0"}
            />
          ))}
        </AnimatePresence>
        
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 mx-4 p-2 rounded-md bg-[var(--impulse-primary)]/10 border border-[var(--impulse-border-normal)]"
          >
            <p className="text-xs text-[var(--impulse-primary)] text-center">
              {sidebarExpanded ? "Drag items to customize" : ""}
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Footer information */}
      <div className="admin-sidebar__footer border-t border-[var(--impulse-border-normal)] p-4">
        <AnimatePresence mode="wait">
          {sidebarExpanded ? (
            <motion.div
              key="sidebar-expanded-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between"
            >
              <span className="text-xs text-[var(--impulse-text-secondary)]">
                {isEditMode ? "Edit mode active" : "MakersImpulse Admin"}
              </span>
              
              <AdminTooltip content="Settings">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/admin/settings")}
                >
                  <Settings className="w-4 h-4 text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-primary)]" />
                </motion.button>
              </AdminTooltip>
            </motion.div>
          ) : (
            <motion.div
              key="sidebar-collapsed-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <div className="w-5 h-5 rounded-full bg-[var(--impulse-primary)]/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[var(--impulse-primary)]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
