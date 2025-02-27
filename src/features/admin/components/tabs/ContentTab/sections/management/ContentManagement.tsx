
// This is now just a wrapper that imports from the correct location
import { ContentManagement as CMSContentManagement } from '@/features/admin/features/cms/components/content/ContentManagement';

export const ContentManagement = () => {
  return <CMSContentManagement />;
};
