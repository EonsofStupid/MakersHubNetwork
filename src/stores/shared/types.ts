export type ErrorState = {
  message: string;
  code?: string;
  context?: Record<string, unknown>;
};

export type LoadingState = {
  isLoading: boolean;
  progress?: number;
  message?: string;
};

export interface SharedState {
  errors: Record<string, ErrorState>;
  loading: Record<string, LoadingState>;
}

export type SharedActions = {
  setError: (id: string, error: ErrorState) => void;
  clearError: (id: string) => void;
  setLoading: (id: string, state: LoadingState) => void;
  clearLoading: (id: string) => void;
};

export type SharedStore = SharedState & SharedActions;