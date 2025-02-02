import React, { useState } from "react";
import { format } from "date-fns";
import { PostWithAuthor } from "@/hooks/posts/usePostsQuery";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PostStatusBadge } from "./PostStatusBadge";
import { PostTableRowActions } from "./PostTableRowActions";
import { PostDeleteDialog } from "./PostDeleteDialog";
import { showSuccessToast, showLoadingToast, showErrorToast } from "@/lib/toast-config";

interface PostsTableProps {
  posts: PostWithAuthor[];
  onDelete: (postId: string) => Promise<void>;
}

export const PostsTable: React.FC<PostsTableProps> = ({ posts, onDelete }) => {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [deletingPosts, setDeletingPosts] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedPosts(checked ? posts.map(post => post.id) : []);
  };

  const handleSelectPost = (postId: string, checked: boolean) => {
    setSelectedPosts(prev => 
      checked ? [...prev, postId] : prev.filter(id => id !== postId)
    );
  };

  const handleDelete = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    setDeletingPosts(prev => [...prev, postId]);
    const loadingToast = showLoadingToast(`Deleting ${post.title}...`);
    
    try {
      await onDelete(postId);
      showSuccessToast(`Successfully deleted ${post.title}`);
    } catch (error) {
      console.error('Error deleting post:', error);
      showErrorToast(`Failed to delete ${post.title}`);
    } finally {
      setDeletingPosts(prev => prev.filter(id => id !== postId));
    }
  };

  const handleBulkDelete = async () => {
    const loadingToast = showLoadingToast(`Deleting ${selectedPosts.length} posts...`);
    
    try {
      await Promise.all(selectedPosts.map(id => onDelete(id)));
      showSuccessToast(`Successfully deleted ${selectedPosts.length} posts`);
      setSelectedPosts([]);
    } catch (error) {
      console.error('Error in bulk delete:', error);
      showErrorToast('Failed to delete some posts');
    }
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-zinc-800/50 border-b border-zinc-800">
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedPosts.length === posts.length}
                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                aria-label="Select all posts"
                className="translate-y-[2px] data-[state=checked]:bg-[#ff0abe] data-[state=checked]:border-[#ff0abe]"
              />
            </TableHead>
            <TableHead className="font-semibold text-zinc-100">Title</TableHead>
            <TableHead className="font-semibold text-zinc-100">Date</TableHead>
            <TableHead className="font-semibold text-zinc-100">Author</TableHead>
            <TableHead className="font-semibold text-zinc-100">Status</TableHead>
            <TableHead className="font-semibold text-zinc-100">Views</TableHead>
            <TableHead className="text-right font-semibold text-zinc-100">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => {
            const isSelected = selectedPosts.includes(post.id);
            const isDeleting = deletingPosts.includes(post.id);
            
            return (
              <TableRow 
                key={post.id} 
                className={`
                  transition-all duration-200 border-b border-zinc-800/50
                  ${isSelected ? 'bg-[#ff0abe]/5 hover:bg-[#ff0abe]/10' : 'hover:bg-zinc-800/50'}
                  ${isDeleting ? 'opacity-50' : ''}
                `}
              >
                <TableCell className="w-12">
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectPost(post.id, checked as boolean)}
                    aria-label={`Select post ${post.title}`}
                    className="translate-y-[2px] data-[state=checked]:bg-[#ff0abe] data-[state=checked]:border-[#ff0abe]"
                    disabled={isDeleting}
                  />
                </TableCell>
                <TableCell className={`font-medium ${isSelected ? 'text-[#ff0abe]' : 'text-zinc-100'}`}>
                  {post.title}
                </TableCell>
                <TableCell className="text-zinc-400">
                  {post.updated_at ? format(new Date(post.updated_at), 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
                <TableCell className="text-zinc-400">
                  {post.profiles?.display_name || post.profiles?.username || 'Unknown'}
                </TableCell>
                <TableCell>
                  <PostStatusBadge status={post.status} />
                </TableCell>
                <TableCell className="text-zinc-400">
                  {post.views_count || 0}
                </TableCell>
                <TableCell>
                  <PostTableRowActions
                    postId={post.id}
                    postTitle={post.title}
                    isSelected={isSelected}
                    isDeleting={isDeleting}
                    onDelete={() => handleDelete(post.id)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {selectedPosts.length > 0 && (
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">
              {selectedPosts.length} {selectedPosts.length === 1 ? 'post' : 'posts'} selected
            </span>
            <PostDeleteDialog
              title=""
              isMultiple={true}
              count={selectedPosts.length}
              onDelete={handleBulkDelete}
              className="bg-[#ff0abe] hover:bg-[#ff0abe]/80 text-white border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};