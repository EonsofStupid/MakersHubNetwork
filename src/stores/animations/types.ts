export interface AnimationState {
  isEnabled: boolean;
  activeAnimations: Set<string>;
  durations: {
    fast: number;
    normal: number;
    slow: number;
  };
  customTimings: Record<string, number>;
}

export type AnimationActions = {
  setEnabled: (enabled: boolean) => void;
  startAnimation: (id: string) => void;
  stopAnimation: (id: string) => void;
  setDuration: (key: keyof AnimationState['durations'], value: number) => void;
  setCustomTiming: (id: string, duration: number) => void;
};

export type AnimationStore = AnimationState & AnimationActions;