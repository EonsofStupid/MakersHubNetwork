
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminStore } from "../store/admin.store";
import { adminNavigationItems } from "../config/navigation.config";

interface SidebarIconProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}

interface AdminSidebarProps {
  collapsed?: boolean;
}

function SidebarIcon({ 
  id, 
  icon, 
  label, 
  active = false, 
  expanded = true,
  onClick
}: SidebarIconProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg",
        "transition-all duration-300 relative overflow-hidden",
        active ? "bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-accent)]" : 
                "text-[var(--impulse-text-secondary)] hover:bg-[rgba(0,240,255,0.1)]"
      )}
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-[rgba(0,240,255,0.1)] relative z-10">
        {icon}
      </div>
      
      {expanded && (
        <span className="truncate relative z-10">{label}</span>
      )}
      
      {active && (
        <motion.div 
          layoutId="sidebar-active-indicator"
          className="absolute inset-0 bg-[var(--impulse-primary)] opacity-10 rounded-lg z-0" 
        />
      )}
    </motion.div>
  );
}

export function AdminSidebar({ collapsed = false }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarExpanded, toggleSidebar, hasPermission } = useAdminStore();
  
  // Use the collapsed prop if provided, otherwise use the store state
  const isCollapsed = collapsed ? collapsed : !sidebarExpanded;
  
  // Extract active section from path
  const currentPath = location.pathname;
  const activeItem = currentPath.split('/').pop() || 'overview';
  
  const handleIconClick = (path: string) => {
    navigate(path);
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "h-full",
        "transition-all duration-300 ease-in-out overflow-hidden",
        "bg-[var(--impulse-bg-overlay)] backdrop-filter backdrop-blur-xl",
        "border border-[var(--impulse-border-normal)] rounded-lg shadow-sm",
        isCollapsed ? "w-[4.5rem]" : "w-full"
      )}
    >
      <div className="flex flex-col h-full p-3 gap-1">
        <div className="flex justify-end mb-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-secondary)]"
          >
            {sidebarExpanded ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </motion.button>
        </div>
        
        <div className="space-y-1 overflow-y-auto scrollbar-thin">
          {adminNavigationItems.map(item => {
            // Only render items the user has permission to see
            if (!hasPermission(item.permission)) {
              return null;
            }
            
            return (
              <SidebarIcon
                key={item.id}
                id={item.id}
                icon={item.icon}
                label={item.label}
                active={activeItem === item.id}
                expanded={!isCollapsed}
                onClick={() => handleIconClick(item.path)}
              />
            );
          })}
        </div>
        
        <div className="mt-auto mb-4">
          <SidebarIcon
            id="backToSite"
            icon={<Home className="w-5 h-5" />}
            label="Back to Site"
            expanded={!isCollapsed}
            onClick={() => navigate('/')}
          />
        </div>
      </div>
    </motion.aside>
  );
}
