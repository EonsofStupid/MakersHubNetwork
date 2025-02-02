import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Edit, Flag, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Thread {
  id: string;
  title: string;
  content: string;
  author: { display_name: string } | null;
  replies: { count: number }[];
  flags: { count: number }[];
  created_at: string;
}

interface ThreadListProps {
  threads: Thread[] | undefined;
  isLoading: boolean;
}

export const ThreadList = ({ threads, isLoading }: ThreadListProps) => {
  const queryClient = useQueryClient();

  const deleteThreadMutation = useMutation({
    mutationFn: async (threadId: string) => {
      const { error } = await supabase
        .from('forum_threads')
        .delete()
        .eq('id', threadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-threads'] });
      toast.success('Thread deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting thread:', error);
      toast.error('Failed to delete thread');
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Replies</TableHead>
          <TableHead>Flags</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {threads?.map((thread) => (
          <TableRow key={thread.id}>
            <TableCell className="font-medium text-white">{thread.title}</TableCell>
            <TableCell>{thread.author?.display_name || 'Unknown'}</TableCell>
            <TableCell>{thread.replies?.[0]?.count || 0}</TableCell>
            <TableCell>{thread.flags?.[0]?.count || 0}</TableCell>
            <TableCell>
              {new Date(thread.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-neon-cyan"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-red-500"
                  onClick={() => deleteThreadMutation.mutate(thread.id)}
                  disabled={deleteThreadMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-yellow-500"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};