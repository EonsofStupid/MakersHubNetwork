
export interface UseQueryResult<T> {
  data?: T;
  isLoading: boolean;
  error: Error | null;
}

export interface Part {
  id: string;
  name: string;
  community_score?: number;
  review_count: number;
}

export interface Review {
  id: string;
  title: string;
  rating: number;
  created_at: string;
  printer_parts?: {
    name: string;
  };
}
