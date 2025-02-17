import { BaseMetrics } from '../../types';

export interface StoreMetrics extends BaseMetrics {
  updates: number;
  subscribers: Map<string, number>;
  computeTime: number;
  lastUpdateTimestamp: number;
}

export interface StoreState {
  storeMetrics: StoreMetrics;
}

export interface StoreActions {
  resetStoreMetrics: () => void;
}

export type StoreSlice = StoreState & StoreActions; 