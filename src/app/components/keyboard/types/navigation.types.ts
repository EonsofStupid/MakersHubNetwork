
import { ReactNode } from 'react';

export type NavigationDirection = 'up' | 'down' | 'left' | 'right';

export interface ScrollConfig {
  scrollAmount: number;
  smooth: boolean;
  acceleration: boolean;
  maxAcceleration: number;
  accelerationRate: number;
}

export interface ScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

export interface KeyboardNavigationOptions {
  enabled: boolean;
  scrollConfig: ScrollConfig;
  showToasts: boolean;
  scrollTarget?: HTMLElement | null;
  enableInInputs?: boolean;
}

export interface KeyboardNavigationState extends KeyboardNavigationOptions {
  pressedKeys: Set<string>;
  currentAcceleration: number;
  isAccelerating: boolean;
  animationFrameId: number | null;
}

export interface KeyboardNavigationContextType {
  state: KeyboardNavigationState;
  setOptions: (options: Partial<KeyboardNavigationOptions>) => void;
  scrollToElement: (element: HTMLElement, options?: ScrollOptions) => void;
}
