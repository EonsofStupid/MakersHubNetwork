
import React from 'react';
import { Edit } from 'lucide-react';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function EditModeToggle() {
  const [isEditMode, setIsEditMode] = useAtom(adminEditModeAtom);
  
  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsEditMode(prev => !prev)}
      className={cn(
        "fixed bottom-4 right-4 h-12 w-12 rounded-full flex items-center justify-center z-50",
        "shadow-lg transition-colors duration-300",
        isEditMode 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted text-muted-foreground"
      )}
    >
      <Edit className="h-5 w-5" />
    </motion.button>
  );
}
