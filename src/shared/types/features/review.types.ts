
// Review types
export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
}

export interface ReviewStats {
  averageRating: number;
  reviewCount: number;
}
