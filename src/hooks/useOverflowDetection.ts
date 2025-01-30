import { useEffect, useState, RefObject } from "react";
import { throttle } from "lodash";

export interface OverflowState {
  isOverflowing: boolean;
  direction: "vertical" | "horizontal" | "both" | "none";
  ratio: number;
}

export const useOverflowDetection = (
  ref: RefObject<HTMLElement>,
  options: { throttleMs?: number; threshold?: number } = {}
) => {
  const { throttleMs = 100, threshold = 1.1 } = options;
  const [overflowState, setOverflowState] = useState<OverflowState>({
    isOverflowing: false,
    direction: "none",
    ratio: 1,
  });

  useEffect(() => {
    if (!ref.current) return;

    const checkOverflow = throttle(() => {
      const element = ref.current;
      if (!element) return;

      const verticalOverflow = element.scrollHeight > element.clientHeight;
      const horizontalOverflow = element.scrollWidth > element.clientWidth;
      const ratio = Math.max(
        element.scrollHeight / element.clientHeight,
        element.scrollWidth / element.clientWidth
      );

      let direction: OverflowState["direction"] = "none";
      if (verticalOverflow && horizontalOverflow) direction = "both";
      else if (verticalOverflow) direction = "vertical";
      else if (horizontalOverflow) direction = "horizontal";

      setOverflowState({
        isOverflowing: ratio > threshold,
        direction,
        ratio,
      });
    }, throttleMs);

    // Initial check
    checkOverflow();

    // Setup resize observer
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
      checkOverflow.cancel();
    };
  }, [ref, throttleMs, threshold]);

  return overflowState;
};