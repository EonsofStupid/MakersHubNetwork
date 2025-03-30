
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DashboardShortcutProps {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<any>;
  onClick?: () => void;
  onRemove?: (e: React.MouseEvent) => void;
  isEditMode?: boolean;
}

export function DashboardShortcut({
  id,
  title,
  description,
  icon: Icon,
  onClick,
  onRemove,
  isEditMode
}: DashboardShortcutProps) {
  // Get consistent color variation based on the first character of the id
  const colorVariant = React.useMemo(() => {
    const charCode = id.charCodeAt(0) || 0;
    return `color-${(charCode % 5) + 1}`;
  }, [id]);

  // Get consistent effect variation based on the second character of the id
  const effectVariant = React.useMemo(() => {
    const charCode = id.charCodeAt(1) || 0;
    return `cyber-effect-${(charCode % 3) + 1}`;
  }, [id]);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "dashboard-shortcut",
        "cyber-glow",
        effectVariant,
        colorVariant,
        isEditMode && "cursor-move"
      )}
      data-id={id}
      id={`shortcut-${id}`}
    >
      {isEditMode && onRemove && (
        <button
          onClick={onRemove}
          className="dashboard-shortcut__delete"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      
      <div className="dashboard-shortcut__icon">
        <Icon className="w-8 h-8" />
      </div>
      
      <h3 className="dashboard-shortcut__title cyber-text">
        {title}
      </h3>
      
      {description && (
        <p className="dashboard-shortcut__description">
          {description}
        </p>
      )}
    </motion.div>
  );
}
