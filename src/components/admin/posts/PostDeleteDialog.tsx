import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PostDeleteDialogProps {
  title: string;
  isMultiple?: boolean;
  count?: number;
  onDelete: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export const PostDeleteDialog: React.FC<PostDeleteDialogProps> = ({
  title,
  isMultiple,
  count,
  onDelete,
  disabled,
  className,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-900 border border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-zinc-100">Delete {isMultiple ? 'Posts' : 'Post'}</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            {isMultiple 
              ? `Are you sure you want to delete ${count} posts? This action cannot be undone.`
              : `Are you sure you want to delete "${title}"? This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border border-zinc-800 text-zinc-100 hover:bg-zinc-800">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-[#ff0abe] hover:bg-[#ff0abe]/80 text-white border-0"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};