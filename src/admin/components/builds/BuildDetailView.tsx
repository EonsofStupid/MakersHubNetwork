
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBuildAdminStore } from "@/admin/store/buildAdmin.store";
import { AlertCircle, ArrowLeft, CheckCircle, Clock, Package, ThumbsDown, ThumbsUp, Wrench } from "lucide-react";
import { formatDistance } from "date-fns";
import { BuildStatusBadge } from "./BuildStatusBadge";
import { ImageGallery } from "./ImageGallery";
import { BuildParts } from "./BuildParts";
import { BuildMods } from "./BuildMods";
import { BuildReview, BuildStatus } from "@/admin/types/build.types";
import { useToast } from "@/hooks/use-toast";

export function BuildDetailView() {
  const { buildId } = useParams<{ buildId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    selectedBuild, 
    isLoading, 
    error, 
    fetchBuildById,
    approveBuild,
    rejectBuild,
    requestRevision,
    clearError
  } = useBuildAdminStore();
  
  const [activeTab, setActiveTab] = useState("details");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (buildId) {
      fetchBuildById(buildId);
    }
    
    return () => {
      clearError();
    };
  }, [buildId, fetchBuildById, clearError]);
  
  const handleReviewSubmit = async (status: BuildStatus) => {
    if (!buildId) return;
    
    if (!reviewComment.trim()) {
      toast({
        title: "Missing Comment",
        description: "Please provide a review comment before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      switch (status) {
        case 'approved':
          await approveBuild(buildId, reviewComment);
          break;
        case 'rejected':
          await rejectBuild(buildId, reviewComment);
          break;
        case 'needs_revision':
          await requestRevision(buildId, reviewComment);
          break;
      }
      
      setReviewComment("");
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="p-8 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6 border-destructive/20">
        <div className="flex items-center text-destructive mb-2">
          <AlertCircle className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Error Loading Build</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{error}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/builds")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Builds
          </Button>
          {buildId && (
            <Button size="sm" onClick={() => fetchBuildById(buildId)}>
              Retry
            </Button>
          )}
        </div>
      </Card>
    );
  }
  
  if (!selectedBuild) {
    return (
      <Card className="p-8 text-center">
        <h3 className="font-medium text-lg mb-2">Build Not Found</h3>
        <p className="text-muted-foreground mb-4">The requested build could not be found.</p>
        <Button onClick={() => navigate("/admin/builds")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Builds
        </Button>
      </Card>
    );
  }
  
  const isPending = selectedBuild.status === 'pending';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/admin/builds")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Builds
        </Button>
        <BuildStatusBadge status={selectedBuild.status} />
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{selectedBuild.title}</CardTitle>
              <CardDescription className="mt-2">
                Submitted by {selectedBuild.display_name || "Unknown User"} {' '}
                {selectedBuild.created_at && (
                  <span title={new Date(selectedBuild.created_at).toLocaleString()}>
                    {formatDistance(new Date(selectedBuild.created_at), new Date(), { addSuffix: true })}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-1 text-muted-foreground" />
                <span>{selectedBuild.parts_count} parts</span>
              </div>
              <div className="flex items-center">
                <Wrench className="w-4 h-4 mr-1 text-muted-foreground" />
                <span>{selectedBuild.mods_count} mods</span>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Complexity: {selectedBuild.complexity_score.toFixed(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardContent className="pb-0">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="parts">Parts</TabsTrigger>
              <TabsTrigger value="mods">Modifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-0">
              <div className="space-y-4">
                <ImageGallery images={selectedBuild.images || []} />
                
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <div className="bg-muted/50 rounded-md p-4 text-muted-foreground">
                    {selectedBuild.description || "No description provided"}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="parts" className="mt-0">
              <BuildParts parts={selectedBuild.parts || []} />
            </TabsContent>
            
            <TabsContent value="mods" className="mt-0">
              <BuildMods mods={selectedBuild.mods || []} />
            </TabsContent>
          </CardContent>
        </Tabs>
        
        {isPending && (
          <CardFooter className="flex-col items-stretch border-t p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="review-comment">Review Comment</Label>
                <Textarea
                  id="review-comment"
                  placeholder="Enter your review comments here..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="mt-1.5 resize-none"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => handleReviewSubmit('approved')}
                  disabled={isSubmitting}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleReviewSubmit('needs_revision')}
                  disabled={isSubmitting}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Request Revision
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleReviewSubmit('rejected')}
                  disabled={isSubmitting}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
