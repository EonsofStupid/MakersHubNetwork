
import { PanInfo } from 'framer-motion';

/**
 * Convert a React DragEvent to a format compatible with Framer Motion's PanInfo
 */
export function convertDragEventToPanInfo(e: React.DragEvent<HTMLDivElement>): PanInfo {
  return {
    point: {
      x: e.clientX,
      y: e.clientY
    },
    delta: {
      x: 0,
      y: 0
    },
    offset: {
      x: 0,
      y: 0
    },
    velocity: {
      x: 0,
      y: 0
    }
  };
}

/**
 * Helper to adapt React drag events to Framer Motion handlers
 */
export function adaptDragEvent(
  handler: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
) {
  return (e: React.DragEvent<HTMLDivElement>) => {
    const panInfo = convertDragEventToPanInfo(e);
    handler(e.nativeEvent, panInfo);
  };
}
