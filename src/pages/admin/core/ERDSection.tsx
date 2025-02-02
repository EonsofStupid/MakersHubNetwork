import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ERDVisualizer from "@/components/admin/schema/ERDVisualizer";
import { supabase } from "@/integrations/supabase/client";

export const ERDSection = () => {
  const { data: visualizations } = useQuery({
    queryKey: ["erd-visualizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("erd_visualizations")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Database Visualization</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Visualization
        </Button>
      </div>
      <ERDVisualizer />
    </Card>
  );
};