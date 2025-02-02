import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useCyberpunkViewer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');

  const openViewer = useCallback((newContent: string) => {
    console.log('Opening viewer with content:', newContent);
    setContent(newContent);
    setIsOpen(true);
    toast.info('Use arrow keys or spacebar to scroll through content');
  }, []);

  const closeViewer = useCallback(() => {
    console.log('Closing viewer');
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    content,
    openViewer,
    closeViewer
  };
};