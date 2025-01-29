import { useEffect, useState } from "react";

export function useOverflowDetection(ref: React.RefObject<HTMLElement>) {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (ref.current) {
        setIsOverflowing(ref.current.scrollHeight > ref.current.clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [ref]);

  return { isOverflowing };
}

export function useResponsiveLayout() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const checkLayout = () => {
      setIsCompact(window.innerWidth < 768);
    };

    checkLayout();
    window.addEventListener("resize", checkLayout);
    return () => window.removeEventListener("resize", checkLayout);
  }, []);

  return { isCompact, containerClass: isCompact ? "w-full h-full" : "max-w-lg max-h-96" };
}
