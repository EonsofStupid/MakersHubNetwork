import { useState, useCallback, useEffect } from 'react';
import type { DiffNavigationState, DiffHighlightMode } from '../types/diff';

interface UseDiffNavigationProps {
  totalChanges: number;
  initialType?: DiffHighlightMode;
}

export const useDiffNavigation = ({ 
  totalChanges, 
  initialType = 'word' 
}: UseDiffNavigationProps) => {
  const [state, setState] = useState<DiffNavigationState>({
    currentIndex: 0,
    totalChanges,
    type: initialType
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || (e.ctrlKey && e.key === 'p')) {
        navigateChange('prev');
      } else if (e.key === 'ArrowRight' || (e.ctrlKey && e.key === 'n')) {
        navigateChange('next');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const navigateChange = useCallback((direction: 'prev' | 'next') => {
    setState(prev => ({
      ...prev,
      currentIndex: direction === 'prev'
        ? (prev.currentIndex > 0 ? prev.currentIndex - 1 : prev.totalChanges - 1)
        : (prev.currentIndex < prev.totalChanges - 1 ? prev.currentIndex + 1 : 0)
    }));
  }, []);

  const setDiffType = useCallback((type: DiffHighlightMode) => {
    setState(prev => ({ ...prev, type }));
  }, []);

  return {
    state,
    navigateChange,
    setDiffType
  };
};