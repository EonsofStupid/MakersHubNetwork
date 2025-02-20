
export interface ContentFilter {
  search?: string;
  type?: string;
  status?: string;
  category?: string;
}

export interface ContentListProps {
  filter: ContentFilter;
}

export interface ContentFiltersProps {
  filter: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
}

export interface BuildSubmission {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: string;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: CategoryData[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'review' | 'approval' | 'publish';
  assignedTo?: string[];
  requiredApprovals?: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  active: boolean;
}
