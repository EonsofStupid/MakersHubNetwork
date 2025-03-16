
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

// Animation variants
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
  
  const commonClasses = cn(
    "flex w-full items-center px-3 py-2 rounded-md text-sm font-normal transition-colors",
    isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/5",
    collapsed && "px-2 py-2 justify-center"
  );

  // Use a direct navigation approach to avoid issues with TanStack Router
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`SidebarNavItem: Navigating to ${path}`);
    navigate(path);
    if (onNavigate) onNavigate();
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <button
        onClick={handleClick}
        className={commonClasses}
        title={collapsed ? label : undefined}
      >
        <span className={collapsed ? "mr-0" : "mr-2"}>
          {React.cloneElement(icon, {
            className: `h-4 w-4 ${collapsed ? "" : "mr-2"}`
          })}
        </span>
        {!collapsed && label}
      </button>
    </motion.div>
  );
};
