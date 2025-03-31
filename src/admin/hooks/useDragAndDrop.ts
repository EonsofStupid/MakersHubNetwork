
import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { 
  dragSourceIdAtom, 
  dragTargetIdAtom, 
  isDraggingAtom, 
  dropIndicatorPositionAtom,
  adminEditModeAtom
} from '@/admin/atoms/tools.atoms';

interface UseDragAndDropProps {
  items: string[];
  containerId: string;
  onReorder?: (newItems: string[]) => void;
  dragOnlyInEditMode?: boolean;
  acceptExternalItems?: boolean;
}

export function useDragAndDrop({
  items,
  containerId,
  onReorder,
  dragOnlyInEditMode = false,
  acceptExternalItems = false
}: UseDragAndDropProps) {
  const [dragSourceId, setDragSourceId] = useAtom(dragSourceIdAtom);
  const [dragTargetId, setDragTargetId] = useAtom(dragTargetIdAtom);
  const [isDragging, setIsDragging] = useAtom(isDraggingAtom);
  const [dropPosition, setDropPosition] = useAtom(dropIndicatorPositionAtom);
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  // Reset drag state on unmount
  useEffect(() => {
    return () => {
      if (dragSourceId && containerId === dragSourceId.split(':')[0]) {
        setDragSourceId(null);
        setDragTargetId(null);
        setIsDragging(false);
        setDropPosition(null);
      }
    };
  }, [dragSourceId, containerId, setDragSourceId, setDragTargetId, setIsDragging, setDropPosition]);
  
  const makeDraggable = useCallback((element: HTMLElement, itemId: string) => {
    // Don't enable drag if not in edit mode and dragOnlyInEditMode is true
    if (dragOnlyInEditMode && !isEditMode) {
      return () => {};
    }
    
    const handleDragStart = (e: DragEvent) => {
      if (!e.dataTransfer) return;
      
      // Format ID as containerId:itemId
      const sourceId = `${containerId}:${itemId}`;
      
      // Set drag data
      e.dataTransfer.setData('text/plain', sourceId);
      e.dataTransfer.effectAllowed = 'move';
      
      // Update state
      setDragSourceId(sourceId);
      setIsDragging(true);
      
      // Add dragging class to element
      element.classList.add('dragging');
    };
    
    const handleDragEnd = () => {
      setDragSourceId(null);
      setDragTargetId(null);
      setIsDragging(false);
      setDropPosition(null);
      
      // Remove dragging class
      element.classList.remove('dragging');
    };
    
    // Add event listeners
    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
    
    // Return cleanup function
    return () => {
      element.removeAttribute('draggable');
      element.removeEventListener('dragstart', handleDragStart);
      element.removeEventListener('dragend', handleDragEnd);
    };
  }, [
    containerId, 
    setDragSourceId, 
    setIsDragging, 
    dragOnlyInEditMode,
    isEditMode
  ]);
  
  const registerDropZone = useCallback((element: HTMLElement) => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      
      if (!e.dataTransfer) return;
      
      // Set mouse position for drop indicator
      setDropPosition({ x: e.clientX, y: e.clientY });
      
      // Set drop effect
      e.dataTransfer.dropEffect = 'move';
    };
    
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (!e.dataTransfer) return;
      
      // Find closest draggable item
      const target = e.target as HTMLElement;
      const item = target.closest('[data-id]');
      
      if (item) {
        const targetId = `${containerId}:${item.getAttribute('data-id')}`;
        setDragTargetId(targetId);
      } else {
        setDragTargetId(`${containerId}`);
      }
    };
    
    const handleDragLeave = () => {
      setDragTargetId(null);
    };
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      
      if (!e.dataTransfer) return;
      
      const sourceId = e.dataTransfer.getData('text/plain');
      
      // If no source ID or not dragging, return
      if (!sourceId || !isDragging) return;
      
      const [sourceContainerId, sourceItemId] = sourceId.split(':');
      
      // Only handle drops if from same container or external items are accepted
      if (sourceContainerId !== containerId && !acceptExternalItems) return;
      
      // If dropping from another container, add at the end
      if (sourceContainerId !== containerId) {
        const newItems = [...items, sourceItemId];
        onReorder?.(newItems);
        return;
      }
      
      // Find closest draggable item
      const target = e.target as HTMLElement;
      const item = target.closest('[data-id]');
      
      // Get dropped position
      let targetIndex = -1;
      let sourceIndex = items.indexOf(sourceItemId);
      
      if (item) {
        const targetId = item.getAttribute('data-id');
        if (targetId) {
          targetIndex = items.indexOf(targetId);
        }
      }
      
      // If source not found or dropped onto itself, do nothing
      if (sourceIndex === -1 || sourceIndex === targetIndex) return;
      
      // If dropped at the end or on no specific item
      if (targetIndex === -1) {
        targetIndex = items.length;
      }
      
      // Create new ordered array
      const newItems = [...items];
      newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, sourceItemId);
      
      // Call onReorder callback
      onReorder?.(newItems);
    };
    
    // Add event listeners
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);
    
    // Return cleanup function
    return () => {
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragenter', handleDragEnter);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
    };
  }, [
    containerId, 
    items, 
    onReorder, 
    setDragTargetId, 
    setDropPosition,
    isDragging,
    acceptExternalItems
  ]);
  
  return {
    isDragging,
    dragSourceId,
    dragTargetId,
    makeDraggable,
    registerDropZone
  };
}
