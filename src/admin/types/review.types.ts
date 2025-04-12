
export type ReviewCategory = 'Print Quality' | 'Ease of Assembly' | 'Cost Effectiveness' | 'Performance' | 'Customizability' | 'Documentation';

export interface Review {
  id: string;
  user_id: string;
  build_id?: string;
  product_id?: string;
  rating: number;
  content: string;
  categories: ReviewCategory[];
  status: ReviewStatus;
  image_urls?: string[];
  created_at: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';
