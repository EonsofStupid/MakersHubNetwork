import { useEffect, useCallback, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const SCROLL_AMOUNT = 150; // pixels to scroll
const TOAST_INTERVAL = 45000; // show toast every 45 seconds
const SCROLL_SPEED = 24; // frames per scroll

export function KeyboardNavigation() {
  const { toast } = useToast();
  const lastToastTime = useRef(0);
  const scrollAnimationRef = useRef<number>();
  const [isScrolling, setIsScrolling] = useState(false);

  const showNavigationToast = useCallback(() => {
    const now = Date.now();
    if (now - lastToastTime.current >= TOAST_INTERVAL) {
      toast({
        title: "🎮 Cyber Navigation",
        description: "Use W/S or ↑/↓ keys to navigate the cybernet",
        className: "cyber-toast",
        duration: 3000,
      });
      lastToastTime.current = now;
    }
  }, [toast]);

  const smoothScrollTo = useCallback((targetScroll: number) => {
    const startPosition = window.pageYOffset;
    const distance = targetScroll - startPosition;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / SCROLL_SPEED, 1);

      const easeInOutCubic = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition + (distance * easeInOutCubic));

      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(animation);
      } else {
        setIsScrolling(false);
      }
    };

    cancelAnimationFrame(scrollAnimationRef.current!);
    scrollAnimationRef.current = requestAnimationFrame(animation);
    setIsScrolling(true);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if user is typing in an input, textarea, or if Ctrl/Cmd is pressed
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.ctrlKey ||
      event.metaKey ||
      isScrolling
    ) {
      return;
    }

    let scrollAmount = 0;

    switch (event.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        event.preventDefault();
        scrollAmount = -SCROLL_AMOUNT;
        break;
      case 's':
      case 'arrowdown':
        event.preventDefault();
        scrollAmount = SCROLL_AMOUNT;
        break;
      default:
        return;
    }

    const targetScroll = window.pageYOffset + scrollAmount;
    smoothScrollTo(targetScroll);
    showNavigationToast();
  }, [smoothScrollTo, showNavigationToast, isScrolling]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    
    // Show initial toast with delay
    const initialToastTimeout = setTimeout(() => {
      toast({
        title: "🌐 Welcome to Cyber Navigation",
        description: "Navigate the cybernet using W/S or ↑/↓ keys",
        className: "cyber-toast",
        duration: 5000,
      });
      lastToastTime.current = Date.now();
    }, 2000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(initialToastTimeout);
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [handleKeyDown, toast]);

  // Add custom styles for the cyber toast
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .cyber-toast {
        background: rgba(26, 27, 38, 0.9) !important;
        border: 1px solid rgba(0, 240, 255, 0.2) !important;
        backdrop-filter: blur(12px) !important;
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.15) !important;
      }
      .cyber-toast:hover {
        border-color: rgba(0, 240, 255, 0.4) !important;
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.3) !important;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return null;
} 