import { create } from 'zustand';
import { AnimationStore, AnimationState } from './types';

const initialState: AnimationState = {
  isEnabled: true,
  activeAnimations: new Set(),
  durations: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  customTimings: {},
};

export const useAnimationStore = create<AnimationStore>()((set, get) => ({
  ...initialState,
  
  setEnabled: (enabled) => set({ isEnabled: enabled }),
  
  startAnimation: (id) => set((state) => ({
    activeAnimations: new Set([...state.activeAnimations, id])
  })),
  
  stopAnimation: (id) => set((state) => {
    const newSet = new Set(state.activeAnimations);
    newSet.delete(id);
    return { activeAnimations: newSet };
  }),
  
  setDuration: (key, value) => set((state) => ({
    durations: { ...state.durations, [key]: value }
  })),
  
  setCustomTiming: (id, duration) => set((state) => ({
    customTimings: { ...state.customTimings, [id]: duration }
  })),
}));