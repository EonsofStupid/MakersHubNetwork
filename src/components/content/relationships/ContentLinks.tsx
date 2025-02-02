import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Plus, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { BaseContent } from '../types/cms';

interface ContentLinksProps {
  contentId: string;
  onRelationshipCreated?: () => void;
}

const ContentLinks: React.FC<ContentLinksProps> = ({ contentId, onRelationshipCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [relationshipType, setRelationshipType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: availableContent, isLoading } = useQuery({
    queryKey: ['available-content', searchQuery],
    queryFn: async () => {
      console.log('Fetching available content with search:', searchQuery);
      const query = supabase
        .from('cms_content')
        .select('id, title, type, status')
        .neq('id', contentId);

      if (searchQuery) {
        query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching content:', error);
        toast.error('Failed to load available content');
        throw error;
      }

      return data as BaseContent[];
    }
  });

  const handleCreateRelationship = async () => {
    if (!selectedContent || !relationshipType) {
      toast.error('Please select content and relationship type');
      return;
    }

    try {
      const { error } = await supabase
        .from('cms_content_relationships')
        .insert({
          parent_id: contentId,
          child_id: selectedContent,
          relationship_type: relationshipType
        });

      if (error) throw error;

      toast.success('Content relationship created');
      setIsOpen(false);
      setSelectedContent('');
      setRelationshipType('');
      onRelationshipCreated?.();
    } catch (error) {
      console.error('Error creating relationship:', error);
      toast.error('Failed to create relationship');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Link Content
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Content</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />

            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Select
                value={selectedContent}
                onValueChange={setSelectedContent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content to link" />
                </SelectTrigger>
                <SelectContent>
                  {availableContent?.map((content) => (
                    <SelectItem key={content.id} value={content.id}>
                      {content.title} ({content.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select
              value={relationshipType}
              onValueChange={setRelationshipType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="references">References</SelectItem>
                <SelectItem value="includes">Includes</SelectItem>
                <SelectItem value="extends">Extends</SelectItem>
                <SelectItem value="related">Related</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={handleCreateRelationship}
              className="w-full"
              disabled={!selectedContent || !relationshipType}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Create Relationship
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ContentLinks;