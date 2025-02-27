// This is now just a wrapper that imports from the correct location
import { ContentManagement as CMSContentManagement } from '@/admin/cms/components/content/ContentManagement';

export const ContentManagement = () => {
  return <CMSContentManagement />;
};
