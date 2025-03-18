
import React, { useState } from "react";
import { SidebarNavItem } from "./SidebarNavItem";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NavItem } from "./navigation.config";

interface SidebarNavListProps {
  items: NavItem[];
  collapsed: boolean;
  currentPath: string;
  hasPermission: (permission: string) => boolean;
  onNavigation: (item: NavItem) => void;
}

export const SidebarNavList: React.FC<SidebarNavListProps> = ({
  items,
  collapsed,
  currentPath,
  hasPermission,
  onNavigation
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Check if an item is active based on route path
  const isItemActive = (item: NavItem) => {
    return currentPath === item.path || 
           (currentPath.startsWith('/admin') && item.path === '/admin/overview' && currentPath === '/admin');
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  // Filter items based on permissions
  const filteredItems = items.filter(item => hasPermission(item.permission));

  return (
    <nav 
      className={`relative ${collapsed ? "p-1" : "p-2"} overflow-hidden cyber-animated-bg`}
      onMouseLeave={() => setHoverIndex(null)}
    >
      <motion.ul 
        className="space-y-1"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <AnimatePresence>
          {filteredItems.map((item, index) => (
            <motion.li 
              key={item.id}
              onMouseEnter={() => setHoverIndex(index)}
              className="relative"
            >
              {collapsed && item.description ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <SidebarNavItem
                          id={item.id}
                          label={item.label}
                          path={item.path}
                          icon={item.icon}
                          isActive={isItemActive(item)}
                          collapsed={collapsed}
                          index={index}
                          onNavigate={() => onNavigation(item)}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right" 
                      className="bg-background/80 backdrop-blur border border-primary/20"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <SidebarNavItem
                  id={item.id}
                  label={item.label}
                  path={item.path}
                  icon={item.icon}
                  isActive={isItemActive(item)}
                  collapsed={collapsed}
                  index={index}
                  onNavigate={() => onNavigation(item)}
                />
              )}
              
              {/* Data stream effect - only shown on hover */}
              {hoverIndex === index && (
                <motion.div 
                  className="absolute left-0 right-0 h-[1px] cyber-data-stream"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </nav>
  );
};
