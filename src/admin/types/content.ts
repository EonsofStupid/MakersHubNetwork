
import { ContentStatus } from '@/shared/types/shared.types';

export type { ContentStatus };

export interface ContentStats {
  draft: number;
  published: number;
  archived: number;
  scheduled: number;
  total: number;
}
