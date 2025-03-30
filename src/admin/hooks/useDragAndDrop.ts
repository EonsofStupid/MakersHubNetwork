
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  adminEditModeAtom,
  dragSourceIdAtom,
  dragTargetIdAtom,
  isDraggingAtom,
  dropIndicatorPositionAtom
} from '@/admin/atoms/tools.atoms';

interface UseDragAndDropOptions {
  items: string[];
  onReorder?: (newItems: string[]) => void;
  containerId: string;
  dragOnlyInEditMode?: boolean;
  acceptExternalItems?: boolean;
}

export function useDragAndDrop({ 
  items, 
  onReorder, 
  containerId,
  dragOnlyInEditMode = true,
  acceptExternalItems = true
}: UseDragAndDropOptions) {
  const [editMode] = useAtom(adminEditModeAtom);
  const [isDragging, setIsDragging] = useAtom(isDraggingAtom);
  const [dragSourceId, setDragSourceId] = useAtom(dragSourceIdAtom);
  const [dragTargetId, setDragTargetId] = useAtom(dragTargetIdAtom);
  const [, setDropIndicatorPosition] = useAtom(dropIndicatorPositionAtom);
  const { toast } = useToast();

  // Update cursor position for indicator
  const updateCursorPosition = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setDropIndicatorPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, setDropIndicatorPosition]);

  // Set up global mouse move listener for drag indicator
  useEffect(() => {
    if ((dragOnlyInEditMode && editMode) || !dragOnlyInEditMode) {
      window.addEventListener('mousemove', updateCursorPosition);
      return () => window.removeEventListener('mousemove', updateCursorPosition);
    }
  }, [editMode, updateCursorPosition, dragOnlyInEditMode]);

  // Reset dragging state when edit mode is toggled off
  useEffect(() => {
    if (dragOnlyInEditMode && !editMode) {
      setIsDragging(false);
      setDragSourceId(null);
      setDragTargetId(null);
      setDropIndicatorPosition(null);
    }
  }, [editMode, setIsDragging, setDragSourceId, setDragTargetId, setDropIndicatorPosition, dragOnlyInEditMode]);

  // Handle the drop event - reorder items or add from external source
  const handleItemDrop = useCallback((sourceId: string, targetId: string | null, targetContainerId: string) => {
    if (!sourceId) return;
    
    // If dropping within same container (reordering)
    if (targetContainerId === containerId && targetId !== `${containerId}-empty`) {
      const sourceIndex = items.indexOf(sourceId);
      const targetIndex = targetId ? items.indexOf(targetId as string) : items.length;
      
      // If source exists in this container, reorder
      if (sourceIndex !== -1 && targetIndex !== -1) {
        const newItems = [...items];
        newItems.splice(sourceIndex, 1);
        newItems.splice(targetIndex, 0, sourceId);
        onReorder?.(newItems);
        return;
      }
    }
    
    // Handle drops from external container
    if (acceptExternalItems && targetContainerId === containerId) {
      // If the item is not in the current container, add it
      if (!items.includes(sourceId)) {
        let newItems = [...items];
        
        // If dropping on a specific item, insert before it
        if (targetId && targetId !== `${containerId}-empty`) {
          const targetIndex = items.indexOf(targetId as string);
          if (targetIndex !== -1) {
            newItems.splice(targetIndex, 0, sourceId);
          } else {
            newItems.push(sourceId);
          }
        } else {
          // If dropping in empty space, add to end
          newItems.push(sourceId);
        }
        
        onReorder?.(newItems);
      }
    }
  }, [items, onReorder, containerId, acceptExternalItems]);

  // Register a drop zone container
  const registerDropZone = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      
      // Check if we should handle this drag (edit mode check)
      if ((dragOnlyInEditMode && !editMode) || !isDragging) return;
      
      if (!element.classList.contains('active-drop')) {
        element.classList.add('active-drop');
      }
      
      // Find the closest draggable item
      const dropItems = Array.from(element.querySelectorAll('[data-id]'));
      let closestItem: Element | null = null;
      let closestDistance = Infinity;

      dropItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + 
          Math.pow(e.clientY - centerY, 2)
        );
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestItem = item;
        }
      });

      // Remove previous target highlights
      document.querySelectorAll('.drop-target-item').forEach(el => {
        (el as HTMLElement).classList.remove('drop-target-item');
      });

      if (closestItem) {
        const targetId = (closestItem as HTMLElement).getAttribute('data-id');
        if (targetId && targetId !== dragTargetId) {
          setDragTargetId(targetId);
          (closestItem as HTMLElement).classList.add('drop-target-item');
        }
      } else {
        // If there are no items, we'll use a special empty target
        setDragTargetId(`${containerId}-empty`);
      }
      
      // Update custom property for glow effect
      if (e.clientX && e.clientY) {
        const rect = element.getBoundingClientRect();
        element.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        element.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      // Only process if we're actually leaving the container (not just moving between its children)
      const relatedTarget = e.relatedTarget as Node | null;
      if (relatedTarget && element.contains(relatedTarget)) {
        return;
      }
      
      element.classList.remove('active-drop');
      
      // Remove target highlight
      document.querySelectorAll('.drop-target-item').forEach(el => {
        (el as HTMLElement).classList.remove('drop-target-item');
      });
      
      setDragTargetId(null);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      element.classList.remove('active-drop');
      
      // Process the drop
      if (dragSourceId) {
        handleItemDrop(dragSourceId, dragTargetId, containerId);
      }
      
      // Remove all visual cues
      document.querySelectorAll('.drop-target-item').forEach(el => {
        (el as HTMLElement).classList.remove('drop-target-item');
      });
      
      document.querySelectorAll('.dragging').forEach(el => {
        (el as HTMLElement).classList.remove('dragging');
      });
      
      // Reset drag state
      setIsDragging(false);
      setDragSourceId(null);
      setDragTargetId(null);
      setDropIndicatorPosition(null);
    };

    // Set up event listeners
    element.setAttribute('data-container-id', containerId);
    element.addEventListener('dragover', handleDragOver as unknown as EventListener);
    element.addEventListener('dragleave', handleDragLeave as unknown as EventListener);
    element.addEventListener('drop', handleDrop as unknown as EventListener);

    return () => {
      element.removeEventListener('dragover', handleDragOver as unknown as EventListener);
      element.removeEventListener('dragleave', handleDragLeave as unknown as EventListener);
      element.removeEventListener('drop', handleDrop as unknown as EventListener);
    };
  }, [
    isDragging, 
    editMode, 
    dragSourceId, 
    dragTargetId, 
    setDragTargetId, 
    setIsDragging, 
    setDragSourceId, 
    setDropIndicatorPosition,
    handleItemDrop,
    containerId,
    dragOnlyInEditMode
  ]);

  // Make an item draggable
  const makeDraggable = useCallback((el: HTMLElement | null, id: string) => {
    if (!el) return;
    
    const handleDragStart = (e: DragEvent) => {
      if (dragOnlyInEditMode && !editMode) {
        e.preventDefault();
        return false;
      }
      
      setIsDragging(true);
      setDragSourceId(id);
      
      // Add visual feedback
      el.classList.add('dragging');
      
      // Set data transfer for compatibility
      e.dataTransfer?.setData('text/plain', id);
      
      // Set drag image (optional)
      if (e.dataTransfer) {
        // Use the element itself as the drag image with a slight offset
        e.dataTransfer.setDragImage(el, 20, 20);
      }
      
      return true;
    };
    
    const handleDragEnd = () => {
      setIsDragging(false);
      setDragSourceId(null);
      setDragTargetId(null);
      setDropIndicatorPosition(null);
      
      // Remove visual feedback
      el.classList.remove('dragging');
      
      // Remove any lingering visual cues
      document.querySelectorAll('.drop-target-item').forEach(el => {
        (el as HTMLElement).classList.remove('drop-target-item');
      });
    };
    
    // Set draggable attribute (only in edit mode if required)
    if (!dragOnlyInEditMode || editMode) {
      el.setAttribute('draggable', 'true');
      el.classList.add('draggable');
    } else {
      el.removeAttribute('draggable');
      el.classList.remove('draggable');
    }
    
    // Attach event listeners
    el.addEventListener('dragstart', handleDragStart as unknown as EventListener);
    el.addEventListener('dragend', handleDragEnd);
    
    return () => {
      el.removeAttribute('draggable');
      el.classList.remove('draggable');
      el.removeEventListener('dragstart', handleDragStart as unknown as EventListener);
      el.removeEventListener('dragend', handleDragEnd);
    };
  }, [
    editMode, 
    setIsDragging, 
    setDragSourceId, 
    setDragTargetId, 
    setDropIndicatorPosition,
    dragOnlyInEditMode
  ]);

  return {
    isDragging,
    dragSourceId,
    dragTargetId,
    registerDropZone,
    makeDraggable,
    handleDrop: handleItemDrop
  };
}
