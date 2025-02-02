import React from 'react';
import { motion } from 'framer-motion';
import { useContentRelationships } from '../hooks/useContentRelationships';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface RelatedContentProps {
  contentId: string;
}

const RelatedContent: React.FC<RelatedContentProps> = ({ contentId }) => {
  const { data: relationships, isLoading, error } = useContentRelationships(contentId);

  if (error) {
    toast.error("Failed to load related content");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const parentRelationships = relationships?.filter(rel => rel.child_id === contentId) || [];
  const childRelationships = relationships?.filter(rel => rel.parent_id === contentId) || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {parentRelationships.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Parent Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parentRelationships.map((rel) => (
              <Card key={rel.id} className="p-4 hover:shadow-lg transition-shadow">
                <Link to={`/content/${rel.parent.id}`} className="block">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{rel.parent.title}</h4>
                      <Badge variant="outline" className="mt-2">
                        {rel.relationship_type}
                      </Badge>
                    </div>
                    <Badge>{rel.parent.type}</Badge>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}

      {childRelationships.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Child Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {childRelationships.map((rel) => (
              <Card key={rel.id} className="p-4 hover:shadow-lg transition-shadow">
                <Link to={`/content/${rel.child.id}`} className="block">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{rel.child.title}</h4>
                      <Badge variant="outline" className="mt-2">
                        {rel.relationship_type}
                      </Badge>
                    </div>
                    <Badge>{rel.child.type}</Badge>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!parentRelationships.length && !childRelationships.length && (
        <div className="text-center text-muted-foreground p-8">
          No related content found
        </div>
      )}
    </motion.div>
  );
};

export default RelatedContent;