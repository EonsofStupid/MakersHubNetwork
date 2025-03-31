
import React from 'react';
import { motion } from 'framer-motion';
import { Edit, X } from 'lucide-react';
import { useAdminStore } from '@/admin/store/admin.store';
import { cn } from '@/lib/utils';
import { AdminTooltip } from './AdminTooltip';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';

interface EditModeToggleProps {
  className?: string;
}

export function EditModeToggle({ className }: EditModeToggleProps) {
  const { toggleEditMode } = useAdminStore();
  const [isEditMode, setEditMode] = useAtom(adminEditModeAtom);
  
  const handleToggleClick = () => {
    toggleEditMode();
    setEditMode(!isEditMode);
    console.log("Edit mode toggled:", !isEditMode); // Debug
    
    // Force edit mode class on body
    if (!isEditMode) {
      document.body.classList.add('edit-mode');
    } else {
      document.body.classList.remove('edit-mode');
    }
  };
  
  return (
    <>
      <AdminTooltip content={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleClick}
          className={cn(
            "p-2 rounded-full transition-all duration-300",
            isEditMode 
              ? "bg-[var(--impulse-primary)] text-[var(--impulse-bg-main)] shadow-glow" 
              : "bg-[var(--impulse-bg-hover)] text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-primary)] hover:bg-[var(--impulse-primary)]/20",
            className
          )}
        >
          {isEditMode ? (
            <X className="w-4 h-4" />
          ) : (
            <Edit className="w-4 h-4" />
          )}
          
          {isEditMode && (
            <motion.div
              className="absolute inset-0 rounded-full z-[-1]"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(0, 240, 255, 0)",
                  "0 0 0 4px rgba(0, 240, 255, 0.2)",
                  "0 0 0 0 rgba(0, 240, 255, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </AdminTooltip>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .shadow-glow {
            box-shadow: 0 0 15px var(--impulse-primary);
          }
        `
      }} />
    </>
  );
}
