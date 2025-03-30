
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
}

export function useDragAndDrop({ items, onReorder, containerId }: UseDragAndDropOptions) {
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
    if (editMode) {
      window.addEventListener('mousemove', updateCursorPosition);
      return () => window.removeEventListener('mousemove', updateCursorPosition);
    }
  }, [editMode, updateCursorPosition]);

  // Reset dragging state when edit mode is toggled off
  useEffect(() => {
    if (!editMode) {
      setIsDragging(false);
      setDragSourceId(null);
      setDragTargetId(null);
      setDropIndicatorPosition(null);
    }
  }, [editMode, setIsDragging, setDragSourceId, setDragTargetId, setDropIndicatorPosition]);

  // Handle the drop event - reorder items
  const handleItemDrop = useCallback((sourceId: string, targetId: string) => {
    if (!sourceId || !targetId || sourceId === targetId) return;

    const sourceIndex = items.indexOf(sourceId);
    const targetIndex = items.indexOf(targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;

    const newItems = [...items];
    newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, sourceId);

    onReorder?.(newItems);
    
    toast({
      title: "Item moved",
      description: `Successfully reordered your shortcuts`,
      variant: "default",
      duration: 2000
    });
  }, [items, onReorder, toast]);

  // Register a drop zone container
  const registerDropZone = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (!isDragging || !editMode) return;
      
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
        }
      }
    };

    const handleDragLeave = () => {
      setDragTargetId(null);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      if (dragSourceId && dragTargetId) {
        handleItemDrop(dragSourceId, dragTargetId);
      }
      
      setIsDragging(false);
      setDragSourceId(null);
      setDragTargetId(null);
      setDropIndicatorPosition(null);
    };

    element.addEventListener('dragover', handleDragOver as EventListener);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop as EventListener);

    return () => {
      element.removeEventListener('dragover', handleDragOver as EventListener);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop as EventListener);
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
    handleItemDrop
  ]);

  return {
    isDragging,
    dragSourceId,
    dragTargetId,
    registerDropZone,
    handleDrop: handleItemDrop
  };
}
