
/**
 * Impulse theme structure
 * Comprehensive type definitions for the Impulse theme system
 */
export interface ImpulseTheme {
  colors: {
    primary: string;
    secondary: string;
    background: {
      main: string;
      card: string;
      overlay: string;
    };
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    borders: {
      normal: string;
      hover: string;
      active: string;
    };
  };
  effects: {
    glow: {
      primary: string;
      secondary: string;
      hover: string;
    };
    blur: {
      background: string;
      overlay: string;
    };
    gradients: {
      main: string;
      accent: string;
      card: string;
    };
  };
  animation: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    curves: {
      bounce: string;
      ease: string;
      spring: string;
    };
  };
  components: Record<string, any>;
}

/**
 * Configuration for smart overlays
 */
export interface OverlayConfig {
  position: 'top' | 'right' | 'bottom' | 'left' | 'center';
  trigger: 'hover' | 'click' | 'alt-click';
  showArrow: boolean;
  animation: 'fade' | 'slide' | 'scale';
}

/**
 * Configuration for the inspector panel
 */
export interface InspectorConfig {
  defaultTab: 'styles' | 'data' | 'rules';
  showHeader: boolean;
  draggable: boolean;
  resizable: boolean;
}
