
import { useCallback, useRef, useState } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';

interface DragDropOptions {
  containerId: string;
  itemId: string;
  dragOnlyInEditMode?: boolean;
  onDragStart?: (event: DragEvent, id: string) => void;
  onDragEnd?: (event: DragEvent, id: string) => void;
  onDrop?: (event: DragEvent, id: string, containerId: string) => void;
}

interface DragDropResult {
  isDragging: boolean;
  makeDraggable: (element: HTMLElement) => () => void;
}

/**
 * Custom hook for implementing drag and drop functionality
 */
export function useDragDrop({
  containerId,
  itemId,
  dragOnlyInEditMode = false,
  onDragStart,
  onDragEnd,
  onDrop
}: DragDropOptions): DragDropResult {
  const [isDragging, setIsDragging] = useState(false);
  const logger = useLogger('useDragDrop', { category: LogCategory.ADMIN });
  const cleanupRef = useRef<(() => void) | null>(null);

  const makeDraggable = useCallback((element: HTMLElement) => {
    // Clean up previous event listeners if they exist
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    // Set draggable attribute
    element.setAttribute('draggable', 'true');
    
    // Handler functions
    const handleDragStart = (event: DragEvent) => {
      if (!event.dataTransfer) return;
      
      setIsDragging(true);
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', itemId);
      
      // Add a class for styling
      element.classList.add('dragging');
      
      // Call the optional callback
      if (onDragStart) {
        onDragStart(event, itemId);
      }
      
      logger.debug(`Drag started for item: ${itemId}`, { 
        details: { containerId, itemId } 
      });
    };
    
    const handleDragEnd = (event: DragEvent) => {
      setIsDragging(false);
      element.classList.remove('dragging');
      
      // Call the optional callback
      if (onDragEnd) {
        onDragEnd(event, itemId);
      }
      
      logger.debug(`Drag ended for item: ${itemId}`);
    };
    
    const handleDragOver = (event: DragEvent) => {
      // Prevent default to allow drop
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    };
    
    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      // Call the optional callback
      if (onDrop) {
        onDrop(event, itemId, containerId);
      }
      
      logger.debug(`Drop event on container: ${containerId}`, { 
        details: { 
          containerId, 
          itemId,
          dataTransfer: event.dataTransfer?.getData('text/plain')
        }
      });
    };
    
    // Attach event listeners
    element.addEventListener('dragstart', handleDragStart as EventListener);
    element.addEventListener('dragend', handleDragEnd as EventListener);
    
    // Find the container and add drop zone event listeners
    const container = document.getElementById(containerId);
    if (container) {
      container.addEventListener('dragover', handleDragOver as EventListener);
      container.addEventListener('drop', handleDrop as EventListener);
      
      logger.debug(`Drop zone initialized for container: ${containerId}`);
    } else {
      logger.warn(`Container not found: ${containerId}`);
    }
    
    // Return cleanup function
    const cleanup = () => {
      element.removeAttribute('draggable');
      element.classList.remove('dragging');
      element.removeEventListener('dragstart', handleDragStart as EventListener);
      element.removeEventListener('dragend', handleDragEnd as EventListener);
      
      if (container) {
        container.removeEventListener('dragover', handleDragOver as EventListener);
        container.removeEventListener('drop', handleDrop as EventListener);
      }
      
      logger.debug(`Cleaned up drag-drop for item: ${itemId}`);
    };
    
    // Store cleanup function in ref
    cleanupRef.current = cleanup;
    
    return cleanup;
  }, [containerId, itemId, onDragStart, onDragEnd, onDrop, logger]);

  return {
    isDragging,
    makeDraggable
  };
}
