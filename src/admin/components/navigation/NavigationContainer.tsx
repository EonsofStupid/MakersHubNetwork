
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';

interface NavigationContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  expanded?: boolean;
}

export function NavigationContainer({ 
  children, 
  className, 
  title,
  expanded = true 
}: NavigationContainerProps) {
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  // Animation variants
  const containerVariants = {
    expanded: { 
      width: '240px', 
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    collapsed: { 
      width: '70px', 
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="expanded"
      animate={expanded ? "expanded" : "collapsed"}
      className={cn(
        "admin-navigation-container h-full overflow-hidden rounded-xl border",
        "border-[var(--impulse-border-normal)] bg-[var(--impulse-bg-card)]",
        "backdrop-blur-md flex flex-col",
        isEditMode && "border-[var(--impulse-primary)]/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
