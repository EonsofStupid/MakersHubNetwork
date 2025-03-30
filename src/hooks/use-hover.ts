
import { useState, useRef, useEffect, RefObject } from 'react';

export function useHover<T extends HTMLElement = HTMLElement>(
  delayMs: number = 0
): [RefObject<T>, boolean] {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }
      
      if (delayMs > 0) {
        delayTimerRef.current = setTimeout(() => {
          setIsHovered(true);
        }, delayMs);
      } else {
        setIsHovered(true);
      }
    };

    const handleMouseLeave = () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
      setIsHovered(false);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }
      
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [delayMs]);

  return [ref, isHovered];
}
