import { create } from 'zustand';
import { AnimationStore, AnimationState, PerformanceMetric, AnimationStep } from './types';

const initialTimings = {
  transitions: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  animations: {
    short: 1000,
    medium: 2000,
    long: 3000,
  },
  delays: {
    minimal: 50,
    standard: 150,
    dramatic: 300,
  },
};

const initialState: AnimationState = {
  isEnabled: true,
  activeAnimations: new Map(),
  timings: initialTimings,
  metrics: {
    frameDrops: 0,
    averageFrameTime: 0,
    lastFrameTimestamp: 0,
    performanceEntries: [],
  },
  sequences: new Map(),
};

export const useAnimationStore = create<AnimationStore>()((set, get) => ({
  ...initialState,

  startAnimation: (id, config) => set((state) => {
    const newAnimations = new Map(state.activeAnimations);
    newAnimations.set(id, {
      status: 'running',
      startTime: performance.now(),
      duration: config.duration || state.timings.animations.medium,
      progress: 0,
      type: config.type || 'custom',
      ...config,
    });
    return { activeAnimations: newAnimations };
  }),

  pauseAnimation: (id) => set((state) => {
    const animation = state.activeAnimations.get(id);
    if (!animation) return state;

    const newAnimations = new Map(state.activeAnimations);
    newAnimations.set(id, { ...animation, status: 'paused' });
    return { activeAnimations: newAnimations };
  }),

  resumeAnimation: (id) => set((state) => {
    const animation = state.activeAnimations.get(id);
    if (!animation) return state;

    const newAnimations = new Map(state.activeAnimations);
    newAnimations.set(id, { ...animation, status: 'running' });
    return { activeAnimations: newAnimations };
  }),

  stopAnimation: (id) => set((state) => {
    const newAnimations = new Map(state.activeAnimations);
    newAnimations.delete(id);
    return { activeAnimations: newAnimations };
  }),

  createSequence: (id, steps) => set((state) => {
    const newSequences = new Map(state.sequences);
    newSequences.set(id, { steps, status: 'pending' });
    return { sequences: newSequences };
  }),

  startSequence: (id) => set((state) => {
    const sequence = state.sequences.get(id);
    if (!sequence) return state;

    const newSequences = new Map(state.sequences);
    newSequences.set(id, { ...sequence, status: 'running' });

    // Start the sequence animations
    sequence.steps.forEach((step, index) => {
      setTimeout(() => {
        get().startAnimation(step.id, {
          duration: step.duration,
          type: 'custom',
        });
      }, step.delay + index * state.timings.delays.standard);
    });

    return { sequences: newSequences };
  }),

  cancelSequence: (id) => set((state) => {
    const sequence = state.sequences.get(id);
    if (!sequence) return state;

    // Stop all animations in the sequence
    sequence.steps.forEach((step) => {
      get().stopAnimation(step.id);
    });

    const newSequences = new Map(state.sequences);
    newSequences.delete(id);
    return { sequences: newSequences };
  }),

  recordMetric: (metric) => set((state) => ({
    metrics: {
      ...state.metrics,
      performanceEntries: [...state.metrics.performanceEntries, metric],
      frameDrops: metric.details.dropped 
        ? state.metrics.frameDrops + 1 
        : state.metrics.frameDrops,
      averageFrameTime: 
        (state.metrics.averageFrameTime * state.metrics.performanceEntries.length + metric.duration) / 
        (state.metrics.performanceEntries.length + 1),
      lastFrameTimestamp: metric.timestamp,
    },
  })),

  clearMetrics: () => set((state) => ({
    metrics: {
      ...initialState.metrics,
    },
  })),

  setTiming: (category, key, value) => set((state) => ({
    timings: {
      ...state.timings,
      [category]: {
        ...state.timings[category],
        [key]: value,
      },
    },
  })),

  resetTimings: () => set((state) => ({
    timings: initialTimings,
  })),
}));