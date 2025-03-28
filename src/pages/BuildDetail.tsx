
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, Package, Wrench } from "lucide-react";
import { PrinterBuild, BuildPart, BuildMod } from "@/types/database";

export default function BuildDetail() {
  const { id } = useParams();
  
  const { data: build, isLoading } = useQuery({
    queryKey: ["build-detail", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("printer_builds")
        .select(`
          *,
          profiles:submitted_by(display_name, avatar_url)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as PrinterBuild & { profiles: { display_name: string | null, avatar_url: string | null } };
    },
    enabled: !!id,
  });
  
  const { data: buildComponents } = useQuery({
    queryKey: ["build-components", id],
    queryFn: async () => {
      if (!id) return { parts: [], mods: [] };
      
      const { data: parts, error: partsError } = await supabase
        .from("build_parts")
        .select("*, printer_parts(*)")
        .eq("build_id", id);

      const { data: mods, error: modsError } = await supabase
        .from("build_mods")
        .select("*")
        .eq("build_id", id);

      if (partsError || modsError) throw partsError || modsError;
      
      return { 
        parts: parts as Array<BuildPart & { printer_parts: any }> || [], 
        mods: mods as BuildMod[] || [] 
      };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Build not found or it may have been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">{build.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge className={
            build.status === "approved" ? "bg-green-100 text-green-800" :
            build.status === "rejected" ? "bg-red-100 text-red-800" :
            "bg-yellow-100 text-yellow-800"
          }>
            {build.status.charAt(0).toUpperCase() + build.status.slice(1)}
          </Badge>
          <span className="text-muted-foreground flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(build.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          {build.images && build.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {build.images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg border">
                  <img 
                    src={image} 
                    alt={`${build.title} - Image ${index + 1}`} 
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted rounded-lg flex items-center justify-center h-60 mb-6">
              <p className="text-muted-foreground">No images available</p>
            </div>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{build.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Submitted By
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {build.profiles?.avatar_url ? (
                  <img 
                    src={build.profiles.avatar_url} 
                    alt="User avatar" 
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <div className="font-medium">
                    {build.profiles?.display_name || "Unknown User"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Build Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Parts Count</div>
                  <div className="text-2xl font-bold">{build.parts_count || 0}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Mods Count</div>
                  <div className="text-2xl font-bold">{build.mods_count || 0}</div>
                </div>
                <div className="space-y-1 col-span-2">
                  <div className="text-sm text-muted-foreground">Complexity Score</div>
                  <div className="text-2xl font-bold">{build.complexity_score || "N/A"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Parts Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            {buildComponents?.parts.length === 0 ? (
              <p className="text-muted-foreground">No parts specified for this build</p>
            ) : (
              <div className="space-y-3">
                {buildComponents?.parts.map((part) => (
                  <div key={part.id} className="flex items-center p-3 border rounded-md">
                    <div>
                      <div className="font-medium">{part.printer_parts?.name || "Unknown Part"}</div>
                      <div className="text-sm text-muted-foreground">Quantity: {part.quantity}</div>
                      {part.notes && <div className="text-sm mt-1">{part.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="mr-2 h-5 w-5" />
              Modifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {buildComponents?.mods.length === 0 ? (
              <p className="text-muted-foreground">No modifications specified for this build</p>
            ) : (
              <div className="space-y-3">
                {buildComponents?.mods.map((mod) => (
                  <div key={mod.id} className="p-3 border rounded-md">
                    <div className="font-medium">{mod.name}</div>
                    {mod.description && (
                      <div className="text-sm text-muted-foreground mt-1">{mod.description}</div>
                    )}
                    {mod.complexity && (
                      <div className="mt-2">
                        <Badge variant="outline">Complexity: {mod.complexity}</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
