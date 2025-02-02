import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { History, Calendar, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Profile {
  id: string;
  display_name: string | null;
}

interface Revision {
  id: string;
  content: any;
  metadata: Record<string, any>;
  created_at: string;
  created_by: string | null;
  profiles: Profile | null;
}

interface RevisionHistoryViewerProps {
  contentId: string | null;
}

export const RevisionHistoryViewer = ({ contentId }: RevisionHistoryViewerProps) => {
  const { data: revisions, isLoading, error } = useQuery({
    queryKey: ["content-revisions", contentId],
    queryFn: async () => {
      console.log("Fetching revisions for content:", contentId);
      
      const { data, error } = await supabase
        .from("cms_content_revisions")
        .select(`
          id,
          content,
          metadata,
          created_at,
          created_by,
          profiles (
            id,
            display_name
          )
        `)
        .eq("content_id", contentId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching revisions:", error);
        throw error;
      }

      console.log("Revisions fetched:", data);
      return data as Revision[];
    },
    enabled: !!contentId,
  });

  if (error) {
    toast.error("Failed to load revision history");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!revisions?.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No revision history available
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {revisions.map((revision) => (
          <div
            key={revision.id}
            className="flex flex-col space-y-2 p-4 rounded-lg bg-card hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {revision.profiles?.display_name || "Unknown user"}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(revision.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(revision.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(revision.content, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};