
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentItem, ContentFilter, ContentType } from "../../types/content";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface ContentListProps {
  filter: ContentFilter;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
}

export const ContentList = ({ filter, onEdit, onDelete }: ContentListProps) => {
  const { data: contentTypes } = useQuery({
    queryKey: ['content-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_types')
        .select('*');
      if (error) throw error;
      return data as ContentType[];
    }
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['content-items', filter],
    queryFn: async () => {
      let query = supabase
        .from('content_items')
        .select(`
          *,
          content_type:type (
            id,
            name,
            slug
          )
        `);

      if (filter.type) {
        query = query.eq('type', filter.type);
      }
      if (filter.status) {
        query = query.eq('status', filter.status);
      }
      if (filter.search) {
        query = query.ilike('title', `%${filter.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ContentItem[];
    }
  });

  const getContentTypeName = (typeId: string) => {
    const contentType = contentTypes?.find(t => t.id === typeId);
    return contentType?.name || 'Unknown Type';
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 space-y-4 animate-pulse glass-morphism">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items?.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="cyber-card group hover:border-primary/40 transition-all duration-300">
            <div className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h3 className="font-medium text-gradient">{item.title}</h3>
                </div>
                <div className="space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="mad-scientist-hover"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                    className="mad-scientist-hover text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {getContentTypeName(item.type)}
                </span>
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {item.status}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
