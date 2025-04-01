
import React from 'react';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { Edit, Eye } from 'lucide-react';
import { AdminTooltip } from './AdminTooltip';

export function EditModeToggle() {
  const [isEditMode, setEditMode] = useAtom(adminEditModeAtom);
  
  return (
    <AdminTooltip 
      content={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
      side="left"
    >
      <button
        onClick={() => setEditMode(!isEditMode)}
        className={`fixed right-4 top-20 z-50 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all
          ${isEditMode 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
      >
        {isEditMode ? (
          <Eye className="h-5 w-5" />
        ) : (
          <Edit className="h-5 w-5" />
        )}
      </button>
    </AdminTooltip>
  );
}
