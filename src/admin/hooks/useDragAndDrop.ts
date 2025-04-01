
import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { PanInfo } from 'framer-motion';
import {
  dragSourceIdAtom,
  dragTargetIdAtom,
  isDraggingAtom,
  dropIndicatorPositionAtom,
  adminEditModeAtom
} from '@/admin/atoms/tools.atoms';
import { useLogger } from '@/hooks/use-logger';
import { LogLevel, LogCategory } from '@/logging';

interface DragAndDropOptions {
  items: string[];
  onReorder?: (newItems: string[]) => void;
  onDrop?: (item: string, target: string) => void;
  containerId?: string;
  dragOnlyInEditMode?: boolean;
  acceptExternalItems?: boolean;
}

export function useDragAndDrop({
  items,
  onReorder,
  onDrop,
  containerId,
  dragOnlyInEditMode = false,
  acceptExternalItems = false
}: DragAndDropOptions) {
  const [dragSourceId, setDragSourceId] = useAtom(dragSourceIdAtom);
  const [dragTargetId, setDragTargetId] = useAtom(dragTargetIdAtom);
  const [isDragging, setIsDragging] = useAtom(isDraggingAtom);
  const [dropPosition, setDropPosition] = useAtom(dropIndicatorPositionAtom);
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  const logger = useLogger('DragAndDrop', LogCategory.ADMIN);
  
  // Handle drag start using Framer Motion
  const handleDragStart = useCallback((info: PanInfo, itemId: string) => {
    if (dragOnlyInEditMode && !isEditMode) {
      return;
    }
    
    setDragSourceId(itemId);
    setIsDragging(true);
    logger.debug(`Drag started: ${itemId}`);
  }, [setDragSourceId, setIsDragging, logger, dragOnlyInEditMode, isEditMode]);
  
  // Handle drag end using Framer Motion
  const handleDragEnd = useCallback((info: PanInfo) => {
    setIsDragging(false);
    setDragSourceId(null);
    setDragTargetId(null);
    setDropPosition('none');
  }, [setIsDragging, setDragSourceId, setDragTargetId, setDropPosition]);
  
  // Function to make an element draggable with Framer Motion
  const makeDraggable = useCallback((element: HTMLElement, itemId: string) => {
    // We can't fully implement this here as Framer Motion requires component-level props
    // This is more of a connector function to be used with framer-motion components
    
    // Return cleanup function
    return () => {
      // Cleanup logic if needed
    };
  }, []);
  
  return {
    isDragging,
    dragSourceId,
    dragTargetId,
    dropPosition,
    makeDraggable,
    handleDragStart,
    handleDragEnd
  };
}
