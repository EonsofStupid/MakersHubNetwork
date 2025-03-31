import React from 'react';
import { motion } from 'framer-motion';
import { Edit, X } from 'lucide-react';
import { useAdminStore } from '@/admin/store/admin.store';
import { cn } from '@/lib/utils';
import { AdminTooltip } from './AdminTooltip';

interface EditModeToggleProps {
  className?: string;
}

export function EditModeToggle({ className }: EditModeToggleProps) {
  const { isEditMode, toggleEditMode } = useAdminStore();
  
  return (
    <AdminTooltip content={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleEditMode}
        className={cn(
          "p-2 rounded-full transition-all duration-300",
          isEditMode 
            ? "bg-[var(--impulse-primary)] text-white shadow-glow" 
            : "bg-[var(--impulse-bg-hover)] text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-primary)] hover:bg-[var(--impulse-primary)]/20",
          className
        )}
      >
        {isEditMode ? (
          <X className="w-4 h-4" />
        ) : (
          <Edit className="w-4 h-4" />
        )}
        
        <style>
          {`
            .shadow-glow {
              box-shadow: 0 0 15px var(--impulse-primary);
            }
          `}
        </style>
      </motion.button>
    </AdminTooltip>
  );
}
