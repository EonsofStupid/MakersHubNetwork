
// Re-export existing content from the read-only file
// This file already exists as read-only, but we need to make sure all necessary admin-related types are here
export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  categories: () => [...adminKeys.all, 'categories'] as const,
  parts: () => [...adminKeys.all, 'parts'] as const,
  reviews: () => [...adminKeys.all, 'reviews'] as const,
  metrics: () => [...adminKeys.all, 'metrics'] as const,
};
