
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link as TanStackLink } from '@tanstack/react-router';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from "framer-motion";

interface SidebarNavItemProps {
  id: string;
  label: string;
  path: string;
  legacyPath: string;
  icon: React.ReactElement;
  isActive: boolean;
  collapsed: boolean;
  index: number;
  useTanStackRouter: boolean;
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
  legacyPath,
  icon,
  isActive,
  collapsed,
  index,
  useTanStackRouter,
  onNavigate
}) => {
  const commonClasses = cn(
    "flex w-full items-center px-3 py-2 rounded-md text-sm font-normal transition-colors",
    isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/5",
    collapsed && "px-2 py-2 justify-center"
  );

  if (useTanStackRouter) {
    return (
      <motion.div
        custom={index}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <TanStackLink
          to={path}
          onClick={onNavigate}
          className={commonClasses}
          title={collapsed ? label : undefined}
          preload="intent"
        >
          <span className={collapsed ? "mr-0" : "mr-2"}>
            {React.cloneElement(icon, {
              className: `h-4 w-4 ${collapsed ? "" : "mr-2"}`
            })}
          </span>
          {!collapsed && label}
        </TanStackLink>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        custom={index}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-normal",
            isActive && "bg-primary/10 text-primary",
            collapsed && "px-2 py-2"
          )}
          asChild
          title={collapsed ? label : undefined}
        >
          <RouterLink to={legacyPath} onClick={onNavigate}>
            <span className={collapsed ? "mr-0" : "mr-2"}>
              {React.cloneElement(icon, {
                className: `h-4 w-4 ${collapsed ? "" : "mr-2"}`
              })}
            </span>
            {!collapsed && label}
          </RouterLink>
        </Button>
      </motion.div>
    );
  }
};
