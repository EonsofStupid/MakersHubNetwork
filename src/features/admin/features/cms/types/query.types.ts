
import { ContentStatus } from './content';

export interface ContentFilter {
  type?: string;
  status?: ContentStatus;
  category?: string;
  search?: string;
}
