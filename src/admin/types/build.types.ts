
// Build types for the admin interface

export type BuildStatus = 'pending' | 'approved' | 'rejected' | 'needs_revision';

export interface Build {
  id: string;
  title: string;
  description: string;
  status: BuildStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  imageUrl?: string;
}

export interface BuildSubmission {
  id: string;
  title: string;
  description: string;
  status: BuildStatus;
  submittedBy: string;
  submittedAt: string;
}

export interface BuildReviewAction {
  buildId: string;
  action: 'approve' | 'reject' | 'request_revision';
  comment?: string;
  reviewerId: string;
}
