
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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

// Animation variants for item appearance
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

// Hover animation variants
const hoverVariants = {
  initial: { 
    scale: 1,
    boxShadow: "0 0 0 rgba(0, 240, 255, 0)" 
  },
  hover: { 
    scale: 1.02,
    boxShadow: "0 0 12px rgba(0, 240, 255, 0.3)" 
  },
  tap: { 
    scale: 0.98,
    boxShadow: "0 0 15px rgba(0, 240, 255, 0.4)" 
  }
};

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
  
  // Create base classes for the nav item
  const baseClasses = cn(
    "flex items-center rounded-md transition-all duration-200 cursor-pointer overflow-hidden relative",
    collapsed ? "px-2 py-2 justify-center w-10 mx-auto" : "px-3 py-2 w-full",
    isActive ? "cyber-nav-active" : "cyber-nav-item"
  );

  // Icon classes with proper styling
  const iconClasses = cn(
    "flex-shrink-0 transition-all duration-200",
    collapsed ? "h-5 w-5" : "h-4 w-4 mr-2",
    isActive ? "text-primary" : "text-muted-foreground"
  );
  
  // Text classes with responsive display
  const textClasses = cn(
    "whitespace-nowrap font-medium transition-all duration-200",
    isActive ? "text-primary" : "text-foreground",
    collapsed && "sr-only"
  );

  // Handle navigation with feedback
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`SidebarNavItem: Navigating to ${path}`);
    
    // Add visual feedback before navigation
    const target = e.currentTarget;
    target.classList.add("nav-item-clicked");
    
    // Use a short timeout to allow the animation to play
    setTimeout(() => {
      navigate(path);
      if (onNavigate) onNavigate();
      target.classList.remove("nav-item-clicked");
    }, 150);
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      className="w-full"
    >
      <motion.button
        onClick={handleClick}
        className={baseClasses}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={hoverVariants}
        title={collapsed ? label : undefined}
      >
        {/* Active indicator bar */}
        {isActive && (
          <motion.div 
            className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-md"
            layoutId="activeIndicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Icon with reactive styling */}
        {React.cloneElement(icon, {
          className: iconClasses
        })}
        
        {/* Label text - hidden when collapsed */}
        <span className={textClasses}>{label}</span>
        
        {/* Hover effect overlay */}
        <div className="cyber-glow-effect absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 
                       bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0" />
      </motion.button>
    </motion.div>
  );
};
