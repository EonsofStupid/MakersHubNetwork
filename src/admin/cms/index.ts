
// Re-export components
export { default as CategoryManagement } from './components/categories/CategoryManagement';

// Re-export hooks
export {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory
} from '../queries/useContentCategories';

// Re-export types if needed
export * from '../types/content';
