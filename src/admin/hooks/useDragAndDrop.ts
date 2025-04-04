
import { useState, useCallback, useEffect } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export interface DraggableItem {
  id: string;
  type: string;
  [key: string]: any;
}

export interface DragState<T extends DraggableItem> {
  isDragging: boolean;
  draggedItem: T | null;
  sourceIndex: number | null;
  targetIndex: number | null;
}

export interface DraggableItemProps {
  onDragStart: () => void;
  onDragOver: () => void;
  onDragEnd: () => void;
  onDragCancel: () => void;
  isDragging: boolean;
  isDropTarget: boolean;
}

export type DraggableItemWithProps<T extends DraggableItem> = T & DraggableItemProps;

/**
 * Hook for drag and drop functionality in admin components
 */
export function useDragAndDrop<T extends DraggableItem>(initialItems: T[]) {
  const [dragState, setDragState] = useState<DragState<T>>({
    isDragging: false,
    draggedItem: null,
    sourceIndex: null,
    targetIndex: null
  });
  
  const [orderedItems, setOrderedItems] = useState<T[]>(initialItems);
  const logger = useLogger('useDragAndDrop', { category: LogCategory.ADMIN });
  
  // Update items when props change
  useEffect(() => {
    if (!dragState.isDragging && JSON.stringify(initialItems) !== JSON.stringify(orderedItems)) {
      setOrderedItems(initialItems);
    }
  }, [initialItems, dragState.isDragging, orderedItems]);
  
  // Start dragging
  const handleDragStart = useCallback((item: T, index: number) => {
    logger.debug('Drag started', { details: { item, index } });
    setDragState({
      isDragging: true,
      draggedItem: item,
      sourceIndex: index,
      targetIndex: null
    });
  }, [logger]);
  
  // Update target position during drag
  const handleDragOver = useCallback((index: number) => {
    if (dragState.targetIndex !== index) {
      setDragState(prev => ({
        ...prev,
        targetIndex: index
      }));
    }
  }, [dragState.targetIndex]);
  
  // Complete drag operation
  const handleDrop = useCallback(() => {
    if (dragState.draggedItem && dragState.sourceIndex !== null && dragState.targetIndex !== null) {
      logger.debug('Item dropped', {
        details: {
          item: dragState.draggedItem,
          fromIndex: dragState.sourceIndex,
          toIndex: dragState.targetIndex
        }
      });
      
      // Reorder items
      const newItems = [...orderedItems];
      const [movedItem] = newItems.splice(dragState.sourceIndex, 1);
      newItems.splice(dragState.targetIndex, 0, movedItem);
      
      setOrderedItems(newItems);
    }
    
    // Reset drag state
    setDragState({
      isDragging: false,
      draggedItem: null,
      sourceIndex: null,
      targetIndex: null
    });
  }, [dragState, orderedItems, logger]);
  
  // Cancel drag operation
  const handleDragCancel = useCallback(() => {
    logger.debug('Drag cancelled');
    setDragState({
      isDragging: false,
      draggedItem: null,
      sourceIndex: null,
      targetIndex: null
    });
  }, [logger]);
  
  // Make elements draggable
  const makeDraggable = useCallback((items: T[]): DraggableItemWithProps<T>[] => {
    return items.map((item, index) => ({
      ...item,
      onDragStart: () => handleDragStart(item, index),
      onDragOver: () => handleDragOver(index),
      onDragEnd: handleDrop,
      onDragCancel: handleDragCancel,
      isDragging: dragState.draggedItem?.id === item.id,
      isDropTarget: dragState.targetIndex === index && dragState.draggedItem?.id !== item.id
    }));
  }, [dragState, handleDragStart, handleDragOver, handleDrop, handleDragCancel]);
  
  return {
    items: orderedItems,
    dragState,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragCancel,
    makeDraggable,
    setItems: setOrderedItems
  };
}
