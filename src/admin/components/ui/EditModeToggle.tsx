
import React from 'react';
import { Edit, Check } from 'lucide-react';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { cn } from '@/lib/utils';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { AdminTooltip } from './AdminTooltip';

export function EditModeToggle() {
  const [isEditMode, setIsEditMode] = useAtom(adminEditModeAtom);
  const logger = useLogger('EditModeToggle', LogCategory.ADMIN);
  
  const toggleEditMode = () => {
    logger.info(`Toggling edit mode: ${!isEditMode}`);
    setIsEditMode(!isEditMode);
  };
  
  return (
    <AdminTooltip
      content={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
      side="right"
    >
      <button
        onClick={toggleEditMode}
        className={cn(
          'p-2 rounded-full transition-colors',
          isEditMode 
            ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' 
            : 'text-[var(--impulse-text-secondary)] hover:bg-[var(--impulse-border-hover)]'
        )}
      >
        {isEditMode ? (
          <Check className="w-5 h-5" />
        ) : (
          <Edit className="w-5 h-5" />
        )}
      </button>
    </AdminTooltip>
  );
}
