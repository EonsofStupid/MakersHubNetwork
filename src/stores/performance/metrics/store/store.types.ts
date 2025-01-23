import { StoreMetrics } from '../../types/metrics';

export interface StoreState {
  storeMetrics: StoreMetrics;
}

export interface StoreActions {
  resetStoreMetrics: () => void;
}

export type StoreSlice = StoreState & StoreActions;