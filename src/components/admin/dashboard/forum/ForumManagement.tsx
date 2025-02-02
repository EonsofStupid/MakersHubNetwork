import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessageSquare, Flag, Trash2, Edit, Search, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const ForumManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const queryClient = useQueryClient();

  const { data: threads, isLoading } = useQuery({
    queryKey: ['forum-threads'],
    queryFn: async () => {
      console.log('Fetching forum threads...');
      const { data, error } = await supabase
        .from('forum_threads')
        .select(`
          *,
          author:profiles(display_name),
          replies:forum_replies(count),
          flags:forum_flags(count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching threads:', error);
        toast.error('Failed to load forum threads');
        throw error;
      }

      return data;
    }
  });

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
      setIsCreateDialogOpen(false);
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

  const filteredThreads = threads?.filter(thread =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Forum Management</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search threads..." 
              className="w-64 bg-black/20 border-white/10 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-neon-cyan/20 text-white border border-neon-cyan/50 hover:bg-neon-cyan/30">
                <MessageSquare className="w-4 h-4 mr-2" />
                New Thread
              </Button>
            </DialogTrigger>
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
        </div>
      </div>

      <Card className="bg-black/40 border-white/10">
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
            </div>
          ) : (
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
                {filteredThreads?.map((thread) => (
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
          )}
        </div>
      </Card>
    </div>
  );
};