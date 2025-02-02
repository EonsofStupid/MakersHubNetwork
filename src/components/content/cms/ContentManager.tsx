import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Loader2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContentWithAuthor {
  id: string;
  title: string;
  status: string;
  type: string;
  updated_at: string;
  created_by: {
    display_name: string | null;
  } | null;
  updated_by: {
    display_name: string | null;
  } | null;
}

export const ContentManager = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  
  const { data: content, isLoading } = useQuery({
    queryKey: ['cms-content', search, typeFilter],
    queryFn: async () => {
      console.log('Fetching CMS content...');
      let query = supabase
        .from('cms_content')
        .select(`
          *,
          created_by:profiles!cms_content_created_by_fkey(display_name),
          updated_by:profiles!cms_content_updated_by_fkey(display_name)
        `)
        .order('updated_at', { ascending: false });

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching content:', error);
        toast.error('Failed to load content');
        throw error;
      }

      console.log('Fetched content:', data);
      return data as ContentWithAuthor[];
    }
  });

  const handleCreateContent = () => {
    navigate('/admin/content-management/editor');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-[#26c766]/20 text-[#26c766]';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'archived':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-white/10 text-white/60';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Content Management</h1>
        <Button 
          onClick={handleCreateContent}
          className="bg-[#26c766]/20 text-white border border-[#26c766]/50 hover:bg-[#26c766]/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Content
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black/40 border-white/10 text-white"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={setTypeFilter}
        >
          <SelectTrigger className="w-[180px] bg-black/40 border-white/10 text-white">
            <SelectValue placeholder="Content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="page">Pages</SelectItem>
            <SelectItem value="component">Components</SelectItem>
            <SelectItem value="template">Templates</SelectItem>
            <SelectItem value="workflow">Workflows</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#26c766]" />
        </div>
      ) : content?.length === 0 ? (
        <Card className="p-12 text-center bg-black/40 border-white/10">
          <p className="text-white/60">No content found. Create your first piece of content to get started.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {content?.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <Card 
                className="p-6 bg-black/40 border-white/10 hover:border-[#26c766]/50 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/admin/content-management/editor/${item.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#26c766] transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-white/60">
                        Last updated by {item.updated_by?.display_name} on{' '}
                        {new Date(item.updated_at).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-white/60">•</span>
                      <span className="text-sm text-white/60 capitalize">
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`
                      px-2 py-1 text-xs rounded-full
                      ${getStatusColor(item.status)}
                    `}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentManager;