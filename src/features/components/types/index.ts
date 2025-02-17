import { ReactNode } from 'react';

export type AnimationStatus = 'idle' | 'running' | 'paused' | 'completed';
export type AnimationType = 'fade' | 'slide' | 'scale' | 'custom';
export type AnimationDirection = 'in' | 'out';
export type AnimationTiming = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

export interface AnimationConfig {
  type: AnimationType;
  direction?: AnimationDirection;
  duration?: number;
  delay?: number;
  timing?: AnimationTiming;
  custom?: Record<string, any>;
}

export interface AnimatedComponentProps {
  animation?: AnimationConfig;
  className?: string;
  children: ReactNode;
}

export interface ComponentState {
  isVisible: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  error: Error | null;
}

export interface ComponentMetadata {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  version?: string;
  author?: string;
  dependencies?: string[];
}

export interface ComponentConfig {
  state: ComponentState;
  metadata: ComponentMetadata;
  animations?: Record<string, AnimationConfig>;
  styles?: Record<string, string>;
  attributes?: Record<string, any>;
}

export interface ComponentContextValue {
  state: ComponentState;
  metadata: ComponentMetadata;
  setVisible: (visible: boolean) => void;
  setLoading: (loading: boolean) => void;
  setDisabled: (disabled: boolean) => void;
  setError: (error: Error | null) => void;
}

export interface ComponentHookConfig {
  initialState?: Partial<ComponentState>;
  metadata?: Partial<ComponentMetadata>;
  animations?: Record<string, AnimationConfig>;
}

export interface ComponentRenderProps {
  state: ComponentState;
  metadata: ComponentMetadata;
  className?: string;
  children?: ReactNode;
  onStateChange?: (state: Partial<ComponentState>) => void;
} 