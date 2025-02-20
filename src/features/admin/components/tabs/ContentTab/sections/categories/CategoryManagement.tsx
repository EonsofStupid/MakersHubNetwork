
// This is now just a wrapper that imports from the correct location
import { CategoryManagement as CMSCategoryManagement } from '@/features/admin/features/cms/components/categories/CategoryManagement';

export const CategoryManagement = () => {
  return <CMSCategoryManagement />;
};
