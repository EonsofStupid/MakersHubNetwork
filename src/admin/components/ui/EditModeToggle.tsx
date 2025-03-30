
import React from 'react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { Edit, Check } from 'lucide-react';
import { AdminTooltip } from './AdminTooltip';

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
        className={`edit-mode-toggle ${editMode ? 'active' : ''} ${className}`}
        onClick={toggleEditMode}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {editMode ? (
          <>
            <Check className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">Done</span>
          </>
        ) : (
          <>
            <Edit className="w-4 h-4" />
            <span className="text-xs font-medium">Edit</span>
          </>
        )}
      </motion.button>
    </AdminTooltip>
  );
};
