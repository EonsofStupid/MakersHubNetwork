
export type NavigationDirection = 'up' | 'down' | 'left' | 'right';

export type NavigationKey = 
  | 'ArrowUp' 
  | 'ArrowDown' 
  | 'ArrowLeft' 
  | 'ArrowRight'
  | 'w'
  | 'W'
  | 's'
  | 'S'
  | 'a'
  | 'A'
  | 'd'
  | 'D';

export interface ScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

export interface ScrollConfig {
  // Amount to scroll in pixels per keystroke
  scrollAmount: number;
  // Smooth scroll behavior
  smooth: boolean;
  // Enable/disable acceleration when keys are held down
  acceleration: boolean;
  // Maximum acceleration (pixels)
  maxAcceleration: number;
  // How quickly acceleration builds up
  accelerationRate: number;
}

export interface KeyboardNavigationOptions {
  // Enable/disable the navigation
  enabled: boolean;
  // Scroll configuration
  scrollConfig: ScrollConfig;
  // Show toast notifications for actions
  showToasts: boolean;
  // Target element to scroll (defaults to window)
  scrollTarget?: HTMLElement | null;
  // Enable in input fields
  enableInInputs: boolean;
}

export interface KeyboardNavigationState extends KeyboardNavigationOptions {
  // Currently pressed keys
  pressedKeys: Set<string>;
  // Current acceleration value
  currentAcceleration: number;
  // Is currently accelerating
  isAccelerating: boolean;
  // Animation frame ID for cleanup
  animationFrameId: number | null;
}

export interface KeyboardNavigationContextType {
  state: KeyboardNavigationState;
  setOptions: (options: Partial<KeyboardNavigationOptions>) => void;
  scrollToElement: (element: HTMLElement, options?: ScrollOptions) => void;
}
