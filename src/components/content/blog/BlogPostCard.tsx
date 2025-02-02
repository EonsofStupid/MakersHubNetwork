import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageGallery } from './components/ImageGallery';
import { ExpandedPost } from './components/ExpandedPost';
import { ImageCarouselDialog } from './components/ImageCarouselDialog';
import { BlogPostContent } from './components/BlogPostContent';
import { BlogPostMeta } from './components/BlogPostMeta';
import { ImageValidation } from './components/ImageValidation';
import { useCyberpunkViewer } from './components/viewer/useCyberpunkViewer';
import CyberpunkBlogViewer from './components/viewer/CyberpunkBlogViewer';

interface BlogPostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    excerpt?: string | null;
    featured_image?: string | null;
    published_at?: string | null;
    views_count?: number | null;
    images?: string[];
  };
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [validImages, setValidImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, openViewer, closeViewer } = useCyberpunkViewer();
  
  const displayContent = post.content.slice(0, 350);
  const hasMoreContent = post.content.length > 350;
  const images = post.images || [];

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowCarousel(true);
  };

  const handleCardClick = () => {
    console.log('Card clicked, opening viewer with content:', post.content);
    openViewer(post.content);
  };

  const featuredImage = post.featured_image || (validImages.length > 0 ? validImages[0] : null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full mb-24"
    >
      <ImageValidation
        images={images}
        onValidImagesChange={setValidImages}
        onLoadingChange={setIsLoading}
      />

      <div 
        onClick={handleCardClick}
        className="group relative bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 hover:border-[#ff0abe]/50 transition-all duration-300 overflow-visible min-h-[400px] cursor-pointer"
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#ff0abe] animate-spin" />
          </div>
        ) : (
          featuredImage && (
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <motion.div 
                className="w-full h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img 
                  src={featuredImage} 
                  alt={post.title}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#ff0abe]/20 to-black/80 mix-blend-overlay" />
              </motion.div>
            </div>
          )
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80 z-10 rounded-xl" />

        <div className="relative z-20 p-8 h-full flex flex-col">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 bg-white/5" />
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-2/3 bg-white/5" />
            </div>
          ) : (
            <>
              <BlogPostContent
                title={post.title}
                content={displayContent}
                hasMoreContent={hasMoreContent}
                onReadMore={() => setIsExpanded(true)}
                images={validImages}
              />
              <div className="mt-auto">
                <BlogPostMeta
                  publishedAt={post.published_at}
                  viewsCount={post.views_count}
                />
              </div>
            </>
          )}
        </div>

        {!isLoading && validImages.length > 0 && (
          <div 
            className="absolute -bottom-32 left-0 right-0 z-30"
            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking gallery
          >
            <ImageGallery 
              images={validImages} 
              onImageClick={handleImageClick}
            />
          </div>
        )}
      </div>

      <ExpandedPost
        isOpen={isExpanded}
        onOpenChange={setIsExpanded}
        post={post}
      />

      {validImages.length > 0 && (
        <ImageCarouselDialog
          isOpen={showCarousel}
          onOpenChange={setShowCarousel}
          images={validImages}
          currentIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
        />
      )}

      <CyberpunkBlogViewer
        content={post.content}
        isOpen={isOpen}
        onClose={closeViewer}
      />
    </motion.div>
  );
};

export default BlogPostCard;
