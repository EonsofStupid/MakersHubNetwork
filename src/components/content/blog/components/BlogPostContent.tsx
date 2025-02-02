import React from 'react';

interface BlogPostContentProps {
  title: string;
  content: string;
  hasMoreContent?: boolean;
  onReadMore?: () => void;
  images?: string[];
}

export const BlogPostContent: React.FC<BlogPostContentProps> = ({
  title,
  content,
  hasMoreContent,
  onReadMore,
  images
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="prose prose-invert max-w-none">
        {content}
      </div>
      {hasMoreContent && (
        <button
          onClick={onReadMore}
          className="text-[#ff0abe] hover:text-[#ff0abe]/80 transition-colors"
        >
          Read more
        </button>
      )}
    </div>
  );
};

export default BlogPostContent;