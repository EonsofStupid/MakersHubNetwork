import { create } from 'zustand';
import { ComponentStore, ComponentState } from './types';

const initialState: ComponentState = {
  visibleModals: new Set(),
  activeDialogs: new Set(),
  componentStates: {},
  themeInfo: {
    isOpen: false,
    activeSection: null,
  },
};

export const useComponentStore = create<ComponentStore>()((set) => ({
  ...initialState,
  
  showModal: (id) => set((state) => ({
    visibleModals: new Set([...state.visibleModals, id])
  })),
  
  hideModal: (id) => set((state) => {
    const newSet = new Set(state.visibleModals);
    newSet.delete(id);
    return { visibleModals: newSet };
  }),
  
  showDialog: (id) => set((state) => ({
    activeDialogs: new Set([...state.activeDialogs, id])
  })),
  
  hideDialog: (id) => set((state) => {
    const newSet = new Set(state.activeDialogs);
    newSet.delete(id);
    return { activeDialogs: newSet };
  }),
  
  setComponentState: (id, newState) => set((state) => ({
    componentStates: {
      ...state.componentStates,
      [id]: {
        ...state.componentStates[id],
        ...newState,
      },
    },
  })),
  
  setThemeInfoState: (newState) => set((state) => ({
    themeInfo: {
      ...state.themeInfo,
      ...newState,
    },
  })),
})); 