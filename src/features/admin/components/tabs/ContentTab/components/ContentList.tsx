
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentItem, ContentFilter } from "@/features/admin/types/content";
import { supabase } from "@/integrations/supabase/client";

interface ContentListProps {
  filter: ContentFilter;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
}

export const ContentList = ({ filter, onEdit, onDelete }: ContentListProps) => {
  const { data: items, isLoading } = useQuery({
    queryKey: ['content-items', filter],
    queryFn: async () => {
      let query = supabase
        .from('content_items')
        .select('*');

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

  if (isLoading) {
    return <div className="animate-pulse">Loading content...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items?.map((item) => (
        <Card key={item.id} className="p-4 space-y-4 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium">{item.title}</h3>
            </div>
            <div className="space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(item)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{item.type}</span>
            <span className="px-2 py-1 rounded-full bg-primary/10">
              {item.status}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};
