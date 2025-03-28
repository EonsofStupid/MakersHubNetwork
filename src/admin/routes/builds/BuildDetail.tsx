
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, ArrowLeft, User, Calendar, Package, Wrench } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PrinterBuild, BuildPart, BuildMod } from "@/types/database";

interface BuildDetailProps {
  id?: string;
}

interface ExtendedBuildPart extends BuildPart {
  printer_parts?: {
    id: string;
    name: string;
    [key: string]: any;
  };
}

interface BuildWithProfile extends PrinterBuild {
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export default function BuildDetail({ id: propId }: BuildDetailProps) {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const buildId = propId || params.id;
  
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: build, isLoading, refetch } = useQuery({
    queryKey: ["admin-build-detail", buildId],
    queryFn: async () => {
      if (!buildId) return null;
      
      const { data, error } = await supabase
        .from("printer_builds")
        .select(`
          *,
          profiles:submitted_by(display_name, avatar_url)
        `)
        .eq("id", buildId)
        .single();

      if (error) {
        console.error("Error fetching build:", error);
        toast({
          title: "Error fetching build details",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      return data as BuildWithProfile;
    },
    enabled: !!buildId,
  });

  // Fetch parts and mods for this build
  const { data: buildComponents } = useQuery({
    queryKey: ["admin-build-components", buildId],
    queryFn: async () => {
      if (!buildId) return { parts: [], mods: [] };
      
      const { data: parts, error: partsError } = await supabase
        .from("build_parts")
        .select("*, printer_parts(*)")
        .eq("build_id", buildId);

      const { data: mods, error: modsError } = await supabase
        .from("build_mods")
        .select("*")
        .eq("build_id", buildId);

      if (partsError) {
        console.error("Error fetching build parts:", partsError);
      }

      if (modsError) {
        console.error("Error fetching build mods:", modsError);
      }

      return { 
        parts: parts as ExtendedBuildPart[] || [], 
        mods: mods as BuildMod[] || [] 
      };
    },
    enabled: !!buildId,
  });

  const updateBuildStatus = async (newStatus: "approved" | "rejected") => {
    if (!buildId) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("printer_builds")
        .update({ 
          status: newStatus, 
          processed_at: new Date().toISOString() 
        })
        .eq("id", buildId);

      if (error) throw error;

      toast({
        title: `Build ${newStatus}`,
        description: `The build has been ${newStatus} successfully`,
        variant: newStatus === "approved" ? "default" : "destructive",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!build) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Build Not Found</CardTitle>
          <CardDescription>The build you're looking for doesn't exist or was removed</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Builds
        </Button>
        
        {build.status === "pending" && (
          <div className="ml-auto space-x-2">
            <Button
              variant="outline"
              disabled={isProcessing}
              className="border-red-200 text-red-500 hover:bg-red-50"
              onClick={() => updateBuildStatus("rejected")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject Build
            </Button>
            <Button
              disabled={isProcessing}
              onClick={() => updateBuildStatus("approved")}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Build
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{build.title}</CardTitle>
                  <CardDescription>
                    {new Date(build.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={
                  build.status === "approved" ? "bg-green-100 text-green-800" :
                  build.status === "rejected" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }>
                  {build.status.charAt(0).toUpperCase() + build.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {build.description}
              </div>
              
              {build.images && build.images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {build.images.map((image: string, index: number) => (
                    <div key={index} className="overflow-hidden rounded-md border">
                      <AspectRatio ratio={4/3}>
                        <img 
                          src={image} 
                          alt={`Build image ${index + 1}`} 
                          className="h-full w-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Parts Used in This Build
              </CardTitle>
            </CardHeader>
            <CardContent>
              {buildComponents?.parts.length === 0 ? (
                <p className="text-muted-foreground">No parts specified for this build</p>
              ) : (
                <div className="space-y-3">
                  {buildComponents?.parts.map((part: ExtendedBuildPart) => (
                    <div key={part.id} className="flex items-center p-3 border rounded-md">
                      <div className="flex-grow">
                        <div className="font-medium">{part.printer_parts?.name || "Unknown Part"}</div>
                        <div className="text-sm text-muted-foreground">Quantity: {part.quantity}</div>
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
                <Tool className="mr-2 h-5 w-5" />
                Modifications Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              {buildComponents?.mods.length === 0 ? (
                <p className="text-muted-foreground">No modifications specified for this build</p>
              ) : (
                <div className="space-y-3">
                  {buildComponents?.mods.map((mod: BuildMod) => (
                    <div key={mod.id} className="p-3 border rounded-md">
                      <div className="font-medium">{mod.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{mod.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submitted By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
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
                  <div className="font-medium">{build.profiles?.display_name || "Unknown User"}</div>
                  <div className="text-sm text-muted-foreground">User ID: {build.submitted_by}</div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Submitted on {new Date(build.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {build.processed_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {build.status === "approved" ? "Approved" : "Rejected"} on {new Date(build.processed_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
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
    </div>
  );
}
