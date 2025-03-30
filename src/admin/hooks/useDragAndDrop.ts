
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
}

export function useDragAndDrop({ 
  items, 
  onReorder, 
  containerId,
  dragOnlyInEditMode = true
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

  // Handle the drop event - reorder items
  const handleItemDrop = useCallback((sourceId: string, targetId: string) => {
    if (!sourceId || !targetId || sourceId === targetId) return;

    const sourceIndex = items.indexOf(sourceId);
    const targetIndex = items.indexOf(targetId);
    
    // Add item if it doesn't exist in the target container
    if (sourceIndex === -1) {
      // Item doesn't exist in this container, add it
      const newItems = [...items];
      newItems.splice(targetIndex !== -1 ? targetIndex : 0, 0, sourceId);
      onReorder?.(newItems);
      
      toast({
        title: "Item added",
        description: `Successfully added item to ${containerId}`,
        variant: "default",
        duration: 2000
      });
      return;
    }
    
    if (targetIndex === -1) return;

    // Reorder existing items
    const newItems = [...items];
    newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, sourceId);

    onReorder?.(newItems);
    
    toast({
      title: "Item moved",
      description: `Successfully reordered your shortcuts in ${containerId}`,
      variant: "default",
      duration: 2000
    });
  }, [items, onReorder, toast, containerId]);

  // Register a drop zone container
  const registerDropZone = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (!isDragging || (dragOnlyInEditMode && !editMode)) return;
      
      // Add active class to the container
      element.classList.add('active-drop');
      
      // Find the closest draggable item
      const items = Array.from(element.querySelectorAll('[data-id]'));
      let closestItem: Element | null = null;
      let closestDistance = Infinity;

      items.forEach(item => {
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

      if (closestItem) {
        const targetId = (closestItem as HTMLElement).getAttribute('data-id');
        if (targetId && targetId !== dragTargetId) {
          setDragTargetId(targetId);
          
          // Add a visual cue to the target item
          document.querySelectorAll('.drop-target-item').forEach(el => 
            el.classList.remove('drop-target-item')
          );
          closestItem.classList.add('drop-target-item');
        }
      } else if (items.length === 0) {
        // If there are no items, we can still drop here
        setDragTargetId(`${containerId}-empty`);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      // Check if we're actually leaving the container (not just moving between children)
      const relatedTarget = e.relatedTarget as Node | null;
      // This is the line causing the error - we need to check if relatedTarget exists first
      if (relatedTarget && element.contains(relatedTarget)) {
        // We're still within the container, don't remove classes or reset state
        return;
      }
      
      element.classList.remove('active-drop');
      setDragTargetId(null);
      
      // Remove visual cues
      document.querySelectorAll('.drop-target-item').forEach(el => 
        el.classList.remove('drop-target-item')
      );
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      element.classList.remove('active-drop');
      
      if (dragSourceId) {
        if (dragTargetId && dragTargetId !== `${containerId}-empty`) {
          // Drop on a specific item
          handleItemDrop(dragSourceId, dragTargetId);
        } else if (dragTargetId === `${containerId}-empty`) {
          // Drop in an empty container
          onReorder?.([...items, dragSourceId]);
          
          toast({
            title: "Item added",
            description: `Successfully added item to ${containerId}`,
            variant: "default",
            duration: 2000
          });
        }
      }
      
      // Remove visual cues
      document.querySelectorAll('.drop-target-item').forEach(el => 
        el.classList.remove('drop-target-item')
      );
      
      // Reset drag state
      setIsDragging(false);
      setDragSourceId(null);
      setDragTargetId(null);
      setDropIndicatorPosition(null);
    };

    // Type cast the event handlers to EventListener
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
    onReorder,
    toast,
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
      
      // Set drag image (optional)
      const dragImage = document.createElement('div');
      dragImage.textContent = id;
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-9999px';
      document.body.appendChild(dragImage);
      e.dataTransfer?.setDragImage(dragImage, 0, 0);
      
      // Clean up after dragging starts
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
      
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
      document.querySelectorAll('.drop-target-item').forEach(el => 
        el.classList.remove('drop-target-item')
      );
    };
    
    el.setAttribute('draggable', (dragOnlyInEditMode ? editMode : true).toString());
    
    // Type cast the event handlers to EventListener
    el.addEventListener('dragstart', handleDragStart as unknown as EventListener);
    el.addEventListener('dragend', handleDragEnd);
    
    return () => {
      el.removeAttribute('draggable');
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
