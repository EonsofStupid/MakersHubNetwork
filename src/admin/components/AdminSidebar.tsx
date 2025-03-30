import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { adminNavigationItems } from '@/admin/config/navigation.config';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { scrollbarStyle } from '@/admin/utils/styles';
import { EditModeToggle } from '@/admin/components/ui/EditModeToggle';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import { NavigationItem } from '@/admin/components/navigation/NavigationItem';
import { useAdminDataSync } from '@/admin/services/adminData.service';

// Import the navigation and new electric CSS
import '@/admin/styles/navigation.css';
import '@/admin/styles/sidebar-navigation.css';
import '@/admin/styles/drag-drop.css';
import '@/admin/styles/electric-effects.css';

// Framer Motion variants
const titleVariants = {
  expanded: { opacity: 1, x: 0, transition: { delay: 0.1 } },
  collapsed: { opacity: 0, x: -10 }
};

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode] = useAtom(adminEditModeAtom);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const { 
    sidebarExpanded, 
    setSidebarExpanded, 
    activeSection,
    setActiveSection,
    hasPermission,
    showLabels,
    setShowLabels,
    isDarkMode
  } = useAdminStore();
  
  // Track mouse position for electric effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      
      const rect = sidebarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      sidebarRef.current.style.setProperty('--mouse-x', `${x}px`);
      sidebarRef.current.style.setProperty('--mouse-y', `${y}px`);
    };
    
    const sidebarEl = sidebarRef.current;
    if (sidebarEl) {
      sidebarEl.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (sidebarEl) {
        sidebarEl.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);
  
  // Sync admin preferences with the database
  const { isSyncing } = useAdminDataSync({
    sidebarExpanded,
    activeSection,
    showLabels
  }, (data) => {
    // This callback updates the store when data is loaded from the database
    if (data.sidebarExpanded !== undefined) setSidebarExpanded(data.sidebarExpanded);
    if (data.activeSection !== undefined) setActiveSection(data.activeSection);
    if (data.showLabels !== undefined) setShowLabels(data.showLabels);
  });

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

  // Generate random idle animation delay
  const generateRandomDelay = () => {
    return Math.random() * 5;
  };

  // Add cyber scan lines to sidebar
  useEffect(() => {
    // Create random scan lines at random intervals
    const createScanLine = () => {
      const sidebarElement = document.querySelector('.admin-sidebar');
      if (!sidebarElement) return;
      
      const scanLine = document.createElement('div');
      scanLine.className = 'admin-sidebar-scan';
      sidebarElement.appendChild(scanLine);
      
      setTimeout(() => {
        sidebarElement.removeChild(scanLine);
      }, 15000); // Remove after animation completes
    };
    
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        createScanLine();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      ref={sidebarRef}
      className={cn(
        "admin-sidebar h-full flex flex-col",
        "electric-background glitch-effect",
        isDarkMode ? "apple-glass-dark" : "apple-glass"
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
              <motion.span 
                className="text-sm font-medium text-[var(--impulse-text-primary)] px-2 idle-flicker cyber-text"
                style={{ animationDelay: `${generateRandomDelay()}s` }}
              >
                Admin Navigation
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-2">
          {sidebarExpanded && (
            <>
              <EditModeToggle className="mr-1" />
              <AdminTooltip content={showLabels ? "Hide labels" : "Show labels"}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowLabels(!showLabels)}
                  className="p-2 rounded-full text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-primary)] transition-colors hover-glow"
                >
                  {showLabels ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </motion.button>
              </AdminTooltip>
            </>
          )}
          
          <AdminTooltip content={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-2 rounded-full bg-[var(--impulse-bg-main)] text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-primary)] transition-colors hover-glow"
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
          "admin-sidebar__content flex-1 overflow-y-auto py-4",
          scrollbarStyle
        )}
        id="main-navigation"
        data-container-id="main-navigation"
      >
        <div className={sidebarExpanded ? "px-2" : "px-1"}>
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, index) => (
              <NavigationItem
                key={item.id}
                id={item.id}
                label={showLabels ? item.label : ""}
                icon={item.icon}
                description={item.description}
                isActive={activeSection === item.id}
                onClick={() => handleNavClick(item.path, item.id)}
                tooltipContent={!showLabels || !sidebarExpanded ? `${item.label}: ${item.description}` : undefined}
                showTooltip={!showLabels || !sidebarExpanded}
                className={cn(
                  sidebarExpanded ? "mx-2" : "justify-center mx-2 px-0",
                  !showLabels && sidebarExpanded && "justify-center",
                  "electric-nav-item",
                  `random-color-${(index % 5) + 1}`
                )}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {isEditMode && sidebarExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 mx-4 p-2 rounded-md bg-[var(--impulse-primary)]/10 border border-[var(--impulse-border-normal)] electric-border"
          >
            <p className="text-xs text-[var(--impulse-primary)] text-center">
              Drag items to customize your dashboard
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
              {isSyncing && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="sidebar-collapsed-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <span className="text-xs text-[var(--impulse-primary)]">
                {isEditMode ? "✏️" : "🛠️"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
