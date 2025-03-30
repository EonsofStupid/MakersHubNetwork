
import { useState, useCallback } from 'react';
import { useAdminStore } from '../store/admin.store';

/**
 * Custom hook to handle admin drag and drop operations with proper type handling
 */
export function useAdminDrag() {
  const { 
    setDragSource, 
    setDragTarget, 
    dragSource, 
    dragTarget,
    setState
  } = useAdminStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((id: string) => {
    setDragSource(id);
    setIsDragging(true);
    setState({ showDragOverlay: true });
  }, [setDragSource, setState]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragSource(null);
    setDragTarget(null);
    setState({ showDragOverlay: false });
  }, [setDragSource, setDragTarget, setState]);

  const handleDragOver = useCallback((id: string) => {
    if (dragSource && id !== dragSource) {
      setDragTarget(id);
    }
  }, [dragSource, setDragTarget]);

  return {
    isDragging,
    dragSource,
    dragTarget,
    handleDragStart,
    handleDragEnd,
    handleDragOver
  };
}
