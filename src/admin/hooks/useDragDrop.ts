
import { useRef, useEffect, useCallback } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/constants/log-level';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';

interface UseDragDropOptions {
  containerId: string;
  itemId: string;
  onReorder?: (items: string[]) => void;
  dragOnlyInEditMode?: boolean;
}

/**
 * Hook for implementing drag and drop functionality
 * on DOM elements directly
 */
export const useDragDrop = ({
  containerId,
  itemId,
  onReorder,
  dragOnlyInEditMode = false
}: UseDragDropOptions) => {
  const logger = useLogger('useDragDrop', { category: LogCategory.ADMIN });
  const [isEditMode] = useAtom(adminEditModeAtom);
  const isDraggingRef = useRef(false);
  
  // Make the element draggable
  const makeDraggable = useCallback((element: HTMLElement) => {
    if (!element) return;
    
    // Skip if not in edit mode and dragOnlyInEditMode is true
    if (dragOnlyInEditMode && !isEditMode) return;
    
    // Set up draggable attributes
    element.setAttribute('draggable', 'true');
    
    // Clean up function to remove event listeners
    const cleanup = () => {
      element.removeAttribute('draggable');
      element.removeEventListener('dragstart', handleDragStart);
      element.removeEventListener('dragend', handleDragEnd);
    };
    
    // Drag start handler
    const handleDragStart = (e: DragEvent) => {
      isDraggingRef.current = true;
      e.dataTransfer?.setData('text/plain', itemId);
      
      // Add dragging class
      element.classList.add('dragging');
      
      logger.debug('Drag started', { details: { itemId, containerId } });
    };
    
    // Drag end handler
    const handleDragEnd = () => {
      isDraggingRef.current = false;
      
      // Remove dragging class
      element.classList.remove('dragging');
      
      logger.debug('Drag ended', { details: { itemId, containerId } });
    };
    
    // Add event listeners
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
    
    return cleanup;
  }, [itemId, containerId, logger, isEditMode, dragOnlyInEditMode]);
  
  return {
    makeDraggable
  };
};
