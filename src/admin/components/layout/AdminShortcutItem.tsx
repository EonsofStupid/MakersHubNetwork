
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import styles from './styles/AdminHeader.module.css';

interface AdminShortcutItemProps {
  shortcut: {
    id: string;
    label: string;
    path: string;
    icon: React.ReactNode;
  };
  index: number;
  isIconOnly: boolean;
}

export const AdminShortcutItem: React.FC<AdminShortcutItemProps> = ({
  shortcut,
  index,
  isIconOnly
}) => {
  const navigate = useNavigate();

  return (
    <Draggable draggableId={shortcut.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className={cn(
            styles.shortcutItem,
            snapshot.isDragging && "z-50"
          )}
        >
          <Tooltip
            content={isIconOnly ? shortcut.label : null}
            side="bottom"
            className={styles.cyberTooltip}
          >
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                styles.shortcutButton,
                styles.iconOnlyTransition
              )}
              onClick={() => navigate(shortcut.path)}
            >
              {shortcut.icon}
              {!isIconOnly && (
                <span className={styles.shortcutLabel}>
                  {shortcut.label}
                </span>
              )}
            </Button>
          </Tooltip>
        </motion.div>
      )}
    </Draggable>
  );
};
