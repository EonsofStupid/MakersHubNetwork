import { create } from 'zustand';
import { SharedStore, SharedState } from './types';

const initialState: SharedState = {
  errors: {},
  loading: {},
};

export const useSharedStore = create<SharedStore>()((set) => ({
  ...initialState,
  
  setError: (id, error) => set((state) => ({
    errors: { ...state.errors, [id]: error }
  })),
  
  clearError: (id) => set((state) => {
    const { [id]: _, ...rest } = state.errors;
    return { errors: rest };
  }),
  
  setLoading: (id, loadingState) => set((state) => ({
    loading: { ...state.loading, [id]: loadingState }
  })),
  
  clearLoading: (id) => set((state) => {
    const { [id]: _, ...rest } = state.loading;
    return { loading: rest };
  }),
})); 