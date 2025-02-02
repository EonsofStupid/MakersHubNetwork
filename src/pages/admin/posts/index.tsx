import React from "react";
import { Navigation } from "@/components/shared/ui/Navigation";
import { AdminNav } from "@/components/admin/dashboard/AdminNav";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PostsTable } from "@/components/admin/posts/PostsTable";
import { usePostsQuery } from "@/hooks/posts/usePostsQuery";
import { deletePost } from "@/services/blog-posts/deletePost";

const PostsManagement = () => {
  const { data: posts, isLoading, error, refetch } = usePostsQuery();

  console.log('PostsManagement render state:', { 
    postsCount: posts?.length, 
    isLoading, 
    hasError: !!error 
  });

  const handleDelete = async (postId: string) => {
    const loadingToast = toast.loading('Deleting post...');
    
    const result = await deletePost(postId);
    
    if (result.success) {
      toast.success('Post deleted successfully');
      refetch();
    } else {
      toast.error(result.error || 'Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <Navigation />
        <div className="pt-20 p-8">
          <AdminNav />
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-[#ff0abe] animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error in posts query:', error);
    return (
      <div className="min-h-screen bg-zinc-900">
        <Navigation />
        <div className="pt-20 p-8">
          <AdminNav />
          <div className="text-center text-red-500 mt-8">
            <p>Failed to load posts</p>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              className="mt-4 border-zinc-800 text-zinc-100 hover:bg-zinc-800"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navigation />
      <div className="pt-20 p-8">
        <AdminNav />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-zinc-100">Posts Management</h1>
            <Button 
              onClick={() => {}} 
              className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white border-0"
            >
              New Post
            </Button>
          </div>

          <PostsTable 
            posts={posts || []} 
            onDelete={handleDelete}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PostsManagement;