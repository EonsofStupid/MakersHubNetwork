
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Edit,
  X,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { adminNavigationItems } from '@/admin/config/navigation.config';
import { useAdmin } from '@/admin/context/AdminContext';
import { NavigationItem } from './navigation/NavigationItem';
import { useToast } from '@/hooks/use-toast';

export function AdminSidebar({ collapsed = false, className }: { collapsed?: boolean, className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { 
    sidebarExpanded, 
    toggleSidebar, 
    isEditMode, 
    toggleEditMode,
    setDragSource, 
    setActiveSection
  } = useAdminStore();
  const { checkPermission } = useAdmin();
  
  const isCollapsed = collapsed ? collapsed : !sidebarExpanded;
  
  // Get current section from the path
  const currentPath = location.pathname.split('/').pop() || 'overview';
  const activeItem = currentPath;
  
  // Set active section based on path
  useEffect(() => {
    setActiveSection(currentPath);
  }, [currentPath, setActiveSection]);
  
  // Handle click on navigation item
  const handleNavigate = (itemId: string, path: string) => {
    navigate(path);
    setActiveSection(itemId);
  };

  // Toggle edit mode
  const handleToggleEditMode = () => {
    if (isEditMode) {
      toast({
        title: "Edit Mode Disabled",
        description: "You've exited the edit mode for navigation customization.",
      });
    } else {
      toast({
        title: "Edit Mode Enabled",
        description: "You can now drag menu items to the top bar or dashboard.",
        duration: 5000,
      });
    }
    
    toggleEditMode();
  };

  // Animation variants
  const sidebarVariants = {
    expanded: { width: 'auto' },
    collapsed: { width: '4.5rem' }
  };
  
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        ...(isCollapsed ? sidebarVariants.collapsed : sidebarVariants.expanded)
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "admin-sidebar",
        "bg-[var(--impulse-bg-overlay)] backdrop-filter backdrop-blur-xl",
        "border border-[var(--impulse-border-normal)] rounded-lg shadow-sm",
        isCollapsed && "sidebar-collapsed",
        className
      )}
    >
      <div className="admin-sidebar__header">
        {!isCollapsed && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleEditMode}
            className={cn(
              "p-1 rounded-full text-[var(--impulse-text-secondary)]",
              isEditMode ? "bg-[rgba(0,240,255,0.2)]" : "hover:bg-[rgba(0,240,255,0.2)]"
            )}
          >
            {isEditMode ? (
              <X className="w-5 h-5" />
            ) : (
              <Edit className="w-5 h-5" />
            )}
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className={cn(
            "p-1 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-secondary)]",
            !isCollapsed && "ml-auto"
          )}
        >
          {sidebarExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </motion.button>
      </div>
      
      <div className="admin-sidebar__content">
        <AnimatePresence mode="popLayout">
          {adminNavigationItems.map(item => {
            if (!checkPermission(item.permission)) {
              return null;
            }
            
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <NavigationItem
                  id={item.id}
                  icon={item.icon}
                  label={item.label}
                  description={item.description}
                  isActive={activeItem === item.id}
                  onClick={() => handleNavigate(item.id, item.path)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isEditMode && !isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 mx-4 p-3 border border-dashed border-[var(--impulse-border-normal)] rounded-lg text-center"
          >
            <p className="text-xs text-[var(--impulse-text-secondary)] mb-2">
              Drag menu items to the top navigation or dashboard shortcuts
            </p>
            {isEditMode && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-[var(--impulse-primary)]"
              >
                Edit mode active
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
      
      <div className="admin-sidebar__footer">
        <NavigationItem
          id="backToSite"
          icon={<Home className="w-5 h-5" />}
          label="Back to Site"
          onClick={() => navigate('/')}
        />
      </div>
    </motion.aside>
  );
}
