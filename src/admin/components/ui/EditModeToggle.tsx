
import React from 'react';
import { motion } from 'framer-motion';
import { Edit, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { useToast } from '@/hooks/use-toast';
import { AdminTooltip } from './AdminTooltip';

interface EditModeToggleProps {
  className?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
}

export function EditModeToggle({ className, buttonSize = 'md' }: EditModeToggleProps) {
  const [isEditMode, setEditMode] = useAtom(adminEditModeAtom);
  const { toast } = useToast();
  
  const handleToggle = () => {
    const newMode = !isEditMode;
    setEditMode(newMode);
    
    if (newMode) {
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
        duration: 3000,
      });
      
      // Remove edit-mode class from body
      document.body.classList.remove('edit-mode');
    }
  };
  
  const sizeClasses = {
    sm: "p-1.5 rounded-md",
    md: "p-2 rounded-full",
    lg: "p-3 rounded-full"
  };
  
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };
  
  return (
    <AdminTooltip content={isEditMode ? "Exit Edit Mode" : "Customize Interface"}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        className={cn(
          "edit-mode-toggle transition-colors relative",
          sizeClasses[buttonSize],
          isEditMode 
            ? "bg-[var(--impulse-primary)]/20 text-[var(--impulse-primary)]" 
            : "text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-primary)] hover:bg-[var(--impulse-border-hover)]",
          isEditMode && "active",
          className
        )}
      >
        {isEditMode ? (
          <X className={iconSizes[buttonSize]} />
        ) : (
          <Edit className={iconSizes[buttonSize]} />
        )}
        
        {/* Animated glow effect */}
        {isEditMode && (
          <motion.span
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(0, 240, 255, 0)",
                "0 0 0 4px rgba(0, 240, 255, 0.3)",
                "0 0 0 0 rgba(0, 240, 255, 0)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        )}
      </motion.button>
    </AdminTooltip>
  );
}
