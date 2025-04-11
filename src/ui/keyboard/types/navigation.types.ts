
export type KeyboardTarget = string | HTMLElement | null;
export type KeyboardDirection = 'up' | 'down' | 'left' | 'right';

export interface KeyboardNavigationOptions {
  enabled?: boolean;
  selector?: string;
  wrap?: boolean;
  autoFocus?: boolean;
  onSelect?: (element: HTMLElement) => void;
  onMove?: (element: HTMLElement) => void;
}

export interface KeyboardScrollOptions {
  selector?: string;
  scrollSpeed?: number;
  horizontalScrollSpeed?: number;
  scrollContainer?: HTMLElement | null | string;
}
