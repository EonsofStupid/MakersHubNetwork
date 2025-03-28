
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PrinterBuild } from "@/types/database";

export default function Builds() {
  const { data: builds, isLoading } = useQuery({
    queryKey: ["community-builds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("printer_builds")
        .select(`
          id, 
          title, 
          description, 
          status,
          created_at,
          images,
          parts_count,
          mods_count,
          complexity_score,
          submitted_by,
          profiles:submitted_by(display_name)
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Array<PrinterBuild & { profiles: { display_name: string | null } }>;
    },
  });

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">3D Printer Builds</h1>
          <p className="text-lg text-muted-foreground mt-2">Browse community-submitted builds</p>
        </div>
        <Button asChild>
          <Link to="/builds/submit">Submit Your Build</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : builds?.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <p className="text-lg mb-4">No builds available yet</p>
            <Button asChild>
              <Link to="/builds/submit">Be the first to submit</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builds?.map(build => (
            <Card key={build.id} className="overflow-hidden flex flex-col">
              {build.images && build.images.length > 0 ? (
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={build.images[0]} 
                    alt={build.title}
                    className="object-cover w-full h-48"
                  />
                </div>
              ) : (
                <div className="bg-muted w-full h-48 flex items-center justify-center">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
              
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{build.title}</CardTitle>
                <CardDescription>
                  By {build.profiles?.display_name || "Unknown maker"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="line-clamp-3 text-muted-foreground mb-4">
                  {build.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    Parts: {build.parts_count}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    Mods: {build.mods_count}
                  </Badge>
                  {build.complexity_score && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Complexity: {build.complexity_score}
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/builds/${build.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
