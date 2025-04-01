
import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import {
  dragSourceIdAtom,
  dragTargetIdAtom,
  isDraggingAtom,
  dropIndicatorPositionAtom,
  adminEditModeAtom
} from '@/admin/atoms/tools.atoms';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

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
  
  // Handle drag start
  const handleDragStart = useCallback((e: DragEvent, itemId: string) => {
    if (dragOnlyInEditMode && !isEditMode) {
      e.preventDefault();
      return;
    }
    
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', itemId);
      e.dataTransfer.effectAllowed = 'move';
    }
    
    setDragSourceId(itemId);
    setIsDragging(true);
    logger.info(`Drag started: ${itemId}`);
  }, [setDragSourceId, setIsDragging, logger, dragOnlyInEditMode, isEditMode]);
  
  // Handle drag over
  const handleDragOver = useCallback((e: DragEvent, itemId: string) => {
    e.preventDefault();
    
    if (dragSourceId === itemId) {
      setDropPosition('none');
      return;
    }
    
    setDragTargetId(itemId);
    
    // Determine drop position (above or below target)
    if (e.currentTarget instanceof HTMLElement) {
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const position = y < rect.height / 2 ? 'top' : 'bottom';
      setDropPosition(position);
    }
  }, [dragSourceId, setDragTargetId, setDropPosition]);
  
  // Handle drop
  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    
    const droppedItemId = e.dataTransfer?.getData('text/plain');
    
    if (!droppedItemId || !dragTargetId) {
      return;
    }
    
    // External drop handling
    if (acceptExternalItems && !items.includes(droppedItemId)) {
      logger.info(`External item dropped: ${droppedItemId}`);
      if (onDrop) {
        onDrop(droppedItemId, dragTargetId);
      }
      return;
    }
    
    // Reordering
    if (dragSourceId && dragTargetId && onReorder) {
      const newItems = [...items];
      const sourceIndex = newItems.indexOf(dragSourceId);
      const targetIndex = newItems.indexOf(dragTargetId);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        newItems.splice(sourceIndex, 1);
        
        // Insert at the correct position based on drop position
        const insertIndex = dropPosition === 'top' ? 
          targetIndex > sourceIndex ? targetIndex - 1 : targetIndex : 
          targetIndex > sourceIndex ? targetIndex : targetIndex + 1;
        
        newItems.splice(insertIndex, 0, dragSourceId);
        onReorder(newItems);
        
        logger.info(`Item reordered: ${dragSourceId} to position ${insertIndex}`);
      }
    }
    
    // Reset drag state
    setIsDragging(false);
    setDragSourceId(null);
    setDragTargetId(null);
    setDropPosition('none');
  }, [dragSourceId, dragTargetId, items, dropPosition, setIsDragging, setDragSourceId, setDragTargetId, setDropPosition, onReorder, onDrop, logger, acceptExternalItems]);
  
  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragSourceId(null);
    setDragTargetId(null);
    setDropPosition('none');
  }, [setIsDragging, setDragSourceId, setDragTargetId, setDropPosition]);
  
  // Register drop zone
  const registerDropZone = useCallback((element: HTMLElement) => {
    if (!element) return;
    
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (dragOnlyInEditMode && !isEditMode) return;
      
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
    };
    
    const onDrop = (e: DragEvent) => {
      if (dragOnlyInEditMode && !isEditMode) return;
      handleDrop(e);
    };
    
    element.addEventListener('dragover', onDragOver);
    element.addEventListener('drop', onDrop);
    
    // Return cleanup function
    return () => {
      element.removeEventListener('dragover', onDragOver);
      element.removeEventListener('drop', onDrop);
    };
  }, [handleDrop, dragOnlyInEditMode, isEditMode]);
  
  // Register draggable item
  const registerDraggable = useCallback((element: HTMLElement, itemId: string) => {
    if (!element) return;
    
    const onDragStart = (e: DragEvent) => handleDragStart(e, itemId);
    const onDragOver = (e: DragEvent) => handleDragOver(e, itemId);
    const onDragEnd = () => handleDragEnd();
    
    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', onDragStart);
    element.addEventListener('dragover', onDragOver);
    element.addEventListener('dragend', onDragEnd);
    
    // Return cleanup function
    return () => {
      element.removeAttribute('draggable');
      element.removeEventListener('dragstart', onDragStart);
      element.removeEventListener('dragover', onDragOver);
      element.removeEventListener('dragend', onDragEnd);
    };
  }, [handleDragStart, handleDragOver, handleDragEnd]);
  
  // Add the makeDraggable function to match component usage
  const makeDraggable = useCallback((element: HTMLElement, itemId: string) => {
    return registerDraggable(element, itemId);
  }, [registerDraggable]);
  
  return {
    isDragging,
    dragSourceId,
    dragTargetId,
    dropPosition,
    registerDropZone,
    registerDraggable,
    makeDraggable // Add this method
  };
}
