import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { List, History, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface ContentTypesListProps {
  onSelectContent: (contentId: string) => void;
}

export const ContentTypesList: React.FC<ContentTypesListProps> = ({ onSelectContent }) => {
  const { data: contentTypes, isLoading } = useQuery({
    queryKey: ["content-types"],
    queryFn: async () => {
      console.log("Fetching content types...");
      const { data, error } = await supabase
        .from("cms_content")
        .select(`
          id,
          title,
          type,
          updated_at,
          created_by,
          profiles:created_by (
            display_name
          )
        `)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching content types:", error);
        toast.error("Failed to load content types");
        throw error;
      }

      console.log("Content types fetched:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <List className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-white">Content Types</h2>
        </div>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-2">
          {contentTypes?.map((content) => (
            <Button
              key={content.id}
              variant="ghost"
              className="w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/5"
              onClick={() => onSelectContent(content.id)}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-medium">{content.title}</div>
                <div className="text-xs text-white/60">
                  {content.type} • Updated {new Date(content.updated_at).toLocaleDateString()}
                </div>
              </div>
              <History className="w-4 h-4 opacity-50" />
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};