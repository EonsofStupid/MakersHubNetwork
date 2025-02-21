import { useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

const SCROLL_AMOUNT = 100; // pixels to scroll
const TOAST_INTERVAL = 30000; // show toast every 30 seconds

export function KeyboardNavigation() {
  const { toast } = useToast();
  const lastToastTime = useRef(0);

  const showNavigationToast = useCallback(() => {
    const now = Date.now();
    if (now - lastToastTime.current >= TOAST_INTERVAL) {
      toast({
        title: "Keyboard Navigation",
        description: "Use W/S or ↑/↓ keys to scroll",
        duration: 3000,
      });
      lastToastTime.current = now;
    }
  }, [toast]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if user is typing in an input or textarea
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
      return;
    }

    let scrollAmount = 0;

    switch (event.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        scrollAmount = -SCROLL_AMOUNT;
        break;
      case 's':
      case 'arrowdown':
        scrollAmount = SCROLL_AMOUNT;
        break;
      default:
        return;
    }

    window.scrollBy({
      top: scrollAmount,
      behavior: 'smooth'
    });

    showNavigationToast();
  }, [showNavigationToast]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    // Show initial toast
    setTimeout(() => {
      showNavigationToast();
    }, 2000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, showNavigationToast]);

  return null;
} 