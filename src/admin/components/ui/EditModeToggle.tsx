
import React from 'react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { Edit, Check } from 'lucide-react';
import { AdminTooltip } from './AdminTooltip';
import { cn } from '@/lib/utils';

interface EditModeToggleProps {
  className?: string;
}

export const EditModeToggle: React.FC<EditModeToggleProps> = ({ className = '' }) => {
  const [editMode, setEditMode] = useAtom(adminEditModeAtom);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <AdminTooltip 
      content={editMode ? "Exit edit mode" : "Enter edit mode"}
      side="bottom"
    >
      <motion.button
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all",
          editMode 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground hover:bg-muted/80",
          className
        )}
        onClick={toggleEditMode}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        layout
      >
        <motion.span
          initial={false}
          animate={{ rotate: editMode ? 360 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {editMode ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Edit className="w-3.5 h-3.5" />
          )}
        </motion.span>
        
        <span className="font-medium">
          {editMode ? "Done" : "Edit"}
        </span>
        
        {editMode && (
          <motion.div 
            className="absolute inset-0 rounded-md -z-10"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              boxShadow: [
                "0 0 5px rgba(0, 240, 255, 0.3)",
                "0 0 15px rgba(0, 240, 255, 0.7)",
                "0 0 5px rgba(0, 240, 255, 0.3)"
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity 
            }}
          />
        )}
      </motion.button>
    </AdminTooltip>
  );
};
