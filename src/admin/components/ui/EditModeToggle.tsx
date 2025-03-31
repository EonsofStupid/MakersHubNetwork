
import React from 'react';
import { motion } from 'framer-motion';
import { Edit, X } from 'lucide-react';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AdminTooltip } from './AdminTooltip';

interface EditModeToggleProps {
  className?: string;
}

export function EditModeToggle({ className }: EditModeToggleProps) {
  const [isEditMode, setEditMode] = useAtom(adminEditModeAtom);
  const { toast } = useToast();
  
  const toggleEditMode = () => {
    setEditMode(!isEditMode);
    
    if (!isEditMode) {
      toast({
        title: "Edit Mode Enabled",
        description: "You can now customize your admin interface by dragging items",
        duration: 4000,
      });
      
      // Add edit-mode class to body for global styling
      document.body.classList.add('edit-mode');
    } else {
      toast({
        title: "Edit Mode Disabled",
        description: "Your customizations have been saved",
      });
      
      // Remove edit-mode class from body
      document.body.classList.remove('edit-mode');
    }
  };
  
  return (
    <AdminTooltip content={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleEditMode}
        className={cn(
          "p-1.5 rounded-full transition-colors",
          isEditMode 
            ? "bg-[var(--impulse-primary)]/20 text-[var(--impulse-primary)]" 
            : "text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-primary)] hover:bg-[var(--impulse-bg-hover)]",
          className
        )}
      >
        {isEditMode ? (
          <X className="w-4 h-4" />
        ) : (
          <Edit className="w-4 h-4" />
        )}
      </motion.button>
    </AdminTooltip>
  );
}
