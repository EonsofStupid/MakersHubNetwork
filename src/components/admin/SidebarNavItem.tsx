
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactElement;
  permission: string;
}

interface SidebarNavItemProps {
  item: NavItem;
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
  item,
  isActive,
  collapsed,
  index,
  onNavigate
}) => {
  const { label, icon } = item;

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
          collapsed && "px-2 py-2 justify-center"
        )}
        onClick={onNavigate}
        title={collapsed ? label : undefined}
      >
        <span className={collapsed ? "mr-0" : "mr-2"}>
          {React.cloneElement(icon, {
            className: `h-4 w-4 ${collapsed ? "" : "mr-2"}`
          })}
        </span>
        {!collapsed && label}
      </Button>
    </motion.div>
  );
};
