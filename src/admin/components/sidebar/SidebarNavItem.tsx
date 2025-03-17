
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SidebarNavItemProps {
  id: string;
  label: string;
  path: string;
  icon: React.ReactElement;
  isActive: boolean;
  collapsed: boolean;
  index: number;
  onNavigate: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  id,
  label,
  path,
  icon,
  isActive,
  collapsed,
  index,
  onNavigate
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Handle navigation with proper logging
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`SidebarNavItem: Navigating to ${path}`);
    navigate(path);
    onNavigate();
  };

  // Animation variants for item entry
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2
      }
    })
  };

  // Default styles for all items
  const commonClasses = cn(
    "cyber-nav-item flex w-full items-center rounded-md text-sm font-medium transition-all",
    "relative overflow-hidden border",
    isActive 
      ? "border-primary/40 bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,240,255,0.1)]" 
      : "border-transparent text-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-primary",
    collapsed ? "px-2 py-2 justify-center" : "px-3 py-2",
    isHovered && !isActive && "hover:shadow-[0_0_8px_rgba(0,240,255,0.08)]"
  );

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <a
        href={path}
        className={commonClasses}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-current={isActive ? "page" : undefined}
      >
        {/* Icon with potential animation */}
        <span className={cn(
          "flex-shrink-0 transition-transform", 
          isActive && "text-primary",
          isHovered && !isActive && "text-primary/80"
        )}>
          {React.cloneElement(icon, { 
            className: cn(icon.props.className, isHovered && !collapsed && "mr-1") 
          })}
        </span>
        
        {/* Label with fade effect when collapsed */}
        {!collapsed && (
          <span className="ml-3 truncate">{label}</span>
        )}
        
        {/* Active indicator */}
        {isActive && (
          <motion.div 
            className="absolute inset-y-0 left-0 w-1 bg-primary"
            layoutId="activeNavIndicator"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        
        {/* Hover shine effect */}
        {(isHovered || isActive) && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 cyber-scan-animate" />
        )}
      </a>
    </motion.div>
  );
};
