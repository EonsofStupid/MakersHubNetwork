
import React from 'react';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { Pencil, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { AdminTooltip } from './AdminTooltip';

export function EditModeToggle() {
  const [isEditMode, setIsEditMode] = useAtom(adminEditModeAtom);
  const logger = useLogger("EditModeToggle", LogCategory.ADMIN);

  const toggleEditMode = () => {
    const newMode = !isEditMode;
    setIsEditMode(newMode);
    logger.info(`Edit mode ${newMode ? 'enabled' : 'disabled'}`);
  };

  return (
    <AdminTooltip content={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}>
      <button
        onClick={toggleEditMode}
        className={cn(
          "fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg",
          "transition-all duration-200 hover:scale-110",
          isEditMode 
            ? "bg-green-500 hover:bg-green-600" 
            : "bg-blue-500 hover:bg-blue-600"
        )}
      >
        {isEditMode ? (
          <Check className="h-5 w-5 text-white" />
        ) : (
          <Pencil className="h-5 w-5 text-white" />
        )}
      </button>
    </AdminTooltip>
  );
}

