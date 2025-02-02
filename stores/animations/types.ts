export type AnimationStatus = 'idle' | 'running' | 'paused' | 'completed';
export type AnimationType = 'fade' | 'slide' | 'scale' | 'custom';
export type TimingCategory = 'transitions' | 'animations' | 'delays';

export interface AnimationEntry {
  status: AnimationStatus;
  startTime: number;
  duration: number;
  progress: number;
  type: AnimationType;
}

export interface AnimationTimings {
  transitions: {
    fast: number;
    normal: number;
    slow: number;
  };
  animations: {
    short: number;
    medium: number;
    long: number;
  };
  delays: {
    minimal: number;
    standard: number;
    dramatic: number;
  };
}

export interface PerformanceMetric {
  type: 'frame' | 'animation' | 'sequence';
  timestamp: number;
  duration: number;
  details: {
    animationId?: string;
    sequenceId?: string;
    frameTime?: number;
    dropped?: boolean;
  };
}

export interface AnimationStep {
  id: string;
  duration: number;
  delay: number;
  easing: string;
  dependencies?: string[];
}

export interface AnimationSequence {
  steps: AnimationStep[];
  status: 'pending' | 'running' | 'completed';
}

export interface AnimationState {
  isEnabled: boolean;
  activeAnimations: Map<string, AnimationEntry>;
  timings: AnimationTimings;
  metrics: {
    frameDrops: number;
    averageFrameTime: number;
    lastFrameTimestamp: number;
    performanceEntries: PerformanceMetric[];
  };
  sequences: Map<string, AnimationSequence>;
}

export interface AnimationActions {
  startAnimation: (id: string, config: Partial<AnimationEntry>) => void;
  pauseAnimation: (id: string) => void;
  resumeAnimation: (id: string) => void;
  stopAnimation: (id: string) => void;
  createSequence: (id: string, steps: AnimationStep[]) => void;
  startSequence: (id: string) => void;
  cancelSequence: (id: string) => void;
  recordMetric: (metric: PerformanceMetric) => void;
  clearMetrics: () => void;
  setTiming: (category: TimingCategory, key: string, value: number) => void;
  resetTimings: () => void;
}

export type AnimationStore = AnimationState & AnimationActions;