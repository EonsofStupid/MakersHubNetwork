
import { useState, useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { isDraggingAtom, dragSourceIdAtom, dragTargetIdAtom } from '@/admin/atoms/tools.atoms';
import { useAdminStore } from '@/admin/store/admin.store';

interface DragAndDropOptions {
  items: string[];
  containerId: string;
  onReorder?: (items: string[]) => void;
  onExternalDrop?: (item: any, position: { x: number, y: number }) => void;
  acceptExternalItems?: boolean;
  dragOnlyInEditMode?: boolean;
}

export function useDragAndDrop({
  items,
  containerId,
  onReorder,
  onExternalDrop,
  acceptExternalItems = false,
  dragOnlyInEditMode = false
}: DragAndDropOptions) {
  const [isDragging, setIsDragging] = useAtom(isDraggingAtom);
  const [dragSourceId, setDragSourceId] = useAtom(dragSourceIdAtom);
  const [dragTargetId, setDragTargetId] = useAtom(dragTargetIdAtom);
  const [dropTargets, setDropTargets] = useState<Set<HTMLElement>>(new Set());
  const { isEditMode } = useAdminStore();
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (dragSourceId && dragSourceId.startsWith(containerId)) {
        setIsDragging(false);
        setDragSourceId(null);
        setDragTargetId(null);
      }
    };
  }, [dragSourceId, containerId, setIsDragging, setDragSourceId, setDragTargetId]);
  
  // Process items for reordering
  const reorderItems = useCallback((sourceId: string, targetId: string) => {
    // Make sure we have a valid source and target
    if (!sourceId || !targetId || sourceId === targetId) return items;
    
    // Get the source and target indices
    const sourceIndex = items.indexOf(sourceId);
    const targetIndex = items.indexOf(targetId);
    
    // If source not found, it might be from external container
    if (sourceIndex === -1) {
      if (acceptExternalItems && onExternalDrop) {
        // This would be handled by the external drop handler
        return items;
      }
      return items;
    }
    
    // Create a new array without the source item
    const newItems = [...items];
    newItems.splice(sourceIndex, 1);
    
    // Insert the source item at the target position
    newItems.splice(targetIndex, 0, sourceId);
    
    return newItems;
  }, [items, acceptExternalItems, onExternalDrop]);

  // Register a container as a drop zone
  const registerDropZone = useCallback((element: HTMLElement) => {
    setDropTargets(prev => {
      const newSet = new Set(prev);
      newSet.add(element);
      return newSet;
    });
    
    // Set up drag hover effect for the container
    element.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (isDragging) {
        element.classList.add('active-drop');
      }
    });
    
    element.addEventListener('dragleave', () => {
      element.classList.remove('active-drop');
    });
    
    element.addEventListener('drop', (e) => {
      e.preventDefault();
      element.classList.remove('active-drop');
      
      if (dragSourceId && onReorder) {
        // If we have external items being dropped
        if (dragSourceId.indexOf(':') !== -1 && !dragSourceId.startsWith(containerId)) {
          // External item - extract the ID
          const externalId = dragSourceId.split(':')[1];
          
          if (acceptExternalItems && onExternalDrop) {
            onExternalDrop(
              { id: externalId, type: dragSourceId.split(':')[0] },
              { x: e.clientX, y: e.clientY }
            );
          }
        }
      }
    });
    
    // Cleanup function
    return () => {
      setDropTargets(prev => {
        const newSet = new Set(prev);
        newSet.delete(element);
        return newSet;
      });
    };
  }, [isDragging, dragSourceId, containerId, onReorder, acceptExternalItems, onExternalDrop]);

  // Make an element draggable
  const makeDraggable = useCallback((element: HTMLElement, itemId: string) => {
    const fullItemId = `${containerId}:${itemId}`;
    
    element.setAttribute('draggable', 'true');
    
    const handleDragStart = (e: DragEvent) => {
      if (dragOnlyInEditMode && !isEditMode) return;
      
      // Set drag data and update state
      e.dataTransfer?.setData('text/plain', fullItemId);
      element.classList.add('dragging');
      
      // Update global drag state
      setIsDragging(true);
      setDragSourceId(fullItemId);
    };
    
    const handleDragEnd = () => {
      element.classList.remove('dragging');
      
      // If we have a target and source, reorder items
      if (dragTargetId && dragSourceId && onReorder) {
        // Extract the actual IDs without container prefix
        const sourceId = dragSourceId.split(':')[1];
        const targetId = dragTargetId.split(':')[1];
        
        // Only reorder if both items are from this container
        if (dragSourceId.startsWith(containerId) && dragTargetId.startsWith(containerId)) {
          const newItems = reorderItems(sourceId, targetId);
          onReorder(newItems);
        }
      }
      
      // Reset drag state
      setIsDragging(false);
      setDragSourceId(null);
      setDragTargetId(null);
      
      // Remove active-drop from all containers
      dropTargets.forEach(target => {
        target.classList.remove('active-drop');
      });
    };
    
    const handleDragOver = (e: DragEvent) => {
      if (dragOnlyInEditMode && !isEditMode) return;
      e.preventDefault();
      
      if (isDragging && dragSourceId && dragSourceId !== fullItemId) {
        setDragTargetId(fullItemId);
      }
    };
    
    // Add event listeners
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
    element.addEventListener('dragover', handleDragOver);
    
    // Return cleanup function
    return () => {
      element.removeAttribute('draggable');
      element.classList.remove('dragging');
      element.removeEventListener('dragstart', handleDragStart);
      element.removeEventListener('dragend', handleDragEnd);
      element.removeEventListener('dragover', handleDragOver);
    };
  }, [
    containerId, 
    dragOnlyInEditMode, 
    isEditMode, 
    isDragging, 
    dragSourceId, 
    dragTargetId, 
    onReorder, 
    reorderItems, 
    setIsDragging, 
    setDragSourceId, 
    setDragTargetId, 
    dropTargets
  ]);

  return {
    makeDraggable,
    registerDropZone,
    isDragging,
    dragSourceId,
    dragTargetId
  };
}
