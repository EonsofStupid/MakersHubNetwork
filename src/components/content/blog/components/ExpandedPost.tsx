import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BlogPostContent } from './BlogPostContent';
import { BlogPostMeta } from './BlogPostMeta';

interface ExpandedPostProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    title: string;
    content: string;
    published_at?: string | null;
    views_count?: number | null;
  };
}

export const ExpandedPost: React.FC<ExpandedPostProps> = ({
  isOpen,
  onOpenChange,
  post
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-black/90 border-[#ff0abe]/20">
        <div className="space-y-6">
          <BlogPostContent
            title={post.title}
            content={post.content}
          />
          <BlogPostMeta
            publishedAt={post.published_at}
            viewsCount={post.views_count}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpandedPost;