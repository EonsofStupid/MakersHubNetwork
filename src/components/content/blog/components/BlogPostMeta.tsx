import React from 'react';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';

interface BlogPostMetaProps {
  publishedAt?: string | null;
  viewsCount?: number | null;
}

export const BlogPostMeta: React.FC<BlogPostMetaProps> = ({
  publishedAt,
  viewsCount
}) => {
  return (
    <div className="flex items-center gap-4 text-sm text-zinc-400">
      {publishedAt && (
        <span>{format(new Date(publishedAt), 'MMM dd, yyyy')}</span>
      )}
      {viewsCount !== undefined && viewsCount !== null && (
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {viewsCount}
        </span>
      )}
    </div>
  );
};

export default BlogPostMeta;