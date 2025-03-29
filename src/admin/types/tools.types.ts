
/**
 * Types for admin tools and utilities
 */

export interface FrozenZone {
  id: string;
  isLocked: boolean;
}

export interface SmartOverlayPosition {
  x: number;
  y: number;
}

export interface SmartOverlayProps {
  id: string;
  title: string;
  initialPosition?: SmartOverlayPosition;
  width?: number;
  height?: number;
  children: React.ReactNode;
}
