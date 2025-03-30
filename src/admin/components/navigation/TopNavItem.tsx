
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminTooltip } from '../ui/AdminTooltip';

interface TopNavItemProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
  isEditMode?: boolean;
  className?: string;
}

export function TopNavItem({
  id,
  icon,
  label,
  onClick,
  onRemove,
  isEditMode = false,
  className
}: TopNavItemProps) {
  return (
    <div className="relative">
      <AdminTooltip content={label} side="bottom">
        <motion.button
          layoutId={`topnav-${id}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          className={cn(
            "admin-topnav-item p-2 rounded-full",
            "bg-[var(--impulse-bg-card)]",
            "text-[var(--impulse-text-primary)]",
            "hover:bg-[var(--impulse-primary)]/20",
            "hover:text-[var(--impulse-primary)]",
            "transition-all",
            className
          )}
        >
          {icon}
        </motion.button>
      </AdminTooltip>
      
      {isEditMode && onRemove && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
          onClick={onRemove}
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}
    </div>
  );
}
