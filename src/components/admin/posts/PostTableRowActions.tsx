import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { PostDeleteDialog } from "./PostDeleteDialog";

interface PostTableRowActionsProps {
  postId: string;
  postTitle: string;
  isSelected: boolean;
  isDeleting: boolean;
  onDelete: () => Promise<void>;
}

export const PostTableRowActions: React.FC<PostTableRowActionsProps> = ({
  postId,
  postTitle,
  isSelected,
  isDeleting,
  onDelete,
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {}}
        className={`h-8 w-8 ${
          isSelected
            ? 'text-[#ff0abe] hover:text-[#ff0abe]/80'
            : 'text-zinc-400 hover:text-[#41f0db] hover:bg-[#41f0db]/10'
        }`}
        disabled={isDeleting}
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <PostDeleteDialog
        title={postTitle}
        onDelete={onDelete}
        disabled={isDeleting}
        className={`h-8 w-8 transition-colors ${
          isSelected
            ? 'text-[#ff0abe] hover:text-[#ff0abe]/80'
            : 'text-zinc-400 hover:text-[#ff0abe] hover:bg-[#ff0abe]/10'
        }`}
      />
    </div>
  );
};