import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateThreadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newThread: { title: string; content: string };
  setNewThread: React.Dispatch<React.SetStateAction<{ title: string; content: string }>>;
}

export const CreateThreadDialog = ({ 
  isOpen, 
  onOpenChange, 
  newThread, 
  setNewThread 
}: CreateThreadDialogProps) => {
  const queryClient = useQueryClient();

  const createThreadMutation = useMutation({
    mutationFn: async (threadData: { title: string; content: string }) => {
      const { data, error } = await supabase
        .from('forum_threads')
        .insert([
          {
            title: threadData.title,
            content: threadData.content,
            author_id: (await supabase.auth.getUser()).data.user?.id
          }
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-threads'] });
      toast.success('Thread created successfully');
      onOpenChange(false);
      setNewThread({ title: '', content: '' });
    },
    onError: (error) => {
      console.error('Error creating thread:', error);
      toast.error('Failed to create thread');
    }
  });

  const handleCreateThread = () => {
    if (!newThread.title || !newThread.content) {
      toast.error('Please fill in all fields');
      return;
    }
    createThreadMutation.mutate(newThread);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Thread</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={newThread.title}
              onChange={(e) => setNewThread(prev => ({ ...prev, title: e.target.value }))}
              className="bg-black/20 border-white/10"
            />
          </div>
          <div>
            <Label htmlFor="content" className="text-white">Content</Label>
            <Textarea
              id="content"
              value={newThread.content}
              onChange={(e) => setNewThread(prev => ({ ...prev, content: e.target.value }))}
              className="bg-black/20 border-white/10 min-h-[100px]"
            />
          </div>
          <Button 
            onClick={handleCreateThread}
            className="w-full bg-neon-cyan/20 text-white border border-neon-cyan/50 hover:bg-neon-cyan/30"
            disabled={createThreadMutation.isPending}
          >
            {createThreadMutation.isPending ? 'Creating...' : 'Create Thread'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};